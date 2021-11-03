import React from "react";
import Helmet from "react-helmet";
import styles from "./styles.styl";
import classNames from "classnames";
import Layout from "../../../components/Layout";
import Body from "../../../components/Body";
import LocationFilters from "./LocationFilters";
import ProfessionalFilters from "./ProfessionalFilters";
import CONF from "~/api/index";
import { compose } from "redux";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import Card from "./card";

import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminUserRedir from "~/containers/non_admin_user_redir";
import axios from "axios";

import { getUserToken } from "~/api/utils";
import { getEvaluationLevel } from "~/helpers/data_const";
import $ from "jquery";
import { BounceLoader, BeatLoader } from "react-spinners";
import DatePicker, { registerLocale } from "react-datepicker";

import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import ExportMicrodata from "../../../components/ExportMicrodata";

const arrLevel = getEvaluationLevel();
moment.locale("pt-br");
export class SelfEvaluation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      survey: [],
      total: 0,
      startDate: new Date(),
      endDate: new Date(),

      areas: [
        {
          referencia: "pedagogica",
          titulo: "Pedagógica",
          niveis: Array(5).fill(0),
          competencias: [
            {
              referencia: "pratica-pedagogica",
              titulo: "Prática Pedagógica",
              hifienizacao: "Prática Pedagógica",
              valores: [
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
              ],
            },
            {
              referencia: "avaliacao",
              titulo: "Avaliação",
              hifienizacao: "Avaliação",
              valores: [
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
              ],
            },
            {
              referencia: "personalizacao",
              titulo: "Personalização",
              hifienizacao: "Personalização",
              valores: [
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
              ],
            },
            {
              referencia: "curadoria-criacao",
              titulo: "Curadoria e Criação",
              hifienizacao: "Curadoria e Criação",
              valores: [
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
              ],
            },
          ],
        },
        {
          referencia: "cidadania",
          titulo: "Cidadania Digital",
          niveis: Array(5).fill(0),
          competencias: [
            {
              referencia: "uso-responsavel",
              titulo: "Uso Responsável",
              hifienizacao: "Uso Responsável",
              valores: [
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
              ],
            },
            {
              referencia: "uso-seguro",
              titulo: "Uso Seguro",
              hifienizacao: "Uso Seguro",
              valores: [
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
              ],
            },
            {
              referencia: "uso-critico",
              titulo: "Uso Crítico",
              hifienizacao: "Uso Crítico",
              valores: [
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
              ],
            },
            {
              referencia: "inclusao",
              titulo: "Inclusão",
              hifienizacao: "Inclusão",
              valores: [
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
              ],
            },
          ],
        },
        {
          referencia: "desenvolvimento",
          titulo: "Desenvolvimento Profissional",
          niveis: Array(5).fill(0),
          competencias: [
            {
              referencia: "autodesenvolvimento",
              titulo: "Autodesenvolvimento",
              hifienizacao: "Autodesen- volvimento",
              valores: [
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
              ],
            },
            {
              referencia: "autoavaliacao",
              titulo: "Autoavaliação",
              hifienizacao: "Autoavaliação",
              valores: [
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
              ],
            },
            {
              referencia: "compartilhamento",
              titulo: "Compartilhamento",
              hifienizacao: "Compartilha- mento",
              valores: [
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
              ],
            },
            {
              referencia: "comunicacao",
              titulo: "Comunicação",
              hifienizacao: "Comunicação",
              valores: [
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
                { numero: 0, porcentagem: 0 },
              ],
            },
          ],
        },
      ],
      viewData: false,
      loading: {
        main: true,
        amount: true,
        area: true,
        competence: true,
        demography: true,
        filter: true,
      },
      source: "",
      active: "todas",
      networks: [],
      dataDB: new Object(),
    };

    this.handleClickTab = this.handleClickTab.bind(this);
    this.handleClickViewData = this.handleClickViewData.bind(this);

    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.onClickFilter = this.onClickFilter.bind(this);
  }

  componentDidMount() {
    this.getSurveys();
  }

  // componentDidMount() {
  //   // {parse(this.translate("DiagnosisTeacher.selfEvaluation.pedagogical"))}
  //   console.log(this.props);
  //   console.log(
  //     "teste",
  //     this.props.intl.formatMessage({
  //       id: "DiagnosisTeacher.selfEvaluation.pedagogical",
  //     })
  //   );
  // }

  handleClickViewData(e) {
    this.setState({
      viewData: !this.state.viewData,
    });
  }

  handleChangeStart(date) {
    this.setState({
      startDate: date,
    });
  }

  handleChangeEnd(date) {
    this.setState({
      endDate: date,
    });
  }

  getUserProfile() {
    const user = this.props.accounts.user;
    return user._profile;
  }

  onClickFilter() {
    let reference = $(".espectro.is-active").data("ref");
    let indicator;

    switch (reference) {
      case "chamada":
        indicator = "true";
        break;
      case "demais":
        indicator = "false";
        break;
    }

    let loading = this.state.loading;
    let dataDB = this.state.dataDB;

    delete dataDB.todas;
    delete dataDB.chamada;
    delete dataDB.demais;

    loading.amount = true;
    loading.area = true;
    loading.competence = true;
    loading.demography = true;
    loading.filter = true;

    this.setState({
      loading: loading,
      dataDB: dataDB,
      active: reference,
    });
    console.log("click");
    this.getSelfEvaluationByArea(indicator, this.state.active);
  }

  handleClickTab() {
    let reference = "todas";
    let source = "";
    let indicator;
    let loading = this.state.loading;

    switch (reference) {
      case "todas":
        source = "Dados do Censo Escolar 2019";
        break;
      case "chamada":
        source = "Dados informados pelos territórios";
        indicator = "true";
        break;
      case "demais":
        source = "Dados do Censo Escolar 2019";
        indicator = "false";
        break;
    }

    if (this.state.dataDB[reference]) {
      this.state.dataDB[reference].total != undefined
        ? (loading.amount = false)
        : (loading.amount = true);
      this.state.dataDB[reference].areas != undefined
        ? (loading.area = false)
        : (loading.area = true);
      this.state.dataDB[reference].details != undefined
        ? (loading.competence = false)
        : (loading.competence = true);
      this.state.dataDB[reference].networks != undefined
        ? (loading.demography = false)
        : (loading.demography = true);

      this.setState({
        areas: this.state.dataDB[reference].areas,
        networks: this.state.dataDB[reference].networks,
        total: this.state.dataDB[reference].total,
        source: source,
        loading: loading,
        active: reference,
      });
    } else {
      loading.amount = true;
      loading.area = true;
      loading.competence = true;
      loading.demography = true;

      this.setState({
        source: source,
        loading: loading,
        active: reference,
      });
      this.getSelfEvaluationByArea(indicator, reference);
    }
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
        let loading = _this.state.loading;

        if (surveys.data) {
          let surveyPersonal = [];
          surveys.data.surveys.forEach(function (survey) {
            if (survey.type === "personal") {
              surveyPersonal = survey;
            }
          });

          loading.main = false;

          _this.setState(
            {
              survey: surveyPersonal,
              loading: loading,
            },
            () => {
              _this.getSelfEvaluationByArea(null, _this.state.active);
            }
          );
        }
      });
  };

  getSelfEvaluationByArea = (indicator, reference) => {
    const _this = this;
    let indicatorParams = indicator ? "&used_indicator=" + indicator : "";
    let dataDBState = _this.state.dataDB;
    let dataDB = new Object();
    dataDBState[reference] = dataDB;
    _this.setState({
      dataDB: dataDBState,
    });
    console.log(decodeURIComponent($("form").serialize()));
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/distribution_by_area?survey_id=" +
          _this.state.survey.id +
          "&access_token=" +
          getUserToken() +
          "&level=pais" +
          indicatorParams +
          "&" +
          decodeURIComponent($("form").serialize()),
        {}
      )
      .then((results) => {
        let areasUpdate = [
          {
            referencia: "pedagogica",
            titulo: this.translate(
              "DiagnosisTeacher.selfEvaluation.pedagogical"
            ),
            niveis: Array(5).fill(0),
            competencias: [
              {
                referencia: "pratica-pedagogica",
                titulo: this.translate(
                  "DiagnosisTeacher.selfEvaluation.pedagogicalPractice"
                ),
                hifienizacao: "Prática Pedagógica",
                valores: [
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                ],
              },
              {
                referencia: "avaliacao",
                titulo: this.translate(
                  "DiagnosisTeacher.selfEvaluation.evaluation"
                ),
                hifienizacao: "Avaliação",
                valores: [
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                ],
              },
              {
                referencia: "personalizacao",
                titulo: this.translate(
                  "DiagnosisTeacher.selfEvaluation.customization"
                ),
                hifienizacao: "Personalização",
                valores: [
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                ],
              },
              {
                referencia: "curadoria-criacao",
                titulo: this.translate(
                  "DiagnosisTeacher.selfEvaluation.curatorshipCreation"
                ),
                hifienizacao: "Curadoria e Criação",
                valores: [
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                ],
              },
            ],
          },
          {
            referencia: "cidadania",
            titulo: this.translate(
              "DiagnosisTeacher.selfEvaluation.digitalCitizenship"
            ),
            niveis: Array(5).fill(0),
            competencias: [
              {
                referencia: "uso-responsavel",
                titulo: this.translate(
                  "DiagnosisTeacher.selfEvaluation.responsibleUse"
                ),
                hifienizacao: "Uso Responsável",
                valores: [
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                ],
              },
              {
                referencia: "uso-seguro",
                titulo: this.translate(
                  "DiagnosisTeacher.selfEvaluation.safeUse"
                ),
                hifienizacao: "Uso Seguro",
                valores: [
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                ],
              },
              {
                referencia: "uso-critico",
                titulo: this.translate(
                  "DiagnosisTeacher.selfEvaluation.criticalUse"
                ),
                hifienizacao: "Uso Crítico",
                valores: [
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                ],
              },
              {
                referencia: "inclusao",
                titulo: this.translate(
                  "DiagnosisTeacher.selfEvaluation.inclusion"
                ),
                hifienizacao: "Inclusão",
                valores: [
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                ],
              },
            ],
          },
          {
            referencia: "desenvolvimento",
            titulo: this.translate(
              "DiagnosisTeacher.selfEvaluation.professionalDevelopment"
            ),
            niveis: Array(5).fill(0),
            competencias: [
              {
                referencia: "autodesenvolvimento",
                titulo: this.translate(
                  "DiagnosisTeacher.selfEvaluation.selfDevelopment"
                ),
                hifienizacao: "Autodesen- volvimento",
                valores: [
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                ],
              },
              {
                referencia: "autoavaliacao",
                titulo: this.translate(
                  "DiagnosisTeacher.selfEvaluation.selfEvaluation"
                ),
                hifienizacao: "Autoavaliação",
                valores: [
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                ],
              },
              {
                referencia: "compartilhamento",
                titulo: this.translate(
                  "DiagnosisTeacher.selfEvaluation.sharing"
                ),
                hifienizacao: "Compartilha- mento",
                valores: [
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                ],
              },
              {
                referencia: "comunicacao",
                titulo: this.translate(
                  "DiagnosisTeacher.selfEvaluation.communication"
                ),
                hifienizacao: "Comunicação",
                valores: [
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                  { numero: 0, porcentagem: 0 },
                ],
              },
            ],
          },
        ];
        let quntRespostas = !$.isEmptyObject(results.data)
          ? Object.values(Object.values(results.data)[0]).reduce(
              (total, num) => {
                return total + num;
              },
              0
            )
          : 0;
        let loading = _this.state.loading;

        let totalTemp = quntRespostas != 0 ? quntRespostas : 1;

        areasUpdate.forEach((area) => {
          let niveis = Array(5).fill(0);
          if (!$.isEmptyObject(results.data[area.titulo.toUpperCase()])) {
            Object.keys(results.data[area.titulo.toUpperCase()]).forEach(
              (key) => {
                let val = results.data[area.titulo.toUpperCase()][key];
                niveis[key - 1] = (val * 100) / totalTemp;
              }
            );
          }
          area.niveis = niveis;
        });

        dataDB.areas = areasUpdate;
        dataDB.total = quntRespostas;
        dataDBState[reference] = dataDB;

        if (_this.state.active == reference) {
          loading.amount = false;
          loading.area = false;
          loading.filter = false;

          _this.setState({
            total: quntRespostas,
            dataDB: dataDBState,
            areas: areasUpdate,
            loading: loading,
          });
        } else {
          _this.setState({
            dataDB: dataDBState,
          });
        }

        _this.getSelfEvaluationDetails(indicatorParams, reference);
      });
  };

  getSelfEvaluationDetails = (indicatorParams, reference) => {
    const _this = this;
    console.log(decodeURIComponent($("form").serialize()));
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/result_self_evaluation_details?survey_id=" +
          _this.state.survey.id +
          indicatorParams +
          "&level=pais" +
          "&" +
          decodeURIComponent($("form").serialize()) +
          "&access_token=" +
          getUserToken()
      )
      .then((results) => {
        let totalTemp =
          _this.state.dataDB[reference].total != 0
            ? _this.state.dataDB[reference].total
            : 1;
        let areas = _this.state.dataDB[reference].areas;
        let loading = _this.state.loading;

        areas.forEach((area) => {
          area.competencias.forEach((competencia) => {
            let result =
              results.data[
                "<H1>" +
                  area.titulo.toUpperCase() +
                  "</H1>" +
                  competencia.titulo.toUpperCase()
              ];
            if (!$.isEmptyObject(result)) {
              competencia.valores.forEach((valor, i) => {
                if (result[i + 1]) {
                  valor.numero = result[i + 1];
                  valor.porcentagem = result[i + 1] / totalTemp;
                }
              });
            }
          });
        });

        let dataDBState = _this.state.dataDB;
        dataDBState[reference].areas = areas;
        dataDBState[reference].details = true;

        if (_this.state.active == reference) {
          loading.competence = false;
          _this.setState({
            dataDB: dataDBState,
            areas: areas,
            loading: loading,
          });
        } else {
          _this.setState({
            dataDB: dataDBState,
          });
        }

        _this.getSelfEvaluationAmount(indicatorParams, reference);
      });
  };

  getSelfEvaluationAmount = (indicatorParams, reference) => {
    const _this = this;
    console.log(decodeURIComponent($("form").serialize()));
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/responses_self_evaluation_demography?survey_id=" +
          _this.state.survey.id +
          "&access_token=" +
          getUserToken() +
          "&level=pais" +
          indicatorParams +
          "&" +
          $("form").serialize(),
        {}
      )
      .then(function (response) {
        let networks = !$.isEmptyObject(response.data)
          ? Object.entries(response.data)
          : [];
        let loading = _this.state.loading;

        networks = networks.map((nw) => {
          nw[1] = Object.entries(nw[1]);
          return nw;
        });

        let dataDBState = _this.state.dataDB;
        dataDBState[reference].networks = networks;

        if (_this.state.active == reference) {
          loading.demography = false;
          _this.setState({
            dataDB: dataDBState,
            networks: networks,
            loading: loading,
          });
        } else {
          _this.setState({
            dataDB: dataDBState,
          });
        }
      });
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    return (
      <Layout
        pageHeader={this.translate("DiagnosisTeacher.selfEvaluation.title")}
      >
        <Helmet title={this.translate("DiagnosisTeacher.titleHelmet")} />
        <Body>
          <section className="section">
            {this.state.loading.main ? (
              <div className={classNames("container", styles.container)}>
                <BeatLoader size={10} color={"#babcbe"} loading={true} />
              </div>
            ) : (
              <div className={classNames("container", styles.container)}>
                <ExportMicrodata type="teacher" />
                <form className={classNames("card", styles.card)}>
                  <div className="card-content">
                    <div className="columns">
                      <div className="column is-6">
                        <LocationFilters
                          hideCountry={
                            this.getUserProfile() === "admin_country"
                              ? true
                              : false
                          }
                          hideProvince={true}
                          hideState={true}
                          hideCity={true}
                          userProfile={this.getUserProfile()}
                        />
                      </div>
                      {/* <ProfessionalFilters /> */}
                      <div
                        className={classNames("column is-6", styles.periodBox)}
                      >
                        <div>
                          <strong className={styles.label}>
                            {parse(
                              this.translate(
                                "DiagnosisTeacher.selfEvaluation.period"
                              )
                            )}
                          </strong>
                          <div className="data">
                            <DatePicker
                              className="input"
                              id={"start_date"}
                              // dateFormatCalendar={"dd/mm/yyyy"}
                              dateFormat="dd/MM/yyyy"
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              selected={this.state.startDate}
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              selectsStart
                              onChange={this.handleChangeStart}
                              name="start"
                            />
                          </div>
                        </div>
                        <div>
                          <strong className={styles.label}>
                            {parse(
                              this.translate(
                                "DiagnosisTeacher.selfEvaluation.to"
                              )
                            )}
                          </strong>
                          <div className="data">
                            <DatePicker
                              className="input"
                              id={"end_date"}
                              // dateFormatCalendar={"dd/mm/yyyy"}
                              dateFormat="dd/MM/yyyy"
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              selected={this.state.endDate}
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              selectsEnd
                              onChange={this.handleChangeEnd}
                              name="end"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <a
                        className={classNames(
                          "card-footer-item button is-primary",
                          {
                            "is-loading": this.state.loading.filter,
                          }
                        )}
                        onClick={this.onClickFilter}
                      >
                        {parse(
                          this.translate(
                            "DiagnosisTeacher.selfEvaluation.applyFilter"
                          )
                        )}
                      </a>
                    </div>
                  </div>
                </form>

                <div className="tabs is-boxed is-marginless">
                  <ul>
                    <li
                      className={classNames(
                        "espectro",
                        this.state.active == "todas" ? "is-active" : "",
                        this.state.active == "todas" ? styles.is_active : ""
                      )}
                      data-ref="todas"
                    >
                      <a>
                        <span className="is-size-6">
                          {parse(
                            this.translate(
                              "DiagnosisTeacher.selfEvaluation.allNetworks"
                            )
                          )}
                        </span>
                      </a>
                    </li>
                    {/* <li
                      className={classNames(
                        "espectro",
                        this.state.active == "chamada" ? "is-active" : "",
                        this.state.active == "chamada" ? styles.is_active : ""
                      )}
                      data-ref="chamada"
                    >
                      <a onClick={this.handleClickTab}>
                        <span className="is-size-6">
                          Territórios da Iniciativa BNDES Educação Conectada
                        </span>
                      </a>
                    </li> */}
                    {/* <li
                      className={classNames(
                        "espectro",
                        this.state.active == "demais" ? "is-active" : "",
                        this.state.active == "demais" ? styles.is_active : ""
                      )}
                      data-ref="demais"
                    >
                      <a onClick={this.handleClickTab}>
                        <span className="is-size-6">Demais Redes</span>
                      </a>
                    </li> */}
                  </ul>
                </div>
                <div
                  className={classNames(
                    "columns is-multiline is-marginless",
                    styles.conteudo
                  )}
                >
                  <div className="column is-full">
                    <h2>
                      <span className={styles.quantidade_total}>
                        {parse(
                          this.translate(
                            "DiagnosisTeacher.selfEvaluation.numberResponses"
                          )
                        )}
                        :{" "}
                        {this.state.loading.amount ? (
                          <BeatLoader
                            size={10}
                            color={"#babcbe"}
                            loading={true}
                          />
                        ) : (
                          this.state.total
                        )}
                      </span>
                    </h2>
                  </div>
                  <div className={classNames("column is-full", styles.resumo)}>
                    <div className="columns is-marginless">
                      <div className="column has-text-centered has-text-weight-bold is-uppercase">
                        {parse(
                          this.translate(
                            "DiagnosisTeacher.selfEvaluation.distributionTeachers"
                          )
                        )}
                      </div>
                    </div>
                    <div className="columns is-marginless">
                      {this.state.loading.area ? (
                        <div className="column">
                          <div className={styles.loading_center}>
                            <BounceLoader
                              size={50}
                              color={"#babcbe"}
                              loading={true}
                            />
                          </div>
                        </div>
                      ) : (
                        this.state.areas.map((area, index) => (
                          <div
                            key={area.referencia + index.toString()}
                            className={classNames(
                              "column has-text-centered",
                              styles[area.referencia]
                            )}
                          >
                            <h2>{area.titulo}</h2>
                            <ul className={styles.niveis}>
                              <li
                                className={classNames(
                                  "columns is-marginless",
                                  Math.round(area.niveis[4]) >= 70
                                    ? "has-text-white"
                                    : null
                                )}
                              >
                                <div
                                  className={styles.densidade}
                                  style={{
                                    opacity:
                                      parseFloat(
                                        Math.round(area.niveis[4]) / 100
                                      ) + 0.1,
                                  }}
                                ></div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right is-paddingless",
                                    styles.valor
                                  )}
                                >
                                  {Math.round(area.niveis[4])}%
                                </div>
                                <div
                                  className={classNames(
                                    "column is-9 has-text-left",
                                    styles.nivel
                                  )}
                                >
                                  {parse(
                                    this.translate(
                                      "DiagnosisTeacher.selfEvaluation.transformation"
                                    )
                                  )}
                                </div>
                              </li>
                              <li
                                className={classNames(
                                  "columns is-marginless",
                                  Math.round(area.niveis[3]) >= 70
                                    ? "has-text-white"
                                    : null
                                )}
                              >
                                <div
                                  className={styles.densidade}
                                  style={{
                                    opacity:
                                      parseFloat(
                                        Math.round(area.niveis[3]) / 100
                                      ) + 0.1,
                                  }}
                                ></div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right is-paddingless",
                                    styles.valor
                                  )}
                                >
                                  {Math.round(area.niveis[3])}%
                                </div>
                                <div
                                  className={classNames(
                                    "column is-9 has-text-left",
                                    styles.nivel
                                  )}
                                >
                                  {parse(
                                    this.translate(
                                      "DiagnosisTeacher.selfEvaluation.integration"
                                    )
                                  )}
                                </div>
                              </li>
                              <li
                                className={classNames(
                                  "columns is-marginless",
                                  Math.round(area.niveis[2]) >= 70
                                    ? "has-text-white"
                                    : null
                                )}
                              >
                                <div
                                  className={styles.densidade}
                                  style={{
                                    opacity:
                                      parseFloat(
                                        Math.round(area.niveis[2]) / 100
                                      ) + 0.1,
                                  }}
                                ></div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right is-paddingless",
                                    styles.valor
                                  )}
                                >
                                  {Math.round(area.niveis[2])}%
                                </div>
                                <div
                                  className={classNames(
                                    "column is-9 has-text-left",
                                    styles.nivel
                                  )}
                                >
                                  {parse(
                                    this.translate(
                                      "DiagnosisTeacher.selfEvaluation.adaptation"
                                    )
                                  )}
                                </div>
                              </li>
                              <li
                                className={classNames(
                                  "columns is-marginless",
                                  Math.round(area.niveis[1]) >= 70
                                    ? "has-text-white"
                                    : null
                                )}
                              >
                                <div
                                  className={styles.densidade}
                                  style={{
                                    opacity:
                                      parseFloat(
                                        Math.round(area.niveis[1]) / 100
                                      ) + 0.1,
                                  }}
                                ></div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right is-paddingless",
                                    styles.valor
                                  )}
                                >
                                  {Math.round(area.niveis[1])}%
                                </div>
                                <div
                                  className={classNames(
                                    "column is-9 has-text-left",
                                    styles.nivel
                                  )}
                                >
                                  {parse(
                                    this.translate(
                                      "DiagnosisTeacher.selfEvaluation.familiarization"
                                    )
                                  )}
                                </div>
                              </li>
                              <li
                                className={classNames(
                                  "columns is-marginless",
                                  Math.round(area.niveis[0]) >= 70
                                    ? "has-text-white"
                                    : null
                                )}
                              >
                                <div
                                  className={styles.densidade}
                                  style={{
                                    opacity:
                                      parseFloat(
                                        Math.round(area.niveis[0]) / 100
                                      ) + 0.1,
                                  }}
                                ></div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right is-paddingless",
                                    styles.valor
                                  )}
                                >
                                  {Math.round(area.niveis[0])}%
                                </div>
                                <div
                                  className={classNames(
                                    "column is-9 has-text-left",
                                    styles.nivel
                                  )}
                                >
                                  {parse(
                                    this.translate(
                                      "DiagnosisTeacher.selfEvaluation.exposure"
                                    )
                                  )}
                                </div>
                              </li>
                            </ul>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className={classNames("column is-full", styles.tabela)}>
                    <div className="columns is-marginless">
                      <div className="column has-text-centered has-text-weight-bold is-uppercase">
                        {parse(
                          this.translate(
                            "DiagnosisTeacher.selfEvaluation.distributionTeachersCompetency"
                          )
                        )}
                      </div>
                    </div>
                    <div className="columns is-marginless">
                      <div className="column">
                        {this.state.loading.competence ? (
                          <div className={styles.loading_center}>
                            <BounceLoader
                              size={50}
                              color={"#babcbe"}
                              loading={true}
                            />
                          </div>
                        ) : (
                          this.state.areas.map((area, index) => (
                            <div
                              key={area.referencia + index.toString()}
                              data-ref={area.referencia}
                              className="box"
                            >
                              <div className={classNames("columns")}>
                                <div
                                  className={classNames(
                                    "tabela column",
                                    area.referencia,
                                    styles[area.referencia],
                                    styles.tabela
                                  )}
                                >
                                  <div className={styles.coluna}>
                                    <div className="columns is-marginless">
                                      <div className="column is-half">
                                        <h2>{area.titulo}</h2>
                                      </div>
                                      <div
                                        className={classNames(
                                          "column is-half has-text-right",
                                          styles.ver_dados
                                        )}
                                      >
                                        <a
                                          className="button is-small"
                                          onClick={this.handleClickViewData}
                                        >
                                          {this.state.viewData ? (
                                            <span>
                                              <i className="far fa-eye-slash"></i>{" "}
                                              {parse(
                                                this.translate(
                                                  "DiagnosisTeacher.selfEvaluation.notDisplayValues"
                                                )
                                              )}
                                            </span>
                                          ) : (
                                            <span>
                                              <i className="far fa-eye"></i>{" "}
                                              {parse(
                                                this.translate(
                                                  "DiagnosisTeacher.selfEvaluation.displayValues"
                                                )
                                              )}
                                            </span>
                                          )}
                                        </a>
                                      </div>
                                    </div>
                                    <div className="columns is-marginless has-text-centered has-text-weight-bold">
                                      <div
                                        className={classNames(
                                          "column is-one-fifth",
                                          styles.ppi
                                        )}
                                      ></div>
                                      {area.competencias.map(
                                        (competencia, index) => (
                                          <div
                                            key={
                                              competencia.referencia +
                                              index.toString()
                                            }
                                            className={classNames(
                                              "column is-one-fifth",
                                              styles.ppi
                                            )}
                                          >
                                            <div className="break-word">
                                              {competencia.titulo}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                    {arrLevel.map((level) => (
                                      <div
                                        key={level.name + level.idx.toString()}
                                        className="columns is-marginless"
                                      >
                                        <div
                                          className={classNames(
                                            "column is-one-fifth",
                                            styles.nivel
                                          )}
                                        >
                                          <span>
                                            {level.idx}. {level.name}
                                          </span>
                                        </div>
                                        {area.competencias.map(
                                          (competencia) => (
                                            <div
                                              key={
                                                competencia.referencia +
                                                index.toString()
                                              }
                                              data-index={level.idx.toString()}
                                              data-name={competencia.referencia}
                                              className={classNames(
                                                "column is-one-fifth valor",
                                                styles.valor
                                              )}
                                            >
                                              <span
                                                className={styles.celula}
                                                style={{
                                                  opacity:
                                                    parseFloat(
                                                      competencia.valores[
                                                        level.idx - 1
                                                      ].porcentagem
                                                    ) + 0.1,
                                                }}
                                              ></span>
                                              <span
                                                className={classNames(
                                                  "numeros",
                                                  styles.numeros
                                                )}
                                                style={{
                                                  display: this.state.viewData
                                                    ? ""
                                                    : "none",
                                                }}
                                              >
                                                {
                                                  competencia.valores[
                                                    level.idx - 1
                                                  ].numero
                                                }
                                                <span
                                                  className={styles.porcentagem}
                                                >
                                                  {(
                                                    competencia.valores[
                                                      level.idx - 1
                                                    ].porcentagem * 100
                                                  ).toFixed(0)}
                                                  %
                                                </span>
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className={styles.legenda_densidade}>
                                <span className={styles.escala}></span>{" "}
                                {parse(
                                  this.translate(
                                    "DiagnosisTeacher.selfEvaluation.infoColor"
                                  )
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="column is-full">
                    <div className="columns is-marginless">
                      <div className="column has-text-centered has-text-weight-bold is-uppercase">
                        {parse(this.translate("DiagnosisTeacher.selfEvaluation.distributionAnswersByCityAndState"))}
                      </div>
                    </div>
                    <div className="columns is-marginless">
                      <div className="column">
                        {this.state.loading.demography ? (
                          <div className={styles.loading_center}>
                            <BounceLoader
                              size={50}
                              color={"#babcbe"}
                              loading={true}
                            />
                          </div>
                        ) : (
                          <Card
                            networks={this.state.networks}
                            source={this.state.source}
                            loading={this.state.loading.demography}
                          />
                        )}
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            )}
          </section>
        </Body>
      </Layout>
    );
  }
}

export default injectIntl(
  compose(APIDataContainer, NonUserRedir, NonAdminUserRedir)(SelfEvaluation)
);
