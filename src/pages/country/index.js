import React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import { compose } from "redux";

// Components
import CountryForm from "./components/CountryForm";
import Layout from "../../components/Layout";
import Body from "~/components/Body";
// Containers
import UserRedir from "~/containers/user_redir";

// Style
import styles from "./school.styl";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import AccountsContainer from "~/containers/accounts";

class Country extends React.Component {
  constructor() {
    super();
    this.state = {
      visibleInstructions: false,
    };
  }

  componentWillMount() {
    const url = window.location.href;
    const config = url.split("?")[1];

    if (config) {
      this.setState({ visibleInstructions: false });
    } else {
      this.setState({ visibleInstructions: true });
    }
  }
  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    return (
      <Layout pageHeader={this.translate("CreateCountry.pageHeader")}>
        <Helmet title={this.translate("CreateCountry.pageHeader")} />

        <Body>
          <CountryForm />
        </Body>
      </Layout>
    );
  }
}

export default injectIntl(compose(AccountsContainer)(Country));
