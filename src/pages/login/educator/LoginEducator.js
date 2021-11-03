import React from "react";
import PropTypes from "prop-types";
import history from "~/core/history";
import SignInForm from "../components/SignInForm";
import AccountsContainer from "~/containers/accounts";
import ReactSpeedometer from "react-d3-speedometer";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import { redirectDefaultPageByUser } from "~/helpers/users";
import styles from "./LoginEducator.styl";
import classNames from "classnames";
import _ from "lodash";
import $ from "jquery";
import Dashboard from "../../../components/Dashboard";

export class LoginEducator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 1,
    };

    this.handleClickLevels = this.handleClickLevels.bind(this);
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  componentDidMount() {
    if (!_.isEmpty(this.props.accounts.user)) {
      history.push(redirectDefaultPageByUser(this.props.accounts.user));
    }

    $(".btn-call-to-action").empty();
    $(".btn-call-to-action").html($("a.cadastro").clone());
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.accounts.user)) {
      history.push(redirectDefaultPageByUser(nextProps.accounts.user));
    }
  }

  handleClickLevels(el) {
    let target = el.target;
    $(".tabs > ul > li").removeClass("is-active");
    $(target).parent("li").addClass("is-active");

    $("#tab-content .content").removeClass("is-active");
    let content = $.makeArray($("#tab-content .content")).find((c) => {
      return $(c).data("content") == $(target).data("tab");
    });
    $(content).addClass("is-active");

    this.setState({
      level: parseInt(target.dataset.tab),
    });
  }

  render() {
    return (
      <section className="section pl-0 pr-0">
        <div
          className={classNames(
            "columns is-multiline is-marginless",
            styles.login
          )}
        >
          <div className={classNames("column is-full", styles.form)}>
            <section className={classNames("section", styles.section)}>
              <div className="container">
                <div className="columns">
                  <div className="column is-5">
                    <h1 className="stripe is-size-4-touch has-text-centered-mobile">
                      <FormattedMessage
                        id="LoginEducator.title"
                        values={{
                          brIsHiddenMobile: <br className="is-hidden-mobile" />,
                        }}
                      />
                      <strong>
                        {parse(this.translate("LoginEducator.teachers"))}
                      </strong>
                    </h1>
                    <Dashboard
                      type={["personal"]}
                      small={true}
                      clean={true}
                      centered={false}
                    />
                  </div>
                  <div className="column is-7">
                    <SignInForm type="educador" />
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className={classNames("column is-full", styles.oque)}>
            <section className={classNames("section", styles.section)}>
              <div className="container">
                <div className="columns align-center">
                  <div
                    className={classNames(
                      "column is-5 is-5-widescreen has-text-centered-mobile has-text-left",
                      styles.call
                    )}
                  >
                    <h2 className="is-size-4-mobile">
                      {parse(this.translate("LoginEducator.whatIs"))}
                      <br className="is-hidden-tablet" />
                      <span className="is-size-5-mobile">
                        {parse(
                          this.translate("LoginEducator.titleSelfEvaluation")
                        )}
                      </span>
                    </h2>
                    <p>
                      {parse(
                        this.translate(
                          "LoginEducator.descriptionSelfEvaluation"
                        )
                      )}
                    </p>
                    <img
                      className={classNames(styles.big_image, styles.espelho)}
                      src={require("../../../../public/images/icons/espelho.svg")}
                      alt=""
                    />
                  </div>
                  <div
                    className={classNames(
                      "column is-7 is-7-widescreen",
                      styles.video
                    )}
                  >
                    <div className={styles.video_container}>
                      <iframe
                        width="640"
                        height="360"
                        src={parse(
                          this.translate("LoginEducator.videoSrcSelfEvaluation")
                        )}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className={classNames("column is-full", styles.porque)}>
            <section className={classNames("section", styles.section)}>
              <div className="container">
                <div className="columns align-center">
                  <div className="column is-5 is-4-widescreen is-offset-1-widescreen">
                    <img
                      className={styles.big_image}
                      src={require("../../../../public/images/icons/foguete.svg")}
                      alt=""
                    />
                  </div>
                  <div
                    className={classNames(
                      "column is-7 is-6-widescreen has-text-centered-mobile has-text-right",
                      styles.call
                    )}
                  >
                    <h2 className="is-size-3-mobile">
                      {parse(this.translate("LoginEducator.titleWhyUse"))}
                    </h2>
                    <p>
                      {parse(this.translate("LoginEducator.descriptionWhyUse"))}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className={classNames("column is-full", styles.structure)}>
            <section className={classNames("section", styles.section)}>
              <div className="container">
                <div className="columns">
                  <div className="column is-12 has-text-centered">
                    <h2 className="is-size-3-mobile">
                      {parse(this.translate("LoginEducator.howWorks"))}
                    </h2>
                  </div>
                </div>
                <div className={classNames("columns is-mobile", styles.arrow)}>
                  <div
                    className={classNames(
                      "column is-6-mobile is-5-desktop is-offset-1-desktop",
                      styles.diagonal
                    )}
                  ></div>
                  <div
                    className={classNames(
                      "column is-6-mobile is-5-desktop",
                      styles.diagonal,
                      styles.negative
                    )}
                  ></div>
                </div>
                <div className="columns align-center">
                  <div className={classNames("column is-3", styles.amount)}>
                    <div className={styles.number}>23</div>
                    <div className={styles.text}>
                      {parse(this.translate("LoginEducator.questions"))}
                    </div>
                  </div>
                  <div className="column is-9 has-text-centered-mobile">
                    <p>
                      {parse(
                        this.translate("LoginEducator.howWorksDescription")
                      )}
                    </p>
                  </div>
                </div>
                <div className="columns">
                  <div
                    className={classNames(
                      "column is-flex is-3",
                      styles.amount,
                      styles.number_area
                    )}
                  >
                    <div className={styles.number}>3</div>
                    <div className={styles.text}>
                      {parse(this.translate("LoginEducator.areas"))}
                    </div>
                  </div>
                  <div
                    className={classNames("column is-flex is-3", styles.area)}
                  >
                    <div className={styles.pedadogica}>
                      <div className={styles.icon}>
                        <img
                          src={require("../../../../public/images/icons/pedagogica.svg")}
                          alt=""
                        />
                      </div>
                      <div className={styles.title}>
                        {parse(this.translate("LoginEducator.pedagogical"))}
                      </div>
                    </div>
                  </div>
                  <div
                    className={classNames("column is-flex is-3", styles.area)}
                  >
                    <div className={styles.cidadania}>
                      <div className={styles.icon}>
                        <img
                          src={require("../../../../public/images/icons/cidadania.svg")}
                          alt=""
                        />
                      </div>
                      <div className={styles.title}>
                        {parse(
                          this.translate("LoginEducator.digitalCitizenship")
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={classNames("column is-flex is-3", styles.area)}
                  >
                    <div className={styles.desenvolvimento}>
                      <div className={styles.icon}>
                        <img
                          src={require("../../../../public/images/icons/desenvolvimento.svg")}
                          alt=""
                        />
                      </div>
                      <div className={styles.title}>
                        {parse(
                          this.translate(
                            "LoginEducator.professionalDevelopment"
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="columns align-center">
                  <div className={classNames("column is-3", styles.amount)}>
                    <div className={styles.number}>12</div>
                    <div className={styles.text}>
                      {parse(this.translate("LoginEducator.competencies"))}
                    </div>
                  </div>
                  <div className="column is-9">
                    <div className="columns">
                      <div className="column is-12 has-text-centered-mobile">
                        <p>
                          {parse(
                            this.translate(
                              "LoginEducator.competenciesDescription"
                            )
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="columns">
                      <div
                        className={classNames("column is-4", styles.pedadogica)}
                      >
                        <ul className={styles.competences}>
                          <li>
                            {parse(
                              this.translate(
                                "LoginEducator.pedagogicalPractice"
                              )
                            )}
                          </li>
                          <li>
                            {parse(this.translate("LoginEducator.evaluation"))}
                          </li>
                          <li>
                            {parse(
                              this.translate("LoginEducator.customization")
                            )}
                          </li>
                          <li>
                            {parse(
                              this.translate(
                                "LoginEducator.curatorshipCreation"
                              )
                            )}
                          </li>
                        </ul>
                      </div>
                      <div
                        className={classNames("column is-4", styles.cidadania)}
                      >
                        <ul className={styles.competences}>
                          <li>
                            {parse(
                              this.translate("LoginEducator.responsibleUse")
                            )}
                          </li>
                          <li>
                            {parse(this.translate("LoginEducator.safeUse"))}
                          </li>
                          <li>
                            {parse(this.translate("LoginEducator.criticalUse"))}
                          </li>
                          <li>
                            {parse(this.translate("LoginEducator.inclusion"))}
                          </li>
                        </ul>
                      </div>
                      <div
                        className={classNames(
                          "column is-4",
                          styles.desenvolvimento
                        )}
                      >
                        <ul className={styles.competences}>
                          <li>
                            {parse(
                              this.translate("LoginEducator.selfDevelopment")
                            )}
                          </li>
                          <li>
                            {parse(
                              this.translate("LoginEducator.selfEvaluation")
                            )}
                          </li>
                          <li>
                            {parse(this.translate("LoginEducator.sharing"))}
                          </li>
                          <li>
                            {parse(
                              this.translate("LoginEducator.communication")
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={classNames("columns align-center", styles.levels)}
                >
                  <div className={classNames("column is-3", styles.amount)}>
                    <div className={styles.number}>5</div>
                    <div className={styles.text}>
                      {parse(this.translate("LoginEducator.ownershipLevels"))}
                    </div>
                  </div>
                  <div className="column is-9">
                    <div className="columns is-multiline">
                      <div className="column is-12 has-text-centered-mobile">
                        <p>
                          {parse(
                            this.translate(
                              "LoginEducator.ownershipLevelsDescription"
                            )
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="columns is-multiline">
                      <div className="column is-12 is-hidden-mobile wrap-speedometer">
                        <ReactSpeedometer
                          width={400}
                          height={210}
                          valueFormat="d"
                          maxValue={5}
                          value={this.state.level - 0.5}
                          needleColor="#ffffff"
                          startColor="#c9c9c9"
                          segments={5}
                          endColor="#2e2e2e"
                          textColor="transparent"
                        />
                      </div>
                      <div className="column is-12 is-hidden-tablet">
                        <nav className="panel">
                          <p
                            className={classNames(
                              "panel-heading",
                              styles.panel_heading
                            )}
                          >
                            1. {parse(this.translate("LoginEducator.exposure"))}
                          </p>
                          <div
                            className={classNames(
                              "panel-block",
                              styles.panel_block
                            )}
                          >
                            <p>
                              {parse(
                                this.translate(
                                  "LoginEducator.exposureDescription"
                                )
                              )}
                            </p>
                          </div>
                        </nav>
                        <nav className="panel">
                          <p
                            className={classNames(
                              "panel-heading",
                              styles.panel_heading
                            )}
                          >
                            2.
                            {parse(
                              this.translate("LoginEducator.familiarization")
                            )}
                          </p>
                          <div
                            className={classNames(
                              "panel-block",
                              styles.panel_block
                            )}
                          >
                            <p>
                              {parse(
                                this.translate(
                                  "LoginEducator.familiarizationDescription"
                                )
                              )}
                            </p>
                          </div>
                        </nav>
                        <nav className="panel">
                          <p
                            className={classNames(
                              "panel-heading",
                              styles.panel_heading
                            )}
                          >
                            3.
                            {parse(this.translate("LoginEducator.adaptation"))}
                          </p>
                          <div
                            className={classNames(
                              "panel-block",
                              styles.panel_block
                            )}
                          >
                            <p>
                              {parse(
                                this.translate(
                                  "LoginEducator.adaptationDescription"
                                )
                              )}
                            </p>
                          </div>
                        </nav>
                        <nav className="panel">
                          <p
                            className={classNames(
                              "panel-heading",
                              styles.panel_heading
                            )}
                          >
                            4.
                            {parse(this.translate("LoginEducator.integration"))}
                          </p>
                          <div
                            className={classNames(
                              "panel-block",
                              styles.panel_block
                            )}
                          >
                            <p>
                              {parse(
                                this.translate(
                                  "LoginEducator.integrationDescription"
                                )
                              )}
                            </p>
                          </div>
                        </nav>
                        <nav className="panel">
                          <p
                            className={classNames(
                              "panel-heading",
                              styles.panel_heading
                            )}
                          >
                            5.
                            {parse(
                              this.translate("LoginEducator.transformation")
                            )}
                          </p>
                          <div
                            className={classNames(
                              "panel-block",
                              styles.panel_block
                            )}
                          >
                            <p>
                              {parse(
                                this.translate(
                                  "LoginEducator.transformationDescription"
                                )
                              )}
                            </p>
                          </div>
                        </nav>
                      </div>
                      <div className="column is-12 is-hidden-mobile">
                        <div
                          id="tabs"
                          className={classNames(
                            "tabs dark is-size-7-touch",
                            styles.tabs
                          )}
                        >
                          <ul>
                            <li className="is-active">
                              <a
                                data-tab="1"
                                href="javascript:void(0)"
                                onClick={this.handleClickLevels}
                              >
                                1.
                                {this.props.intl.formatMessage({
                                  id: "LoginEducator.exposure",
                                })}
                              </a>
                            </li>
                            <li>
                              <a
                                data-tab="2"
                                href="javascript:void(0)"
                                onClick={this.handleClickLevels}
                              >
                                2.
                                {this.props.intl.formatMessage({
                                  id: "LoginEducator.familiarization",
                                })}
                              </a>
                            </li>
                            <li>
                              <a
                                data-tab="3"
                                href="javascript:void(0)"
                                onClick={this.handleClickLevels}
                              >
                                3.
                                {this.props.intl.formatMessage({
                                  id: "LoginEducator.adaptation",
                                })}
                              </a>
                            </li>
                            <li>
                              <a
                                data-tab="4"
                                href="javascript:void(0)"
                                onClick={this.handleClickLevels}
                              >
                                4.
                                {this.props.intl.formatMessage({
                                  id: "LoginEducator.integration",
                                })}
                              </a>
                            </li>
                            <li>
                              <a
                                data-tab="5"
                                href="javascript:void(0)"
                                onClick={this.handleClickLevels}
                              >
                                5.
                                {this.props.intl.formatMessage({
                                  id: "LoginEducator.transformation",
                                })}
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div
                          id="tab-content"
                          className={classNames(
                            "tab-content",
                            styles.tab_content
                          )}
                        >
                          <p className="content is-active" data-content="1">
                            {parse(
                              this.translate(
                                "LoginEducator.exposureDescription"
                              )
                            )}
                          </p>
                          <p className="content" data-content="2">
                            {parse(
                              this.translate(
                                "LoginEducator.familiarizationDescription"
                              )
                            )}
                          </p>
                          <p className="content" data-content="3">
                            {parse(
                              this.translate(
                                "LoginEducator.adaptationDescription"
                              )
                            )}
                          </p>
                          <p className="content" data-content="4">
                            {parse(
                              this.translate(
                                "LoginEducator.integrationDescription"
                              )
                            )}
                          </p>
                          <p className="content" data-content="5">
                            {parse(
                              this.translate(
                                "LoginEducator.transformationDescription"
                              )
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className={classNames("column is-full", styles.devolutive)}>
            <section className={classNames("section", styles.section)}>
              <div className="container">
                <div className="columns">
                  <div className="column is-10 is-offset-1 has-text-centered-mobile">
                    <h2 className="is-size-3-mobile">
                      {parse(this.translate("LoginEducator.devolutive"))}
                    </h2>
                  </div>
                </div>
                <div className="columns align-center">
                  <div className="column is-8">
                    <div className={classNames("columns", styles.diagram)}>
                      <div className="column is-one-quarter is-paddingless">
                        <img
                          className="image is-64x64"
                          src={require("../../../../public/images/icons/devolutiva-onde-estou.svg")}
                          alt=""
                        />
                        <span>
                          {parse(this.translate("LoginEducator.whereAmI"))}
                        </span>
                      </div>
                      <div className="column is-hidden-mobile"></div>
                      <div className="column is-one-quarter is-paddingless">
                        <img
                          className="image is-64x64"
                          src={require("../../../../public/images/icons/devolutiva-isso-significa.svg")}
                          alt=""
                        />
                        <span>
                          {parse(this.translate("LoginEducator.whatMean"))}
                        </span>
                      </div>
                      <div className="column is-hidden-mobile"></div>
                      <div className="column is-one-quarter is-paddingless">
                        <img
                          className="image is-64x64"
                          src={require("../../../../public/images/icons/devolutiva-posso-evoluir.svg")}
                          alt=""
                        />
                        <span>
                          {parse(this.translate("LoginEducator.howEvolve"))}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="column is-4 has-text-centered-mobile has-text-right">
                    <p>
                      {parse(
                        this.translate("LoginEducator.devolutiveDescription")
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div
            className={classNames(
              "column has-text-centered",
              styles.calltoaction
            )}
          >
            <section className={classNames("section", styles.section)}>
              <div className="container">
                <h2 className="is-size-4-mobile">
                  <FormattedMessage
                    id="LoginEducator.startNow"
                    values={{
                      brIsHiddenTablet: <br className="is-hidden-tablet" />,
                    }}
                  />
                  <span className="is-size-5-mobile">
                    {parse(this.translate("LoginEducator.startNowSelfEvaluation"))}
                  </span>
                </h2>
                <div className="btn-call-to-action"></div>
              </div>
            </section>
          </div>
          <div className={classNames("column is-full", styles.notes)}>
            <section className={classNames("section", styles.section)}>
              <div className="container">
                <p>{parse(this.translate("LoginEducator.notes1"))}</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    );
  }
}

LoginEducator.propTypes = {
  accounts: PropTypes.object.isRequired,
};

export default injectIntl(AccountsContainer(LoginEducator));
