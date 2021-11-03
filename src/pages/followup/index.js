import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import classnames from "classnames";
import { compose } from "redux";

// components
import Layout from "~/components/Layout";
import Body from "~/components/Body";
import AnswersStats from "./components/AnswersStats";
import AnswersTable from "./components/AnswersTable";

// containers
import APIContainer from "~/containers/api_data";
import NonAdminRedir from "~/containers/non_admin_redir";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

// styles
import styles from "./followup.styl";

class FollowUp extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }
  render() {
    const {
      apiData: { surveyAnswers },
    } = this.props;

    return (
      <Layout pageHeader={this.translate("FollowUp.pageHeaderTitle")}>
        <Helmet title={this.translate("FollowUp.helmetTitle")} />
        <Body>
          <AnswersTable />
        </Body>
      </Layout>
    );
  }
}

FollowUp.propTypes = {
  apiData: PropTypes.object,
};

export default injectIntl(compose(APIContainer, NonAdminRedir)(FollowUp));
