import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import axios from "axios";
import $ from "jquery";
import styles from "./styles.styl";
import classnames from "classnames";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import SubmitBtn from "~/components/SubmitBtn";

import {
  getUserToken,
  setUserToken,
  removeUserToken,
  createUrlWithParams,
} from "~/api/utils";

import CONF from "~/api/index";

import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import _ from "lodash";
import schema from "../scheduling/schema";

class SchedulingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      survey: [],
      recurrence_days: 0,
      fetchedSurvey: false,
    };
  }

  componentWillMount() {
    this.getSurveys();
  }

  getSurveys = () => {
    const _this = this;
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/surveys_list?access_token=" +
          getUserToken(),
        {}
      )
      .then(function (surveys) {
        if (surveys.data) {
          var surveySchool = [];
          var recurrence_days = 0;
          surveys.data.surveys.forEach(function (survey) {
            if (survey.type === "personal") {
              surveySchool = survey;
              if (survey.schedule.length > 0)
                recurrence_days = survey.schedule[0].recurrence_days;
            }
          });
          _this.setState({
            survey: surveySchool,
            recurrence_days: Number(recurrence_days),
            fetchedSurvey: true,
          });
        }
      });
  };

  _submit(e) {
    let survey = this.state.survey;
    // e.preventDefault()
    // e = e || window.event
    // e = e.target || e.srcElement

    axios
      .post(CONF.ApiURL + "/api/v1/survey/schedule/" + survey.id, {
        access_token: getUserToken(),
        recurrence_days: $("#dateend").val(),
        is_cyclic: false,
      })
      .then(function (response) {
        console.log(response.data);
        if (response.data) {
          window.location = "/mapeamento-professor/frequencia";
        }
      })
      .catch(function (error) {
        console.log("Falha ao salvar a frequência " + error);
      });
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    const { handleSubmit, intl } = this.props;
    const onSubmit = handleSubmit(this._submit.bind(this));
    const translatedMonths = intl.formatMessage({
      id: "FrequencyAnswers.months",
    });

    return (
      <form onSubmit={onSubmit}>
        <div>
          <p>
            <strong>
              {parse(this.translate("FrequencyAnswers.numberMonths"))}
            </strong>
          </p>
          <p>
            {parse(this.translate("FrequencyAnswers.description2"))}
          </p>
          {this.state.fetchedSurvey && (
            <select
              defaultValue={this.state.recurrence_days}
              className={classnames("input", styles.select_day)}
              id="dateend"
            >
              <option value="180">6 {translatedMonths}</option>
              <option value="212">7 {translatedMonths}</option>
              <option value="243">8 {translatedMonths}</option>
              <option value="273">9 {translatedMonths}</option>
              <option value="304">10 {translatedMonths}</option>
              <option value="334">11 {translatedMonths}</option>
              <option value="365">12 {translatedMonths}</option>
              <option value="547">18 {translatedMonths}</option>
              <option value="730">24 {translatedMonths}</option>
            </select>
          )}
        </div>
        <div className={styles.field}>
          <p className={classnames("control", styles.form__submit_button)}>
            <SubmitBtn className={classnames("is-primary")}>
              {parse(this.translate("FrequencyAnswers.btnSave"))}
            </SubmitBtn>
          </p>
        </div>
      </form>
    );
  }
}
SchedulingForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default injectIntl(
  reduxForm({
    form: "schedulingForm",
    fields: _.keys(schema),
  })(SchedulingForm)
);
