import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Helmet from "react-helmet";
import _ from "lodash";
import { compose } from "redux";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import Field from "~/components/Form/Field";
import PageHeader from "~/components/Header/PageHeader";
import schema from "./schema";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from "react-accessible-accordion";
import "!style!css!react-accessible-accordion/dist/minimal-example.css";
import "!style!css!react-accessible-accordion/dist/fancy-example.css";
import APIDataContainer from "~/containers/api_data";

import history from "~/core/history";
import AccountsContainer from "~/containers/accounts";
import NonUserRedir from "~/containers/non_user_redir";
import {
  isDirector,
  isTeacher,
  isDirectorOrTeacher,
  isOther,
} from "~/helpers/users";
import {
  setSelectedSurvey,
  removeSelectedSurvey,
  setSelectedAnswer,
  surveyAnswered,
  surveyStarted,
  surveyOutPeriod,
  surveyNextResponse,
} from "~/actions/survey";
import { getUserToken, getUserId } from "~/api/utils";

import Layout from "~/components/Layout";
import Body from "~/components/Body";
import Button from "~/components/Button";
import InfrastructureFormModal from "~/components/InfrastructureFormModal";
import ModalContainer from "~/containers/modal";

import styles from "./Resources.styl";
import stylesModal from "~/components/Modal/Modal.styl";

import CONF from "~/api/index";
import axios from "axios";
import API from "~/api";
import moment from "moment";
//import { BarLoader, PulseLoader } from "react-spinners";
import $ from "jquery";
import { reduxForm } from "redux-form";

class Resources extends React.Component {
  constructor() {
    super();
    removeSelectedSurvey();
    this.state = {
      surveys: [],
      institutionHasSchoolPlan: false,
      schoolHasPlan: false,
      institution: [],
      loading: true,
      loadingTerm: false,
      modalResend: false,
      emailResend: "",
      dataResend: {},
      loadingResend: false,
      loadingEmailResend: false,
      statusResend: 0,
      validResend: false,
      tutorial: [],
      hasUser: false,
    };
    this.handleCensusEdit = this.handleCensusEdit.bind(this);
    this.handleInfrastructure = this.handleInfrastructure.bind(this);
    this.handleAcceptedTerm = this.handleAcceptedTerm.bind(this);
  }

  getLang = () => {
    return localStorage.getItem("lang") || process.env.DEFAULT_LOCALE;
  };

  componentDidMount = () => {
    this.props.fetchTranslations(this.getLang());
    this.getSurveys();
  };

  componentDidUpdate = (prevProps) => {
    const user = this.props.accounts.user;
    const prevUser = prevProps.accounts.user;
    if (prevUser === user && !this.state.hasUser) {
      this.setState({ hasUser: true });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.accounts.user !== nextProps.accounts.user) {
      this.checkSurveyInvited(nextProps.accounts.user);
    }
  }

  hasInvitedSurvey(surveyId, inviteds) {
    let survey = inviteds.find((i) => i.survey_id.$oid == surveyId);
    return survey != undefined;
  }

  checkSurveyInvited(user) {
    const _this = this;
    _this.state.surveys.forEach(function (survey) {
      if (user.invited_survey && user.invited_survey.length > 0) {
        if (_this.hasInvitedSurvey(survey.id, user.invited_survey)) {
          survey.type_invited = true;
        }
      }
    });
    if (user && isTeacher(user)) {
      _this.state.surveys.sort((a, b) => (a.type > b.type ? 1 : -1));
    } else {
      _this.state.surveys.sort((a, b) => (a.type < b.type ? 1 : -1));
    }
  }

