import React from "react";
import classNames from "classnames";
import Helmet from "react-helmet";
import _ from "lodash";
import ReactSpeedometer from "react-d3-speedometer";
import { compose } from "redux";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import AccountsContainer from "~/containers/accounts";
import NonUserRedir from "~/containers/non_user_redir";

import {
  isAdmin,
  isMonitor,
  isDirector,
  isDirectorOrTeacher,
  isOther,
  isAdminStateCity,
} from "~/helpers/users";

import Layout from "~/components/Layout";
import Body from "~/components/Body";
import Button from "~/components/Button";

import styles from "./Resources.styl";
import history from "~/core/history";

import CONF from "~/api/index";
import axios from "axios";
import API from "~/api";

import APIDataContainer from "~/containers/api_data";

import {
  getUserToken,
  setUserToken,
  removeUserToken,
  createUrlWithParams,
} from "~/api/utils";
import $ from "jquery";

class Resources extends React.Component {
  constructor() {
    super();
    this.state = {
      survey: [],
      level: 1,
      tutorial: [],
    };

    this.handleClickLevels = this.handleClickLevels.bind(this);
  }
  getLang = () => {
    return localStorage.getItem("lang") || process.env.DEFAULT_LOCALE;
  };
  componentWillMount() {
    this.getSurveys();
    this.props.fetchTranslations(this.getLang());
  }

