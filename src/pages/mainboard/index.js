import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Helmet from "react-helmet";
import moment from "moment";
import { compose } from "redux";
import axios from "axios";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import parse from "html-react-parser";

import AccountsContainer from "~/containers/accounts";
import NonUserRedir from "~/containers/non_user_redir";
import CONF from "~/api/index";

import { getUserToken } from "~/api/utils";

import {
  isAdminStateCity,
  isAdminUser,
  isMonitor,
  isAdminCountry,
} from "~/helpers/users";

import Layout from "~/components/Layout";
import Body from "~/components/Body";
import styles from "./styles.styl";
import PageHeader from "~/components/Header/PageHeader";

import APIDataContainer from "~/containers/api_data";

class Mainboard extends React.Component {
  componentDidMount() {
    const { user } = this.props.accounts;
    this.props.fetchTranslations(this.getLang());
  }

  constructor() {
    super();
    this.state = {
      showModalUpdate: false,
      tutorial: [],
    };
    this.handleCloseModalUpdate = this.handleCloseModalUpdate.bind(this);
  }

  getLang = () => {
    return localStorage.getItem("lang") || process.env.DEFAULT_LOCALE;
  };
  hasWasNotified = () => {
    const _this = this;
    axios
      .post(
        CONF.ApiURL + "/api/v1/was_notified?access_token=" + getUserToken(),
        {
          was_notified: true,
        }
      )
      .then((res) => {
        const { user } = _this.props.accounts;
        user.was_notified = res.data.was_notified;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleCloseModalUpdate() {
    this.hasWasNotified();
    this.setState({ showModalUpdate: false });
  }
  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    const { user } = this.props.accounts;
    return (
      <Layout bgSecondary={true}>
        <Helmet title="Guia EduTec" />
        <Body>
          <section
            className={classNames(
              isAdminStateCity(user) || isMonitor(user) ? "pb-0" : "",
              "section"
            )}
          >
            <div className="container">
              <div className="columns">
                <div className="column">
                  <PageHeader user={user} />
                </div>
              </div>
            </div>
          </section>

          {isAdminStateCity(user) || isMonitor(user) ? (
            <section className={classNames("section")}>
              <div className={classNames("container")}>
                <div className={classNames("columns")}>
                  <div className={classNames("column")}>
                    <div
                      className={classNames(
                        "card tutorial-step-2",
                        styles.card
                      )}
                      id="tutorial-step-2"
                    >
                      <div className="card-content">
                        <div className="content">
                          <h4
                            className={classNames("is-uppercase", styles.title)}
                          >
                            {parse(this.translate("Panel.fourDimensionsTitle"))}
                          </h4>
                          <p
                            className={classNames("subtitle", styles.subtitle)}
                          >
                            {parse(
                              this.translate("Panel.fourDimensionsDescription")
                            )}
                          </p>
                        </div>
                      </div>
                      <footer
                        className={classNames(
                          "card-footer",
                          styles.main_card_footer
                        )}
                      >
                        <p className="card-footer-item">
                          <span>
                            <a href="/dimensoes" className={styles.button_link}>
                              {parse(
                                this.translate("Panel.fourDimensionsLink")
                              )}
                            </a>
                          </span>
                        </p>
                      </footer>
                    </div>
                  </div>

                  <div className={classNames("column")}>
                    <div
                      className={classNames(
                        "card tutorial-step-3",
                        styles.card
                      )}
                      id="tutorial-step-3"
                    >
                      <div className="card-content">
                        <div className="content">
                          <h4
                            className={classNames("is-uppercase", styles.title)}
                          >
                            {parse(this.translate("Panel.diagnosisTitle"))}
                          </h4>
                          <p
                            className={classNames("subtitle", styles.subtitle)}
                          >
                            {parse(
                              this.translate("Panel.diagnosisDescription")
                            )}
                          </p>
                        </div>
                      </div>
                      <footer
                        className={classNames(
                          "card-footer",
                          styles.main_card_footer
                        )}
                      >
                        <p className="card-footer-item">
                          <span>
                            <a
                              href="/diagnostico-escola"
                              className={styles.button_link}
                            >
                              {parse(this.translate("Panel.diagnosisLink"))}
                            </a>
                          </span>
                        </p>
                      </footer>
                    </div>
                  </div>

                  <div className={classNames("column")}>
                    <div
                      className={classNames(
                        "card tutorial-step-3",
                        styles.card
                      )}
                      id="tutorial-step-3"
                    >
                      <div className="card-content">
                        <div className="content">
                          <h4
                            className={classNames("is-uppercase", styles.title)}
                          >
                            {parse(
                              this.translate("Panel.teacherSelfEvaluationTitle")
                            )}
                          </h4>
                          <p
                            className={classNames("subtitle", styles.subtitle)}
                          >
                            {parse(
                              this.translate(
                                "Panel.teacherSelfEvaluationDescription"
                              )
                            )}
                          </p>
                        </div>
                      </div>
                      <footer
                        className={classNames(
                          "card-footer",
                          styles.main_card_footer
                        )}
                      >
                        <p className="card-footer-item">
                          <span>
                            <a
                              href="/mapeamento-professor"
                              className={styles.button_link}
                            >
                              {parse(
                                this.translate(
                                  "Panel.teacherSelfEvaluationLink"
                                )
                              )}
                            </a>
                          </span>
                        </p>
                      </footer>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {isAdminUser(user) || isAdminCountry(user) ? (
            <section className={classNames("section", styles.main)}>
              <div className={classNames("container", styles.admin_principal)}>
                <div className="columns">
                  <div className="column">
                    <h2>{parse(this.translate("Admin.panels"))}</h2>
                  </div>
                </div>
                <div className="columns">
                  <div className="column is-3">
                    <a href="/painel-diagnostico">
                      <div className="card">
                        <div className="card-image">
                          <figure className="image is-4by3">
                            <img
                              src={require("../../../public/images/devolutives/painel_rede.jpg")}
                            />
                          </figure>
                        </div>
                        <div className="card-content">
                          <div className="content has-text-centered">
                            {parse(this.translate("Admin.networksPanel"))}
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="column is-3">
                    <a href="/painel-autoavaliacao">
                      <div className="card">
                        <div className="card-image">
                          <figure className="image is-4by3">
                            <img
                              src={require("../../../public/images/devolutives/painel_autoavaliacao.jpg")}
                            />
                          </figure>
                        </div>
                        <div className="card-content">
                          <div className="content has-text-centered">
                            {parse(this.translate("Admin.selfEvaluationPanel"))}
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </Body>
      </Layout>
    );
  }
}

Mainboard.propTypes = {};

export default injectIntl(
  compose(AccountsContainer, NonUserRedir, APIDataContainer)(Mainboard)
);
