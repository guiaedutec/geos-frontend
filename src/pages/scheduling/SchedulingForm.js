import React from "react";
import { reduxForm } from "redux-form";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import $ from "jquery";
import styles from "./styles.styl";
import classnames from "classnames";
import SubmitBtn from "~/components/SubmitBtn";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import { getUserToken } from "~/api/utils";
import CONF from "~/api/index";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import _ from "lodash";
import schema from "./schema";

class SchedulingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      survey: {},
      now: moment(),
      startDate: moment(),
      endDate: moment().add(45, "days").format("DD/MM/YYYY"),
      dateend: moment()
        .add(45, "days")
        .locale(this.getLang())
        .format("DD/MM/YYYY dddd"),
      lastDateWill: "",
      lastDate: "",
      lastDay: "",
      ssd: "",
      isEdit: false,
      missing_days: null,
      startEditPicker: "",
      pickerMinDate: "",
    };
  }

  getLang() {
    const lang = localStorage.getItem("lang");
    return lang;
  }

  componentDidMount() {
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
          surveys.data.surveys.forEach(function (survey) {
            if (survey.type === "school") {
              surveySchool = survey;
            }
          });
          _this.setState(
            {
              survey: surveySchool,
            },
            () => {
              _this.getSchedule();
            }
          );
        }
      });
  };

  getSchedule = () => {
    const _this = this;
    let schedule = this.state.survey.schedule[0];
    if (schedule.survey_start_date == null) return;
    if (schedule.missing_days == null) {
      _this.setState({
        isEdit: true,
        ssd: moment(schedule.survey_start_date).format("DD/MM/YYYY"),
        lastDateWill: moment(schedule.survey_end_date).format("DD/MM/YYYY"),
      });
    } else if (schedule.missing_days >= 0 && schedule.missing_days != null) {
      var can10 = true;
      var can20 = true;
      var can30 = true;
      if (schedule.missing_days == 20) {
        can30 = false;
      } else if (schedule.missing_days == 10) {
        can30 = false;
        can20 = false;
      }
      _this.setState({
        lastDate: moment(schedule.survey_end_date).format("DD/MM/YYYY"),
        lastDateWill: moment(schedule.survey_end_date)
          .add(10, "days")
          .locale(this.getLang())
          .format("DD/MM/YYYY dddd"),
        lastDay: moment(schedule.survey_end_date)
          .add(10, "days")
          .format("DD/MM/YYYY"),
        ssd: moment(schedule.survey_start_date).format("DD/MM/YYYY"),
        isEdit: true,
        can30: can30,
        can20: can20,
        can10: can10,
        startEditPicker: moment(schedule.survey_end_date).format("DD/MM/YYYY"),
        missing_days: schedule.missing_days,
        pickerMinDate: moment(schedule.survey_end_date).format("DD/MM/YYYY"),
      });
    }
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    return (
      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{parse(this.translate("SchedulingForm.cycle"))}</th>
              <th>{parse(this.translate("SchedulingForm.startDate"))}</th>
              <th>{parse(this.translate("SchedulingForm.endDate"))}</th>
            </tr>
          </thead>

          <tbody>
            {this.state.survey.schedule &&
              this.state.survey.schedule.map((item) => (
                <tr>
                  <td>{item.name}</td>
                  <td>
                    {item.survey_start_date &&
                      new Date(item.survey_start_date).toLocaleDateString(
                        "pt-BR"
                      )}
                  </td>
                  <td>
                    {item.survey_end_date &&
                      new Date(item.survey_end_date).toLocaleDateString(
                        "pt-BR"
                      )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <br></br>
        <br></br>
      </div>
    );
  }
}

export default injectIntl(
  reduxForm({
    form: "schedulingForm",
    fields: _.keys(schema),
  })(SchedulingForm)
);
