import React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import Layout from "~/components/Layout";
import styles from "./Resources.styl";

import AccountsContainer from "~/containers/accounts";
import NonUserRedir from "~/containers/non_user_redir";

import { getSelectedSurvey, getSelectedAnswer } from "~/actions/survey";
import { getUserToken } from "~/api/utils";
import { compose } from "redux";

import CONF from "~/api/index";
import axios from "axios";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

class AnswersList extends React.Component {
  constructor() {
    super();
    this.state = {
      fetchedQuestions: false,
      fetchedAnswers: false,
      survey: getSelectedSurvey(),
      answer: getSelectedAnswer(),
      questions: [],
      userResponses: [],
      surveyResponse: [],
    };
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  componentWillMount() {
    if (this.state.survey) {
      this.getQuestions();
      this.getResponses();
    }
  }

  getQuestions = () => {
    const _this = this;
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/questions/" +
          this.state.survey.id +
          "?access_token=" +
          getUserToken(),
        {}
      )
      .then((q) => {
        let questions = q.data.result;
        let questionsInfra = questions.find((q) => q.name == "Infraestrutura");
        let surveyQuestionInfra = questionsInfra.survey_question.filter(
          (sq) => sq.name.includes("Infra") && sq.name.includes(" D")
        );
        surveyQuestionInfra.forEach((sq, index) => {
          sq.survey_question_description[0].question_id = sq._id.$oid;

          if (index == 0) {
            sq.survey_question_description.push(
              surveyQuestionInfra[1].survey_question_description[0]
            );
            sq.survey_question_description.push(
              surveyQuestionInfra[2].survey_question_description[0]
            );
          }

          if (index == 3) {
            sq.survey_question_description.push(
              surveyQuestionInfra[4].survey_question_description[0]
            );
            sq.survey_question_description.push(
              surveyQuestionInfra[5].survey_question_description[0]
            );
          }
        });

        questionsInfra.survey_question.splice(4, 2);
        questionsInfra.survey_question.splice(5, 2);

        _this.setState({
          fetchedQuestions: true,
          questions: questions.filter(
            (r) => r.position == 2 || (r.position >= 4 && r.position <= 7)
          ),
        });
      });
  };

