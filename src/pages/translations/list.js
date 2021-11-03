import axios from "axios";
import classnames from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import Helmet from "react-helmet";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import { BarLoader } from "react-spinners";
import Reactable from "reactable";
import { compose } from "redux";
import CONF from "~/api/index";
// components
import Body from "~/components/Body";
import Layout from "~/components/Layout";
import AccountsContainer from "~/containers/accounts";
// containers
import APIContainer from "~/containers/api_data";
import NonAdminStateCityRedir from "~/containers/non_admin_state_city_redir";
import NonUserRedir from "~/containers/non_user_redir";
import { flattenMessages } from "~/i18n/utils";
import TranslationsActionFooter from "./components/TranslationsActionFooter";
// styles
import styles from "./technicals.styl";
import { getUserToken } from "~/api/utils";
const params = new URLSearchParams(document.location.search.substring(1));
const locale = params.get("lang") || process.env.DEFAULT_LOCALE;
import TranslationsQuestions from "./TranslationQuestions";
class Translations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingSecondTranslations: false,
      loadingTranslations: false,
      newTranslations: {},
      saving: false,
      secondTranslations: {},
      selectedMainLang: null,
      selectedSecondLang: null,
      translations: {},
    };
  }

  getLang() {
    return localStorage.getItem("lang") || locale;
  }

  getSecondLang() {
    return localStorage.getItem("secondLang");
  }

  componentDidMount() {
    this.fetchTranslations(this.getLang());
  }

  fetchTranslations(lang, stateName) {
    const loadingState =
      stateName === "secondTranslations"
        ? "loadingSecondTranslations"
        : "loadingTranslations";
    const selectedLang =
      stateName === "secondTranslations"
        ? "selectedSecondLang"
        : "selectedMainLang";

    this.setState({
      [loadingState]: true,
      [selectedLang]: lang,
      newTranslations: {},
    });

    axios
      .get(CONF.ApiURL + `/api/v1/translation/${lang}`, {})
      .then((res) => {
        const data = _.get(res, "data.data") || {};
        const dataOmitedProps = _.omit(data[0], [
          "created_at",
          "lang",
          "updated_at",
          "_id",
        ]);

        this.setState({
          [stateName || "translations"]: flattenMessages(dataOmitedProps),
          [loadingState]: false,
        });
      })
      .catch((err) => {
        this.setState(
          {
            [stateName || "translations"]: [],
            [loadingState]: false,
          },
          () =>
            window.alert(
              _.get(err, "response.data.message") ||
                this.translate("Translations.errorFetchTranslations")
            )
        );
      });
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  handleSecondaryLanguageChange(event) {
    const lang = event.target.value;
    localStorage.setItem("secondLang", lang);

    if (lang) {
      this.fetchTranslations(lang, "secondTranslations");
    } else {
      this.setState({ secondTranslations: {} });
    }
  }

  handleMainLanguageChange(event) {
    this.setState({ secondTranslations: {}, selectedSecondLang: null });
    localStorage.removeItem("secondLang");

    const lang = event.target.value;

    if (lang) {
      this.fetchTranslations(lang, "translations");
    } else {
      this.setState({ translations: {} });
    }
  }

  getColumns() {
    const {
      apiData: { languages },
    } = this.props;

    return {
      mapping: () => this.translate("Translations.mapping"),
      baseLanguageTraslation: () => (
        <span>
          <label style={{ fontSize: 10 }}>
            {parse(this.translate("Translations.baseLanguage"))}
          </label>
          <select
            onChange={(e) => this.handleMainLanguageChange(e)}
            style={{ width: "100%", padding: "5px" }}
            defaultValue={this.state.selectedMainLang}
          >
            {languages.map((l) => (
              <option value={l.lang}>{l.description}</option>
            ))}
          </select>
        </span>
      ),
      secondaryLanguageTraslation: () => (
        <span>
          <label style={{ fontSize: 10 }}>
            {parse(this.translate("Translations.languageToTranslate"))}
          </label>
          <select
            onChange={(e) => this.handleSecondaryLanguageChange(e)}
            style={{ width: "100%", padding: "5px" }}
            defaultValue={
              this.state.selectedSecondLang ? this.getSecondLang() : null
            }
          >
            <option value="">
              {this.translate("Translations.selectLanguage")}
            </option>
            {languages.map((l) => (
              <option value={l.lang}>{l.description}</option>
            ))}
          </select>
        </span>
      ),
    };
  }

  handleTranslateChange = (e) => {
    this.setState({
      newTranslations: {
        ...this.state.newTranslations,
        [e.target.name]: e.target.value,
      },
    });
  };

  unflatten = (data) => {
    var result = {};
    for (var i in data) {
      i = i.replace(" .", "__");
      var keys = i.split(".");
      keys = keys.map((key) => key.replace("__", " ."));
      i = i.replace("__", " .");
      keys.reduce((r, e, j) => {
        return (
          r[e] ||
          (r[e] = isNaN(Number(keys[j + 1]))
            ? keys.length - 1 == j
              ? data[i]
              : {}
            : {})
        );
      }, result);
    }
    return result;
  };
  saveTranslations() {
    const { newTranslations, selectedMainLang, selectedSecondLang } =
      this.state;

    this.setState({ saving: true });
    const unflattenTranslations = newTranslations;
    axios
      .post(
        CONF.ApiURL +
          `/api/v1/translation/?access_token=${getUserToken()}&lang=${selectedSecondLang}`,
        {
          translation: {
            ...unflattenTranslations,
            lang: selectedSecondLang,
          },
        }
      )
      .then((_res) => {
        this.fetchTranslations(selectedMainLang);
        this.fetchTranslations(selectedSecondLang, "secondTranslations");
        this.setState({ saving: false });
      })
      .catch((err) => {
        this.setState({ saving: false }, () =>
          window.alert(
            _.get(err, "response.data.message") ||
              this.translate("Translations.errorFetchTranslations")
          )
        );
      });
  }

  handleSubmit = () => {
    this.saveTranslations();
  };

  render() {
    const {
      loadingSecondTranslations,
      loadingTranslations,
      newTranslations,
      saving,
      secondTranslations,
      translations,
    } = this.state;
    const data = Object.keys(translations).map((key, index) => ({
      mapping: <div className={styles.column_width}>{key}</div>,
      baseLanguageTraslation: (
        <div className={styles.column_width}>{translations[key]}</div>
      ),
      secondaryLanguageTraslation: loadingSecondTranslations ? (
        <textarea
          rows={4}
          key={index}
          className={styles.column_width}
          disabled
        />
      ) : (
        <textarea
          className={styles.column_width}
          rows={4}
          name={key}
          defaultValue={secondTranslations[key]}
          disabled={loadingSecondTranslations}
          style={{ padding: "10px", height: "100%", minWidth: "100%" }}
          placeholder="Digite o texto traduzido..."
          onChange={this.handleTranslateChange}
        />
      ),
    }));

    return (
      <Layout pageHeader={this.translate("Translations.title")}>
        <Helmet title={this.translate("Translations.title")} />

        <Body>
          <section className="section">
            {loadingTranslations ? (
              <div className="container">
                <div className="columns">
                  <div className="column">
                    {parse(this.translate("Global.loading"))}
                    <BarLoader
                      width={"100%"}
                      color={"#babcbe"}
                      loading={true}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="container">
                {/* <TranslationsQuestions languages={this.props.languages} /> */}
                <p>{parse(this.translate("Translations.description"))}</p>
                <Reactable.Table
                  className={classnames(
                    "table is-bordered is-hoverable is-fullwidth",
                    styles.followup__info__table
                  )}
                  data={data}
                  style={{ margin: "20px 0 30px" }}
                >
                  <Reactable.Thead>
                    {_.map(this.getColumns(), (renderer, column) => (
                      <Reactable.Th column={column} style={{ width: "30px" }}>
                        {renderer()}
                      </Reactable.Th>
                    ))}
                  </Reactable.Thead>
                </Reactable.Table>
              </div>
            )}
          </section>
          <TranslationsActionFooter
            onSubmit={this.handleSubmit}
            saving={saving}
            isDisabledButton={
              _.isEmpty(newTranslations) || loadingSecondTranslations
            }
          />
        </Body>
      </Layout>
    );
  }
}

Translations.propTypes = {
  apiData: PropTypes.object.isRequired,
};

export default injectIntl(
  compose(AccountsContainer, APIContainer, NonUserRedir)(Translations)
);
