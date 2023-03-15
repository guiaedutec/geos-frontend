import React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import Layout from "~/components/Layout";
import Body from "~/components/Body";
import styles from "./Resources.styl";
import stylesPrint from "./Print.styl";

import AccountsContainer from "~/containers/accounts";
import NonUserRedir from "~/containers/non_user_redir";

import { getSelectedSurvey } from "~/actions/survey";
import { getUserToken } from "~/api/utils";
import { compose } from "redux";

import CONF from "~/api/index";
import axios from "axios";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";

class PrintList extends React.Component {
  constructor() {
    super();
    this.state = {
      fetchedQuestions: false,
      fetchedAnswers: false,
      survey: getSelectedSurvey(),
      questions: [],
    };
  }

  getLang = () => localStorage.getItem("lang");

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  componentWillMount() {
    if (this.state.survey) {
      this.getQuestions();
    }
  }

  organizeInfraQuestions = (questions) => {
    let questionsInfra = questions.find(
      (question) => question.pageTitleCssClass === "infraTitle"
    );

    if (questionsInfra && questionsInfra.survey_question) {
      // INFRA D ALUNO
      let surveyQuestionInfraD1 = questionsInfra.survey_question.filter(
        (surveyQuestion) => surveyQuestion.compound_ref === "infra-d-aluno"
      );

      console.log(surveyQuestionInfraD1);
      const surveyQuestionDescriptionInfraD1 = surveyQuestionInfraD1.map(
        (surveyQuestion) => surveyQuestion.survey_question_description[0]
      );
      if (surveyQuestionDescriptionInfraD1.length !== 0) {
        surveyQuestionInfraD1[0].survey_question_description =
          surveyQuestionDescriptionInfraD1;
      }

      //  INFRA D PROFESSOR
      let surveyQuestionInfraD2 = questionsInfra.survey_question.filter(
        (surveyQuestion2) =>
          surveyQuestion2.compound_ref === "infra-d-professor"
      );

      const surveyQuestionDescriptionInfraD2 = surveyQuestionInfraD2.map(
        (surveyQuestion2) => surveyQuestion2.survey_question_description[0]
      );
      if (surveyQuestionDescriptionInfraD2.length !== 0) {
        surveyQuestionInfraD2[0].survey_question_description =
          surveyQuestionDescriptionInfraD2;
      }

      const itemsToBeRemoved = [3, 4, 6, 7];
      questionsInfra.survey_question = questionsInfra.survey_question
        .sort((a, b) => (a.question_order > b.question_order ? 1 : -1))
        .filter((_, index) => !itemsToBeRemoved.includes(index));
    }

    return questions;
  };

  async getQuestions() {
    const { schedule, id } = this.state.survey;
    const surveyId = schedule.length > 0 ? schedule[0].survey_id.$oid : id;
    const params = { access_token: getUserToken(), lang: this.getLang() };
    const response = await axios.get(
      CONF.ApiURL + `/api/v1/survey/questions/${surveyId}`,
      { params }
    );
    const questions = this.organizeInfraQuestions(response.data.result);
    this.setState({
      fetchedQuestions: true,
      questions: questions.filter(
        ({ name }) =>
          !name.toLowerCase().includes("anexo") &&
          !name.toLowerCase().includes("perguntas extra") &&
          !name.toLowerCase().includes("resultado")
      ),
    });
  }

  organizeInfoSchools = (surveyQuestion) => {
    const questions_orders = [];
    const finalSurveyQuestion = [];
    let union_survey_question_description = [];
    for (const question of surveyQuestion) {
      union_survey_question_description = [];
      if (!questions_orders.includes(question.question_order)) {
        const groupByQuestionOrder = surveyQuestion.filter(
          (q) => q.compound_ref === question.compound_ref
        );
        groupByQuestionOrder.forEach(({ survey_question_description }) => {
          if (question.question_order === "01") {
            union_survey_question_description = survey_question_description;
          } else {
            union_survey_question_description.push(
              survey_question_description[0]
            );
          }
        });
        const questionRef = groupByQuestionOrder[0];
        questionRef.survey_question_description =
          union_survey_question_description;
        finalSurveyQuestion.push(questionRef);
        questions_orders.push(question.question_order);
      }
    }
    return finalSurveyQuestion;
  };

  render() {
    return this.state.fetchedQuestions ? (
      <Layout className={classnames(styles.layout, stylesPrint.layout)}>
        <Helmet title={this.translate("PrintList.pageHeader")} />
        <Body>
          <section className="section">
            <div className={classnames("container")}>
              {this.state.questions.map((dimension, i) => (
                <div key={"d" + i.toString()}>
                  <div className="columns is-multiline">
                    <div
                      className={classnames("column is-12", styles.dimension)}
                    >
                      <div
                        className={classnames(
                          stylesPrint[dimension.pageTitleCssClass],
                          dimension.pageTitleCssClass
                            ? stylesPrint.sectionTitle
                            : null
                        )}
                      >
                        <h1
                          dangerouslySetInnerHTML={{ __html: dimension.name }}
                        />
                        <div
                          className={stylesPrint.description}
                          dangerouslySetInnerHTML={{
                            __html:
                              dimension.description &&
                              dimension.description
                                .replace(/padding_title_form h2/g, "")
                                .replace(/padding_title_form/g, "")
                                .replace(/h2_underscore/g, "")
                                .replace(/_underscore/g, ""),
                          }}
                        />
                      </div>
                      {dimension.divisor == null &&
                      dimension.survey_question.length > 0
                        ? this.organizeInfoSchools(dimension.survey_question)
                            .sort((a, b) =>
                              a.question_order > b.question_order ? 1 : -1
                            )
                            .map((question, j) => (
                              <div
                                key={"q" + j.toString()}
                                className={classnames("box", styles.question)}
                              >
                                <h2
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      question.question_order +
                                      ": " +
                                      question.name,
                                  }}
                                />
                                <p
                                  className={styles.obs}
                                  dangerouslySetInnerHTML={{
                                    __html: question.obs,
                                  }}
                                />

                                {question.survey_question_description.map(
                                  (sqd, k) => (
                                    <div
                                      key={"o" + k.toString()}
                                      className={classnames(styles.option)}
                                    >
                                      <span>{sqd.value}</span>
                                    </div>
                                  )
                                )}
                              </div>
                            ))
                        : dimension.survey_question
                            .sort((a, b) =>
                              a.question_order > b.question_order ? 1 : -1
                            )
                            .map((question, j) => (
                              <div
                                key={"q" + j.toString()}
                                className={classnames("box", styles.question)}
                              >
                                <h2
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      question.question_order +
                                      ": " +
                                      question.name,
                                  }}
                                />
                                <p
                                  className={styles.obs}
                                  dangerouslySetInnerHTML={{
                                    __html: question.obs,
                                  }}
                                />
                                {question.survey_question_description.map(
                                  (sqd, k) => (
                                    <div
                                      key={"o" + k.toString()}
                                      className={classnames(styles.option)}
                                    >
                                      <span>{sqd.value}</span>
                                    </div>
                                  )
                                )}
                              </div>
                            ))}
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </section>
        </Body>
      </Layout>
    ) : (
      <div>{parse(this.translate("Global.loading"))}</div>
    );
  }
}

export default injectIntl(compose(AccountsContainer, NonUserRedir)(PrintList));
