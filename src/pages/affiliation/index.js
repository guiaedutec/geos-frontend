import React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import { compose } from "redux";

// Components
import AffiliationForm from "./components/AffiliationForm";
import Layout from "../../components/Layout";
import Body from "~/components/Body";

// Containers
import UserRedir from "~/containers/user_redir";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

// Style
import styles from "./school.styl";

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
      <Layout pageHeader={this.translate("CreateAffiliation.pageHeader")} >
        <Helmet title={this.translate("CreateAffiliation.pageHeader")} />

        <Body>
          <AffiliationForm />
        </Body>
      </Layout>
    );
  }
}

export default injectIntl(compose()(Country));
