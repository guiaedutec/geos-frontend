import React from "react";
import FormData from "react-form-data";
import Question from "./Question";
import CONF from "~/api/index";
import axios from "axios";
import APIDataContainer from "~/containers/api_data";
import AccountsContainer from "~/containers/accounts";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminDirectorOrTeacherRedir from "~/containers/non_admin_director_teacher_redir";
import Button from "../../components/Button";
import Progress from "../../components/Progress";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import {
  getUserToken,
  setUserToken,
  removeUserToken,
  createUrlWithParams,
} from "~/api/utils";
import styles from "./styles.styl";
import classnames from "classnames";
import $ from "jquery";
var createReactClass = require("create-react-class");

const Form = createReactClass({
  // mixins:[FormData,ResponseData],
  // mixins: [FormData],
  questionCheckboxChanged: {},

  getInitialState: function () {
    return {
      pagenow: 0,
      lastpage: 0,
      pagemax: 0,
      lastSection: 0,
      isSaving: false,
      totalQuestions: 0,
      answeredQuestions: 0,
      progress: 0,
      responsesSection: {},
      items: [],
      values: {},
    };
  },
  translate(id) {
    return this.props.intl.formatMessage({ id });
  },

  componentWillMount() {
    const itemsQuestionDirector = [
      {
        key: 0,
        title: this.translate("ProgressDirector.vision"),
        className: "visao_title",
        items: [{ key: 0, check: false }],
      },
      {
        key: 1,
        title: this.translate("ProgressDirector.competence"),
        className: "comp_title",
        items: [{ key: 1, check: false }],
      },
      {
        key: 2,
        title: this.translate("ProgressDirector.resources"),
        className: "crd_title",
        items: [{ key: 2, check: false }],
      },
      {
        key: 3,
        title: this.translate("ProgressDirector.infrastructure"),
        className: "infra_title",
        items: [{ key: 3, check: false }],
      },
    ];

    const itemsQuestionTeacher = [
      {
        key: 0,
        title: this.translate("ProgressTeacher.pedagogical"),
        className: "pedagogica_stage",
        items: [
          { key: 0, check: false },
          { key: 1, check: false },
          { key: 2, check: false },
          { key: 3, check: false },
        ],
      },
      {
        key: 1,
        title: this.translate("ProgressTeacher.digitalCitizenship"),
        className: "cidadania_digital_stage",
        items: [
          { key: 4, check: false },
          { key: 5, check: false },
          { key: 6, check: false },
          { key: 7, check: false },
        ],
      },
      {
        key: 2,
        title: this.translate("ProgressTeacher.professionalDevelopment"),
        className: "dev_profissional_stage",
        items: [
          { key: 8, check: false },
          { key: 9, check: false },
          { key: 10, check: false },
          { key: 11, check: false },
        ],
      },
    ];

    if (this.props.survey && this.props.survey.type === "school") {
      this.setState({ items: itemsQuestionDirector });
    } else if (this.props.accounts.user.profile !== "principal") {
      this.setState({ items: itemsQuestionTeacher });
    }
    let totalQuestions = 0;
    let totalPages = this.props.sections.length - 1;
    let listToRemove = [];
    let lastSection = 0;
    this.props.sections.forEach(function (section, index) {
      if (
        (section.has_question && section.survey_question.length <= 0) ||
        section.only_feedback
      ) {
        totalPages--;
        listToRemove.push(index);
      } else {
        lastSection = section.position;
      }
      section.survey_question.forEach(function (question) {
        if (question.weight > 0) totalQuestions++;
      });
    });
    let sections = this.props.sections;
    listToRemove.forEach(function (index) {
      sections.splice(index, 1);
    });
    this.setState({
      sections: sections,
      totalQuestions: totalQuestions,
      pagemax: totalPages,
      lastSection: lastSection,
      answeredQuestions: 0,
      progress: 0,
    });
  },

  // componentWillReceiveProps() {
  //   this.resetFormData(this.props.userResponses);
  // },

  setBulletProgress(boolean) {
    var elementnow = {};
    var itemnow = [];
    var inc = 1;
    const items = this.state.items;

    if (this.props.survey && this.props.survey.type === "school") {
      if (boolean === false && this.state.pagenow !== 0) {
        inc = -4;
      } else if (this.state.pagenow === 0 && boolean === false) {
        inc = 0;
      } else {
        inc = -5;
      }
    } else if (this.props.accounts.user.profile !== "principal") {
      if (this.state.pagenow === 0 && boolean === false) {
        inc = +1;
      } else if (boolean === false) {
        inc = -1;
      } else if (this.state.pagenow !== 0 && boolean === true) {
        inc = -2;
      }
    }

    for (let item of items) {
      for (let element of item.items) {
        if (element.key === this.state.pagenow + inc) {
          itemnow = item;
          elementnow = element;
        }
      }
    }
    if (elementnow) elementnow.check = boolean;

    const listItems =
      elementnow &&
      itemnow.items &&
      itemnow.items.map((item) =>
        item.key === elementnow.key ? { ...item } : item
      );
    itemnow.items = listItems;

    const newStateItems = items.map((item) =>
      item.key === itemnow.key ? { ...item } : item
    );
    this.setState({ items: newStateItems });
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.pagenow !== this.state.pagenow) {
      if (this.state.pagenow <= prevState.pagenow) {
        this.setBulletProgress(false);
      } else {
        this.setBulletProgress(true);
      }
    }
  },

  componentDidMount() {
    this.setBulletProgress(false);
    this.updatePage(0, 0);
  },

  handleInputText(e, question) {
    const id = question._id.$oid;
    const response = e.target.value;
    // let questionResponse = this.props.userResponses[id];
    const values = this.state.values;
    values[id] = response;
    // this.props.setUserResponses(values);
    this.setState({ values });
    // if (!questionResponse) return null;
  },

  handleInputRadio(resposta) {
    const values = this.state.values;
    values[resposta.question] = resposta.option;
    // this.props.setUserResponses(values);
    this.setState({ values });
  },

  handleCheckbox(resposta) {
    const values = this.state.values;
    // this.setState({ values: {} });

    if (values[resposta.question]) {
      if (resposta.checked) {
        values[resposta.question] = [
          ...values[resposta.question],
          resposta.option,
        ];

        if (resposta.weight <= 0) {
          const alternativesWithouRepetition = new Set(
            values[resposta.question].filter(
              (alternative) => alternative === resposta.option
            )
          );

          values[resposta.question] = Array.from(alternativesWithouRepetition);
        }
      } else {
        values[resposta.question] = values[resposta.question].filter(
          (alternative) => alternative !== resposta.option
        );
      }
    } else {
      if (resposta.checked === true)
        values[resposta.question] = [resposta.option];
    }

    if (values[resposta.question] && resposta.weight > 0 && resposta.checked) {
      this.setState({
        values: {
          ...this.state.values,
          [resposta.question]: Array.from(
            new Set([
              ...this.props.userResponses[resposta.question],
              ...values[resposta.question],
            ])
          ),
        },
      });

      this.props.setUserResponses({
        values: {
          ...this.state.values,
          [resposta.question]: Array.from(
            new Set([
              ...this.props.userResponses[resposta.question],
              ...values[resposta.question],
            ])
          ),
        },
      });
    } else {
      this.setState({ values });
      this.props.setUserResponses({ values });
    }
  },

  handleSubmit: async function (e) {
    e.preventDefault();
    this.setState({
      responsesSection: {},
    });
    
    if (!(e.target instanceof HTMLAnchorElement) && !(e.target.parentNode instanceof HTMLAnchorElement)) return;
    if (e.target.parentNode instanceof HTMLAnchorElement) e.target = e.target.parentNode;

    this.setState({
      isSaving: true,
    });
    this.printQuestionWithoutResponse(this.state.pagenow, "white");
    if (this.isValidForm(this.state.pagenow)) {
      e = e || window.event;
      e = e.target || e.srcElement;
      // const responses = { ...this.formData };

      const responses = this.state.values;
      // _.forEach(this.questionCheckboxChanged, (values, key) => {
      //   if (key in responses) {
      //     responses[key] = values;
      //   }
      // });

      //Falta resolver o caso de enviar os dados pro backend e resolver caso da checkbox "nenhuma das alternativas"
      // this.questionCheckboxChanged.forEach(questionsChanged, )
      const URL_REQUEST =
        CONF.ApiURL +
        "/api/v1/survey/respond/" +
        this.props.response.survey_id.$oid +
        "/" +
        this.props.response._id.$oid +
        "?access_token=" +
        getUserToken();

      try {
        const response = await axios.post(URL_REQUEST, { responses });
        await this.redirect(e.id, response.data);
        this.setState({
          isSaving: false,
        });
      } catch (error) {
        console.log(error);
        this.setState({
          isSaving: false,
        });
      }
    } else {
      this.setState({
        isSaving: false,
      });
    }
  },

  redirect: async function (el, resp) {
    if ("beforePage" === el) {
      let bp = this.beforePage;
      bp();
    } else if ("nextPage" === el) {
      let np = this.nextPage;
      np();
    } else if ("finished" === el) {
      let teachers = [];
      for (let i = 1; i <= 2; i++) {
        if (
          $('div[data-compound-ref="dados-convidado-' + i + '"]').length > 0
        ) {
          let teacher = $('div[data-compound-ref="dados-convidado-' + i + '"]');
          teachers.push({
            nome: $(teacher).find('input[data-type="nome"]').first().val(),
            email: $(teacher).find('input[data-type="email"]').first().val(),
            cpf: $(teacher).find('input[data-type="cpf"]').first().val(),
          });
        }
      }
      const URL_REQUEST =
        CONF.ApiURL +
        "/api/v1/survey/generate_scores/" +
        this.props.response.survey_id.$oid +
        "/" +
        this.props.response._id.$oid +
        "?access_token=" +
        getUserToken();
      try {
        const response = await axios.post(URL_REQUEST, { teachers });
      } catch (error) {
        console.log(error);
      }

      let np = this.nextPage;
      np();
    }
  },

  beforePage() {
    this.setState({ isSaving: true });
    let valueDivShow = "";
    valueDivShow = this.state.pagenow - 1;
    this.updatePage(
      valueDivShow,
      this.state.answeredQuestions - this.countQuestionsProgress("before")
    );
    this.setState({ isSaving: false });
  },

  nextPage() {
    if (this.isValidForm(this.state.pagenow)) {
      let valueDivShow = "";
      valueDivShow = this.state.pagenow + 1;
      this.updatePage(
        valueDivShow,
        this.state.answeredQuestions + this.countQuestionsProgress("next")
      );
    }
  },

  countQuestionsProgress(direction) {
    let total = 0;
    let idx = this.props.sections.findIndex(
      (s) => s.position == this.state.pagenow
    );
    idx = direction == "before" ? idx - 1 : idx;
    this.props.sections[idx].survey_question.forEach(function (question) {
      if (question.weight > 0) total++;
    });
    return total;
  },

  nextExplain() {
    let hideElements = document.getElementsByClassName(this.state.pagenow);
    for (let i = 0; i < hideElements.length; i++) {
      hideElements[i].style.display = "none";
    }

    let showElements = document.getElementsByClassName("explain");
    for (let i = 0; i < showElements.length; i++) {
      showElements[i].style.display = "block";
    }
  },

  checkExistsSection(valueDivShow) {
    let directionRight = valueDivShow >= this.state.pagenow;
    let existsSection = $("." + valueDivShow + ".section_page");
    if (existsSection.length <= 0) {
      if (directionRight) {
        for (let i = valueDivShow; i <= this.state.pagemax; i++) {
          existsSection = $("." + i + ".section_page");
          if (existsSection.length > 0) {
            valueDivShow = i;
            break;
          }
        }
      } else {
        for (let i = valueDivShow; i >= 0; i--) {
          existsSection = $("." + i + ".section_page");
          if (existsSection.length > 0) {
            valueDivShow = i;
            break;
          }
        }
      }
    }
    return valueDivShow;
  },

  updatePage: function (valueDivShow, answeredQuestions) {
    valueDivShow = this.checkExistsSection(valueDivShow);
    this.toggle(valueDivShow);
    this.setState({
      pagenow: valueDivShow,
      answeredQuestions: answeredQuestions,
      progress: (answeredQuestions / this.state.totalQuestions) * 100,
    });
  },

  toggle: function (divshow) {
    $("." + this.state.pagenow).each(function () {
      $(this).hide();
    });

    $("." + divshow).each(function () {
      // if(!$(this).data("compound") || ($(this).data("compound") && $(this).data("compound-first"))){
      $(this).show();
      // }
    });

    $("html, body").animate(
      {
        scrollTop: 0,
      },
      0
    );
  },

  isValidForm(divform) {
    /** div that I need verify if exist checked or values */
    let divnow = "." + divform + " input";

    /** storage array with all name question */
    let question_reference = [];

    /** storage array with the name of question selected by user */
    let response_user = [];

    /** only build array reference */
    $(divnow).each(function () {
      /** does not exist, I need to add */
      let idxQ = question_reference.indexOf(this.name);
      if (idxQ === -1) {
        question_reference.push(this.name);
      }
    });

    /** build array with the name of question yet selected */
    $(divnow).each(function () {
      let hasValue = false;
      let val = $(this).val();

      if ($(this).is(":text")) {
        /** fillout form ok */
        if (val !== "") {
          hasValue = true;
        }
      } else if ($(this).attr("type") === "number") {
        if (!isNaN(parseInt(val)) && isFinite(val) && val >= 0) {
          hasValue = true;
        }
      } else if ($(this).is(":checked")) {
        /** checked */
        hasValue = true;
      } else if ($(this).attr("type") === "date") {
        if (val !== "") {
          hasValue = true;
        }
      }

      /** yes, user choose or fillout the field */
      if (hasValue) {
        /** does not exist, I need to add */
        let idx = response_user.indexOf(this.name);
        if (idx === -1) {
          response_user.push(this.name);
        }
      }
    });

    /** to compare array elements */
    return this.checkArr(question_reference, response_user);
  },

  checkArr(question_reference, response_user) {
    let success = true;

    //reset form errors
    for (let question of question_reference) {
      this.printQuestionWithoutResponse(question, "");
    }
    var response_user_2 = new Set(response_user);
    var wrong_fields = [
      ...new Set(
        [...question_reference].filter((x) => !response_user_2.has(x))
      ),
    ];

    for (let field of wrong_fields) {
      this.printQuestionWithoutResponse(field, "#ffcccc");
      success = false;
    }

    if (wrong_fields.length > 0) {
      window.setTimeout(() => {
        $("html, body").animate(
          {
            scrollTop: $("#" + wrong_fields[0]).offset().top,
          },
          1000
        );
      }, 300);
    }

    return success;
  },

  printQuestionWithoutResponse(idElement, color) {
    $("#" + idElement).css("background", color);
  },

  render: function () {
    let user = this.props.accounts.user;
    let hasFirst = (survey_question, question) => {
      let sq = survey_question.filter(
        (sq) => sq.page == "2" && sq.compound && sq.compound_first
      );
      return sq.length > 0 && sq[0]._id.$oid == question._id.$oid;
    };

    return (
      <form
        onChange={this.updateFormData}
        onSubmit={this.handleSubmit}
        id="questionForm"
      >
        <div className="section pb-0">
          <div className="container">
            <div className="columns">
              <div className="column">
                <Progress items={this.state.items} />
              </div>
            </div>
          </div>
        </div>

        <div className={classnames("section", styles.section_questions)}>
          <div className="container mt-50">
            <div className="columns">
              <div className="column">
                {this.props.sections.map((section) => (
                  <div
                    key={section._id.$oid}
                    className={classnames(
                      `${section.position} ${styles.hide}`,
                      styles[`section__${section.position}`],
                      "section_page"
                    )}
                  >
                    <div className="columns is-multiline">
                      <div
                        className={classnames(
                          section.pageTitleCssClass ? `${section.pageTitleCssClass}` : styles.not_question,
                          `${styles.h1}`,
                          "column is-full"
                        )}
                      >
                        <div
                          className={styles.page__title}
                          dangerouslySetInnerHTML={{ __html: section.name }}
                        ></div>
                        <div
                          className={classnames(
                            styles.page__description,
                            section.description == "" ? "is-hidden" : null
                          )}
                          dangerouslySetInnerHTML={{ __html: section.description }}
                        ></div>
                      </div>
                      {section.survey_question.map((question) => {
                        if (question.compound && question.compound_first) {
                          question.child_questions = section.survey_question
                            .sort((a, b) =>
                              a.question_order > b.question_order ? 1 : -1
                            )
                            .filter(
                              (q) =>
                                q.compound && q.compound_ref == question.compound_ref
                            );
                        }
                      })}
                      {section.has_question
                        ? section.survey_question
                            .sort((a, b) =>
                              a.question_order > b.question_order ? 1 : -1
                            )
                            .map((question) => {
                              return question.compound &&
                                question.compound_first &&
                                question.child_questions ? (
                                <div
                                  className={classnames(
                                    styles.question,
                                    styles.question__compound,
                                    "column is-half"
                                  )}
                                >
                                  {hasFirst(section.survey_question, question) && (
                                    <h1 className={styles.title__compound}>
                                      Dados dos(as) professores(as) convidados(as)
                                    </h1>
                                  )}
                                  <div className={styles.box__question__compound}>
                                    <div className={styles.question__title}>
                                      <div>
                                        <p
                                          className={styles.bold}
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              question.question_order +
                                              " - " +
                                              question.name,
                                          }}
                                        />
                                      </div>
                                      <div className={styles.question__obs}>
                                        {parse(this.translate("Survey.mandatory"))}
                                      </div>
                                    </div>
                                    {question.obs && (
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: question.obs,
                                        }}
                                      ></div>
                                    )}
                                    {question.child_questions.map((child) => {
                                      return (
                                        <div
                                          id={child._id.$oid}
                                          key={child._id.$oid}
                                          className={classnames(
                                            `${section.position}`,
                                            styles.hide,
                                            styles.question__child
                                          )}
                                          data-compound={
                                            child.compound ? child.compound : null
                                          }
                                          data-compound-ref={
                                            child.compound_ref
                                              ? child.compound_ref
                                              : null
                                          }
                                          data-compound-first={
                                            child.compound_first
                                              ? child.compound_first
                                              : null
                                          }
                                        >
                                          <Question
                                            surveyId={
                                              this.props.response.survey_id.$oid
                                            }
                                            user={user}
                                            elThis={this}
                                            question={child}
                                            questions={section.survey_question.sort(
                                              (a, b) =>
                                                a.question_order - b.question_order
                                            )}
                                            userResponses={this.props.userResponses}
                                            handleCheckbox={this.handleCheckbox}
                                            handleInputText={this.handleInputText}
                                            handleInputRadio={this.handleInputRadio}
                                            labelDirectorOne={parse(this.translate("Survey.labelDirectorOne"))}
                                            labelDirectorTwo={parse(this.translate("Survey.labelDirectorTwo"))}
                                            labelMandatory={parse(this.translate("Survey.mandatory"))}
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                !question.compound && (
                                  <div
                                    id={question._id.$oid}
                                    key={question._id.$oid}
                                    className={`${section.position} ${styles.hide} ${styles.question}`}
                                    data-compound={
                                      question.compound ? question.compound : null
                                    }
                                    data-compound-ref={
                                      question.compound_ref
                                        ? question.compound_ref
                                        : null
                                    }
                                    data-compound-first={
                                      question.compound_first
                                        ? question.compound_first
                                        : null
                                    }
                                  >
                                    <Question
                                      surveyId={this.props.response.survey_id.$oid}
                                      user={user}
                                      elThis={this}
                                      question={question}
                                      questions={section.survey_question.sort(
                                        (a, b) => a.question_order - b.question_order
                                      )}
                                      userResponses={this.props.userResponses}
                                      handleCheckbox={this.handleCheckbox}
                                      handleInputRadio={this.handleInputRadio}
                                      labelDirectorOne={parse(this.translate("Survey.labelDirectorOne"))}
                                      labelDirectorTwo={parse(this.translate("Survey.labelDirectorTwo"))}
                                      labelMandatory={parse(this.translate("Survey.mandatory"))}
                                    />
                                  </div>
                                )
                              );
                            })
                        : null}
                    </div>
                  </div>
                ))}
                
                <div
                  className={classnames(
                    `${this.state.lastSection + 1} ${styles.hide} ${
                      styles.padding_left
                    }`,
                    "section_page"
                  )}
                >
                  {
                    this.props.survey.type == "personal" ? [
                      <div className={styles.padding_top + " " + styles.bold}>
                        <strong>
                          {parse(this.translate("AcknowledgmentDevolutive.acknowledgmentTeacher"))}
                        </strong>
                      </div>,
                      <div className={styles.padding_top + " " + styles.fields}>
                        {parse(this.translate("AcknowledgmentDevolutive.devolutiveAccessTeacher"))}
                      </div>
                    ] : [
                      <div className={styles.padding_top + " " + styles.bold}>
                        <strong>
                          {parse(this.translate("AcknowledgmentDevolutive.acknowledgmentPrincipal"))}
                        </strong>
                      </div>,
                      <div className={styles.padding_top + " " + styles.fields}>
                        {parse(this.translate("AcknowledgmentDevolutive.devolutiveAccessPrincipal"))}
                      </div>
                    ]
                  }
                </div>
              </div>
            </div>

            <div className="columns mt-50">
              {this.state.pagenow > 0 &&
              this.state.pagenow > this.state.lastSection ? (
                <div className="column has-text-centered">
                  <Button
                    className={classnames("is-primary", styles.controls__button)}
                    to="/recursos"
                  >
                    {parse(this.translate("AcknowledgmentDevolutive.btnDevolutiveAccess"))} 
                  </Button>
                </div>
              ) : null}
              
              {this.state.pagenow > 0 &&
              this.state.pagenow <= this.state.lastSection ? (
                <div className="column">
                  <Button
                    id={"beforePage"}
                    onClick={this.beforePage}
                    className={classnames(styles.controls__button, {
                      "is-loading": this.state.isSaving,
                    })}
                    {...(this.state.isSaving ? { disabled: true } : {})}
                  >
                    <span className={styles.with_icon}>
                      <i className="fas fa-long-arrow-alt-left"></i>
                      {parse(this.translate("Survey.btnBack"))}
                    </span>
                  </Button>
                </div>
              ) : null}
              
              {this.state.pagenow < this.state.lastSection ? (
                <div className="column has-text-right">  
                  <Button
                    id={"nextPage"}
                    onClick={
                      this.state.pagenow === 0 ? this.nextPage : this.handleSubmit
                    }
                    className={classnames("is-primary", styles.controls__button, {
                      "is-loading": this.state.isSaving,
                    })}
                    {...(this.state.isSaving ? { disabled: true } : {})}
                  >
                    <span className={styles.with_icon}>
                      {parse(this.translate("Survey.btnNext"))}
                      <i className="fas fa-long-arrow-alt-right"></i>
                    </span>
                  </Button>
                </div>
              ) : null}
              
              {this.state.pagenow == this.state.lastSection ? (
                <div className="column has-text-right">
                  <Button
                    id="finished"
                    onClick={this.handleSubmit}
                    className={classnames("is-primary", styles.controls__button, {
                      "is-loading": this.state.isSaving,
                    })}
                  >
                    {parse(this.translate("Survey.btnComplete"))}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </form>
    );
  },
});

export default injectIntl(
  (APIDataContainer,
  AccountsContainer,
  NonUserRedir,
  NonAdminDirectorOrTeacherRedir)(Form)
);
