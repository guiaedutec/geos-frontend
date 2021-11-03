import React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import Layout from "../../components/Layout";
import styles from "./styles.styl";
import axios from "axios";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import Body from "~/components/Body";
import CONF from "~/api/index";
import SchedulingForm from "./SchedulingForm";
import Field from "~/components/Form/Field";

import { compose } from "redux";

import {
  getUserToken,
  setUserToken,
  removeUserToken,
  createUrlWithParams,
} from "~/api/utils";

import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminStateCityRedir from "~/containers/non_admin_state_city_redir";

class Scheduling extends React.Component {
  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    return (
      <Layout pageHeader={this.translate("Scheduling.pageHeader")}>
        <Helmet title={this.translate("Scheduling.titleHelmet")} />
        <Body>
          <section className="section">
            <div className="container">
              <div className="columns">
                <div className="column">
                  <h1 className={styles.highlighted}>
                    {parse(this.translate("FrequencyAnswers.title"))}
                  </h1>
                  {parse(this.translate("FrequencyAnswers.description"))}
                </div>
              </div>
            </div>

            <div className={classnames("container")}>
              <div className={classnames("columns", styles.section)}>
                <div className="column">
                  <SchedulingForm />
                </div>
              </div>
            </div>
          </section>
        </Body>
      </Layout>
    );
  }
}

export default injectIntl(
  compose(APIDataContainer, NonUserRedir, NonAdminStateCityRedir)(Scheduling)
);
