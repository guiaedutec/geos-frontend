import React from "react";
import PropTypes from "prop-types";
import { change, reduxForm } from "redux-form";
import classNames from "classnames";
import Helmet from "react-helmet";
import schema from "./schema";
import axios from "axios";
import Body from "~/components/Body";
import { compose } from "redux";

import { injectIntl } from "react-intl";
import parse from "html-react-parser";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

import APIDataContainer from "~/containers/api_data";

import Field from "~/components/Form/Field";
import SubmitBtn from "~/components/SubmitBtn";
import AccountsContainer from "~/containers/accounts";
import NonAdminRedir from "~/containers/non_admin_redir";
import CustomizedLabelGeral from "./components/CustomizedLabelGeral";
import CustomizedLabelQuestionsSimple from "./components/CustomizedLabelQuestionsSimple";
import QuestionResult from "./components/QuestionResult";
import { PulseLoader } from "react-spinners";
import API from "~/api";

import { getUserToken, getUrlParamString } from "~/api/utils";

import { isAdminStateCity, isAdminUser } from "~/helpers/users";
import { resultTxt } from "~/helpers/results";

import Layout from "~/components/Layout";
import styles from "./styles.styl";
import CONF from "~/api/index";

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      survey: [],
      fetchedResults: false,
      fetchResultsAvg: false,
      fetchResultsPerDimension: false,
      fetchResultsQuestionsPerDimension: false,
      fetchedAnswers: false,
      aditionalQuestions: false,
      resultType: 0,
      results: [],
      resultsAvg: [],
      minorDimension: "",
      dataVision: [],
      dataCompetence: [],
      dataResources: [],
      dataInfra: [],
      questions: [],
      surveyList: [],
      paramsList: [],
      txtRegional: "",
      params: "",
      survey_params: "",
      loadingRQPD: true,
      loadingRPD: true,
      loading: true,
      loadingResultsAvg: true,
      loadingAnswersJsonSample: true,
      loadingAnswersJsonFilter: true,
      stateName: "",
      regionals: [],
    };

    this.getQuestions = this.getQuestions.bind(this);
  }

  async componentDidMount() {
    this.createParams();
    const response = await API.Schools.findRegionals();
    this.setState({ regionals: response });
  }

  createParams = () => {
    let state_id = getUrlParamString("state_id");
    let city_id = getUrlParamString("city_id");
    let network = getUrlParamString("network");
    let survey_id = getUrlParamString("survey_id");
    let survey_schedule_id = getUrlParamString("survey_schedule_id");
    let params = "access_token=" + getUserToken();
    let survey_params = "";
    let survey = [];
    let p = {};

    if (state_id && network) {
      params += "&state_id=" + state_id + "&network=" + network;
      p["state"] = state_id;
      p["network"] = network;
    }

    if (city_id && network) {
      params += "&city_id=" + city_id + "&network=" + network;
      p["city"] = city_id;
      p["network"] = network;
    }

    if (survey_id && survey_schedule_id) {
      survey_params =
        "&survey_id=" + survey_id + "&survey_schedule_id=" + survey_schedule_id;
      survey = survey_id;
    }

    if (isAdminUser(this.props.accounts.user)) {
      this.props.fetchRegionals(p);
    } else this.props.fetchRegionals();

    this.setState(
      {
        params,
        survey_params,
        survey,
      },
      () => {
        this.getSurveys();
      }
    );
  };

  _updateSelectedCicles(event) {
    let { paramsList, params, surveyList } = this.state;

    // Verifica se o scheduleId do state paramsList é igual ao valor passado evento do select
    let cicles = paramsList.find(
      ({ scheduleId }) => scheduleId === event.target.value
    );

    // procurar se o scheduleId do state > surveyList é igual ao valor passado evento do select, após atribuir ao state
    let surveyScheduledId = surveyList.find(
      ({ scheduleId }) => scheduleId.$oid === event.target.value
    );

    let updatedParam = cicles.param;

    if (params !== updatedParam)
      this.setState(
        {
          survey: surveyScheduledId.surveySchool,
          params: updatedParam,
          fetchedResults: false,
          fetchResultsAvg: false,
          fetchResultsPerDimension: false,
          fetchResultsQuestionsPerDimension: false,
          fetchedAnswers: false,
          aditionalQuestions: false,
          resultType: 0,
          results: [],
          resultsAvg: [],
          minorDimension: "",
          dataVision: [],
          dataCompetence: [],
          dataResources: [],
          dataInfra: [],
          questions: [],
          loading: true,
          loadingRQPD: true,
          loadingRPD: true,
          loadingResultsAvg: true,
        },
        () => {
          this.getResults();
        }
      );
  }

  _updateSelectedRegional(event) {
    this.props.fields.regional.onChange(event);
    this.setState(
      {
        txtRegional:
          event.target.value === ""
            ? ""
            : "&regional=" + encodeURI(event.target.value),
        fetchedResults: false,
        fetchResultsAvg: false,
        fetchResultsPerDimension: false,
        fetchResultsQuestionsPerDimension: false,
        fetchedAnswers: false,
        aditionalQuestions: false,
        resultType: 0,
        results: [],
        resultsAvg: [],
        minorDimension: "",
        dataVision: [],
        dataCompetence: [],
        dataResources: [],
        dataInfra: [],
        questions: [],
        loading: true,
        loadingRPD: true,
        loadingRQPD: true,
        loadingResultsAvg: true,
      },
      () => {
        this.getResults();
      }
    );
  }

  getSurveys = () => {
    const _this = this;
    if (_this.state.survey_params !== "") {
      let params = _this.state.params + _this.state.survey_params;
      _this.setState(
        {
          params,
        },
        () => {
          _this.getResults();
        }
      );
    } else {
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
            var surveySchoolList = [];
            var scheduleId = {};

            surveys.data.surveys.forEach(function (survey) {
              if (survey.type === "school") {
                if (survey.schedule.length) {
                  surveySchool = survey.schedule[0].survey_id.$oid;
                  scheduleId = survey.schedule[0].id;
                  surveySchoolList = survey.schedule.map(
                    ({ name, survey_id, id }) => ({
                      name: name,
                      surveySchool: survey_id.$oid,
                      scheduleId: id,
                    })
                  );
                } else {
                  surveySchool = survey.id;
                }
              }
            });

            let params =
              _this.state.params +
              "&survey_id=" +
              surveySchool +
              "&survey_schedule_id=" +
              scheduleId.$oid;

            let paramsList = surveySchoolList.map(
              ({ surveySchool, scheduleId }) => ({
                param:
                  _this.state.params +
                  "&survey_id=" +
                  surveySchool +
                  "&survey_schedule_id=" +
                  scheduleId.$oid,
                scheduleId: scheduleId.$oid,
              })
            );

            _this.setState(
              {
                survey: surveySchool,
                surveyList: surveySchoolList,
                paramsList: paramsList,
                params: params,
              },
              () => {
                _this.getResults();
              }
            );
          }
        });
    }
  };

  getResults = () => {
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey_answers_cicle.json?" +
          this.state.params +
          this.state.txtRegional +
          "&type=" +
          this.state.resultType,
        {}
      )
      .then((results) => {
        let result = 0;
        if (results.data.answered_count / results.data.total_count >= 0.85)
          result = 1;
        else if (
          results.data.answered_sample / results.data.total_sample >=
          0.85
        )
          result = 2;
        else result = 3;
        this.setState({
          fetchedResults: true,
          results: results.data,
          resultType: result,
          loading: false,
        });
        this.getResultsAvg();
      });
  };

  getResultsAvg = () => {
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/result_avg?" +
          this.state.params +
          this.state.txtRegional +
          "&type=" +
          this.state.resultType,
        {}
      )
      .then((avg) => {
        if (avg.data != undefined && avg.data.length > 0) {
          let val = avg.data[0].vision_avg;
          if (avg.data[0].competence_avg < val)
            val = avg.data[0].competence_avg;
          if (avg.data[0].crd_avg < val) val = avg.data[0].crd_avg;
          if (avg.data[0].infra_avg < val) val = avg.data[0].infra_avg;
          this.setState({
            stateName: avg.data[0].state_name,
            fetchResultsAvg: true,
            minorDimension: val,
            resultsAvg: avg.data[0],
            loadingResultsAvg: false,
          });
          this.getResultsPerDimension();
        }
      });
  };

  getResultsPerDimension = () => {
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/result_per_dimension?" +
          this.state.params +
          this.state.txtRegional +
          "&type=" +
          this.state.resultType,
        {}
      )
      .then((avg) => {
        let results = new Object();
        results.vision = new Array();
        results.vision[0] = new Object();
        results.vision[0].name = this.translate("Results.emerging");
        results.vision[0].value = avg.data[0].level1;
        results.vision[1] = new Object();
        results.vision[1].name = this.translate("Results.basic");
        results.vision[1].value = avg.data[0].level2;
        results.vision[2] = new Object();
        results.vision[2].name = this.translate("Results.intermediate");
        results.vision[2].value = avg.data[0].level3;
        results.vision[3] = new Object();
        results.vision[3].name = this.translate("Results.advanced");
        results.vision[3].value = avg.data[0].level4;
        results.competence = new Array();
        results.competence[0] = new Object();
        results.competence[0].name = this.translate("Results.emerging");
        results.competence[0].value = avg.data[1].level1;
        results.competence[1] = new Object();
        results.competence[1].name = this.translate("Results.basic");
        results.competence[1].value = avg.data[1].level2;
        results.competence[2] = new Object();
        results.competence[2].name = this.translate("Results.intermediate");
        results.competence[2].value = avg.data[1].level3;
        results.competence[3] = new Object();
        results.competence[3].name = this.translate("Results.advanced");
        results.competence[3].value = avg.data[1].level4;
        results.crd = new Array();
        results.crd[0] = new Object();
        results.crd[0].name = this.translate("Results.emerging");
        results.crd[0].value = avg.data[2].level1;
        results.crd[1] = new Object();
        results.crd[1].name = this.translate("Results.basic");
        results.crd[1].value = avg.data[2].level2;
        results.crd[2] = new Object();
        results.crd[2].name = this.translate("Results.intermediate");
        results.crd[2].value = avg.data[2].level3;
        results.crd[3] = new Object();
        results.crd[3].name = this.translate("Results.advanced");
        results.crd[3].value = avg.data[2].level4;
        results.infra = new Array();
        results.infra[0] = new Object();
        results.infra[0].name = this.translate("Results.emerging");
        results.infra[0].value = avg.data[3].level1;
        results.infra[1] = new Object();
        results.infra[1].name = this.translate("Results.basic");
        results.infra[1].value = avg.data[3].level2;
        results.infra[2] = new Object();
        results.infra[2].name = this.translate("Results.intermediate");
        results.infra[2].value = avg.data[3].level3;
        results.infra[3] = new Object();
        results.infra[3].name = this.translate("Results.advanced");
        results.infra[3].value = avg.data[3].level4;
        this.setState({
          fetchResultsPerDimension: true,
          resultsPerDimension: results,
          loadingRPD: false,
        });
        this.getQuestions();
      });
  };

  getLang = () => localStorage.getItem("lang");

  getQuestions = () => {
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/questions/" +
          this.state.survey +
          "?" +
          this.state.params +
          this.state.txtRegional +
          "&type=" +
          this.state.resultType +
          "&lang=" +
          this.getLang(),
        {}
      )
      .then((sections) => {
        let questionsData = [];
        sections.data.result.forEach((questions, index) => {
          questions.survey_question.forEach((question, index) => {
            if (
              question.page === 6 &&
              question.survey_section_id !== null &&
              question.type === "pc"
            ) {
              if (question.weight >= 1) {
                question.survey_question_description[0].value = this.translate(
                  "Results.studentPerComputer1"
                );
                question.survey_question_description[1] = new Object();
                question.survey_question_description[1].value = this.translate(
                  "Results.studentPerComputer2"
                );
                question.survey_question_description[1].id = "pc02";
                question.survey_question_description[2] = new Object();
                question.survey_question_description[2].value = this.translate(
                  "Results.studentPerComputer3"
                );
                question.survey_question_description[2].id = "pc03";
                question.survey_question_description[3] = new Object();
                question.survey_question_description[3].value = this.translate(
                  "Results.studentPerComputer4"
                );
                question.survey_question_description[3].id = "pc04";
                question.survey_question_description[4] = new Object();
                question.survey_question_description[4].value = this.translate(
                  "Results.studentPerComputer5"
                );
                question.survey_question_description[4].id = "pc05";
                question.survey_question_description[5] = new Object();
                question.survey_question_description[5].value = this.translate(
                  "Results.studentPerComputer6"
                );
                question.survey_question_description[5].id = "pc06";
                questionsData.push(question);
              }
            } else questionsData.push(question);
          });
        });

        this.setState({
          questions: questionsData.sort((a, b) =>
            a.question_order > b.question_order ? 1 : -1
          ),
        });
        this.getResultsQuestionsPerDimension();
      });
  };

  getResultsQuestionsPerDimension = () => {
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/result_questions_per_dimension?" +
          this.state.params +
          this.state.txtRegional +
          "&type=" +
          this.state.resultType,
        {}
      )
      .then((avg) => {
        let dtv = new Array();
        let dtc = new Array();
        let dtr = new Array();
        let dti = new Array();
        avg.data.forEach(function (v, indexq) {
          switch (v.page) {
            case 3:
              dtv.push(v);
              break;
            case 4:
              dtc.push(v);
              break;
            case 5:
              dtr.push(v);
              break;
            case 6:
              dti.push(v);
              break;
          }
        });
        this.processStatiscs(avg.data[avg.data.length - 1]);
        let q = this.state.questions;
        q.forEach(function (question, index) {
          if (
            question.page === 6 &&
            question.survey_section_id !== null &&
            question.type === "pc"
          ) {
            question.survey_question_description[0].percent = avg.data[
              avg.data.length - 2
            ][0].level1.toString();
            question.survey_question_description[1].percent = avg.data[
              avg.data.length - 2
            ][0].level2.toString();
            question.survey_question_description[2].percent = avg.data[
              avg.data.length - 2
            ][0].level3.toString();
            question.survey_question_description[3].percent = avg.data[
              avg.data.length - 2
            ][0].level4.toString();
            question.survey_question_description[4].percent = avg.data[
              avg.data.length - 2
            ][0].level5.toString();
            question.survey_question_description[5].percent = avg.data[
              avg.data.length - 2
            ][0].level6.toString();
          }
        });
        this.setState({
          fetchResultsQuestionsPerDimension: true,
          questions: q,
          dataVision: dtv,
          dataCompetence: dtc,
          dataResources: dtr,
          dataInfra: dti,
          loadingRQPD: false,
        });
      });
  };

  processStatiscs = (statistics) => {
    var localAditionalQuestion = false;
    var localQuestion = this.state.questions;
    localQuestion.forEach(function (question, index, localQuestion) {
      if (question.page === 7) localAditionalQuestion = true;
      statistics.forEach(function (stat) {
        if (String(question._id.$oid) === String(stat.question_id.$oid)) {
          var total = 0;
          question.survey_question_description.forEach(function (
            option,
            indexq,
            arrayQuestion
          ) {
            if (stat.result) {
              stat.result.forEach(function (result) {
                if (String(option.id) === String(result.option)) {
                  localQuestion[index].survey_question_description[
                    indexq
                  ].count = result.count;
                  total += result.count;
                }
              });
            }
            if (
              localQuestion[index].survey_question_description[indexq].count ===
              undefined
            )
              localQuestion[index].survey_question_description[
                indexq
              ].count = 0;
          });
          question.survey_question_description.forEach(function (
            option,
            indexq,
            arrayQuestion
          ) {
            localQuestion[index].survey_question_description[
              indexq
            ].percent = parseFloat(
              (localQuestion[index].survey_question_description[indexq].count /
                total) *
                100
            ).toFixed(1);
          });
        }
      });
    });
    this.setState({
      fetchedAnswers: true,
      loadingAnswersJsonSample: false,
      aditionalQuestions: localAditionalQuestion,
      questions: localQuestion,
    });
  };

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    const { fields } = this.props;
    const { user } = this.props.accounts;
    let surveyList = this.state.surveyList;

    return (
      <Layout>
        <Helmet title={parse(this.translate("Results.pageHeader"))} />
        <Body>
          <section className="section">
            {isAdminStateCity(user) || isAdminUser(user) ? (
              <div className="container">
                <div
                  className={classNames(
                    "columns",
                    styles.results_container_title
                  )}
                >
                  <div className="column">
                    <h2 className={classNames(styles.not_print)}>
                      <strong>
                        {parse(this.translate("Results.analyzeTheResults"))}
                      </strong>
                    </h2>
                    <h2 className={classNames(styles.print, styles.title_main)}>
                      <strong>
                        {parse(this.translate("Results.results"))}
                      </strong>
                      <div className={styles.state_name}>
                        {this.state.stateName}
                      </div>
                    </h2>
                    <h3 className={classNames(styles.print)}>
                      <strong>
                        {" "}
                        {isAdminStateCity(user) && user.institution
                          ? user.institution.name
                          : ""}
                      </strong>
                    </h3>
                    <img
                      className={classNames(
                        styles.not_print,
                        styles.scale_with_grid
                      )}
                      src={require("../../../public/images/separador-black.png")}
                      alt=""
                    />
                  </div>
                </div>

                <div
                  className={classNames(
                    "columns",
                    styles.section_top_header,
                    styles.description_text
                  )}
                >
                  <div
                    className={classNames(
                      "column",
                      "is-three-quarter",
                      styles.paragraph_spacing
                    )}
                  >
                    <p>
                      {parse(this.translate("Results.description.p1.text"))}{" "}
                      <span className={classNames(styles.section1)}>
                        <u>
                          {parse(
                            this.translate("Results.description.p1.vision")
                          )}
                        </u>
                      </span>
                      ,{" "}
                      <span className={classNames(styles.section2)}>
                        <u>
                          {parse(
                            this.translate(
                              "Results.description.p1.competenceAndFormation"
                            )
                          )}
                        </u>
                      </span>
                      ,{" "}
                      <span className={classNames(styles.section3)}>
                        <u>
                          {parse(
                            this.translate(
                              "Results.description.p1.educationalResources"
                            )
                          )}
                        </u>
                      </span>{" "}
                      e{" "}
                      <span className={classNames(styles.section4)}>
                        <u>
                          {parse(
                            this.translate(
                              "Results.description.p1.infrastructure"
                            )
                          )}
                        </u>
                      </span>
                      ).
                    </p>
                    <p>
                      {parse(this.translate("Results.description.p2.text"))}
                    </p>

                    <strong>
                      {parse(
                        this.translate(
                          "Results.description.howToDoThisAnalysis"
                        )
                      )}
                    </strong>

                    <p>
                      {parse(this.translate("Results.description.p3.text"))}
                    </p>

                    <p>
                      {parse(this.translate("Results.description.p4.text"))}
                    </p>

                    {parse(this.translate("Results.description.p5.text"))}
                  </div>
                </div>

                <div
                  className={classNames(
                    "columns",
                    styles.results_container_selects
                  )}
                >
                  <div className="column">
                    <label className="label Field_field__label_2FT">
                      {parse(this.translate("Results.selectCycle"))}
                    </label>
                    <span className={classNames("select", styles.form__select)}>
                      <select onChange={this._updateSelectedCicles.bind(this)}>
                        <option
                          key={
                            !!surveyList.length && surveyList[0].surveySchool
                          }
                          value={
                            !!surveyList.length && surveyList[0].scheduleId.$oid
                          }
                        >
                          {!!surveyList.length && surveyList[0].name}
                        </option>
                        {this.state.surveyList
                          .slice(1)
                          .map(({ name, scheduleId }) => (
                            <option
                              key={scheduleId.$oid}
                              value={scheduleId.$oid}
                            >
                              {name}
                            </option>
                          ))}
                      </select>
                    </span>
                  </div>
                </div>

                <br className={styles.not_print} />

                {this.state.loading ? (
                  <div className={classNames(styles.results_loading_container)}>
                    <PulseLoader color="#e65c2d" />
                  </div>
                ) : (
                  <div>
                    <div className={classNames(styles.section_header)}>
                      <div className="columns">
                        <div className="column is-full">
                          <h1>
                            {parse(this.translate("Results.diagnosisResults"))}{" "}
                            {fields.regional.value
                              ? " - " + fields.regional.value
                              : ""}{" "}
                          </h1>
                        </div>
                      </div>
                    </div>

                    <div className={classNames(styles.section_body)}>
                      {this.state.resultType === 3 ? (
                        <div className={classNames(styles.warning_result)}>
                          <b>{parse(this.translate("Results.warning"))}</b>
                        </div>
                      ) : null}

                      <div className={classNames(styles.results_print_column)}>
                        <div
                          className={classNames(
                            "column",
                            "is-one-third",
                            styles.result__description
                          )}
                        >
                          {this.state.resultType === 2
                            ? parse(
                                this.translate("Results.summary.description1")
                              )
                            : parse(
                                this.translate("Results.summary.description2")
                              )}
                        </div>
                        <div
                          className={classNames(
                            "column",
                            "is-one-third",
                            styles.result__description,
                            styles.align__right
                          )}
                        >
                          {parse(
                            this.translate("Results.summary.schoolsSample")
                          )}
                          :{" "}
                          <span className={classNames(styles.result_number)}>
                            <u>{this.state.results.total_sample}</u>
                          </span>
                          <br />
                          {parse(
                            this.translate("Results.summary.registeredSchools")
                          )}
                          :{" "}
                          <span className={classNames(styles.result_number)}>
                            <u>{this.state.results.total_count}</u>
                          </span>
                        </div>
                        <div
                          className={classNames(
                            "column",
                            "is-one-third",
                            styles.result__description,
                            styles.align__right
                          )}
                        >
                          {parse(
                            this.translate("Results.summary.sampleAnswers")
                          )}
                          :{" "}
                          <span className={classNames(styles.result_number)}>
                            <u>
                              {this.state.results.answered_sample} (
                              {this.state.results.total_sample > 0
                                ? parseFloat(
                                    100 *
                                      (this.state.results.answered_sample /
                                        this.state.results.total_sample)
                                  ).toFixed(1)
                                : 0}
                              %)
                            </u>
                          </span>
                          <br />
                          {parse(
                            this.translate("Results.summary.totalAnswers")
                          )}
                          :{" "}
                          <span className={classNames(styles.result_number)}>
                            <u>
                              {this.state.results.answered_count} (
                              {this.state.results.total_count > 0
                                ? parseFloat(
                                    100 *
                                      (this.state.results.answered_count /
                                        this.state.results.total_count)
                                  ).toFixed(1)
                                : 0}
                              %)
                            </u>
                          </span>
                        </div>
                      </div>

                      {/* tabela com imagens de quebra cabeça */}
                      {this.state.resultsAvg.length !== 0 ? (
                        this.state.loadingResultsAvg !== true ? (
                          <div>
                            <div className={classNames(styles.result_title)}>
                              <p>
                                {parse(
                                  this.translate("Results.summary.footer2")
                                )}
                                {this.state.minorDimension ===
                                this.state.resultsAvg.vision_avg ? (
                                  <span className={classNames(styles.section1)}>
                                    &nbsp;
                                    <u>
                                      {parse(
                                        this.translate("Results.summary.vision")
                                      )}
                                    </u>
                                    ,
                                  </span>
                                ) : null}
                                {this.state.minorDimension ===
                                this.state.resultsAvg.competence_avg ? (
                                  <span className={classNames(styles.section2)}>
                                    &nbsp;
                                    <u>
                                      {parse(
                                        this.translate(
                                          "Results.competenceAndFormation"
                                        )
                                      )}
                                    </u>
                                    ,
                                  </span>
                                ) : null}
                                {this.state.minorDimension ===
                                this.state.resultsAvg.crd_avg ? (
                                  <span className={classNames(styles.section3)}>
                                    &nbsp;
                                    <u>
                                      {parse(
                                        this.translate(
                                          "Results.educationalResources"
                                        )
                                      )}
                                    </u>
                                    ,
                                  </span>
                                ) : null}
                                {this.state.minorDimension ===
                                this.state.resultsAvg.infra_avg ? (
                                  <span className={classNames(styles.section4)}>
                                    &nbsp;
                                    <u>
                                      {parse(
                                        this.translate("Results.infrastructure")
                                      )}
                                    </u>
                                    ,
                                  </span>
                                ) : null}
                                &nbsp;
                                {parse(
                                  this.translate("Results.summary.yourPriority")
                                )}
                              </p>
                            </div>
                            <div className={styles.wrap_table}>
                              <table
                                className={classNames(styles.result_table)}
                              >
                                <thead>
                                  <tr>
                                    <th
                                      className={classNames(styles.none)}
                                    ></th>
                                    <th className={classNames(styles.title)}>
                                      {parse(this.translate("Results.vision"))}
                                    </th>
                                    <th className={classNames(styles.title)}>
                                      {parse(
                                        this.translate(
                                          "Results.competenceAndFormation"
                                        )
                                      )}
                                    </th>
                                    <th className={classNames(styles.title)}>
                                      {parse(
                                        this.translate(
                                          "Results.educationalResources"
                                        )
                                      )}
                                    </th>
                                    <th className={classNames(styles.title)}>
                                      {parse(
                                        this.translate("Results.infrastructure")
                                      )}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      className={classNames(
                                        styles.title,
                                        styles.level_table
                                      )}
                                    >
                                      {parse(
                                        this.translate("Results.advancedLevel")
                                      )}
                                    </td>
                                    <td className="">
                                      {this.state.fetchResultsAvg ? (
                                        <div
                                          style={{
                                            top:
                                              (4 -
                                                this.state.resultsAvg
                                                  .vision_avg) *
                                                94 +
                                              "px",
                                          }}
                                          className={classNames(
                                            styles.result_puzzle
                                          )}
                                        >
                                          <img
                                            src={require("../../../public/images/1.png")}
                                            alt="1"
                                          />
                                          <span
                                            className={classNames(
                                              styles.result_puzzle_text
                                            )}
                                          >
                                            {parseFloat(
                                              this.state.resultsAvg.vision_avg
                                            ).toFixed(1)}
                                          </span>
                                        </div>
                                      ) : null}
                                    </td>
                                    <td className="">
                                      {this.state.fetchResultsAvg ? (
                                        <div
                                          style={{
                                            top:
                                              (4 -
                                                this.state.resultsAvg
                                                  .competence_avg) *
                                                94 +
                                              "px",
                                          }}
                                          className={classNames(
                                            styles.result_puzzle
                                          )}
                                        >
                                          <img
                                            src={require("../../../public/images/2.png")}
                                            alt="2"
                                          />
                                          <span
                                            className={classNames(
                                              styles.result_puzzle_text
                                            )}
                                          >
                                            {parseFloat(
                                              this.state.resultsAvg
                                                .competence_avg
                                            ).toFixed(1)}
                                          </span>
                                        </div>
                                      ) : null}
                                    </td>
                                    <td className="">
                                      {this.state.fetchResultsAvg ? (
                                        <div
                                          style={{
                                            top:
                                              (4 -
                                                this.state.resultsAvg.crd_avg) *
                                                94 +
                                              "px",
                                          }}
                                          className={classNames(
                                            styles.result_puzzle
                                          )}
                                        >
                                          <img
                                            src={require("../../../public/images/3.png")}
                                            alt="3"
                                          />
                                          <span
                                            className={classNames(
                                              styles.result_puzzle_text
                                            )}
                                          >
                                            {parseFloat(
                                              this.state.resultsAvg.crd_avg
                                            ).toFixed(1)}
                                          </span>
                                        </div>
                                      ) : null}
                                    </td>
                                    <td className="">
                                      {this.state.fetchResultsAvg ? (
                                        <div
                                          style={{
                                            top:
                                              (4 -
                                                this.state.resultsAvg
                                                  .infra_avg) *
                                                94 +
                                              "px",
                                          }}
                                          className={classNames(
                                            styles.result_puzzle
                                          )}
                                        >
                                          <img
                                            src={require("../../../public/images/4.png")}
                                            alt="4"
                                          />
                                          <span
                                            className={classNames(
                                              styles.result_puzzle_text
                                            )}
                                          >
                                            {parseFloat(
                                              this.state.resultsAvg.infra_avg
                                            ).toFixed(1)}
                                          </span>
                                        </div>
                                      ) : null}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className={classNames(styles.title)}>
                                      {parse(
                                        this.translate(
                                          "Results.intermediateLevel"
                                        )
                                      )}
                                    </td>
                                    <td className=""></td>
                                    <td className=""></td>
                                    <td className=""></td>
                                    <td className=""></td>
                                  </tr>
                                  <tr>
                                    <td className={classNames(styles.title)}>
                                      {parse(
                                        this.translate("Results.basicLevel")
                                      )}
                                    </td>
                                    <td className=""></td>
                                    <td className=""></td>
                                    <td className=""></td>
                                    <td className=""></td>
                                  </tr>
                                  <tr>
                                    <td className={classNames(styles.title)}>
                                      {parse(
                                        this.translate("Results.emergingLevel")
                                      )}
                                    </td>
                                    <td className=""></td>
                                    <td className=""></td>
                                    <td className=""></td>
                                    <td className=""></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <PulseLoader color="#e65c2d" />
                        )
                      ) : (
                        <div className={styles.results_info_not_data}>
                          <p>
                            {parse(this.translate("Results.summary.footer1"))}
                          </p>
                        </div>
                      )}

                      <br className={styles.not_print} />
                      <br className={styles.not_print} />
                    </div>

                    <div>
                      {this.state.fetchResultsAvg &&
                        (this.state.loadingRQPD !== true ? (
                          <div>
                            <div
                              className={classNames(
                                styles.section_header,
                                styles.section1,
                                styles.page_break
                              )}
                            >
                              <h1>
                                {parse(this.translate("Results.dimension1"))}
                              </h1>
                              <div className={classNames(styles.underline)} />
                            </div>
                            <div
                              className={classNames(
                                styles.section_body,
                                styles.section1
                              )}
                            >
                              <br className={styles.not_print} />
                              <br />
                              <h2>
                                <u>
                                  {parse(
                                    this.translate(
                                      "Results.visionSchoolDistribution"
                                    )
                                  )}
                                </u>
                                {this.state.loadingRPD ? (
                                  <a
                                    className={classNames(
                                      "button is-loading",
                                      styles.loading
                                    )}
                                  ></a>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <br />
                              <div
                                className={classNames(
                                  "columns",
                                  styles.columns_board
                                )}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {this.state.fetchResultsAvg &&
                                this.state.fetchResultsPerDimension ? (
                                  <div
                                    className={classNames(
                                      "column",

                                      styles.resultPerDimension
                                    )}
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      flexDirection: "column",
                                      gap: "50px",
                                    }}
                                  >
                                    <h1>
                                      {parse(this.translate("Results.result"))}{" "}
                                      -{" "}
                                      <u>
                                        {resultTxt(
                                          this.state.resultsAvg.vision_avg
                                        )}
                                      </u>
                                    </h1>
                                    <ResponsiveContainer
                                      className={classNames(
                                        styles.recharts_width_print,
                                        styles.chart2
                                      )}
                                      width="100%"
                                      height={400}
                                    >
                                      <BarChart
                                        className={classNames(
                                          styles.dimensionChart
                                        )}
                                        data={
                                          this.state.resultsPerDimension.vision
                                        }
                                        margin={{
                                          top: 40,
                                          right: 20,
                                          left: 20,
                                          bottom: 20,
                                        }}
                                      >
                                        <XAxis
                                          dataKey="name"
                                          fontSize="14"
                                          dy={15}
                                        />
                                        <YAxis hide />
                                        <CartesianGrid
                                          vertical={false}
                                          stroke="#ebf3f0"
                                        />
                                        <Tooltip />
                                        <Bar
                                          dataKey="value"
                                          label={<CustomizedLabelGeral />}
                                        >
                                          <Cell fill="#acacac" />
                                          <Cell fill="#7f7f7f" />
                                          <Cell fill="#edc718" />
                                          <Cell fill="#ffdd00" />
                                        </Bar>
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                ) : null}
                              </div>
                              <br className={styles.not_print} />

                              <br className={styles.not_print} />
                              <h2>
                                <u>
                                  {parse(
                                    this.translate(
                                      "Results.schoolDistributionByDimension"
                                    )
                                  )}
                                </u>
                                {this.state.loadingRQPD ? (
                                  <a
                                    className={classNames(
                                      "button is-loading",
                                      styles.loading
                                    )}
                                  ></a>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <br className={styles.not_print} />
                              <div
                                className={classNames(
                                  "columns",
                                  styles.columns_board
                                )}
                              >
                                {this.state
                                  .fetchResultsQuestionsPerDimension ? (
                                  <div
                                    className={classNames(
                                      "column is-half",
                                      styles.geral_distribution_chart
                                    )}
                                  >
                                    <ResponsiveContainer
                                      width="100%"
                                      height="100%"
                                    >
                                      <BarChart
                                        data={this.state.dataVision}
                                        layout="vertical"
                                        barCategoryGap={8}
                                        margin={{
                                          top: 10,
                                          right: 0,
                                          left: 0,
                                          bottom: 10,
                                        }}
                                      >
                                        <XAxis
                                          type="number"
                                          tick={
                                            <CustomizedLabelQuestionsSimple />
                                          }
                                        />
                                        <YAxis
                                          type="category"
                                          dataKey="name"
                                          hide
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                          dataKey="level1"
                                          stackId="a"
                                          fill="#acacac"
                                          name={parse(
                                            this.translate("Results.emerging")
                                          )}
                                        />
                                        <Bar
                                          dataKey="level2"
                                          stackId="a"
                                          fill="#7f7f7f"
                                          name={parse(
                                            this.translate("Results.basic")
                                          )}
                                        />
                                        <Bar
                                          dataKey="level3"
                                          stackId="a"
                                          fill="#edc718"
                                          name={parse(
                                            this.translate(
                                              "Results.intermediate"
                                            )
                                          )}
                                        />
                                        <Bar
                                          dataKey="level4"
                                          stackId="a"
                                          fill="#ffdd00"
                                          name={parse(
                                            this.translate("Results.advanced")
                                          )}
                                        />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                ) : null}
                                <div
                                  className={classNames(
                                    "column is-half",
                                    styles.geral_distribution_text
                                  )}
                                >
                                  {this.state.fetchedAnswers
                                    ? this.state.questions.map((question) =>
                                        question.page === 3 &&
                                        question.weight > -1 ? (
                                          <div
                                            className={classNames(
                                              styles.question_description
                                            )}
                                            key={question._id.$oid}
                                          >
                                            <u>{question.question_order}</u>

                                            <div
                                              className={classNames(
                                                styles.content
                                              )}
                                              dangerouslySetInnerHTML={{
                                                __html: question.name.toUpperCase(),
                                              }}
                                            />
                                          </div>
                                        ) : null
                                      )
                                    : null}
                                </div>
                              </div>

                              <br className={styles.not_print} />
                              <br />
                              <h2 className={styles.page_break}>
                                <u>
                                  {parse(
                                    this.translate(
                                      "Results.schoolDistributionByQuestion"
                                    )
                                  )}
                                </u>
                                {this.state.loadingRQPD ? (
                                  <a
                                    className={classNames(
                                      "button is-loading",
                                      styles.loading
                                    )}
                                  ></a>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <br className={styles.not_print} />
                              <br />
                              {this.state.fetchedAnswers
                                ? this.state.questions.map((question) =>
                                    question.page === 3 ? (
                                      <QuestionResult
                                        elThis={this}
                                        question={question}
                                        section={1}
                                        key={question._id.$oid}
                                      />
                                    ) : null
                                  )
                                : null}
                            </div>
                            <div
                              className={classNames(
                                styles.section_header,
                                styles.section2,
                                styles.page_break
                              )}
                            >
                              <h1>
                                {parse(this.translate("Results.dimension2"))}
                              </h1>
                              <div className={classNames(styles.underline)} />
                            </div>
                            <div
                              className={classNames(
                                styles.section_body,
                                styles.section2
                              )}
                            >
                              <br className={styles.not_print} />
                              <br />
                              <h2>
                                <u>
                                  {parse(
                                    this.translate(
                                      "Results.competenceAndFormationSchoolDistribution"
                                    )
                                  )}
                                </u>
                                {this.state.loadingRPD ? (
                                  <a
                                    className={classNames(
                                      "button is-loading",
                                      styles.loading
                                    )}
                                  ></a>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <br />
                              <div
                                className={classNames(
                                  "columns",
                                  styles.columns_board
                                )}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {this.state.fetchResultsAvg &&
                                this.state.fetchResultsPerDimension ? (
                                  <div
                                    className={classNames(
                                      "column",

                                      styles.resultPerDimension
                                    )}
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      flexDirection: "column",
                                      gap: "50px",
                                    }}
                                  >
                                    <h1>
                                      {parse(this.translate("Results.result"))}{" "}
                                      -{" "}
                                      <u>
                                        {resultTxt(
                                          this.state.resultsAvg.competence_avg
                                        )}
                                      </u>
                                    </h1>
                                    <ResponsiveContainer
                                      className={classNames(
                                        styles.recharts_width_print,
                                        styles.chart2
                                      )}
                                      width="100%"
                                      height={400}
                                    >
                                      <BarChart
                                        className={classNames(
                                          styles.dimensionChart
                                        )}
                                        data={
                                          this.state.resultsPerDimension
                                            .competence
                                        }
                                        margin={{
                                          top: 40,
                                          right: 20,
                                          left: 20,
                                          bottom: 20,
                                        }}
                                      >
                                        <XAxis
                                          dataKey="name"
                                          fontSize="14"
                                          dy={15}
                                        />
                                        <YAxis hide />
                                        <CartesianGrid
                                          vertical={false}
                                          stroke="#ebf3f0"
                                        />
                                        <Tooltip />
                                        <Bar
                                          dataKey="value"
                                          label={<CustomizedLabelGeral />}
                                        >
                                          <Cell fill="#acacac" />
                                          <Cell fill="#7f7f7f" />
                                          <Cell fill="#d11f79" />
                                          <Cell fill="#fa2a79" />
                                        </Bar>
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                ) : null}
                              </div>
                              <br className={styles.not_print} />
                              <br className={styles.not_print} />

                              <br className={styles.not_print} />
                              <h2>
                                <u>
                                  {parse(
                                    this.translate(
                                      "Results.schoolDistributionByDimension"
                                    )
                                  )}
                                </u>
                                {this.state.loadingRQPD ? (
                                  <a
                                    className={classNames(
                                      "button is-loading",
                                      styles.loading
                                    )}
                                  ></a>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <br className={styles.not_print} />
                              <div
                                className={classNames(
                                  "columns",
                                  styles.columns_board
                                )}
                              >
                                {this.state
                                  .fetchResultsQuestionsPerDimension ? (
                                  <div
                                    className={classNames(
                                      "column",
                                      styles.geral_distribution_chart
                                    )}
                                  >
                                    <ResponsiveContainer
                                      width="100%"
                                      height="100%"
                                    >
                                      <BarChart
                                        data={this.state.dataCompetence}
                                        layout="vertical"
                                        barCategoryGap={8}
                                        margin={{
                                          top: 20,
                                          right: 20,
                                          left: 20,
                                          bottom: 5,
                                        }}
                                      >
                                        <XAxis
                                          type="number"
                                          tick={
                                            <CustomizedLabelQuestionsSimple />
                                          }
                                        />
                                        <YAxis
                                          type="category"
                                          dataKey="name"
                                          hide
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                          dataKey="level1"
                                          stackId="a"
                                          fill="#acacac"
                                          name={parse(
                                            this.translate("Results.emerging")
                                          )}
                                        />
                                        <Bar
                                          dataKey="level2"
                                          stackId="a"
                                          fill="#7f7f7f"
                                          name={parse(
                                            this.translate("Results.basic")
                                          )}
                                        />
                                        <Bar
                                          dataKey="level3"
                                          stackId="a"
                                          fill="#d11f79"
                                          name={parse(
                                            this.translate("Results.basic")
                                          )}
                                        />
                                        <Bar
                                          dataKey="level4"
                                          stackId="a"
                                          fill="#fa2a79"
                                          name={parse(
                                            this.translate(
                                              "Results.intermediate"
                                            )
                                          )}
                                        />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                ) : null}
                                <div
                                  className={classNames(
                                    "column",
                                    styles.geral_distribution_text
                                  )}
                                >
                                  {this.state.fetchedAnswers
                                    ? this.state.questions.map((question) =>
                                        question.page === 4 ? (
                                          <div
                                            className={classNames(
                                              styles.question_description
                                            )}
                                            key={question._id.$oid}
                                          >
                                            <u>{question.question_order}</u>

                                            <div
                                              className={classNames(
                                                styles.content
                                              )}
                                              dangerouslySetInnerHTML={{
                                                __html: question.name.toUpperCase(),
                                              }}
                                            />
                                          </div>
                                        ) : null
                                      )
                                    : null}
                                </div>
                              </div>

                              <br className={styles.not_print} />
                              <br />
                              <h2 className={styles.page_break}>
                                <u>
                                  {parse(
                                    this.translate(
                                      "Results.schoolDistributionByQuestion"
                                    )
                                  )}
                                </u>
                                {this.state.loadingRQPD ? (
                                  <a
                                    className={classNames(
                                      "button is-loading",
                                      styles.loading
                                    )}
                                  ></a>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <br className={styles.not_print} />
                              <br />
                              {this.state.fetchedAnswers
                                ? this.state.questions.map((question) =>
                                    question.page === 4 ? (
                                      <QuestionResult
                                        elThis={this}
                                        question={question}
                                        section={2}
                                        key={question._id.$oid}
                                      />
                                    ) : null
                                  )
                                : null}
                            </div>
                            <div
                              className={classNames(
                                styles.section_header,
                                styles.section3,
                                styles.page_break
                              )}
                            >
                              <h1>
                                {parse(this.translate("Results.dimension3"))}
                              </h1>
                              <div className={classNames(styles.underline)} />
                            </div>
                            <div
                              className={classNames(
                                styles.section_body,
                                styles.section3
                              )}
                            >
                              <br className={styles.not_print} />
                              <br />
                              <h2 className={styles.page_break}>
                                <u>
                                  {parse(
                                    this.translate(
                                      "Results.educationalResourcesSchoolDistribution"
                                    )
                                  )}
                                </u>
                                {this.state.loadingRPD ? (
                                  <a
                                    className={classNames(
                                      "button is-loading",
                                      styles.loading
                                    )}
                                  ></a>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <br />
                              <div
                                className={classNames(
                                  "columns",
                                  styles.columns_board
                                )}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {this.state.fetchResultsAvg &&
                                this.state.fetchResultsPerDimension ? (
                                  <div
                                    className={classNames(
                                      "column",

                                      styles.resultPerDimension
                                    )}
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      flexDirection: "column",
                                      gap: "50px",
                                    }}
                                  >
                                    <h1>
                                      {parse(this.translate("Results.result"))}{" "}
                                      -{" "}
                                      <u>
                                        {resultTxt(
                                          this.state.resultsAvg.crd_avg
                                        )}
                                      </u>
                                    </h1>

                                    <ResponsiveContainer
                                      className={classNames(
                                        styles.recharts_width_print,
                                        styles.chart2
                                      )}
                                      width="100%"
                                      height={400}
                                    >
                                      <BarChart
                                        className={classNames(
                                          styles.dimensionChart
                                        )}
                                        data={
                                          this.state.resultsPerDimension.crd
                                        }
                                        margin={{
                                          top: 40,
                                          right: 20,
                                          left: 20,
                                          bottom: 20,
                                        }}
                                      >
                                        <XAxis
                                          dataKey="name"
                                          fontSize="14"
                                          dy={15}
                                        />
                                        <YAxis hide />
                                        <CartesianGrid
                                          vertical={false}
                                          stroke="#ebf3f0"
                                        />
                                        <Tooltip />
                                        <Bar
                                          dataKey="value"
                                          label={<CustomizedLabelGeral />}
                                        >
                                          <Cell fill="#acacac" />
                                          <Cell fill="#7f7f7f" />
                                          <Cell fill="#007ada" />
                                          <Cell fill="#00a3da" />
                                        </Bar>
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                ) : null}
                              </div>
                              <br className={styles.not_print} />
                              <br className={styles.not_print} />

                              <br className={styles.not_print} />
                              <h2>
                                <u>
                                  {parse(
                                    this.translate(
                                      "Results.schoolDistributionByDimension"
                                    )
                                  )}
                                </u>
                                {this.state.loadingRQPD ? (
                                  <a
                                    className={classNames(
                                      "button is-loading",
                                      styles.loading
                                    )}
                                  ></a>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <br className={styles.not_print} />
                              <div
                                className={classNames(
                                  "columns",
                                  styles.columns_board
                                )}
                              >
                                {this.state
                                  .fetchResultsQuestionsPerDimension ? (
                                  <div
                                    className={classNames(
                                      "column",
                                      styles.geral_distribution_chart
                                    )}
                                  >
                                    <ResponsiveContainer
                                      width="100%"
                                      height="100%"
                                    >
                                      <BarChart
                                        data={this.state.dataResources}
                                        layout="vertical"
                                        barCategoryGap={8}
                                        margin={{
                                          top: 20,
                                          right: 20,
                                          left: 20,
                                          bottom: 5,
                                        }}
                                      >
                                        <XAxis
                                          type="number"
                                          tick={
                                            <CustomizedLabelQuestionsSimple />
                                          }
                                        />
                                        <YAxis
                                          type="category"
                                          dataKey="name"
                                          hide
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                          dataKey="level1"
                                          stackId="a"
                                          fill="#acacac"
                                          name={parse(
                                            this.translate("Results.emerging")
                                          )}
                                        />
                                        <Bar
                                          dataKey="level2"
                                          stackId="a"
                                          fill="#7f7f7f"
                                          name={parse(
                                            this.translate("Results.basic")
                                          )}
                                        />
                                        <Bar
                                          dataKey="level3"
                                          stackId="a"
                                          fill="#007ada"
                                          name={parse(
                                            this.translate("Results.basic")
                                          )}
                                        />
                                        <Bar
                                          dataKey="level4"
                                          stackId="a"
                                          fill="#00a3da"
                                          name={parse(
                                            this.translate(
                                              "Results.intermediate"
                                            )
                                          )}
                                        />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                ) : null}
                                <div
                                  className={classNames(
                                    "column",
                                    styles.geral_distribution_text
                                  )}
                                >
                                  {this.state.fetchedAnswers
                                    ? this.state.questions.map((question) =>
                                        question.page === 5 ? (
                                          <div
                                            className={classNames(
                                              styles.question_description
                                            )}
                                            key={question._id.$oid}
                                          >
                                            <u>{question.question_order}</u>

                                            <div
                                              className={classNames(
                                                styles.content
                                              )}
                                              dangerouslySetInnerHTML={{
                                                __html: question.name.toUpperCase(),
                                              }}
                                            />
                                          </div>
                                        ) : null
                                      )
                                    : null}
                                </div>
                              </div>

                              <br className={styles.not_print} />
                              <br />
                              <h2>
                                <u>
                                  {parse(
                                    this.translate(
                                      "Results.schoolDistributionByQuestion"
                                    )
                                  )}
                                </u>
                                {this.state.loadingRQPD ? (
                                  <a
                                    className={classNames(
                                      "button is-loading",
                                      styles.loading
                                    )}
                                  ></a>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <br className={styles.not_print} />
                              <br />
                              {this.state.fetchedAnswers
                                ? this.state.questions.map((question) =>
                                    question.page === 5 ? (
                                      <QuestionResult
                                        elThis={this}
                                        question={question}
                                        section={3}
                                        key={question._id.$oid}
                                      />
                                    ) : null
                                  )
                                : null}
                            </div>
                            <div
                              className={classNames(
                                styles.section_header,
                                styles.section4,
                                styles.page_break
                              )}
                            >
                              <h1>
                                {parse(this.translate("Results.dimension4"))}
                              </h1>
                              <div className={classNames(styles.underline)} />
                            </div>
                            <div
                              className={classNames(
                                styles.section_body,
                                styles.section4
                              )}
                            >
                              <br className={styles.not_print} />
                              <br />
                              <h2>
                                <u>
                                  {parse(
                                    this.translate(
                                      "Results.infrastructureSchoolDistribution"
                                    )
                                  )}
                                </u>
                                {this.state.loadingRPD ? (
                                  <a
                                    className={classNames(
                                      "button is-loading",
                                      styles.loading
                                    )}
                                  ></a>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <br />
                              <div
                                className={classNames(
                                  "columns",
                                  styles.columns_board
                                )}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {this.state.fetchResultsAvg &&
                                this.state.fetchResultsPerDimension ? (
                                  <div
                                    className={classNames(
                                      "column",

                                      styles.resultPerDimension
                                    )}
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      flexDirection: "column",
                                      gap: "50px",
                                    }}
                                  >
                                    <h1>
                                      {parse(this.translate("Results.result"))}{" "}
                                      -{" "}
                                      <u>
                                        {resultTxt(
                                          this.state.resultsAvg.infra_avg
                                        )}
                                      </u>
                                    </h1>
                                    <ResponsiveContainer
                                      className={classNames(
                                        styles.recharts_width_print,
                                        styles.chart2
                                      )}
                                      width="100%"
                                      height={400}
                                    >
                                      <BarChart
                                        className={classNames(
                                          styles.dimensionChart
                                        )}
                                        data={
                                          this.state.resultsPerDimension.infra
                                        }
                                        margin={{
                                          top: 40,
                                          right: 20,
                                          left: 20,
                                          bottom: 20,
                                        }}
                                      >
                                        <XAxis
                                          dataKey="name"
                                          fontSize="14"
                                          dy={15}
                                        />
                                        <YAxis hide />
                                        <CartesianGrid
                                          vertical={false}
                                          stroke="#ebf3f0"
                                        />
                                        <Tooltip />
                                        <Bar
                                          dataKey="value"
                                          label={<CustomizedLabelGeral />}
                                        >
                                          <Cell fill="#acacac" />
                                          <Cell fill="#7f7f7f" />
                                          <Cell fill="#00c900" />
                                          <Cell fill="#00fa00" />
                                        </Bar>
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                ) : null}
                              </div>
                              <br className={styles.not_print} />
                              <br className={styles.not_print} />

                              <br className={styles.not_print} />
                              <h2>
                                <u>
                                  {parse(
                                    this.translate(
                                      "Results.schoolDistributionByDimension"
                                    )
                                  )}
                                </u>
                                {this.state.loadingRQPD ? (
                                  <a
                                    className={classNames(
                                      "button is-loading",
                                      styles.loading
                                    )}
                                  ></a>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <br className={styles.not_print} />
                              <div
                                className={classNames(
                                  "columns",
                                  styles.columns_board
                                )}
                              >
                                {this.state
                                  .fetchResultsQuestionsPerDimension ? (
                                  <div
                                    className={classNames(
                                      "column",
                                      styles.geral_distribution_chart
                                    )}
                                  >
                                    <ResponsiveContainer
                                      width="100%"
                                      height="100%"
                                    >
                                      <BarChart
                                        data={this.state.dataInfra}
                                        layout="vertical"
                                        barCategoryGap={8}
                                        margin={{
                                          top: 20,
                                          right: 20,
                                          left: 20,
                                          bottom: 5,
                                        }}
                                      >
                                        <XAxis
                                          type="number"
                                          tick={
                                            <CustomizedLabelQuestionsSimple />
                                          }
                                        />
                                        <YAxis
                                          type="category"
                                          dataKey="name"
                                          hide
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                          dataKey="level1"
                                          stackId="a"
                                          fill="#acacac"
                                          name={parse(
                                            this.translate("Results.emerging")
                                          )}
                                        />
                                        <Bar
                                          dataKey="level2"
                                          stackId="a"
                                          fill="#7f7f7f"
                                          name={parse(
                                            this.translate("Results.basic")
                                          )}
                                        />
                                        <Bar
                                          dataKey="level3"
                                          stackId="a"
                                          fill="#00c900"
                                          name={parse(
                                            this.translate("Results.basic")
                                          )}
                                        />
                                        <Bar
                                          dataKey="level4"
                                          stackId="a"
                                          fill="#00fa00"
                                          name={parse(
                                            this.translate(
                                              "Results.intermediate"
                                            )
                                          )}
                                        />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                ) : null}
                                <div
                                  className={classNames(
                                    "column",
                                    styles.geral_distribution_text
                                  )}
                                >
                                  {this.state.fetchedAnswers
                                    ? this.state.questions.map((question) =>
                                        question.page === 6 &&
                                        question.survey_section_id !== null &&
                                        question.type !== "table" ? (
                                          <div
                                            className={classNames(
                                              styles.question_description
                                            )}
                                            key={question._id.$oid}
                                          >
                                            <u>{question.question_order}</u>

                                            <div
                                              className={classNames(
                                                styles.content
                                              )}
                                              dangerouslySetInnerHTML={{
                                                __html: question.name.toUpperCase(),
                                              }}
                                            />
                                          </div>
                                        ) : null
                                      )
                                    : null}
                                </div>
                              </div>

                              <br className={styles.not_print} />
                              <br />
                              <h2 className={styles.page_break}>
                                <u>
                                  {parse(
                                    this.translate(
                                      "Results.schoolDistributionByQuestion"
                                    )
                                  )}
                                </u>
                                {this.state.loadingRQPD ? (
                                  <a
                                    className={classNames(
                                      "button is-loading",
                                      styles.loading
                                    )}
                                  ></a>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <br className={styles.not_print} />
                              <br />
                              {this.state.fetchedAnswers
                                ? this.state.questions.map((question) =>
                                    question.page === 6 &&
                                    question.survey_section_id !== null &&
                                    question.type !== "table" ? (
                                      <QuestionResult
                                        elThis={this}
                                        question={question}
                                        section={4}
                                        key={question._id.$oid}
                                      />
                                    ) : null
                                  )
                                : null}
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <PulseLoader color="#e65c2d" />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </section>
        </Body>
      </Layout>
    );
  }
}

export default injectIntl(
  reduxForm({
    form: "resultForm",
    fields: _.keys(schema),
    initialValues: {},
  })(compose(NonAdminRedir, AccountsContainer, APIDataContainer)(Results))
);
