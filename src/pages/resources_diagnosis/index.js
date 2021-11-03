import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Helmet from "react-helmet";
import _ from "lodash";
import { compose } from "redux";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from "react-accessible-accordion";
import "!style!css!react-accessible-accordion/dist/minimal-example.css";
import "!style!css!react-accessible-accordion/dist/fancy-example.css";

import AccountsContainer from "~/containers/accounts";
import NonUserRedir from "~/containers/non_user_redir";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import APIDataContainer from "~/containers/api_data";

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
import CensusFormModal from "~/components/CensusFormModal";
import ModalContainer from "~/containers/modal";
import PageHeader from "~/components/Header/PageHeader";

import styles from "./Resources.styl";
import history from "~/core/history";

import CONF from "~/api/index";
import axios from "axios";
import API from "~/api";

import { getUserToken } from "~/api/utils";

class Resources extends React.Component {
  constructor() {
    super();
    this.state = {
      survey: [],
      valid: false,
      answered: false,
      has_old_devolutive: false,
      institutionHasSchoolPlan: false,
      schoolHasPlan: false,
      institution: [],
      tutorial: [],
    };
    this.handleCensusEdit = this.handleCensusEdit.bind(this);
  }

  getLang = () => {
    return localStorage.getItem("lang") || process.env.DEFAULT_LOCALE;
  };

  componentDidMount() {
    this.getSurveys();
    this.getSchool();
    this.getHasUserAnswered();
    this.props.fetchTranslations(this.getLang());
  }

  translate = (id) => this.props.intl.formatMessage({ id });

