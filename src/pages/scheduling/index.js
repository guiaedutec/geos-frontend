import React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import Layout from "../../components/Layout";
import styles from "./styles.styl";
import axios from "axios";
import Body from "~/components/Body";
import CONF from "~/api/index";
import SchedulingForm from "./SchedulingForm";
import Field from "~/components/Form/Field";

import { compose } from "redux";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

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
        <Helmet title={this.translate("Scheduling.helmetTitle")} />

        <Body>
          <section className="section">
            <div className="container">
              <div className="columns">
                <div className="column">
                  <div className={styles.introducao}>
                    <h1 className={styles.highlighted}>
                      {parse(this.translate("Scheduling.cycleOfApplication"))}
                    </h1>
                    <p>{parse(this.translate("Scheduling.description"))}</p>
                  </div>
                  <hr />

                  <h1 className={styles.highlighted}>
                    {parse(this.translate("Scheduling.historyOfDiagnosis"))}
                  </h1>
                  <div className={classnames("container")}>
                    <div className={classnames("columns", styles.section)}>
                      <div className="column">
                        <SchedulingForm />
                      </div>
                    </div>
                  </div>
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