  getResponses = () => {
    const _this = this;
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/responses_user/" +
          this.state.survey.id +
          "?access_token=" +
          getUserToken() +
          "&survey_response_id=" +
          this.state.answer.id.$oid +
          "&read_only=true"
      )
      .then((result) => {
        let fullArrResponse = {};
        if (result.data && result.data.answeres.length > 0) {
          console.log(result.data.answeres.length);
          for (let i = 0; i < result.data.answeres.length; i++) {
            let val = result.data.answeres[i].options;
            fullArrResponse[
              result.data.answeres[i].survey_question_id.$oid
            ] = val;
          }
        }
        _this.setState({
          fetchedAnswers: true,
          userResponses: fullArrResponse,
          surveyResponse: result.data.response,
        });
      });
  };

  infoSchools = (surveyQuestion) => {
    let sqTemp = surveyQuestion.slice(0).filter((s) => s.compound_ref);
    let compoundRefs = [
      ...new Set(
        sqTemp.map((s) => {
          return s.compound_ref;
        })
      ),
    ];
    let arrSurveyQuestion = [];

    compoundRefs.forEach((cr) => {
      arrSurveyQuestion.push(sqTemp.filter((s) => s.compound_ref == cr));
    });

    return arrSurveyQuestion;
  };

  render() {
    return this.state.fetchedQuestions && this.state.fetchedAnswers ? (
      <Layout className={styles.layout}>
        <Helmet title="Respostas" />
        <div className="section">
          <div className={classnames("container")}>
            {this.state.questions.map((dimension, i) => (
              <div key={"d" + i.toString()}>
                <div className="columns is-multiline">
                  {dimension.position == 2 ? (
                    <div
                      className={classnames("column is-12", styles.dimension)}
                    >
                      <h1>{dimension.name}</h1>
                      {
                        <div className={classnames("box", styles.question)}>
                          <h2 className={styles.pb_5}>
                            Nome e a função dentro da escola dos professores que
                            responderam esse questionário:
                          </h2>
                          <div className="columns is-multiline">
                            {this.infoSchools(dimension.survey_question).map(
                              (sQuestions) => (
                                <div
                                  className={classnames(
                                    "column is-6",
                                    styles.teacher_group
                                  )}
                                >
                                  {sQuestions.map(
                                    (question, j) =>
                                      question.survey_question_description[0]
                                        .value != "CPF" &&
                                      question.survey_question_description[0]
                                        .value != "Data de Nascimento" && (
                                        <div key={"q" + j.toString()}>
                                          <span>
                                            {
                                              question
                                                .survey_question_description[0]
                                                .value
                                            }
                                            :{" "}
                                            <strong>
                                              {
                                                this.state.userResponses[
                                                  question._id.$oid
                                                ]
                                              }
                                            </strong>
                                          </span>
                                        </div>
                                      )
                                  )}
                                </div>
                              )
                            )}
                          </div>
                          <h2 className={styles.mt_5}>
                            {dimension.survey_question[0].name}
                          </h2>
                          {dimension.survey_question[0].survey_question_description.map(
                            (option, k) => (
                              <div
                                key={"o" + k.toString()}
                                className={classnames(
                                  styles.option,
                                  this.state.userResponses[
                                    dimension.survey_question[0]._id.$oid
                                  ].includes(option.id.toString()) &&
                                    styles.selected
                                )}
                              >
                                {this.state.userResponses[
                                  dimension.survey_question[0]._id.$oid
                                ].includes(option.id.toString()) && (
                                  <i className="far fa-check-circle"></i>
                                )}
                                {option.value}
                              </div>
                            )
                          )}
                        </div>
                      }
                    </div>
                  ) : (
                    <div
                      className={classnames("column is-12", styles.dimension)}
                    >
                      <h1>{dimension.name}</h1>
                      {dimension.survey_question.map((question, j) =>
                        this.state.userResponses[question._id.$oid] ? (
                          question.type != "pc" && question.type != "table" ? (
                            <div
                              key={"q" + j.toString()}
                              className={classnames("box", styles.question)}
                            >
                              <h2
                                dangerouslySetInnerHTML={{
                                  __html: question.name,
                                }}
                              ></h2>
                              {question.survey_question_description.map(
                                (option, k) => (
                                  <div
                                    key={"o" + k.toString()}
                                    className={classnames(
                                      styles.option,
                                      this.state.userResponses[
                                        question._id.$oid
                                      ].includes(option.id.toString()) &&
                                        styles.selected
                                    )}
                                  >
                                    {this.state.userResponses[
                                      question._id.$oid
                                    ].includes(option.id.toString()) && (
                                      <i className="far fa-check-circle"></i>
                                    )}

                                    {option.value}
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div
                              key={"q" + j.toString()}
                              className={classnames("box", styles.question)}
                            >
                              <h2
                                dangerouslySetInnerHTML={{
                                  __html: question.name,
                                }}
                              ></h2>
                              <p
                                className={styles.obs}
                                dangerouslySetInnerHTML={{
                                  __html: question.obs,
                                }}
                              ></p>
                              {question.survey_question_description.map(
                                (sqd, k) => (
                                  <div
                                    key={"o" + k.toString()}
                                    className={classnames(styles.option)}
                                  >
                                    <span>
                                      {sqd.value}{" "}
                                      <strong>
                                        {
                                          this.state.userResponses[
                                            question._id.$oid
                                          ][0]
                                        }
                                        {console.log(question._id.$oid)}
                                      </strong>
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          )
                        ) : null
                      )}
                    </div>
                  )}
                </div>
                <hr />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    ) : (
      <div>{parse(this.translate("Global.loading"))}</div>
    );
  }
}

AnswersList.propTypes = {};

export default injectIntl(
  compose(AccountsContainer, NonUserRedir)(AnswersList)
);
