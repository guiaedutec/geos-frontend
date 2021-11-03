import React from "react";
import classNames from "classnames";
import Helmet from "react-helmet";
import { GridLoader } from "react-spinners";
import axios from "axios";
import Body from "~/components/Body";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { compose } from "redux";

import AccountsContainer from "~/containers/accounts";
import NonUserRedir from "~/containers/non_user_redir";

import {
  getUserToken,
  setUserToken,
  removeUserToken,
  createUrlWithParams,
  getUrlParamString,
} from "~/api/utils";

import { isAdminStateCity, isAdminUser } from "~/helpers/users";
import { resultTxt } from "~/helpers/results";

import Layout from "~/components/Layout";
import styles from "./styles.styl";
import CONF from "~/api/index";

class ResultsDetails extends React.Component {
  ws = null;

  constructor(props) {
    super(props);
    this.state = {
      pageLoaded: 0,
      pageTotal: 0,
      survey: [],
      fetchedAnswers: false,
      stillFetching: false,
      errorFetching: false,
      resultType: 0,
      totalResults: 0,
      results: [],
      resultsAvg: [],
      resultDetails: [],
      questions: [],
    };
  }

  componentDidMount() {
    this.createParams();
  }

  createParams = () => {
    let state_id = getUrlParamString("state_id");
    let city_id = getUrlParamString("city_id");
    let network = getUrlParamString("network");
    let params = "access_token=" + getUserToken();
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

    this.setState(
      {
        params: params,
      },
      () => {
        this.getSurveys();
      }
    );
  };

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
          var surveySchool_schedule = [];
          surveys.data.surveys.forEach(function (survey) {
            if (survey.type === "school") {
              surveySchool_schedule =
                survey.schedule.length > 0
                  ? survey.schedule[0].id.$oid
                  : survey.id;
              surveySchool =
                survey.schedule.length > 0
                  ? survey.schedule[0].survey_id.$oid
                  : survey.id;
            }
          });
          let params =
            _this.state.params + "&survey_schedule_id=" + surveySchool_schedule;
          _this.setState(
            {
              survey: surveySchool,
              params: params,
            },
            () => {
              _this.getResults();
            }
          );
        }
      });
  };

  getResults = () => {
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey_answers_results.json?" +
          this.state.params + //this.state.txtRegional +
          "&type=" +
          this.state.resultType,
        {}
      )
      .then((results) => {
        let result = 0;
        let pageTotal = results.data.total_count;
        if (results.data.answered_count / results.data.total_count >= 0.85) {
          result = 1;
        } else if (
          results.data.answered_sample / results.data.total_sample >=
          0.85
        ) {
          pageTotal = results.data.total_sample;
          result = 2;
        } else {
          result = 3;
        }
        this.setState(
          {
            pageTotal: pageTotal,
            fetchedResults: true,
            results: results.data,
            resultType: result,
          },
          () => {
            this.getQuestions();
          }
        );
      });
  };

  getQuestions = () => {
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/questions/" +
          this.state.survey +
          "?" +
          this.state.params +
          "&survey_id=" +
          this.state.survey + //this.state.txtRegional +
          "&type=" +
          this.state.resultType,
        {}
      )
      .then((sections) => {
        let questionsData = [];
        sections.data.result.forEach(function (questions, index) {
          questions.survey_question.forEach(function (question, index) {
            questionsData.push(question);
          });
        });
        this.setState(
          {
            questions: questionsData,
          },
          () => {
            this.getDetails(1, null);
          }
        );
      });
  };

  getDetails = (page, resultDetails) => {
    var url =
      CONF.ApiURL +
      "/api/v1/survey/answers_details.json?" +
      this.state.params +
      "&type=" +
      this.state.resultType;
    this.setState({ pageLoaded: page });
    if (page > 1) url += "&page=" + page;
    axios
      .get(url, {})
      .then((detailsSchools) => {
        if (resultDetails === null) resultDetails = [];
        var localQuestion = this.state.questions;
        var survey = this.state.survey;
        detailsSchools.data.answers_details.forEach(function (school) {
          var printSchool = [];
          printSchool.push(school.inep);
          printSchool.push(school.school_name);
          printSchool.push(school.sample ? "SIM" : "NÃO");
          printSchool.push(school.regional);
          printSchool.push(school.location_type);
          printSchool.push(school.answered ? "SIM" : "NÃO");
          printSchool.push(school.vision_level);
          printSchool.push(school.competence_level);
          printSchool.push(school.resource_level);
          printSchool.push(school.infrastructure_level);
          printSchool.push(school.student_diurnal_count);
          printSchool.push(school.student_vespertine_count);
          printSchool.push(school.student_nocturnal_count);
          printSchool.push(school.student_full_count);
          if (
            school.survey_responses !== null &&
            school.survey_responses.length > 0
          ) {
            school.survey_responses.forEach(function (response, index) {
              if (response.survey_id.$oid === survey) {
                localQuestion.forEach(function (question, index) {
                  if (question.page > 1) {
                    var exists = false;
                    // if(school.survey_responses.length > 0) {
                    response.response_answers.forEach(function (
                      resp,
                      indexResp,
                      object
                    ) {
                      if (question._id.$oid === resp.survey_question_id.$oid) {
                        exists = true;
                        if (question.survey_question_description.length == 1) {
                          printSchool.push(resp.options[0]);
                          object.splice(indexResp, 1);
                        } else {
                          question.survey_question_description.forEach(
                            function (option, index, arr) {
                              if (
                                resp.options.indexOf(option.id.toString()) >= 0
                              ) {
                                printSchool.push(1);
                              } else {
                                printSchool.push(0);
                              }
                            }
                          );
                          object.splice(indexResp, 1);
                        }
                      }
                    });
                    // }
                    if (!exists) {
                      question.survey_question_description.forEach(function (
                        option,
                        index,
                        arr
                      ) {
                        printSchool.push(0);
                      });
                    }
                  }
                });
                resultDetails.push(printSchool);
              }
            });
          }
        });
        page++;
        if (detailsSchools.data.total_pages < page) {
          this.setState({
            fetchedAnswers: true,
            stillFetching: false,
            totalResults: detailsSchools.data.answered_count,
            resultDetails: resultDetails,
          });
        } else {
          this.setState({
            fetchedAnswers: true,
            stillFetching: true,
            totalResults: detailsSchools.data.answered_count,
            resultDetails: resultDetails,
          });
          this.getDetails(page, resultDetails);
        }
      })
      .catch((error) => {
        this.setState({
          errorFetching: true,
        });
        console.log(error);
      });
  };

  render() {
    const { submitting } = this.props;

    const { user } = this.props.accounts;

    return (
      <Layout>
        <Helmet title="Guia EduTec" />

        <Body>
          <section className="section">
            <div className={classNames("container", styles.title)}>
              <div className="columns">
                <div className="column is-two-thirds">
                  <h2>
                    <strong>RESPOSTAS DETALHADAS DAS ESCOLAS</strong>
                  </h2>
                  <img
                    className={classNames(styles.scale_with_grid)}
                    src={require("../../../public/images/separador-black.png")}
                    alt=""
                  />
                  <br />
                  <strong>Legenda Resultado: </strong> 1 - Emergente | 2 -
                  Básico | 3 - Intermediário | 4 - Avançado
                </div>
                <div className="column is-one-third">
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className={classNames(
                      "button",
                      "is-primary",
                      styles.download_button
                    )}
                    table="table-to-xls"
                    filename="resultado-detalhes"
                    sheet="escolas"
                    buttonText="Baixar Detalhes"
                  />
                </div>
              </div>
              {this.state.fetchedAnswers && this.state.totalResults > 350 ? (
                <p>
                  * Atenção: Devido à quantidade de resposta associada a uma
                  incompatibilidade com o navegador solicitamos que para "Baixar
                  os Detalhes" em excel seja utilizado o navegador Firefox.
                </p>
              ) : null}
            </div>

            {isAdminStateCity(user) || isAdminUser(user) ? (
              <div className={styles.overflow_container}>
                {this.state.fetchedAnswers ? (
                  <table id="table-to-xls">
                    <thead>
                      <tr>
                        <th colSpan={6}>ESCOLA</th>
                        <th colSpan={4}>RESULTADO</th>
                        <th colSpan={4}>QUANTIDADE DE ALUNOS P/ TURNO</th>
                        {this.state.questions.map((question) =>
                          question.page > 1 ? (
                            <th
                              colSpan={
                                question.survey_question_description.length
                              }
                            >
                              <div
                                className={classNames(styles.question_truncate)}
                                key={question._id.$oid}
                              >
                                <b>
                                  <u>
                                    {question.name
                                      .substr(
                                        0,
                                        question.name.indexOf("-", 0) - 1
                                      )
                                      .toUpperCase()}
                                  </u>
                                </b>
                                {question.name.indexOf("? (", 0) > 0 ? (
                                  <span
                                    className={classNames(styles.content)}
                                    dangerouslySetInnerHTML={{
                                      __html: question.name
                                        .substr(
                                          question.name.indexOf("-", 0) + 1,
                                          question.name.indexOf("? (", 0) -
                                            question.name.indexOf("-", 0)
                                        )
                                        .toUpperCase(),
                                    }}
                                  />
                                ) : (
                                  <span
                                    className={classNames(styles.content)}
                                    dangerouslySetInnerHTML={{
                                      __html: question.name
                                        .substr(
                                          question.name.indexOf("-", 0) + 1
                                        )
                                        .toUpperCase(),
                                    }}
                                  />
                                )}
                              </div>
                            </th>
                          ) : null
                        )}
                      </tr>
                      <tr>
                        <th>Inep</th>
                        <th className={styles.school_name}>Nome da Escola</th>
                        <th>Amostra</th>
                        <th>Regional</th>
                        <th>Localização</th>
                        <th>Respondeu?</th>
                        <th>Visão</th>
                        <th>Competência</th>
                        <th>CRD</th>
                        <th>Infra</th>
                        <th>Matutino</th>
                        <th>Vespertino</th>
                        <th>Noturno</th>
                        <th>Integral</th>
                        {this.state.questions.map((question) =>
                          question.page > 1
                            ? question.survey_question_description.map(
                                (option) => (
                                  <th key={option.id}>
                                    <div
                                      className={classNames(
                                        styles.question_truncate
                                      )}
                                      key={question._id.$oid}
                                    >
                                      {option.value}
                                    </div>
                                  </th>
                                )
                              )
                            : null
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.resultDetails.map((question) => (
                        <tr>
                          {question.map((value) => (
                            <td>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    {this.state.stillFetching ? (
                      <div className={(styles.loader, styles.still_loading)}>
                        <GridLoader color={"#131D3C"} loading={true} />
                        {this.state.pageTotal
                          ? "Carregando páginas " +
                            this.state.pageLoaded +
                            " / " +
                            this.state.pageTotal
                          : "Carregando"}
                      </div>
                    ) : null}
                  </table>
                ) : this.state.errorFetching ? (
                  <div
                    className={classNames(styles.loader, styles.loader_error)}
                  >
                    FALHA AO CARREGAR DADOS
                    <br />
                    POR FAVOR TENTE NOVAMENTE
                  </div>
                ) : (
                  <div className={styles.loader}>
                    <GridLoader color={"#131D3C"} loading={true} />
                    {this.state.pageTotal
                      ? "Carregando páginas " +
                        this.state.pageLoaded +
                        " / " +
                        this.state.pageTotal
                      : "Carregando"}
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

ResultsDetails.propTypes = {};

export default compose(AccountsContainer, NonUserRedir)(ResultsDetails);
