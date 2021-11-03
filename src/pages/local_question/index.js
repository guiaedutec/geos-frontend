import React from "react";
var createReactClass = require("create-react-class");
import Helmet from "react-helmet";
import classnames from "classnames";
import Field from "~/components/Form/Field";
import FieldTextArea from "~/components/Form/FieldTextArea";
import Layout from "../../components/Layout";
import Body from "~/components/Body";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import styles from "./styles.styl";
import axios from "axios";
import $ from "jquery";
import { compose } from "redux";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminRedir from "~/containers/non_admin_redir";

import {
  getUserToken,
  setUserToken,
  removeUserToken,
  createUrlWithParams,
} from "~/api/utils";
import CONF from "~/api/index";

class Pergunta extends React.Component {
  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    return (
      <Layout pageHeader={this.translate("CreateQuestion.pageHeader")}>
        <Helmet title={this.translate("CreateQuestion.registerQuestion")} />
        <Body>
          <section className="section">
            <MainForm intl={this.props.intl} />
          </section>
        </Body>
      </Layout>
    );
  }
}

const OptionList = createReactClass({
  getInitialState: function () {
    const option = "";
    const index = this.props.optionIndex;
    return { option, index };
  },

  componentWillReceiveProps() {
    this.setState({
      index: this.props.optionIndex,
    });
  },

  addOption: function (e) {
    e.preventDefault();

    if (this.state.option == "") {
      alert("Ops, alternativa está vazia.");
      return;
    }

    let new_options = this.props.optionArray.concat([this.state.option]);

    this.setState({
      option: "",
    });

    this.props.changeOptions(new_options, this.props.optionIndex);
  },
  onChange: function (e) {
    this.setState({ option: e.target.value });
  },
  deleteElement: function (e) {
    var optionIndex = e.target.value;

    let new_options = this.props.optionArray.slice(0);
    new_options.splice(optionIndex, 1);

    this.setState({
      options: new_options,
    });

    this.props.changeOptions(new_options, this.props.optionIndex);
    e.preventDefault();
  },
  updateResponse: function (e) {
    const elements = document.getElementsByClassName("fake" + e.target.id);

    if (document.getElementById(e.target.id).checked) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].type = "radio";
      }
      this.props.changeType("radio", this.props.optionIndex);
    } else {
      for (var i = 0; i < elements.length; i++) {
        elements[i].type = "checkbox";
      }
      this.props.changeType("checkbox", this.props.optionIndex);
    }
  },
  _handleKeyPress(e) {
    if (e.key == "Enter") {
      e.preventDefault();
    }
  },

  translate: function (id) {
    return this.props.intl.formatMessage({ id });
  },

  render: function () {
    return (
      <ul key={JSON.stringify(this.props.optionArray)}>
        <div>
          <p className={styles.single_check_box}>
            <strong>
              {parse(this.translate("CreateQuestion.typeOfQuestion"))}:
            </strong>{" "}
            &nbsp;
            <input
              type="checkbox"
              onChange={() => {}}
              name={"p" + this.state.index + "-type"}
              id={"p" + this.state.index + "-type"}
              onClick={this.updateResponse}
              value={this.props.optionType}
              checked={this.props.optionType == "radio" ? true : false}
              className={styles.input__option__type}
            />{" "}
            &nbsp; {parse(this.translate("CreateQuestion.oneAlternative"))}{" "}
          </p>
          {this.props.optionArray.map((option, optionIndex) => (
            <div
              key={JSON.stringify(this.props.optionArray[optionIndex])}
              id={"remove" + optionIndex}
              className={styles.div__group__option}
            >
              <div className={styles.div__option}>
                <input
                  type={this.props.optionType}
                  className={"fake" + this.props.indexQuestion}
                  disabled
                  checked
                />
                <input
                  type="hidden"
                  name={"p" + this.props.indexQuestion + "-" + optionIndex}
                  value={this.props.optionArray[optionIndex]}
                  disabled
                />
                &nbsp; - {this.props.optionArray[optionIndex]}
              </div>
              <div className={styles.btn__right}>
                <button
                  onClick={this.deleteElement}
                  value={optionIndex}
                  className={"button " + styles.remove__option__btn}
                >
                  <Icon name="remove-red" />
                </button>
              </div>
            </div>
          ))}
          <div className={styles.div__group__option}>
            <div className={styles.div__option}>
              <Field
                onChange={this.onChange}
                onKeyPress={this._handleKeyPress}
                placeholder={
                  this.translate("CreateQuestion.placeholderAlternative")
                  // {parse(this.translate("CreateQuestion.placeholderAlternative"))}
                }
                type="text"
                name={this.state.option}
                value={this.state.option}
              />
            </div>
            <div className={styles.btn__right__new}>
              <button
                id={"addOpt" + this.props.indexQuestion}
                onClick={this.addOption}
                className="button"
              >
                {parse(this.translate("CreateQuestion.btnAddAlternative"))}
              </button>
              &nbsp;&nbsp;
            </div>
          </div>
        </div>
      </ul>
    );
  },
});

