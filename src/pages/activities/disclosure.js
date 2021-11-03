import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import classnames from "classnames";
import { compose } from "redux";

// Components
import Layout from "../../components/Layout";
import Body from "~/components/Body";
import { isMonitor } from "~/helpers/users";
// Style
import styles from "./styles.styl";

import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminRedir from "~/containers/non_admin_redir";

import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

const LEFT_MATERIALS_QUANT = 3;
const RIGHT_MATERIALS_QUANT = 4;
const TOTAL_MATERIALS_QUANT = LEFT_MATERIALS_QUANT + RIGHT_MATERIALS_QUANT;

class Disclosure extends React.Component {
  translate = (id) => this.props.intl.formatMessage({ id });

  renderMaterial = (index) => (
    <div className={classnames("mb-2", styles.material)}>
      <p>
        <span className={styles.activitie__title}>
          <FormattedMessage id={`Disclosure.material${index}.title`} />
        </span>
      </p>
      <p>
        <i>
          <FormattedMessage id={`Disclosure.material${index}.description`} />
        </i>
      </p>
      <p className="mt-1">
        {parse(this.translate("Disclosure.downloadFile"))}:{" "}
        <a
          target="_blank"
          href={this.translate(`Disclosure.material${index}.href`)}
        >
          {parse(this.translate("Disclosure.here"))}{" "}
          <i className="fa fa-arrow-circle-down fa-3" aria-hidden="true" />{" "}
        </a>
      </p>
    </div>
  );

  renderMaterials = (initialCount, finalCount) => {
    const materials = [];

    for (let i = initialCount; i <= finalCount; i++) {
      materials.push(this.renderMaterial(i));
    }

    return materials;
  };
  render() {
    const { user } = this.props.accounts;
    return (
      <Layout pageHeader={parse(this.translate("Disclosure.pageHeader"))}>
        <Helmet title={parse(this.translate("Disclosure.titleHelmet"))} />
        <Body>
          <section className="section">
            <div className="container">
              <div className="columns">
                <div className="column">
                  <h1 className="is-size-4 mb-20">
                    {parse(this.translate("Disclosure.titleHelmet"))}
                  </h1>
                  <p>
                    {parse(this.translate("Disclosure.description1"))}
                  </p>
                  <p>
                    {parse(this.translate("Disclosure.description2"))}
                  </p>
                  <div
                    className={classnames(
                      styles.lista_materiais,
                      "columns is-multiline mt-40"
                    )}
                  >
                    <div className="column is-6">
                      {this.renderMaterials(1, LEFT_MATERIALS_QUANT)}
                    </div>
                    <div className="column is-6">
                      {this.renderMaterials(
                        LEFT_MATERIALS_QUANT + 1,
                        TOTAL_MATERIALS_QUANT
                      )}
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
  compose(APIDataContainer, NonUserRedir, NonAdminRedir)(Disclosure)
);