  getSurveys = () => {
    const _this = this;
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/surveys_list?access_token=" +
          getUserToken() +
          "&lang=" +
          this.getLang(),
        {}
      )
      .then(function (surveys) {
        if (surveys.data) {
          var has_anwers = false;
          surveys.data.surveys.forEach(function (survey) {
            if (
              survey.type === "school" &&
              surveyAnswered(survey, getUserId())
            ) {
              has_anwers = true;
            }
          });

          _this.setState({
            surveys: surveys.data.surveys,
            loading: false,
          });

          _this.checkSurveyInvited(_this.props.accounts.user);
          if (has_anwers) _this.getHasSchoolPlan();
          _this.getSchool();
        }
      });
  };

  getSchool = () => {
    const _this = this;

    if (_this.props.accounts.user && _this.props.accounts.user.school_id) {
      API.Schools.findOne(_this.props.accounts.user.school_id.$oid).then(
        (schoolFound) => {
          var hasPlan = schoolFound.plan ? true : false;
          _this.setState({
            schoolHasPlan: hasPlan,
            school: schoolFound,
          });
        }
      );
    }
  };

  getHasSchoolPlan = () => {
    const _this = this;
    if (isDirector(_this.props.accounts.user)) {
      axios
        .get(
          CONF.ApiURL +
            "/api/v1/user_institution?access_token=" +
            getUserToken(),
          {}
        )
        .then(function (institution) {
          var institutionHasSchoolPlan = false;
          if (institution.data) {
            institution.data[0].plans.forEach(function (plan, index) {
              if (plan.type === "Escola") institutionHasSchoolPlan = true;
            });
            _this.setState({
              institutionHasSchoolPlan: institutionHasSchoolPlan,
              institution: institution,
            });
          }
        });
    }
  };

  handleCensusEdit() {
    const _this = this;
    if (isDirector(_this.props.accounts.user)) {
      _this.props.toggleCensusModal();
      return;
    }
  }

  handleInfrastructure() {
    const _this = this;
    if (isDirector(_this.props.accounts.user)) {
      _this.props.toggleInfrastructureModal();
      return;
    }
  }

  acceptedTerm = () => {
    const _this = this;
    _this.setState({
      loadingTerm: true,
    });

    axios
      .post(
        CONF.ApiURL + "/api/v1/accepted_term?access_token=" + getUserToken(),
        {
          term: true,
        }
      )
      .then((res) => {
        const { user } = _this.props.accounts;
        user.term = true;

        _this.setState({
          loadingTerm: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleAcceptedTerm() {
    this.acceptedTerm();
  }

  gotToSurvey(survey) {
    setSelectedSurvey(survey);
    window.location = "/responder-questionario";
  }

  gotToAnswers(survey, answer) {
    setSelectedSurvey(survey);
    setSelectedAnswer(answer);
    window.open("/acessar-respostas", "_blank");
  }

  gotToPrintSurvey(survey) {
    setSelectedSurvey(survey);
    window.open("/imprimir-questionario", "_blank");
  }

  _logout() {
    this.props.logoutUser();
    history.push("/");
  }

  combinedComplete(answer) {
    if (answer.type == "Combined") {
      return (
        answer.guests &&
        answer.guests.every((g) => g.status.toLowerCase() == "respondido")
      );
    } else {
      return false;
    }
  }

  hasAnswer = (schedules) => {
    const user = this.props.accounts.user;

    const schedulesWithAnswer = schedules.filter(
      (schedule) =>
        schedule.answers &&
        schedule.answers.find(
          (answer) =>
            answer.status === "Complete" &&
            answer.user_id.$oid === user._id.$oid
        )
    );
    return schedulesWithAnswer.length > 0;
  };

  _resendInvite = (el) => {
    let target = $(el.target).is("i")
      ? $(el.target).parents("a")
      : $(el.target);
    let update = target.attr("data-update");
    let isNewUser = update != undefined && update == "true";
    let data = this.state.dataResend;
    let newEmail = this.props.fields.email.value;

    this.setState({
      loadingEmailResend: true,
    });

    axios
      .post(
        CONF.ApiURL +
          "/api/v1/resend_invite?id=" +
          data.user_id +
          "&access_token=" +
          getUserToken(),
        {
          user: {
            name: data.user_name,
            email: data.user_email,
            newEmail: isNewUser ? newEmail : null,
          },
          manager: { id: data.manager_id, name: data.manager_name },
          isNewUser: null,
        }
      )
      .then((res) => {
        this.setState({
          statusResend: res.status,
          validResend: res.data.valid,
        });

        if (res.data.valid && isNewUser) {
          $("a[data-email='" + data.user_email + "'").attr(
            "data-email",
            newEmail
          );
          this.setState({
            emailResend: newEmail,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .then((res) => {
        this.setState({
          loadingEmailResend: false,
        });
      });
  };

  _handleClickModal = (el) => {
    let target = $(el.target).is("i")
      ? $(el.target).parents("a")
      : $(el.target);
    let id = target.attr("data-id");

    this.setState({
      modalResend: true,
      emailResend: target.attr("data-email"),
      dataResend: {
        user_id: id,
        user_name: target.attr("data-name"),
        user_email: target.attr("data-email"),
        manager_id: target.attr("data-manager-id"),
        manager_name: target.attr("data-manager-name"),
      },
    });

    if (target.attr("data-email") == "") {
      this.setState({
        loadingResend: true,
      });

      axios
        .get(
          CONF.ApiURL +
            "/api/v1/get_email_by_id?id=" +
            id +
            "&access_token=" +
            getUserToken(),
          {}
        )
        .then((res) => {
          let email = res.data != {} ? res.data.email : "";

          target.attr("data-email", email);
          this.setState({
            emailResend: email,
            loadingResend: false,
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .then((res) => {
          this.setState({
            loadingResend: false,
          });
        });
    }
  };

  _closeModal = () => {
    this.props.fields.email.onChange("");
    this.setState({
      modalResend: false,
      statusResend: 0,
    });
  };

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    const { user } = this.props.accounts;
    const { fields } = this.props;
    var openModalTerm = user == null || _.isEmpty(user) ? false : !user.term;
    var surveyType = isDirector(user)
      ? "school"
      : isTeacher(user)
      ? "personal"
      : "";
    if (
      this.state.surveys &&
      this.state.surveys.findIndex((s) => s.type == surveyType) > 0
    ) {
      var survey = this.state.surveys.splice(
        this.state.surveys.findIndex((s) => s.type == surveyType),
        1
      );
      this.state.surveys.unshift(survey[0]);
    }

    return (
      <Layout bgSecondary={true}>
        <Helmet title={parse(this.translate("Resources.title"))} />
        <Body>
          <section className="section">
            <div className="container mb-50">
              <div className="columns">
                <div className="column">
                  <PageHeader user={user} />
                </div>
              </div>
            </div>
            <div className="container mb-30">
              {this.state.school && isDirector(user) ? (
                <div
                  className={classNames(
                    "columns is-multiline",
                    styles.header__surveys
                  )}
                >
                  <h2
                    className={classNames("column is-5", styles.school__name)}
                  >
                    <span>{parse(this.translate("Resources.school"))}: </span>
                    {user.school_type == "Particular"
                      ? user.institution_name
                      : this.state.school.name}
                  </h2>
                  {user.school_type != "Particular" && (
                    <div
                      className={classNames(
                        "column is-7 has-text-centered-mobile has-text-right-tablet",
                        styles.buttons
                      )}
                    >
                      <button
                        className={classNames(
                          "button",
                          "is-primary",
                          styles.button__censo
                        )}
                        onClick={this.handleInfrastructure}
                      >
                        {parse(this.translate("Resources.btnSchoolInventary"))}
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {this.state
              ? this.state.surveys.map((survey, idx) => (
                  <div className="container mb-30" key={survey.id.$oid}>
                    <div
                      className={classNames(
                        "columns is-multiline",
                        styles.box_main
                      )}
                    >
                      <div className="column is-full">
                        {survey.schedule.length > 0 && [
                          <h1 className="is-size-3 mb-20 has-text-weight-light">
                            {survey.schedule[0].survey_name}
                          </h1>,
                          <p>{survey.schedule[0].survey_description}</p>,
                        ]}
                      </div>
                      <div className="column is-full">
                        {survey.is_cyclic &&
                          survey.schedule.length > 0 &&
                          survey.schedule[0].name && (
                            <h3 className="is-size-6">
                              <span className="has-text-weight-bold">
                                {parse(
                                  this.translate("Resources.currentCycle")
                                )}
                                :
                              </span>{" "}
                              {survey.schedule[0].name}
                            </h3>
                          )}
                        {!surveyOutPeriod(survey) &&
                          !surveyAnswered(survey, user) &&
                          isDirectorOrTeacher(user) &&
                          !this.hasAnswer(survey.schedule) && (
                            <Button
                              className={classNames(
                                "is-primary ml-0",
                                styles.resources__buttons__button
                              )}
                              onClick={() => this.gotToSurvey(survey)}
                            >
                              <span className={styles.with_icon}>
                                <i
                                  className={classNames(
                                    "fas fa-clipboard-list is-size-5 mr-10",
                                    styles.fa
                                  )}
                                ></i>
                                {surveyStarted(survey, user)
                                  ? parse(
                                      this.translate("Resources.continueSurvey")
                                    )
                                  : parse(
                                      this.translate("Resources.answerSurvey")
                                    )}
                              </span>
                            </Button>
                          )}
                        {surveyOutPeriod(survey) &&
                        !survey.is_cyclic &&
                        isDirectorOrTeacher(user) ? (
                          <div>
                            <p>
                              <strong>
                                {parse(this.translate("Resources.attention"))}!
                              </strong>
                            </p>
                            <p>
                              {parse(this.translate("Resources.description1"))}{" "}
                              <strong>
                                {surveyNextResponse(survey).toLowerCase()}
                              </strong>
                              .
                            </p>
                            <p>
                              {parse(this.translate("Resources.description2"))}
                            </p>
                          </div>
                        ) : (
                          <Button
                            className={classNames(
                              "is-primary",
                              styles.resources__buttons__button
                            )}
                            onClick={() => this.gotToPrintSurvey(survey)}
                          >
                            <span className={styles.with_icon}>
                              <i className="fas fa-print is-size-5 mr-10"></i>
                              {parse(this.translate("Resources.print"))}
                            </span>
                          </Button>
                        )}
                      </div>
                      {this.hasAnswer(survey.schedule) && [
                        <div className="column is-8 is-offset-2 mt-30 mb-20">
                          <div className="has-text-weight-bold is-size-6">
                            {parse(this.translate("Resources.historicTitle"))}
                          </div>
                        </div>,
                        <div
                          className={classNames(
                            "column is-8 is-offset-2",
                            styles.history
                          )}
                        >
                          <div className="columns">
                            {this.state.school &&
                              isDirector(user) &&
                              survey.type == "school" && (
                                <div className="column has-text-weight-bold">
                                  {parse(this.translate("Resources.cycle"))}
                                </div>
                              )}
                            <div className="column has-text-weight-bold">
                              {parse(this.translate("Resources.answered"))}
                            </div>
                            <div className="column has-text-weight-bold">
                              {parse(this.translate("Resources.devolutive"))}
                            </div>
                          </div>
                          {survey.schedule.map(
                            (schedule) =>
                              schedule.answers &&
                              schedule.answers.map((answer, idxAns) =>
                                answer.status === "Complete" &&
                                answer.user_id.$oid ===
                                  this.props.accounts.user._id.$oid &&
                                answer.type !== "Combined" ? (
                                  <div className="columns" key={answer.id.$oid}>
                                    {this.state.school &&
                                      isDirector(user) &&
                                      survey.type == "school" && (
                                        <div className="column">
                                          {schedule.name}
                                        </div>
                                      )}
                                    <div className="column">
                                      {this.state.school &&
                                        isDirector(user) &&
                                        survey.type == "school" && [
                                          answer.user_name,
                                          " - ",
                                        ]}
                                      {moment(answer.submitted_at).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </div>
                                    <div className="column">
                                      <a
                                        className={styles.access_link}
                                        onClick={() =>
                                          window.open(
                                            CONF.ApiURL +
                                              "/api/v1/survey/feedback/" +
                                              schedule.survey_id.$oid +
                                              "/" +
                                              answer.id.$oid +
                                              "?access_token=" +
                                              getUserToken() +
                                              "&lang=" +
                                              this.getLang(),
                                            "target=_blank"
                                          )
                                        }
                                      >
                                        <span className={styles.with_icon}>
                                          {parse(
                                            this.translate(
                                              "Resources.accessDevolutive"
                                            )
                                          )}
                                          <i className="ml-10 far fa-file-pdf"></i>
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                ) : null
                              )
                          )}
                        </div>,
                      ]}
                    </div>
                  </div>
                ))
              : null}
          </section>
        </Body>

        {this.state.school && (
          <InfrastructureFormModal
            isActive={this.props.modal.isInfrastructureModalActive}
            toggleModal={this.props.toggleInfrastructureModal}
            schoolId={this.state.school._id.$oid}
          />
        )}
      </Layout>
    );
  }
}

Resources.propTypes = {
  modal: PropTypes.object,
  fields: PropTypes.object.isRequired,
};

export default injectIntl(
  reduxForm({
    form: "resources",
    fields: _.keys(schema),
  })(
    compose(
      APIDataContainer,
      AccountsContainer,
      ModalContainer,
      NonUserRedir
    )(Resources)
  )
);