const TitleInput = createReactClass({
  getInitialState: function () {
    const readOnly = false;
    const title = this.props.title;
    const index = this.props.titleIndex;
    return { title, index, readOnly };
  },

  translate: function (id) {
    return this.props.intl.formatMessage({ id });
  },

  componentWillReceiveProps() {
    this.setState({
      index: this.props.titleIndex,
    });
  },

  onChange: function (e) {
    this.setState({ title: e.target.value });
  },
  render: function () {
    return (
      <div>
        <strong>
          {parse(this.translate("CreateQuestion.question"))}{" "}
          {this.state.index + 1}{" "}
        </strong>
        <FieldTextArea
          onChange={this.onChange}
          onKeyPress={this._handleKeyPress}
          type="textarea"
          name={"p" + this.state.index + "-name"}
          value={this.state.title}
          rows="3"
          placeholder={this.translate(
            "CreateQuestion.placeholderquestionTitle"
          )}
        />
      </div>
    );
  },
});

const QuestionList = createReactClass({
  _handleKeyPress(e) {
    if (e.key == "Enter") {
      e.preventDefault();
    }
  },
  translate: function (id) {
    return this.props.intl.formatMessage({ id });
  },
  onChange: function (id, e) {
    titles[id] = e.target.value;
    this.setState({ titles: titles });
  },

  render: function () {
    return (
      <div>
        {this.props.titles.length < 1 ? (
          <div>
            <hr className={styles.question__title} />
            <p>
              <i>{parse(this.translate("CreateQuestion.noQuestions"))}</i>
            </p>
          </div>
        ) : null}

        {this.props.titles.map((title, titleIndex) => (
          <div key={titleIndex} id={"title-" + titleIndex}>
            <hr className={styles.question__title} />
            <b>
              <TitleInput
                intl={this.props.intl}
                title={title}
                titleIndex={titleIndex}
              />
            </b>

            <OptionList
              intl={this.props.intl}
              changeType={this.props.changeType}
              changeOptions={this.props.changeOptions}
              optionIndex={titleIndex}
              deleteElement={this.deleteElement}
              indexQuestion={titleIndex}
              optionArray={this.props.optionArray[titleIndex]}
              optionType={this.props.optionTypeArray[titleIndex]}
            />
            <p className={styles.remove_btn}>
              <button
                onClick={this.props.deleteElement}
                value={titleIndex}
                className={"button " + styles.remove_btn}
              >
                {parse(this.translate("CreateQuestion.btnDeleteQuestion"))}
              </button>
            </p>
          </div>
        ))}
      </div>
    );
  },
});

