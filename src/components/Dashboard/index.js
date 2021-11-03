import React, { Component } from "react";
import { CookiesProvider, withCookies, Cookies } from "react-cookie";
import classNames from "classnames";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import styles from "./Dashboard.styl";
import CountNumber from "./CountNumber";
import CONF from "~/api/index";
import axios from "axios";
import moment from "moment";

class Dashboard extends Component {
  static defaultProps = {
    small: false,
    clean: false,
    centered: true,
    type: ["personal", "school"],
    teacherDescription: "responderam a Autoavaliação de Competências Digitais.",
    schoolDescription:
      "realizaram o diagnóstico do grau de adoção de tecnologia.",
  };

  constructor() {
    super();
    this.state = {
      totalTeachers: 0,
      totalSchools: 0,
      loadingTotals: true,
    };
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  async componentDidMount() {
    try {
      const totals = await axios.get(
        CONF.ApiURL + "/api/v1/survey/total_responses"
      );
      this.setState({
        totalTeachers: totals.data.personal,
        totalSchools: totals.data.school,
        loadingTotals: false,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  render() {
    return (
      <CookiesProvider>
        <div
          className={classNames(
            "columns is-marginless is-vcentered",
            styles.statistics,
            this.props.centered ? "is-centered" : "",
            this.props.small ? styles.small : "",
            this.props.clean ? styles.clean : ""
          )}
        >
          {this.props.type.includes("personal") && (
            <div
              className={classNames(
                "column",
                styles.column,
                this.props.type.length > 1 ? "is-5" : "is-8"
              )}
            >
              <div className={classNames("card", styles.card)}>
                <div
                  className={classNames("card-content", styles.card_content)}
                >
                  <div className={classNames("media", styles.card_media)}>
                    <div className="media-left">
                      <figure className="image">
                        <img
                          src={require("../../../public/images/icons/educador.svg")}
                          alt=""
                        />
                      </figure>
                    </div>
                    <div className="media-content">
                      <div className={classNames("title", styles.card_title)}>
                        <CountNumber
                          colorLoading={
                            this.props.clean ? "#131D3C" : "#FFFFFF"
                          }
                          loading={this.state.loadingTotals}
                          end={this.state.totalTeachers}
                        />
                        {parse(this.translate("Dashboard.teachers"))}
                      </div>
                      <p
                        className={classNames("subtitle", styles.card_subtitle)}
                      >
                        {this.props.small &&
                          parse(
                            this.translate("Dashboard.teacherSmallDescription")
                          )}
                      </p>
                      {!this.props.small && (
                        <p className="content">
                          {parse(
                            this.translate("Dashboard.teacherDescription")
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {this.props.type.includes("school") && (
            <div
              className={classNames(
                "column",
                styles.column,
                this.props.type.length > 1 ? "is-5" : "is-8"
              )}
            >
              <div className={classNames("card", styles.card)}>
                <div
                  className={classNames("card-content", styles.card_content)}
                >
                  <div className={classNames("media", styles.card_media)}>
                    <div className="media-left">
                      <figure className="image">
                        <img
                          src={require("../../../public/images/icons/escola.svg")}
                          alt=""
                        />
                      </figure>
                    </div>
                    <div className="media-content">
                      <div className={classNames("title", styles.card_title)}>
                        <CountNumber
                          colorLoading={
                            this.props.clean ? "#131D3C" : "#FFFFFF"
                          }
                          loading={this.state.loadingTotals}
                          end={this.state.totalSchools}
                        />
                        {parse(this.translate("Dashboard.schools"))}
                      </div>
                      <p
                        className={classNames("subtitle", styles.card_subtitle)}
                      >
                        {this.props.small &&
                          parse(
                            this.translate("Dashboard.schoolSmallDescription")
                          )}
                      </p>
                      {!this.props.small && (
                        <p className="content">
                          {parse(this.translate("Dashboard.schoolDescription"))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CookiesProvider>
    );
  }
}

export default injectIntl(Dashboard);