  getSurveys = () => {
    const _this = this;
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/surveys_list?access_token=" +
          getUserToken(),
        {}
      )
      .then((surveys) => {
        var surveySchool = [];
        surveys.data.surveys.forEach((survey) => {
          if (survey.type === "school") {
            surveySchool = survey;
          }
        });
        _this.setState(
          {
            survey: surveySchool,
            has_old_devolutive: surveys.data.has_old_devolutive,
          },
          () => {
            _this.fetchData();
          }
        );
      });
  };

  fetchData = () => {
    const _this = this;
    if (
      _this.state.survey.schedule != undefined &&
      _this.state.survey.schedule.length > 0
    ) {
      const schedule = _this.state.survey.schedule[0];
      if (schedule) {
        var valid = true;
        var outPeriod = false;
        if (schedule.survey_end_date) {
          var dateDB = new Date(schedule.survey_end_date);
          var dateNew = new Date();
          if (dateDB < dateNew) {
            valid = false;
            outPeriod = true;
          }
        }

        _this.setState({
          surveyEndDate: schedule.survey_end_date,
          isEdit: true,
          valid: valid,
          outPeriod: outPeriod,
          missing_days: schedule.missing_days,
        });
      } else {
        var valid = true;
        _this.setState({
          isEdit: true,
          valid: valid,
        });
      }
    }
  };

  getSchool = () => {
    const _this = this;
    if (_this.props.accounts.user && _this.props.accounts.user.school_id) {
      API.Schools.findOne(_this.props.accounts.user.school_id.$oid).then(
        (schoolFound) => {
          var hasPlan = schoolFound.plan ? true : false;
          _this.setState({
            schoolHasPlan: hasPlan,
            school: schoolFound,
          });
        }
      );
    }
  };

  getHasUserAnswered = () => {
    const _this = this;
    axios
      .get(
        CONF.ApiURL + "/api/v1/user_answered?access_token=" + getUserToken(),
        {}
      )
      .then(function (school) {
        if (school.data) {
          _this.setState({
            answered: school.data.has_answered,
          });
          _this.getHasSchoolPlan();
        }
      });
  };

  getHasSchoolPlan = () => {
    const _this = this;
    if (isDirectorOrTeacher(_this.props.accounts.user)) {
      axios
        .get(
          CONF.ApiURL +
            "/api/v1/user_institution?access_token=" +
            getUserToken(),
          {}
        )
        .then(function (institution) {
          var institutionHasSchoolPlan = false;
          if (institution.data) {
            institution.data[0].plans.forEach(function (plan, index) {
              if (plan.type === "Escola") institutionHasSchoolPlan = true;
            });
            _this.setState({
              institutionHasSchoolPlan: institutionHasSchoolPlan,
              institution: institution,
            });
          }
        });
    }
  };

  handleCensusEdit() {
    const _this = this;
    if (isDirector(_this.props.accounts.user)) {
      _this.props.toggleModal();
      return;
    }
  }

  render() {
    const { user, userPrintSurveyUrl } = this.props.accounts;
    return (
      <Layout pageHeader={this.translate("SchoolDiagnosis.pageHeader")}>
        <Helmet title={this.translate("SchoolDiagnosis.pageHeader")} />
        <Body>
          <section className="section">
            <div className="container mb-30">
              <div className="columns">
                <div className="column">
                  <PageHeader user={user} />
                </div>
              </div>
            </div>
            <div className="container">
              <div className="columns">
                <div className="column">
                  {(isAdminStateCity(user) || isMonitor(user)) && [
                    <div className="mb-40">
                      <p className="mb-10">
                        {parse(this.translate("SchoolDiagnosis.description1"))}
                      </p>
                      <p className="mb-10">
                        {parse(this.translate("SchoolDiagnosis.description2"))}
                      </p>
                      <p className="mb-10">
                        {parse(this.translate("SchoolDiagnosis.description3"))}
                      </p>
                    </div>,
                    <Accordion className={styles.accordion} accordion={false}>
                      <AccordionItem
                        expanded={!isMonitor(user) ? true : false}
                        className={styles.accordion__item}
                      >
                        <AccordionItemTitle className={styles.accordion__title}>
                          <div className={styles.accordion__header}>
                            <i
                              className={classNames(
                                "fas fa-chevron-down",
                                styles.arrow
                              )}
                            ></i>
                            <div>
                              <div
                                className={classNames(
                                  "tutorial-step-5",
                                  styles.accordion__name
                                )}
                                id="tutorial-step-5"
                              >
                                {parse(
                                  this.translate(
                                    "SchoolDiagnosis.configurationCustomization"
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </AccordionItemTitle>
                        <AccordionItemBody className={styles.accordion__body}>
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
                                    this.translate("SchoolDiagnosis.item1Title")
                                  )}
                                </strong>
                                <p>
                                  {parse(
                                    this.translate(
                                      "SchoolDiagnosis.item1Description"
                                    )
                                  )}
                                </p>
                              </div>

                              <Button to="/listar-escolas">
                                {parse(
                                  this.translate("SchoolDiagnosis.btnAccess")
                                )}
                              </Button>
                            </div>

                            <div
                              className={classNames(
                                styles.step,
                                isMonitor(user) ? "disabled" : null
                              )}
                            >
                              <span>02</span>

                              <div>
                                <strong>
                                  {parse(
                                    this.translate("SchoolDiagnosis.item2Title")
                                  )}
                                </strong>
                                <p>
                                  {parse(
                                    this.translate(
                                      "SchoolDiagnosis.item2Description"
                                    )
                                  )}
                                </p>
                              </div>

                              <Button to="/criar-pergunta">
                                {parse(
                                  this.translate("SchoolDiagnosis.btnAccess")
                                )}
                              </Button>
                            </div>

                            <div
                              className={classNames(
                                styles.step,
                                isMonitor(user) ? "disabled" : null
                              )}
                            >
                              <span>03</span>

                              <div>
                                <strong>
                                  {parse(
                                    this.translate("SchoolDiagnosis.item4Title")
                                  )}
                                </strong>
                                <p>
                                  {parse(
                                    this.translate(
                                      "SchoolDiagnosis.item4Description"
                                    )
                                  )}
                                </p>
                              </div>

                              <Button to="/periodo-questionario">
                                {parse(
                                  this.translate("SchoolDiagnosis.btnAccess")
                                )}
                              </Button>
                            </div>
                          </div>
                        </AccordionItemBody>
                      </AccordionItem>

                      <AccordionItem
                        expanded={true}
                        className={styles.accordion__item}
                      >
                        <AccordionItemTitle className={styles.accordion__title}>
                          <div className={styles.accordion__header}>
                            <i
                              className={classNames(
                                "fas fa-chevron-down",
                                styles.arrow
                              )}
                            ></i>
                            <div>
                              <div
                                className={classNames(
                                  "tutorial-step-6",
                                  styles.accordion__name
                                )}
                                id="tutorial-step-6"
                              >
                                {parse(
                                  this.translate(
                                    "SchoolDiagnosis.disclosureMonitoring"
                                  )
                                )}
                                {/* Divulgação e Acompanhamento */}
                              </div>
                            </div>
                          </div>
                        </AccordionItemTitle>
                        <AccordionItemBody className={styles.accordion__body}>
                          <div className={styles.steps}>
                            <div className={styles.step}>
                              <span>04</span>

                              <div>
                                <strong>
                                  {parse(
                                    this.translate("SchoolDiagnosis.item5Title")
                                  )}
                                </strong>
                                <p>
                                  {parse(
                                    this.translate(
                                      "SchoolDiagnosis.item5Description"
                                    )
                                  )}
                                </p>
                              </div>

                              <Button to="/listar-atividades">
                                {parse(
                                  this.translate("SchoolDiagnosis.btnAccess")
                                )}
                              </Button>
                            </div>

                            <div className={styles.step}>
                              <span>05</span>

                              <div>
                                <strong>
                                  {parse(
                                    this.translate("SchoolDiagnosis.item6Title")
                                  )}
                                </strong>
                                <p>
                                  {parse(
                                    this.translate(
                                      "SchoolDiagnosis.item6Description"
                                    )
                                  )}
                                </p>
                              </div>

                              <Button to="/acompanhamento-respostas">
                                {parse(
                                  this.translate("SchoolDiagnosis.btnAccess")
                                )}
                              </Button>
                            </div>
                          </div>
                        </AccordionItemBody>
                      </AccordionItem>

                      <AccordionItem
                        expanded={true}
                        className={styles.accordion__item}
                      >
                        <AccordionItemTitle className={styles.accordion__title}>
                          <div className={styles.accordion__header}>
                            <i
                              className={classNames(
                                "fas fa-chevron-down",
                                styles.arrow
                              )}
                            ></i>
                            <div>
                              <div className={styles.accordion__name}>
                                {parse(
                                  this.translate("SchoolDiagnosis.results")
                                )}
                              </div>
                            </div>
                          </div>
                        </AccordionItemTitle>
                        <AccordionItemBody className={styles.accordion__body}>
                          <div className={styles.steps}>
                            <div className={styles.step}>
                              <span>06</span>

                              <div>
                                <strong>
                                  {parse(
                                    this.translate("SchoolDiagnosis.item7Title")
                                  )}
                                </strong>
                                <p>
                                  {parse(
                                    this.translate(
                                      "SchoolDiagnosis.item7Description"
                                    )
                                  )}
                                </p>
                              </div>

                              <Button to="/resultado">
                                {parse(
                                  this.translate("SchoolDiagnosis.btnAccess")
                                )}
                              </Button>
                            </div>
                          </div>
                        </AccordionItemBody>
                      </AccordionItem>
                    </Accordion>,
                  ]}
                </div>
              </div>
            </div>
          </section>
        </Body>
        {this.state && this.state.school && (
          <CensusFormModal
            isActive={this.props.modal.isActive}
            toggleModal={this.props.toggleModal}
            schoolId={this.state.school._id.$oid}
          />
        )}
      </Layout>
    );
  }
}

Resources.propTypes = {
  userSurveyUrl: PropTypes.object,
  userPrintSurveyUrl: PropTypes.object,
  modal: PropTypes.object,
};

export default injectIntl(
  compose(
    ModalContainer,
    NonUserRedir,
    AccountsContainer,
    APIDataContainer
  )(Resources)
);