const MainForm = createReactClass({
  getInitialState: function () {
    return {
      titles: [],
      title: "",
      qtd: 0,
      showDivQuestion: true,
      msg: "Salvar",
      savestatus: false,
      options: [],
      option_types: ["checkbox"],
      setting_valid: false,
      has_answered: true,
    };
  },

  componentWillMount: function () {
    const _this = this;
    _this.check_has_answered_schools();
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey_questions/multiple_manager.json?access_token=" +
          getUserToken(),
        {}
      )
      .then(function (result) {
        if (result.data && result.data.length > 0) {
          var options = [];
          var titles = [];
          var option_types = [];
          for (let i = 0; i < result.data.length; i++) {
            titles[i] = result.data[i].name;
            option_types[i] = result.data[i].type;

            var res_parsed = Object.keys(
              result.data[i].survey_question_description
            ).map(function (e) {
              return result.data[i].survey_question_description[e];
            });
            options[i] = res_parsed;
          }

          _this.setState({
            titles: titles,
            options: options,
            option_types: option_types,
            qtd: titles.length,
            showDivQuestion: titles.length > 3 ? false : true,
          });
        }
      });
  },
  check_has_answered_schools() {
    let _this = this;
    return axios
      .get(
        CONF.ApiURL +
          "/api/v1/has_answered_schools?access_token=" +
          getUserToken()
      )
      .then((result) => {
        if (!result.data.has_answereds) {
          //console.log("change has answered")
          _this.setState({
            has_answered: false,
          });
        }
      });
  },
  sendData: function (e) {
    this.setState({ setting_valid: true });

    e.preventDefault();
    const _this = this;
    const formArray = document.getElementById("formData");

    var arrFields = {};
    for (var i = 0; i < formArray.length; i++) {
      if (
        formArray[i]["name"].indexOf("name") !== -1 &&
        formArray[i]["value"] === ""
      ) {
        alert(
          "Ops, a pergunta " +
            (parseInt(formArray[i]["name"].substring(1, 2)) + 1) +
            " esta com campo enunciado vazio."
        );
        _this.setState({
          savestatus: true,
          msg: "Falha ao salvar",
          setting_valid: false,
        });
        return;
      }

      if (formArray[i]["name"]) {
        arrFields[formArray[i]["name"]] = formArray[i]["value"];
      }
    }
    const survey_question = JSON.stringify(arrFields);
    axios({
      method: "PUT",
      url:
        CONF.ApiURL +
        "/api/v1/survey_questions/multiple.json?access_token=" +
        getUserToken(),
      data: { survey_question },
    })
      .then(function (response) {
        _this.setState({
          msg: "Salvo com sucesso",
          setting_valid: false,
        });
      })
      .catch(function (error) {
        _this.setState({
          savestatus: true,
          msg: "Falha ao salvar",
          setting_valid: false,
        });
      });
    window.setTimeout(() => {
      this.setState({
        msg: "Salvar",
        savestatus: false,
      });
    }, 4000);
  },
  _check_save() {
    //no more than 4 questions
    if (this.state.titles.length > 4) {
      return false;
    }
    //questions must be at least 2 alternatives
    for (let i = 0; i < this.state.options.length; i++) {
      if (this.state.options[i].length < 2) {
        return false;
      }
    }
    return true;
  },
  _handleKeyPress(e) {
    if (e.key == "Enter") {
      e.preventDefault();
    }
  },
  translate(id) {
    return this.props.intl.formatMessage({ id });
  },
  deleteElement: function (e) {
    var titleIndex = e.target.value;

    let new_titles = this.state.titles.slice(0);
    new_titles.splice(titleIndex, 1);

    let new_options = this.state.options.slice(0);
    new_options.splice(titleIndex, 1);

    let new_option_types = this.state.option_types.slice(0);
    new_option_types.splice(titleIndex, 1);

    this.setState({
      titles: new_titles,
      options: new_options,
      option_types: new_option_types,
      qtd: this.state.qtd - 1,
    });
    if (this.state.qtd <= 4) this.state.showDivQuestion = true;
    e.preventDefault();
  },
  onChange: function (e) {
    this.setState({ title: e.target.value });
  },
  changeOptions: function (options, index) {
    let new_options = this.state.options.slice(0);
    new_options[index] = options;
    this.setState({ options: new_options });
  },
  changeType: function (type, index) {
    let new_option_types = this.state.option_types.slice(0);
    new_option_types[index] = type;
    this.setState({ option_types: new_option_types });
  },
  addQuestion: function (e) {
    if (this.state.qtd >= 3) this.state.showDivQuestion = false;
    this.setState({
      titles: this.state.titles.concat(""),
      options: this.state.options.concat([[]]),
      option_types: this.state.option_types.concat(["checkbox"]),
      title: "",
      qtd: this.state.qtd + 1,
    });

    var position = this.state.titles.length;

    window.setTimeout(() => {
      $("html, body").animate(
        {
          scrollTop: $("#title-" + position).offset().top,
        },
        1000
      );
    }, 500);
  },
  submitForm: function (e) {
    e.preventDefault();
  },
  render: function () {
    return this.state && !this.state.has_answered ? (
      <div className="container">
        <div className="columns">
          <div className="column">
            <h1 className="mb-20 is-size-4">
              {parse(this.translate("CreateQuestion.createQuestionTitle"))}
            </h1>
            <p className="mb-15">
              {parse(this.translate("CreateQuestion.description"))}
            </p>
            <p className="mb-15">
              {parse(this.translate("CreateQuestion.description2"))}
            </p>
            <ol className="pl-20 mb-30">
              <li>{parse(this.translate("CreateQuestion.bullet1"))}</li>
              <li>{parse(this.translate("CreateQuestion.bullet2"))}</li>
            </ol>
            <button
              onClick={this.addQuestion}
              className={classnames("button", styles.new__question__button)}
              disabled={!this.state.showDivQuestion}
            >
              {parse(this.translate("CreateQuestion.btnAddQuestion"))}
            </button>
          </div>
        </div>

        <form id="formData">
          <QuestionList
            intl={this.props.intl}
            titles={this.state.titles}
            changeOptions={this.changeOptions}
            changeType={this.changeType}
            deleteElement={this.deleteElement}
            optionArray={this.state.options}
            optionTypeArray={this.state.option_types}
          />
          <div className={styles.field}>
            <p className={classnames("control", styles.form__submit_button)}>
              <div className="result">
                <Button
                  onClick={this.sendData}
                  className={classnames("is-primary", {
                    "is-loading":
                      this.state && this.state.setting_valid ? true : false,
                  })}
                  disabled={!this._check_save()}
                >
                  {parse(this.translate("CreateQuestion.btnSave"))}
                </Button>
              </div>
            </p>
          </div>
        </form>
      </div>
    ) : (
      <div className={styles.form}>
        <div>
          <h1 className={styles.highlighted}>
            {parse(this.translate("LocalQuestions.responsesAlreadyRecorded"))}
          </h1>
        </div>
        <form id="formData"></form>
      </div>
    );
  },
});

export default injectIntl(
  compose(APIDataContainer, NonUserRedir, NonAdminRedir)(Pergunta)
);
