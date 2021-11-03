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

class TranslationsDevolutives extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devolutives: [],
      surveys: [],
      sections: [],
      questions: [],
      baseLanguageSurvey: {},
      baseLanguageDevolutive: [],
      secondaryLanguageSurvey: {},
      secondaryLanguageDevolutive: [],
      secondaryLanguageDevolutiveSave: [],
      idSelectedSurvey: null,
      secondTranslations: {},
      selectedMainLang: null,
      selectedSecondLang: null,
      isSurveyOpen: false,
      saving: false,
      mainLang: process.env.DEFAULT_LOCALE,
      secondaryLang: "es",
      isSurveysLoading: true,
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
      await axios.post(URL_REQUEST, data);
      this.setState({ saving: false });
    } catch (error) {
      console.log(error);
    }
  };

  filterBody = (data) => {
    var body = {};
    if (data) {
      Object.keys(data).forEach((item) => {
        if (Number.isInteger(Number(item))) {
          body[item] = data[item];
        }
      });
    }
    return body;
  };

  translateDevolutives = async function (lang) {
    const route = "/api/v1/update_feedback";
    const accessToken = `?access_token=${getUserToken()}`;
    const URL_REQUEST = this.apiURL + route + accessToken + `&lang=${lang}`;
    const secondary = this.state.secondaryLanguageDevolutive;
    const devolutives = this.state.devolutives;

    const data = devolutives.map((item, index) => ({
      id: item._id.$oid,
      body: {
        ...this.filterBody(secondary[index]),
      },
      group: item.group,
      subtitle: this.state.secondaryLanguageDevolutive[index].subtitle,
      title: this.state.secondaryLanguageDevolutive[index].title,
      type: item.type,
    }));

    try {
      for (const i of this.state.secondaryLanguageDevolutiveSave) {
        await axios.post(URL_REQUEST, data[i]);
      }
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

  getDevolutives = async function (lang, survey_id, language_type) {
    const route = "/api/v1/feedbacks/";
    const accessToken = `?access_token=${getUserToken()}`;
    const language = `&lang=${lang}`;
    const URL_REQUEST =
      this.apiURL + route + `${survey_id}` + accessToken + language;
    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ devolutives: response.data });

      const data = response.data.map((item) => ({
        ...item.body,
        title: item.title,
        subtitle: item.subtitle,
        id: item._id.$oid,
      }));

      if (language_type === "baseLanguage") {
        this.setState({ baseLanguageDevolutive: data });
      } else if (language_type === "secondaryLanguage") {
        this.setState({ secondaryLanguageDevolutive: data });
      }

      // this.setState({ isSurveysLoading: false });
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
    try {
      this.setState({ isSurveyLoading: true });
      const response = await axios.get(URL_REQUEST);
      this.setState({ isSurveyLoading: false });
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
    } catch (error) {
      console.log(error);
    }
  };

  selectSurvey = (e) => {
    if (e.target.value === "") {
      this.setState({ questions: [], sections: [], questions: [] });
      this.setState({
        idSelectedSurvey: null,
        baseLanguageSurvey: {},
        baseLanguageDevolutive: [],
        secondaryLanguageDevolutive: [],
        secondaryLanguageDevolutiveSave: [],
        baseLanguageSurvey: {},
        secondaryLanguageSurvey: {},
        isSurveyOpen: false,
        isSectionsLoading: true,
      });
      this.setState({ isSectionOpen: false });
    } else {
      this.setState({ idSelectedSurvey: e.target.value });
      this.setState({ isSurveyOpen: true });
      this.getSurvey(this.state.mainLang, e.target.value, "baseLanguage");
      this.getSurvey(
        this.state.secondaryLang,
        e.target.value,
        "secondaryLanguage"
      );
      this.getDevolutives(this.state.mainLang, e.target.value, "baseLanguage");
      this.getDevolutives(
        this.state.secondaryLang,
        e.target.value,
        "secondaryLanguage"
      );
    }
  };

  handleMainLanguageChange = (event) => {
    const lang = event.target.value;
    this.setState({ mainLang: lang });
    this.getSurvey(lang, this.state.idSelectedSurvey, "baseLanguage");
    this.getDevolutives(lang, this.state.idSelectedSurvey, "baseLanguage");
  };

  handleSecondaryLanguageChange(event) {
    const lang = event.target.value;
    this.setState({ secondaryLang: lang });
    this.getSurvey(lang, this.state.idSelectedSurvey, "secondaryLanguage");
    this.getDevolutives(lang, this.state.idSelectedSurvey, "secondaryLanguage");
  }

  saveTranslations = () => {
    this.setState({ saving: true });
    this.translateDevolutives(this.state.secondaryLang);
  };

  handleChangeDevolutiveFields = (e, index_devolutive) => {
    const newSecondaryLanguageDevolutive = [
      ...this.state.secondaryLanguageDevolutive,
    ];
    newSecondaryLanguageDevolutive[index_devolutive] = {
      ...this.state.secondaryLanguageDevolutive[index_devolutive],
      [e.target.name]: e.target.value,
    };
    this.setState({
      secondaryLanguageDevolutive: newSecondaryLanguageDevolutive,
    });
    if (
      this.state.secondaryLanguageDevolutiveSave.indexOf(index_devolutive) ===
      -1
    ) {
      this.setState({
        secondaryLanguageDevolutiveSave: [
          ...this.state.secondaryLanguageDevolutiveSave,
          index_devolutive,
        ],
      });
    }
  };

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

  getData = (index_devolutive) => {
    const base = this.filterTitles(
      this.state.baseLanguageDevolutive[index_devolutive]
    );
    const secondary = this.filterTitles(
      this.state.secondaryLanguageDevolutive[index_devolutive]
    );
    const data =
      base &&
      secondary &&
      Object.keys(base)
        .slice(0, Object.keys(base).length - 1)
        .map((key, index) => ({
          mapping: <div className={styles.column_width}>{key}</div>,
          baseLanguageTranslation: (
            <div className={styles.column_width}>{base[key]}</div>
          ),
          secondaryLanguageTranslation: (
            <textarea
              className={styles.column_width}
              rows={4}
              name={key}
              value={secondary[key]}
              // defaultValue={secondTranslations[key]}
              // disabled={loadingSecondTranslations}
              style={{ padding: "10px", height: "100%", minWidth: "100%" }}
              placeholder="Digite o texto traduzido..."
              onChange={(e) =>
                this.handleChangeDevolutiveFields(e, index_devolutive)
              }
            />
          ),
        }));
    return data;
  };

  filterTitles = (data) => {
    const titles = [
      "RESULTADO - PEDAGÓGICA",
      "RESULTADO - CIDADANIA DIGITAL",
      "RESULTADO - DESENVOLVIMENTO PROFISSIONAL",
    ];
    if (data) {
      const { title, ...rest } = data;
      if (titles.includes(title)) return rest;
      return data;
    }
  };

  render() {
    return (
      <section className="section">
        {/* Surveys Options */}
        <div className="container">
          <div className="columns">
            <div className="column">
              {this.state.isSurveysLoading ? (
                <div style={{ marginBottom: "30px" }}>
                  {/* {parse(this.translate("Global.loading"))} */}
                  {parse(this.translate("Global.loadingDevolutives"))}
                  <BarLoader
                    width={"100%"}
                    color={"#babcbe"}
                    loading={this.state.isSurveysLoading}
                  />
                </div>
              ) : (
                [
                  <h1 className={styles.title}>
                    {parse(this.translate("Translations.questions"))}
                  </h1>,
                  <select
                    className={styles.selectContainerTranslations}
                    style={{ padding: "5px" }}
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
                  </select>,
                ]
              )}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="columns">
            <div className="column">
              {this.state.isSurveyOpen && this.state.isSurveyLoading ? (
                <div style={{ marginBottom: "30px" }}>
                  {parse(this.translate("Global.loadingDevolutives"))}
                  <BarLoader
                    width={"100%"}
                    color={"#babcbe"}
                    loading={this.state.isSurveyLoading}
                  />
                </div>
              ) : (
                <div>
                  {this.state.baseLanguageDevolutive instanceof Array &&
                    this.state.baseLanguageDevolutive.map(
                      (base, index_devolutive) => (
                        <Table
                          className={classNames(
                            "table is-bordered is-hoverable",
                            styles.followup__info__table
                          )}
                          data={this.getData(index_devolutive)}
                          style={{ margin: "20px 0 30px", width: "100%" }}
                        >
                          <Thead>
                            {_.map(
                              index_devolutive === 0
                                ? this.getColumns()
                                : this.getColumnsWithoutSelectLanguage(),
                              (renderer, column) => (
                                <Th column={column} style={{ width: "50px" }}>
                                  {renderer()}
                                </Th>
                              )
                            )}
                          </Thead>
                        </Table>
                      )
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

export default injectIntl(compose(APIDataContainer)(TranslationsDevolutives));