  getSurveys = () => {
    const _this = this;
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/surveys_list?access_token=" +
          getUserToken(),
        {}
      )
      .then(function (surveys) {
        var surveySchool = [];
        surveys.data.surveys.forEach(function (survey) {
          if (survey.type === "personal") {
            surveySchool = survey;
          }
        });
        _this.setState({
          survey: surveySchool,
        });
      });
  };

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

  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    const { user } = this.props.accounts;

    return (
      <Layout pageHeader={this.translate("DiagnosisTeacher.pageHeader")}>
        <Helmet title={this.translate("DiagnosisTeacher.titleHelmet")} />
        <Body>
          <section className="section">
            {isAdminStateCity(user) || isMonitor(user) ? (
              <div className="container">
                <div className="columns">
                  <div className="column">
                    <div className={styles.content__paragraphs}>
                      <p>
                        {parse(this.translate("DiagnosisTeacher.description"))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.steps}>
                  <div
                    className={classNames(
                      styles.step,
                      isMonitor(user) ? "disabled" : null
                    )}
                  >
                    <span>01</span>

                    <div>
                      <strong>
                        {parse(
                          this.translate("DiagnosisTeacher.mappingFrequency")
                        )}
                      </strong>
                      <p>
                        {parse(
                          this.translate(
                            "DiagnosisTeacher.mappingFrequencyDescription"
                          )
                        )}
                      </p>
                    </div>

                    <Button to="/mapeamento-professor/frequencia">
                      {parse(this.translate("DiagnosisTeacher.btnAccess"))}
                    </Button>
                  </div>

                  <div className={styles.step}>
                    <span>02</span>

                    <div>
                      <strong>
                        {parse(this.translate("DiagnosisTeacher.materials"))}
                      </strong>
                      <p>
                        {parse(
                          this.translate(
                            "DiagnosisTeacher.materialsDescription"
                          )
                        )}
                      </p>
                    </div>

                    <Button to="/mapeamento-professor/divulgacao">
                      {parse(this.translate("DiagnosisTeacher.btnAccess"))}
                    </Button>
                  </div>

                  <div className={styles.step}>
                    <span>03</span>

                    <div>
                      <strong>
                        {parse(this.translate("DiagnosisTeacher.result"))}
                      </strong>
                      <p>
                        {parse(
                          this.translate("DiagnosisTeacher.resultDescription")
                        )}
                      </p>
                    </div>

                    <Button to="/mapeamento-professor/resultados">
                      {parse(this.translate("DiagnosisTeacher.btnAccess"))}
                    </Button>
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    <div className={styles.content__paragraphs}>
                      <p>
                        {parse(this.translate("DiagnosisTeacher.description2"))}
                      </p>
                      <p>
                        {parse(this.translate("DiagnosisTeacher.description3"))}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={classNames(
                    "columns is-multiline is-marginless",
                    styles.devolutive
                  )}
                >
                  <div
                    className={classNames("column is-full", styles.structure)}
                  >
                    <hr />
                    <section
                      className={classNames(
                        "section tutorial-step-4",
                        styles.section
                      )}
                      id="tutorial-step-4"
                    >
                      <div className="columns">
                        <div className="column is-12 has-text-centered">
                          <h2 className="is-size-3-mobile">
                            {parse(this.translate("LoginEducator.howWorks"))}
                          </h2>
                        </div>
                      </div>
                      <div className="columns align-center">
                        <div
                          className={classNames("column is-3", styles.amount)}
                        >
                          <div className={styles.number}>23</div>
                          <div className={styles.text}>
                            {parse(this.translate("LoginEducator.questions"))}
                          </div>
                        </div>
                        <div className="column is-9 has-text-centered-mobile">
                          <p>
                            {parse(
                              this.translate(
                                "LoginEducator.howWorksDescription"
                              )
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
                          className={classNames(
                            "column is-flex is-3",
                            styles.area
                          )}
                        >
                          <div className={styles.pedadogica}>
                            <div className={styles.icon}>
                              <img
                                src={require("../../../public/images/icons/pedagogica.svg")}
                                alt=""
                              />
                            </div>
                            <div className={styles.title}>
                              {parse(
                                this.translate("LoginEducator.pedagogical")
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={classNames(
                            "column is-flex is-3",
                            styles.area
                          )}
                        >
                          <div className={styles.cidadania}>
                            <div className={styles.icon}>
                              <img
                                src={require("../../../public/images/icons/cidadania.svg")}
                                alt=""
                              />
                            </div>
                            <div className={styles.title}>
                              {parse(
                                this.translate(
                                  "LoginEducator.digitalCitizenship"
                                )
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={classNames(
                            "column is-flex is-3",
                            styles.area
                          )}
                        >
                          <div className={styles.desenvolvimento}>
                            <div className={styles.icon}>
                              <img
                                src={require("../../../public/images/icons/desenvolvimento.svg")}
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
                        <div
                          className={classNames("column is-3", styles.amount)}
                        >
                          <div className={styles.number}>12</div>
                          <div className={styles.text}>
                            {parse(
                              this.translate("LoginEducator.competencies")
                            )}
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
                              className={classNames(
                                "column is-4",
                                styles.pedadogica
                              )}
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
                                  {parse(
                                    this.translate("LoginEducator.evaluation")
                                  )}
                                </li>
                                <li>
                                  {parse(
                                    this.translate(
                                      "LoginEducator.customization"
                                    )
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
                              className={classNames(
                                "column is-4",
                                styles.cidadania
                              )}
                            >
                              <ul className={styles.competences}>
                                <li>
                                  {parse(
                                    this.translate(
                                      "LoginEducator.responsibleUse"
                                    )
                                  )}
                                </li>
                                <li>
                                  {parse(
                                    this.translate("LoginEducator.safeUse")
                                  )}
                                </li>
                                <li>
                                  {parse(
                                    this.translate("LoginEducator.criticalUse")
                                  )}
                                </li>
                                <li>
                                  {parse(
                                    this.translate("LoginEducator.inclusion")
                                  )}
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
                                    this.translate(
                                      "LoginEducator.selfDevelopment"
                                    )
                                  )}
                                </li>
                                <li>
                                  {parse(
                                    this.translate(
                                      "LoginEducator.selfEvaluation"
                                    )
                                  )}
                                </li>
                                <li>
                                  {parse(
                                    this.translate("LoginEducator.sharing")
                                  )}
                                </li>
                                <li>
                                  {parse(
                                    this.translate(
                                      "LoginEducator.communication"
                                    )
                                  )}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={classNames(
                          "columns align-center",
                          styles.levels
                        )}
                      >
                        <div
                          className={classNames("column is-3", styles.amount)}
                        >
                          <div className={styles.number}>5</div>
                          <div className={styles.text}>
                            {parse(
                              this.translate("LoginEducator.ownershipLevels")
                            )}
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
                            <div className="column is-12 is-hidden-mobile wrap-speedometer bg-transparent">
                              <ReactSpeedometer
                                width={400}
                                height={210}
                                valueFormat="d"
                                maxValue={5}
                                value={this.state.level - 0.5}
                                needleColor="#131D3C"
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
                                  1.{" "}
                                  {parse(
                                    this.translate("LoginEducator.exposure")
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
                                  2.{" "}
                                  {parse(
                                    this.translate(
                                      "LoginEducator.familiarization"
                                    )
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
                                  3.{" "}
                                  {parse(
                                    this.translate("LoginEducator.adaptation")
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
                                  4.{" "}
                                  {parse(
                                    this.translate("LoginEducator.integration")
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
                                  5.{" "}
                                  {parse(
                                    this.translate(
                                      "LoginEducator.transformation"
                                    )
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
                                  "tabs is-size-7-touch",
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
                                      1.{" "}
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
                                      2.{" "}
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
                                      3.{" "}
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
                                      4.{" "}
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
                                      5.{" "}
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
                                <p
                                  className="content is-active"
                                  data-content="1"
                                >
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
                    </section>
                  </div>
                </div>
                <div className={classNames("columns")}>
                  <div className="column">
                    <hr />
                    <p>
                      {parse(
                        this.translate("DiagnosisTeacher.skillsDescription")
                      )}
                      :
                    </p>
                  </div>
                </div>
                <div
                  className={classNames("columns is-multiline", styles.matriz)}
                >
                  <div className="column is-full">
                    <h2>
                      <strong>
                        {parse(this.translate("DiagnosisTeacher.skillsMatrix"))}
                      </strong>
                    </h2>
                  </div>
                  <div className="column is-full">
                    <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                      <thead>
                        <tr>
                          <th>
                            {parse(this.translate("DiagnosisTeacher.areas"))}
                          </th>
                          <th colSpan="4">
                            {parse(this.translate("DiagnosisTeacher.skills"))}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className={styles.pedadogica_th}>
                            {parse(
                              this.translate("DiagnosisTeacher.pedagogical")
                            )}
                          </th>
                          <td>
                            <strong>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.pedagogicalPractice.title"
                                )
                              )}
                            </strong>
                            <p>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.pedagogicalPractice.description"
                                )
                              )}
                            </p>
                          </td>
                          <td>
                            <strong>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.evaluation.title"
                                )
                              )}
                            </strong>
                            <p>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.evaluation.description"
                                )
                              )}
                            </p>
                          </td>
                          <td>
                            <strong>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.customization.title"
                                )
                              )}
                            </strong>
                            <p>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.customization.description"
                                )
                              )}
                            </p>
                          </td>
                          <td>
                            <strong>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.criation.title"
                                )
                              )}
                            </strong>
                            <p>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.criation.description"
                                )
                              )}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.citizenship_th}>
                            {parse(
                              this.translate("DiagnosisTeacher.citizenship")
                            )}
                          </th>
                          <td>
                            <strong>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.responsible.title"
                                )
                              )}
                            </strong>
                            <p>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.responsible.description"
                                )
                              )}
                            </p>
                          </td>
                          <td>
                            <strong>
                              {parse(
                                this.translate("DiagnosisTeacher.safe.title")
                              )}
                            </strong>
                            <p>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.safe.description"
                                )
                              )}
                            </p>
                          </td>
                          <td>
                            <strong>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.critical.title"
                                )
                              )}
                            </strong>
                            <p>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.critical.description"
                                )
                              )}
                            </p>
                          </td>
                          <td>
                            <strong>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.inclusion.title"
                                )
                              )}
                            </strong>
                            <p>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.inclusion.description"
                                )
                              )}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.professionals_th}>
                            {parse(
                              this.translate("DiagnosisTeacher.professionals")
                            )}
                          </th>
                          <td>
                            <strong>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.selfDevelopment.title"
                                )
                              )}
                            </strong>
                            <p>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.selfDevelopment.description"
                                )
                              )}
                            </p>
                          </td>
                          <td>
                            <strong>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.selfEvaluation.title"
                                )
                              )}
                            </strong>
                            <p>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.selfEvaluation.description"
                                )
                              )}
                            </p>
                          </td>
                          <td>
                            <strong>
                              {parse(
                                this.translate("DiagnosisTeacher.share.title")
                              )}
                            </strong>
                            <p>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.share.description"
                                )
                              )}
                            </p>
                          </td>
                          <td>
                            <strong>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.communication.title"
                                )
                              )}
                            </strong>
                            <p>
                              {parse(
                                this.translate(
                                  "DiagnosisTeacher.communication.description"
                                )
                              )}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className={classNames("columns")}>
                  <div className="column">
                    <p>
                      {parse(this.translate("DiagnosisTeacher.tecnhicalNote"))}{" "}
                      <a
                        href={parse(
                          this.translate("StaticLinks.technicalNotes")
                        )}
                        target="_blank"
                      >
                        {parse(
                          this.translate(
                            "DiagnosisTeacher.tecnhicalNoteTextLink"
                          )
                        )}
                      </a>
                      .
                    </p>
                  </div>
                </div>
                <div className={classNames("columns", styles.encerramento)}>
                  <div className="column">
                    <hr className={styles.topless} />
                    <p>
                      {parse(this.translate("DiagnosisTeacher.knowMore"))}{" "}
                      <a
                        href={parse(
                          this.translate("StaticLinks.questionsExample")
                        )}
                        target="_blank"
                      >
                        {parse(this.translate("DiagnosisTeacher.quiz"))}
                      </a>{" "}
                      {parse(this.translate("DiagnosisTeacher.and"))}{" "}
                      <a
                        href={parse(
                          this.translate("StaticLinks.feedbackExample")
                        )}
                        target="_blank"
                      >
                        {parse(
                          this.translate("DiagnosisTeacher.devolutiveExample")
                        )}
                      </a>{" "}
                      {parse(this.translate("DiagnosisTeacher.sendTeacher"))}.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </Body>
      </Layout>
    );
  }
}

Resources.propTypes = {};

export default injectIntl(
  compose(NonUserRedir, AccountsContainer, APIDataContainer)(Resources)
);
