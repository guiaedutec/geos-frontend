import React from "react";
import axios from "axios";
import { getUserToken } from "~/api/utils";
import CONF from "../../api/index";
const params = new URLSearchParams(document.location.search.substring(1));
const locale = params.get("lang") || process.env.DEFAULT_LOCALE;
import styles from "./technicals.styl";
import classNames from "classnames";
import { Table, Thead, Th, Td } from "reactable";
import TranslationsActionFooter from "./components/TranslationsActionFooter";
import { compose } from "redux";
import APIDataContainer from "~/containers/api_data";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import { BarLoader } from "react-spinners";

class TranslationsQuestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      surveys: [],
      sections: [],
      questions: [],
      baseLanguageSurvey: {},
      baseLanguageSection: {},
      baseLanguageQuestion: [],
      baseLanguageQuestionRender: [],
      secondaryLanguageQuestionRender: [],
      secondaryLanguageSurvey: {},
      secondaryLanguageSection: {},
      secondaryLanguageQuestion: [],
      idSelectedSection: null,
      idSelectedSurvey: null,
      idSelectedQuestion: null,
      nameSelectedQuestion: undefined,
      secondTranslations: {},
      selectedMainLang: null,
      selectedSecondLang: null,
      isQuestionOpen: false,
      isSurveyOpen: false,
      isSectionOpen: false,
      saving: false,
      mainLang: process.env.DEFAULT_LOCALE,
      secondaryLang: "es",
      isSurveysLoading: true,
      isSectionsLoading: true,
      isSectionAndQuestionLoading: true,
      isSurveyLoading: true,
    };
    this.apiURL = CONF.ApiURL;
    this.lang = `&lang=${this.getLang()}`;
  }
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }
  componentDidMount() {
    this.getSurveys();
  }

  translateSurveys = async function (lang) {
    const route = "/api/v1/survey/update_survey/";
    const accessToken = `?access_token=${getUserToken()}`;
    const URL_REQUEST = this.apiURL + route + accessToken + `&lang=${lang}`;
    const data = this.state.secondaryLanguageSurvey;
    try {
      this.setState({ saving: true });
      await axios.post(URL_REQUEST, data);
      this.setState({ saving: false });
    } catch (error) {
      console.log(error);
    }
  };

  translateQuestions = async function (lang) {
    const route = "/api/v1/survey/update_question/";
    const accessToken = `?access_token=${getUserToken()}`;
    const URL_REQUEST = this.apiURL + route + accessToken + `&lang=${lang}`;
    for (
      let i = 0;
      i < this.state.secondaryLanguageQuestionRender.length;
      i++
    ) {
      const question_id = this.state.secondaryLanguageQuestion[i]._id.$oid;
      const title = this.state.secondaryLanguageQuestionRender[i].find(
        (question) => question.id === 999
      ).value;
      const question_order = this.state.secondaryLanguageQuestionRender[i].find(
        (question) => question.id === 777
      ).value;
      const data = {
        id: question_id,
        name: title,
        question_order,
        obs: "",
        survey_question_description: this.state.secondaryLanguageQuestionRender[
          i
        ].filter((item) => item.id !== 999 && item.id !== 777),
      };

      try {
        this.setState({ saving: true });
        await axios.post(URL_REQUEST, data);
        this.setState({ saving: false });
      } catch (error) {
        console.log(error);
      }
    }
  };

  translateSections = async function (lang, data) {
    const route = "/api/v1/survey/update_section/";
    const accessToken = `?access_token=${getUserToken()}`;
    const URL_REQUEST = this.apiURL + route + accessToken + `&lang=${lang}`;
    try {
      this.setState({ saving: true });
      await axios.post(URL_REQUEST, data);
      this.setState({ saving: false });
    } catch (error) {
      console.log(error);
    }
  };

  getLang = () => {
    return localStorage.getItem("lang") || locale;
  };
  getSecondLang() {
    return localStorage.getItem("secondLang");
  }

  getSections = async function (idSurvey, lang) {
    const route = "/api/v1/survey/questions/";
    const accessToken = `?access_token=${getUserToken()}`;
    const language = lang ? lang : this.lang;
    const URL_REQUEST = this.apiURL + route + idSurvey + accessToken + language;
    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ isSectionsLoading: false });
      this.setState({ sections: response.data.result });
    } catch (error) {
      console.log(error);
    }
  };

  getSurveys = async function (lang) {
    const route = "/api/v1/survey/surveys_list";
    const accessToken = `?access_token=${getUserToken()}`;
    const language = lang ? lang : this.lang;
    const URL_REQUEST = this.apiURL + route + accessToken + language;
    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ surveys: response.data.surveys });
      this.setState({ isSurveysLoading: false });
    } catch (error) {
      console.log(error);
    }
  };

  getSurvey = async function (lang, idSelectedSurvey, language_type) {
    const route = "/api/v1/survey/surveys_list";
    const accessToken = `?access_token=${getUserToken()}`;
    const URL_REQUEST = this.apiURL + route + accessToken + `&lang=${lang}`;
    const response = await axios.get(URL_REQUEST);
    const survey = response.data.surveys.find(
      (survey) => survey.id === idSelectedSurvey
    );

    if (language_type === "baseLanguage") {
      this.setState({
        baseLanguageSurvey: {
          id: survey.id,
          survey_name: survey.survey_name,
          survey_description: survey.survey_description,
        },
      });
    } else if (language_type === "secondaryLanguage") {
      this.setState({
        secondaryLanguageSurvey: {
          id: survey.id,
          survey_name: survey.survey_name,
          survey_description: survey.survey_description,
        },
      });
    }
  };
  getSection = async function (lang, idSelectedSurvey, language_type) {
    const route = "/api/v1/survey/questions/";
    const accessToken = `?access_token=${getUserToken()}`;
    const URL_REQUEST =
      this.apiURL + route + idSelectedSurvey + accessToken + `&lang=${lang}`;
    const response = await axios.get(URL_REQUEST);
    const section = response.data.result.find(
      (section) => section._id.$oid === this.state.idSelectedSection
    );

    if (language_type === "baseLanguage") {
      this.setState({
        baseLanguageQuestion: section.survey_question.sort(
          (a, b) => a.question_order - b.question_order
        ),
      });

      this.setState({
        baseLanguageSection: {
          id: section._id.$oid,
          name: section.name,
          description: section.description,
        },
      });
      const baseLanguageQuestionRender =
        section.survey_question &&
        section.survey_question
          .sort((a, b) => (a.question_order > b.question_order ? 1 : -1))
          .map((base) => {
            return [
              {
                id: 999,
                value: base.name,
              },
              { id: 777, value: base.question_order },
              ...base.survey_question_description.filter(
                (item) => item.id !== 888 && item.id !== 777
              ),
            ];
          });
      this.setState({
        baseLanguageQuestionRender,
      });
    } else if (language_type === "secondaryLanguage") {
      this.setState({ isSectionAndQuestionLoading: true });
      this.setState({
        secondaryLanguageQuestion: section.survey_question.sort(
          (a, b) => a.question_order - b.question_order
        ),
      });
      this.setState({
        secondaryLanguageSection: {
          id: section._id.$oid,
          name: section.name,
          description: section.description,
        },
      });
    }
    const secondaryLanguageQuestionRender =
      section.survey_question &&
      section.survey_question
        .sort((a, b) => (a.question_order > b.question_order ? 1 : -1))
        .map((secondary) => {
          return [
            {
              id: 999,
              value: secondary.name,
            },
            { id: 777, value: secondary.question_order },
            ...secondary.survey_question_description.filter(
              (item) => item.id !== 888 && item.id !== 777
            ),
          ];
        });

    this.setState({
      secondaryLanguageQuestionRender,
    });
    this.setState({ isSectionAndQuestionLoading: false });
  };

  selectSurvey = (e) => {
    if (e.target.value === "") {
      this.setState({ questions: [], sections: [], questions: [] });
      this.setState({
        idSelectedSection: null,
        idSelectedSurvey: null,
        baseLanguageSurvey: {},
        baseLanguageSection: {},
        baseLanguageQuestion: {},
        baseLanguageQuestionRender: [],
        secondaryLanguageSurvey: {},
        secondaryLanguageSection: {},
        secondaryLanguageQuestion: {},
        secondaryLanguageQuestionRender: [],
        isSurveyOpen: false,
        isSectionOpen: false,
        isQuestionOpen: false,
        isSectionsLoading: true,
      });
      this.setState({ isSectionOpen: false });
    } else {
      this.setState({ idSelectedSurvey: e.target.value });
      this.getSections(e.target.value);
      this.setState({ isSurveyOpen: true });
      this.getSurvey(this.state.mainLang, e.target.value, "baseLanguage");
      this.getSurvey(
        this.state.secondaryLang,
        e.target.value,
        "secondaryLanguage"
      );
    }
  };

  selectSection = (e) => {
    if (e.target.value === "") {
      this.setState({ questions: [] });
      this.setState({
        isSectionOpen: false,
        idSelectedSection: null,
        baseLanguageSection: {},
        baseLanguageQuestion: {},
        baseLanguageQuestionRender: [],
        secondaryLanguageSection: {},
        secondaryLanguageQuestion: {},
        secondaryLanguageQuestionRender: [],
      });
    } else {
      const questions = this.state.sections.find(
        (section) => section.name === e.target.value
      );
      this.setState({ idSelectedSection: questions._id.$oid });
      this.setState({ questions: questions.survey_question });
      this.setState({ isSurveyOpen: false });
      this.setState({ isSectionOpen: true });
      this.getSection(
        this.state.mainLang,
        this.state.idSelectedSurvey,
        "baseLanguage"
      );
      this.getSection(
        this.state.secondaryLang,
        this.state.idSelectedSurvey,
        "secondaryLanguage"
      );
    }
  };

  handleMainLanguageChange = (event) => {
    const lang = event.target.value;
    this.setState({ mainLang: lang });
    this.getSection();

    this.getSurvey(lang, this.state.idSelectedSurvey, "baseLanguage");

    this.getSection(lang, this.state.idSelectedSurvey, "baseLanguage");

    this.getSection(lang, this.state.idSelectedSurvey, "baseLanguage");
  };
  handleSecondaryLanguageChange(event) {
    const lang = event.target.value;
    this.setState({ secondaryLang: lang });

    this.getSurvey(lang, this.state.idSelectedSurvey, "secondaryLanguage");

    this.getSection(lang, this.state.idSelectedSurvey, "secondaryLanguage");

    this.getSection(lang, this.state.idSelectedSurvey, "secondaryLanguage");
  }

  saveTranslations = () => {
    this.setState({ saving: true });
    this.translateQuestions(this.state.secondaryLang);
    this.translateSurveys(this.state.secondaryLang);
    this.translateSections(
      this.state.secondaryLang,
      this.state.secondaryLanguageSection
    );
  };

  handleChangeSurveyFields = (e) => {
    this.setState({
      secondaryLanguageSurvey: {
        ...this.state.secondaryLanguageSurvey,
        [e.target.name]: e.target.value,
      },
    });
  };
  handleChangeSectionFields = (e) => {
    this.setState({
      secondaryLanguageSection: {
        ...this.state.secondaryLanguageSection,
        [e.target.name]: e.target.value,
      },
    });
  };
  handleChangeQuestionFields = (e, weight, index_question) => {
    const index = this.state.secondaryLanguageQuestionRender[
      index_question
    ].findIndex((question) => question.id === Number(e.target.name));
    const newSecondaryLanguageQuestionRender = [
      ...this.state.secondaryLanguageQuestionRender,
    ];
    newSecondaryLanguageQuestionRender[index_question][index] = {
      id: Number(e.target.name),
      value: e.target.value,
      weight,
    };

    this.setState({
      secondaryLanguageQuestionRender: newSecondaryLanguageQuestionRender,
    });
  };

  getData2 = (index_question) => {
    const base = this.state.baseLanguageQuestionRender[index_question];

    const data2 = base.map((question, index) => ({
      mapping: <div className={styles.column_width}>{"value"}</div>,
      baseLanguageTranslation: (
        <div className={styles.column_width}>{question && question.value}</div>
      ),
      secondaryLanguageTranslation: (
        <textarea
          className={styles.column_width}
          rows={4}
          name={question.id}
          value={
            this.state.secondaryLanguageQuestionRender[index_question] !==
              undefined &&
            this.state.secondaryLanguageQuestionRender[index_question][index] &&
            this.state.secondaryLanguageQuestionRender[index_question][index]
              .value
          }
          // defaultValue={secondTranslations[key]}
          // disabled={loadingSecondTranslations}
          style={{ padding: "10px", height: "100%", minWidth: "100%" }}
          placeholder="Digite o texto traduzido..."
          onChange={(e) =>
            this.handleChangeQuestionFields(e, question.weight, index_question)
          }
        />
      ),
    }));

    return data2;
  };

  getColumns() {
    const {
      apiData: { languages },
    } = this.props;
    return {
      mapping: () => this.translate("Translations.mapping"),
      baseLanguageTranslation: () => (
        <span>
          <label style={{ fontSize: 10 }}>
            {parse(this.translate("Translations.baseLanguage"))}
          </label>
          <select
            onChange={(e) => this.handleMainLanguageChange(e)}
            style={{ width: "100%", padding: "5px" }}
            defaultValue={this.state.mainLang}
          >
            {/* <option key="selectLanguage"></option> */}
            {languages.map((l) => (
              <option key={l.lang} value={l.lang}>
                {l.description}
              </option>
            ))}
          </select>
        </span>
      ),
      secondaryLanguageTranslation: () => (
        <span>
          <label style={{ fontSize: 10 }}>
            {parse(this.translate("Translations.languageToTranslate"))}
          </label>
          <select
            onChange={(e) => this.handleSecondaryLanguageChange(e)}
            style={{ width: "100%", padding: "5px" }}
            defaultValue={this.state.secondaryLang}
          >
            {/* <option value="">
              {parse(this.translate("Translations.selectLanguage"))}
            </option> */}
            {languages.map((l) => (
              <option value={l.lang}>{l.description}</option>
            ))}
          </select>
        </span>
      ),
    };
  }
  getColumnsWithoutSelectLanguage() {
    const {
      apiData: { languages },
    } = this.props;
    return {
      mapping: () => this.translate("Translations.mapping"),
      baseLanguageTranslation: () => (
        <span>
          <label style={{ fontSize: 10 }}>
            {parse(this.translate("Translations.baseLanguage"))}
          </label>
        </span>
      ),
      secondaryLanguageTranslation: () => (
        <span>
          <label style={{ fontSize: 10 }}>
            {parse(this.translate("Translations.languageToTranslate"))}
          </label>
        </span>
      ),
    };
  }

  render() {
    const data = Object.keys(this.state.baseLanguageSurvey)
      .slice(1)
      .map((key, index) => ({
        mapping: <div className={styles.column_width}>{key}</div>,
        baseLanguageTranslation: (
          <div className={styles.column_width}>
            {this.state.baseLanguageSurvey[key]}
          </div>
        ),
        secondaryLanguageTranslation: (
          <textarea
            className={styles.column_width}
            rows={4}
            name={key}
            value={this.state.secondaryLanguageSurvey[key]}
            // defaultValue={secondTranslations[key]}
            // disabled={loadingSecondTranslations}
            style={{ padding: "10px", height: "100%", minWidth: "100%" }}
            placeholder="Digite o texto traduzido..."
            onChange={this.handleChangeSurveyFields}
          />
        ),
      }));

    const data1 = Object.keys(this.state.baseLanguageSection)
      .slice(1)
      .map((key, index) => ({
        mapping: <div className={styles.column_width}>{key}</div>,
        baseLanguageTranslation: (
          <div className={styles.column_width}>
            {this.state.baseLanguageSection[key]}
          </div>
        ),
        secondaryLanguageTranslation: (
          <textarea
            className={styles.column_width}
            rows={4}
            name={key}
            value={this.state.secondaryLanguageSection[key]}
            // defaultValue={secondTranslations[key]}
            // disabled={loadingSecondTranslations}
            style={{ padding: "10px", height: "100%", minWidth: "100%" }}
            placeholder="Digite o texto traduzido..."
            onChange={this.handleChangeSectionFields}
          />
        ),
      }));

    return (
      <section className="section">
        {/* Surveys Options */}
        <div className="container">
          <div className="columns">
            <div className="column">
              {this.state.isSurveysLoading ? (
                <div style={{ marginBottom: "30px" }}>
                  {/* {parse(this.translate("Global.loading"))} */}
                  {parse(this.translate("Global.loadingQuestions"))}
                  <BarLoader
                    width={"100%"}
                    color={"#babcbe"}
                    loading={this.state.isSurveysLoading}
                  />
                </div>
              ) : (
                <div>
                  <h1 className={styles.title}>
                    {parse(this.translate("Translations.questions"))}
                  </h1>
                  <select
                    className={styles.selectContainerTranslations}
                    style={{ padding: "5px", marginBottom: "20px" }}
                    onChange={this.selectSurvey}
                    defaultValue=""
                  >
                    <option key="" value="">
                      {parse(this.translate("Translations.selectQuestion"))}
                    </option>
                    {this.state.surveys &&
                      this.state.surveys.map((survey) => (
                        <option key={survey.id} value={survey.id}>
                          {survey.survey_name}
                        </option>
                      ))}
                  </select>
                  {/* Sections Options */}

                  <h1 className={styles.title}>
                    {parse(this.translate("Translations.sections"))}
                  </h1>
                  <select
                    className={styles.selectContainerTranslations}
                    style={{ padding: "5px", marginBottom: "15px" }}
                    onChange={this.selectSection}
                    defaultValue=""
                    disabled={this.state.isSectionsLoading}
                  >
                    <option key="" value="">
                      {parse(this.translate("Translations.selectSection"))}
                    </option>
                    {this.state.sections &&
                      this.state.sections.map((section) => (
                        <option key={section._id.$oid} value={section.name}>
                          {section.name}
                        </option>
                      ))}
                  </select>
                  <hr />
                  <h1 className={styles.title}>
                    {parse(this.translate("Translations.questionsData"))}
                  </h1>
                  <Table
                    className={classNames(
                      "table is-bordered is-hoverable",
                      styles.followup__info__table
                    )}
                    data={data}
                    style={{ margin: "20px 0 30px", width: "100%" }}
                  >
                    <Thead>
                      {_.map(this.getColumns(), (renderer, column) => (
                        <Th column={column} style={{ width: "50px" }}>
                          {renderer()}
                        </Th>
                      ))}
                    </Thead>
                  </Table>
                  {this.state.isSectionAndQuestionLoading &&
                  this.state.isSectionOpen ? (
                    <div style={{ marginBottom: "20px" }}>
                      {parse(
                        this.translate("Global.loadingSectionsAndQuestions")
                      )}
                      <BarLoader
                        width={"100%"}
                        color={"#babcbe"}
                        loading={this.state.isSectionAndQuestionLoading}
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className={styles.title}>
                        {parse(this.translate("Translations.sectionData"))}
                      </h1>
                      <Table
                        className={classNames(
                          "table is-bordered is-hoverable",
                          styles.followup__info__table
                        )}
                        data={data1}
                        style={{ margin: "20px 0 30px", width: "100%" }}
                      >
                        <Thead>
                          {_.map(
                            this.getColumnsWithoutSelectLanguage(),
                            (renderer, column) => (
                              <Th column={column} style={{ width: "30px" }}>
                                {renderer()}
                              </Th>
                            )
                          )}
                        </Thead>
                      </Table>

                      {this.state.baseLanguageQuestionRender &&
                        this.state.baseLanguageQuestionRender.map(
                          (base, index_question) => (
                            <div>
                              <h1 className={styles.title}>
                                {parse(
                                  this.translate("Translations.questionData")
                                )}
                              </h1>
                              <Table
                                className={classNames(
                                  "table is-bordered is-hoverable",
                                  styles.followup__info__table
                                )}
                                data={this.getData2(index_question)}
                                style={{ margin: "20px 0 30px", width: "100%" }}
                              >
                                <Thead>
                                  {_.map(
                                    this.getColumnsWithoutSelectLanguage(),
                                    (renderer, column) => (
                                      <Th
                                        column={column}
                                        style={{ width: "30px" }}
                                      >
                                        {renderer()}
                                      </Th>
                                    )
                                  )}
                                </Thead>
                              </Table>
                            </div>
                          )
                        )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <TranslationsActionFooter
          onSubmit={this.saveTranslations}
          saving={this.state.saving}
          isDisabledButton={
            (this.state.isSurveyOpen ||
              this.state.isQuestionOpen ||
              this.state.isSectionOpen) === false
              ? true
              : false
          }
        />
      </section>
    );
  }
}

export default injectIntl(compose(APIDataContainer)(TranslationsQuestions));
