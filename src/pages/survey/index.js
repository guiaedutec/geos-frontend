import React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import Layout from "../../components/Layout";
import Body from "../../components/Body";
import PageHeader from "~/components/Header/PageHeader";
import styles from "./styles.styl";
import { BarLoader } from "react-spinners";

import AccountsContainer from "~/containers/accounts";
import NonUserRedir from "~/containers/non_user_redir";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import {
  getSelectedSurvey,
  removeSelectedSurvey,
  surveyOutPeriod,
} from "~/actions/survey";

import Form from "./Form";

import { compose } from "redux";

import CONF from "~/api/index";
import axios from "axios";

import { getUserToken, createUrlWithParams } from "~/api/utils";

class QuestionList extends React.Component {
  constructor() {
    super();
    this.state = {
      fetchedQuestions: false,
      fetchedAnswers: false,
      survey: getSelectedSurvey(),
      questions: [],
      userResponses: {},
      surveyResponse: [],
    };
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  getLang = () => {
    return localStorage.getItem("lang") || process.env.DEFAULT_LOCALE;
  };
  componentWillMount() {
    //let survey = getSelectedSurvey();getSelectedSurvey
    if (this.state.survey) {
      if (!surveyOutPeriod(this.state.survey)) {
        this.getQuestions();
        this.getResponses();
      } else {
        window.location = "/";
      }
    }
  }

  setUserResponses = (value) => {
    this.setState({ userResponses: value });
  };

  getQuestions = () => {
    const _this = this;
    let surveyId =
      this.state.survey.schedule.length > 0
        ? this.state.survey.schedule[0].survey_id.$oid
        : this.state.survey.id;
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/questions/" +
          surveyId +
          "?access_token=" +
          getUserToken() +
          "&lang=" +
          this.getLang(),
        {}
      )
      .then((questions) => {
        _this.setState({
          fetchedQuestions: true,
          questions: questions.data.result,
        });
      });
  };

  getResponses = () => {
    const _this = this;
    let surveyId =
      this.state.survey.schedule.length > 0
        ? this.state.survey.schedule[0].survey_id.$oid
        : this.state.survey.id;
    const URL_REQUEST = `${
      CONF.ApiURL
    }/api/v1/survey/responses_user/${surveyId}?access_token=${getUserToken()}`;
    axios.get(URL_REQUEST).then((result) => {
      let fullArrResponse = {};
      if (result.data.answeres instanceof Array) {
        if (result.data && result.data.answeres.length > 0) {
          for (let i = 0; i < result.data.answeres.length; i++) {
            let val = result.data.answeres[i].options;
            fullArrResponse[result.data.answeres[i].survey_question_id.$oid] =
              val;
          }
        }
      }
      _this.setState({
        fetchedAnswers: true,
        userResponses: fullArrResponse,
        surveyResponse: result.data.response,
      });
    });
  };

  render() {
    const { user } = this.props.accounts;

    return (
      <Layout className={styles.layout}>
        <Helmet title={parse(this.translate("Survey.surveyTitle"))} />
        <Body>
          {this.state.fetchedQuestions && this.state.fetchedAnswers ? (
            [
              <section className="section pb-0">
                <div className="container">
                  <div className="columns">
                    <div className="column">
                      <PageHeader user={user} />
                    </div>
                  </div>
                </div>
              </section>,

              <Form
                survey={this.state.survey}
                sections={this.state.questions}
                userResponses={this.state.userResponses}
                response={this.state.surveyResponse}
                setUserResponses={this.setUserResponses}
              />,
            ]
          ) : (
            <section className="section">
              <div className="container">
                <div className="columns">
                  <div className="column is-full">
                    <p className="mb-10">
                      {parse(this.translate("Global.loadingQuestions"))}
                    </p>
                    <BarLoader
                      width={"100%"}
                      color={"#babcbe"}
                      loading={true}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}
        </Body>
      </Layout>
    );
  }
}

QuestionList.propTypes = {};

export default injectIntl(
  compose(AccountsContainer, NonUserRedir)(QuestionList)
);
