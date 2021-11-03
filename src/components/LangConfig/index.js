import axios from "axios";
import _ from "lodash";
import React from "react";
import { addLocaleData, IntlProvider } from "react-intl";
import parse from "html-react-parser";
import CONF from "~/api/index";
// import es from "react-intl/locale-data/es";
// import pt from "react-intl/locale-data/pt";

// import es from "@formatjs/intl-relativetimeformat/locale-data/es";
// import pt from "@formatjs/intl-relativetimeformat/locale-data/pt";
// addLocaleData([...es, ...pt]);
import { flattenMessages } from "~/i18n/utils";
let locale = localStorage.getItem("lang") || process.env.DEFAULT_LOCALE;

export default class LangConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      messages: {},
    };
  }

  insertLangInLocalStorage() {
    if (!localStorage.getItem("lang")) {
      const locale = process.env.DEFAULT_LOCALE || "es";
      localStorage.setItem("lang", locale);
      location.reload();
    }
  }

  componentDidMount() {
    this.insertLangInLocalStorage();
    this.fetchTranslations();
  }

  async fetchTranslations() {
    try {
      this.setState({ loading: true });
      const response = await axios.get(
        CONF.ApiURL + `/api/v1/translation/${locale}`
      );

      const data = response.data.data[0];
      const dataOmitedProps = _.omit(data, [
        "created_at",
        "lang",
        "updated_at",
        "_id",
      ]);
      const messages = flattenMessages(dataOmitedProps);
      this.setState({
        messages,
        loading: false,
      });
    } catch (error) {
      this.setState({ loading: false, messages: {} });
      console.log(error);
    }
  }

  render() {
    const { loading, messages } = this.state;
    const { children } = this.props;

    if (loading) {
      return <div />;
    }

    return (
      <IntlProvider locale={locale} messages={messages} onError={() => true}>
        {children}
      </IntlProvider>
    );
  }
}
