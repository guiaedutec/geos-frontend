import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import moment from "moment";
import Helmet from "react-helmet";
import Layout from "~/components/Layout";
import Body from "~/components/Body";
import styles from "./styles.styl";
import classNames from "classnames";
import { compose } from "redux";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import $ from "jquery";
import Radar from "react-d3-radar";
import {
  BounceLoader,
  BeatLoader,
  BarLoader,
  PropagateLoader,
} from "react-spinners";
import Modal from "~/components/Modal";
import stylesModal from "~/components/Modal/Modal.styl";
import ProfessionalFilters from "../self_evaluation/ProfessionalFilters";
import LocationFilters from "../self_evaluation/LocationFilters";

import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminRedir from "~/containers/non_admin_redir";
import { isStateAdmin, isCityAdmin } from "~/helpers/users";
import {
  getStages,
  getKnowledges,
  getEvaluationLevel,
} from "~/helpers/data_const";

import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import axios from "axios";
import CONF from "~/api/index";
import { getUserToken } from "~/api/utils";
import Select from "react-select";
import Table from "./table";

const arrLevel = getEvaluationLevel();

export class Devolutive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titulos: {
        PEDAGÓGICA: [
          "Prática Pedagógica",
          "Avaliação",
          "Personalização",
          "Curadoria e Criação",
        ],
        "CIDADANIA DIGITAL": [
          "Uso Responsável",
          "Uso Seguro",
          "Uso Crítico",
          "Inclusão",
        ],
        "DESENVOLVIMENTO PROFISSIONAL": [
          "Autodesenvolvimento",
          "Autoavaliação",
          "Compartilhamento",
          "Comunicação",
        ],
      },
      affiliation_id: "",
      province_id: "",
      state_id: "",
      city_id: "",
      country_id: "",
      provincesList: [],
      hasUser: false,
      statesList: [],
      citiesList: [],
      survey: [],
      hasSchools: false,
      startDate: new Date(),
      endDate: new Date(),
      total: 0,
      showModalTeachers: false,
      loadingTeachers: false,
      teachers: [],
      situacao: true,
      comparativo: false,
      planejamento: false,
      viewClass: styles.situacao,
      viewData: false,
      totalEstadual: 0,
      totalNacional: 0,
      regional: {
        cityName: "",
        stateName: "",
      },
      loading: {
        geral: true,
        filter: false,
        comparativo: true,
        radar: true,
      },
      filters: [],
      radarRede: {},
      radarEstadual: {},
      radarNacional: {},
      areas: [
        {
          referencia: "pedagogica",
          titulo: this.translate("DiagnosisTeacher.pedagogical"),
          niveis: Array(5).fill(0),
          quantidade: Array(5).fill(0),
          competencias: [
            {
              referencia: "pratica-pedagogica",
              titulo: this.translate("Devolutive.pedagogicalPractice"),
              hifienizacao: "Prática Pedagógica",
              valores: [
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
              ],
            },
            {
              referencia: "avaliacao",
              titulo: this.translate("Devolutive.evaluation"),
              hifienizacao: "Avaliação",
              valores: [
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
              ],
            },
            {
              referencia: "personalizacao",
              titulo: this.translate("Devolutive.customization"),
              hifienizacao: "Personalização",
              valores: [
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
              ],
            },
            {
              referencia: "curadoria-criacao",
              titulo: this.translate("Devolutive.criation"),
              hifienizacao: "Curadoria e Criação",
              valores: [
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
              ],
            },
          ],
        },
        {
          referencia: "cidadania",
          titulo: this.translate("DiagnosisTeacher.citizenship"),
          niveis: Array(5).fill(0),
          quantidade: Array(5).fill(0),
          competencias: [
            {
              referencia: "uso-responsavel",
              titulo: this.translate("Devolutive.responsible"),
              hifienizacao: "Uso Responsável",
              valores: [
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
              ],
            },
            {
              referencia: "uso-seguro",
              titulo: this.translate("Devolutive.safe"),
              hifienizacao: "Uso Seguro",
              valores: [
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
              ],
            },
            {
              referencia: "uso-critico",
              titulo: this.translate("Devolutive.critical"),
              hifienizacao: "Uso Crítico",
              valores: [
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
              ],
            },
            {
              referencia: "inclusao",
              titulo: this.translate("Devolutive.inclusion"),
              hifienizacao: "Inclusão",
              valores: [
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
              ],
            },
          ],
        },
        {
          referencia: "desenvolvimento",
          titulo: this.translate("DiagnosisTeacher.professionals"),
          niveis: Array(5).fill(0),
          quantidade: Array(5).fill(0),
          competencias: [
            {
              referencia: "autodesenvolvimento",
              titulo: this.translate("Devolutive.selfDevelopment"),
              hifienizacao: "Autodesen- volvimento",
              valores: [
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
              ],
            },
            {
              referencia: "autoavaliacao",
              titulo: this.translate("Devolutive.selfEvaluation"),
              hifienizacao: "Autoavaliação",
              valores: [
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
              ],
            },
            {
              referencia: "compartilhamento",
              titulo: this.translate("Devolutive.share"),
              hifienizacao: "Compartilha- mento",
              valores: [
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
              ],
            },
            {
              referencia: "comunicacao",
              titulo: this.translate("Devolutive.communication"),
              hifienizacao: "Comunicação",
              valores: [
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
                { numero: 0, porcentagem: 0, estados: 0, nacional: 0 },
              ],
            },
          ],
        },
      ],
    };
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.handleClickView = this.handleClickView.bind(this);
    this.handleClickViewData = this.handleClickViewData.bind(this);
    this.onClickFilter = this.onClickFilter.bind(this);
    this.onClickGetListTeachers = this.onClickGetListTeachers.bind(this);
    this.toggleViewCard = this.toggleViewCard.bind(this);
    this.updateProvince = this.updateProvince.bind(this);
    this.updateState = this.updateState.bind(this);
    this.updateCity = this.updateCity.bind(this);
  }

  updateProvince(province_id) {
    this.setState({ province_id });
  }
  updateState(state_id) {
    this.setState({ state_id });
  }
  updateCity(city_id) {
    this.setState({ city_id });
  }

  componentDidMount() {
    this.getSurveys();
  }

  componentDidUpdate = (prevProps) => {
    if (
      this.state.hasSchools === false &&
      this.props.apiData.schools &&
      this.props.apiData.schools.length !== 0
    ) {
      const provinces = this.props.apiData.schools.map((school) => {
        return {
          value: school.province_id.$oid
            ? school.province_id.$oid
            : school.province_id,
          label: school.province_name,
          name: school.province_id.$oid
            ? school.province_id.$oid
            : school.province_id,
        };
      });

      const uniqueProvinces = [
        ...new Map(
          provinces.map((province) => [province.value, province])
        ).values(),
      ];

      this.setState({
        provincesList: uniqueProvinces,
      });
      this.setState({ hasSchools: true });
    }

    if (
      this.state.hasUser === false &&
      prevProps.accounts.user === this.props.accounts.user
    ) {
      const user = this.props.accounts.user;

      const affiliation_id = user.affiliation_id && user.affiliation_id.$oid;
      const country_id = user.country_id && user.country_id.$oid;
      this.props.fetchSchoolsByAffiliationId(affiliation_id);
      this.setState({ affiliation_id, country_id });
      this.setState({ hasUser: true });
    }
  };

  getAvg = (arr, name) => {
    let avg = 0;
    let total = 0;

    if (!$.isEmptyObject(arr[name])) {
      Object.keys(arr[name]).forEach((key) => {
        avg += arr[name][key] * key;
        total += arr[name][key];
      });
    }
    return avg / (total > 0 ? total : 1);
  };

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
        if (surveys.data) {
          let surveyPersonal = [];
          let loading = _this.state.loading;
          loading.filter = false;

          surveys.data.surveys.forEach(function (survey) {
            if (survey.type === "personal") {
              surveyPersonal = survey;
            }
          });

          _this.setState(
            {
              survey: surveyPersonal,
              loading: loading,
            },
            () => {
              _this.getSelfEvaluationByArea();
            }
          );
        }
      });
  };

  getDataFromProfessionalFilters = () => {
    const stages_data = [];
    let stage_key = "";

    // stages
    for (let item of $("form").serializeArray()) {
      if (item.name === "teaching_stage") {
        stages_data.push(item.value);
      }
    }

    for (let stage of getStages(this.props)) {
      if (stages_data.includes(stage.value)) {
        stage_key = stage.key;
      }
    }

    // knowledge
    const knowledges_data = [];
    let knowledge_key = "";
    let knowledgesSelect = [];

    for (let item of $("form").serializeArray()) {
      if (item.name === "knowledge") {
        knowledges_data.push(item.value);
      }
    }

    for (let field of getKnowledges(this.props)) {
      const filteredOptions = field.options.filter((option) =>
        knowledges_data.includes(option.value)
      );
      filteredOptions.forEach((option) => knowledgesSelect.push(option));
    }
    knowledge_key =
      knowledgesSelect.length !== 0 ? knowledgesSelect[0].key : "" || "";

    const serializedArray = $("form").serializeArray();

    for (let index in $("form").serializeArray()) {
      if ($("form").serializeArray()[index].name === "teaching_stage") {
        serializedArray[index].value = stage_key;
      }
      if ($("form").serializeArray()[index].name === "knowledge") {
        serializedArray[index].value = knowledge_key;
      }
    }

    return serializedArray;
  };

  getSelfEvaluationByArea = () => {
    const _this = this;
    const { user } = _this.props.accounts;
    let schoolType = isCityAdmin(user) ? "Municipal" : "Estadual";
    const direccionRegionalId = _.get(user, "state_id.$oid");
    const direccionRegionalIdParam =
      isStateAdmin(user) && direccionRegionalId
        ? `direccion_regional_id=${direccionRegionalId}&`
        : "";

    this.setState({
      filters: $("form").serializeArray(),
    });

    const serializedArray = this.getDataFromProfessionalFilters();

    const serializedForm = serializedArray
      .map((param) => `${param.name}=${param.value}`)
      .join("&");

    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/distribution_by_area?survey_id=" +
          _this.state.survey.id +
          "&affiliation_id=" +
          this.state.affiliation_id +
          "&country_id=" +
          this.state.country_id +
          "&" +
          serializedForm +
          "&access_token=" +
          getUserToken()
      )
      .then(function (results) {
        let areas = _this.state.areas;
        let quntRespostas = !$.isEmptyObject(results.data)
          ? Object.values(Object.values(results.data)[0]).reduce(
              (total, num) => {
                return total + num;
              },
              0
            )
          : 0;

        _this.setState({
          total: quntRespostas,
        });

        let totalTemp = _this.state.total != 0 ? _this.state.total : 1;
        areas.forEach((area, index) => {
          let niveis = Array(5).fill(0);
          let quantidade = Array(5).fill(0);
          const titulos = [
            "PEDAGÓGICA",
            "CIDADANIA DIGITAL",
            "DESENVOLVIMENTO PROFISSIONAL",
          ];

          if (!$.isEmptyObject(results.data[titulos[index]])) {
            Object.keys(results.data[titulos[index]]).forEach((key) => {
              let val = results.data[titulos[index]][key];
              niveis[key - 1] = (val * 100) / totalTemp;
              quantidade[key - 1] = val;
            });
          }
          area.niveis = niveis;
          area.quantidade = quantidade;
        });

        _this.setState({
          areas: areas,
        });

        _this.getSelfEvaluationDetails();
      });
  };

  getSelfEvaluationDetails = () => {
    const _this = this;

    const serializedArray = this.getDataFromProfessionalFilters();

    const serializedForm = serializedArray
      .map((param) => `${param.name}=${param.value}`)
      .join("&");

    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/result_self_evaluation_details?survey_id=" +
          _this.state.survey.id +
          "&access_token=" +
          getUserToken() +
          "&" +
          serializedForm,
        {}
      )
      .then((results) => {
        let totalTemp = _this.state.total != 0 ? _this.state.total : 1;
        let areas = _this.state.areas;
        let loading = _this.state.loading;
        loading.geral = false;

        const titulos = this.state.titulos;

        areas.forEach((area, index1) => {
          area.competencias.forEach((competencia, index2) => {
            let result =
              results.data[
                "<H1>" +
                  Object.keys(titulos)[index1].toUpperCase() +
                  "</H1>" +
                  titulos[Object.keys(titulos)[index1]][index2].toUpperCase()
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

        _this.setState({
          areas: areas,
          loading: loading,
        });

        this.getSelfEvaluationSummary(results.data);

        if (isCityAdmin(_this.props.accounts.user)) {
          this.getSelfEvaluationDetailsStates();
        } else {
          this.getSelfEvaluationDetailsCountry();
        }
      });
  };

  getSelfEvaluationDetailsStates = () => {
    const _this = this;
    const serializedArray = this.getDataFromProfessionalFilters();

    const serializedForm = serializedArray
      .map((param) => `${param.name}=${param.value}`)
      .join("&");

    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/result_self_evaluation_details?level=estado&survey_id=" +
          _this.state.survey.id +
          "&access_token=" +
          getUserToken() +
          "&" +
          serializedForm,
        {}
      )
      .then((results) => {
        let quntRespostas = !$.isEmptyObject(results.data)
          ? Object.values(Object.values(results.data)[0]).reduce(
              (total, num) => {
                return total + num;
              },
              0
            )
          : 0;
        let totalTemp = quntRespostas != 0 ? quntRespostas : 1;
        let areas = _this.state.areas;
        const titulos = this.state.titulos;
        areas.forEach((area, index1) => {
          area.competencias.forEach((competencia, index2) => {
            let result =
              results.data[
                "<H1>" +
                  Object.keys(titulos)[index1].toUpperCase() +
                  "</H1>" +
                  titulos[Object.keys(titulos)[index1]][index2].toUpperCase()
              ];
            if (!$.isEmptyObject(result)) {
              competencia.valores.forEach((valor, i) => {
                if (result[i + 1]) {
                  valor.estados = result[i + 1] / totalTemp;
                }
              });
            }
          });
        });

        _this.setState({
          areas: areas,
          totalEstadual: quntRespostas,
        });

        this.getSelfEvaluationSummaryStates(results.data);
        this.getSelfEvaluationDetailsCountry();
      });
  };

  getSelfEvaluationDetailsCountry = () => {
    const _this = this;

    const serializedArray = this.getDataFromProfessionalFilters();

    const serializedForm = serializedArray
      .map((param) => `${param.name}=${param.value}`)
      .join("&");

    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/result_self_evaluation_details?level=pais&survey_id=" +
          _this.state.survey.id +
          "&access_token=" +
          getUserToken() +
          "&" +
          serializedForm,
        {}
      )
      .then((results) => {
        let quntRespostas = !$.isEmptyObject(results.data)
          ? Object.values(Object.values(results.data)[0]).reduce(
              (total, num) => {
                return total + num;
              },
              0
            )
          : 0;
        let totalTemp = quntRespostas != 0 ? quntRespostas : 1;
        let areas = _this.state.areas;
        let loading = _this.state.loading;

        loading.comparativo = false;
        const titulos = this.state.titulos;
        areas.forEach((area, index1) => {
          area.competencias.forEach((competencia, index2) => {
            let result =
              results.data[
                "<H1>" +
                  Object.keys(titulos)[index1].toUpperCase() +
                  "</H1>" +
                  titulos[Object.keys(titulos)[index1]][index2].toUpperCase()
              ];
            if (!$.isEmptyObject(result)) {
              competencia.valores.forEach((valor, i) => {
                if (result[i + 1]) {
                  valor.nacional = result[i + 1] / totalTemp;
                }
              });
            }
          });
        });

        _this.setState({
          areas: areas,
          loading: loading,
          totalNacional: quntRespostas,
        });

        this.getSelfEvaluationSummaryCountry(results.data);
      });
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  getSummaryValues = (data) => ({
    pratica_pedagogica: this.getAvg(
      data,
      "<H1>PEDAGÓGICA</H1>PRÁTICA PEDAGÓGICA"
    ),
    avaliacao: this.getAvg(data, "<H1>PEDAGÓGICA</H1>AVALIAÇÃO"),
    personalizacao: this.getAvg(data, "<H1>PEDAGÓGICA</H1>PERSONALIZAÇÃO"),
    curadoria_criacao: this.getAvg(
      data,
      "<H1>PEDAGÓGICA</H1>CURADORIA E CRIAÇÃO"
    ),
    uso_responsavel: this.getAvg(
      data,
      "<H1>CIDADANIA DIGITAL</H1>USO RESPONSÁVEL"
    ),
    uso_seguro: this.getAvg(data, "<H1>CIDADANIA DIGITAL</H1>USO SEGURO"),
    uso_critico: this.getAvg(data, "<H1>CIDADANIA DIGITAL</H1>USO CRÍTICO"),
    inclusao: this.getAvg(data, "<H1>CIDADANIA DIGITAL</H1>INCLUSÃO"),
    autodesenvolvimento: this.getAvg(
      data,
      "<H1>DESENVOLVIMENTO PROFISSIONAL</H1>AUTODESENVOLVIMENTO"
    ),
    autoavaliacao: this.getAvg(
      data,
      "<H1>DESENVOLVIMENTO PROFISSIONAL</H1>AUTOAVALIAÇÃO"
    ),
    compartilhamento: this.getAvg(
      data,
      "<H1>DESENVOLVIMENTO PROFISSIONAL</H1>COMPARTILHAMENTO"
    ),
    comunicacao: this.getAvg(
      data,
      "<H1>DESENVOLVIMENTO PROFISSIONAL</H1>COMUNICAÇÃO"
    ),
  });

  getSelfEvaluationSummary = (data) => {
    let radarRede = {
      key: "rede",
      label: "Minha Rede",
      values: this.getSummaryValues(data),
    };

    this.setState({
      radarRede: radarRede,
    });
  };

  getSelfEvaluationSummaryStates = (data) => {
    let radarEstadual = {
      key: "estadual",
      label: "Estadual",
      values: this.getSummaryValues(data),
    };

    this.setState({
      radarEstadual: radarEstadual,
    });
  };

  getSelfEvaluationSummaryCountry = (data) => {
    let radarNacional = {
      key: "nacional",
      label: "Estadual",
      values: this.getSummaryValues(data),
    };

    let loading = this.state.loading;
    loading.radar = false;

    this.setState({
      radarNacional: radarNacional,
      loading: loading,
    });
  };

  onClickFilter() {
    let areas = this.state.areas;
    let loading = this.state.loading;
    loading.geral = true;
    loading.comparativo = true;
    loading.radar = true;

    areas.forEach((area) => {
      area.competencias.forEach((competencia) => {
        competencia.valores.forEach((valor) => {
          valor.numero = 0;
          valor.porcentagem = 0;
          valor.estados = 0;
          valor.nacional = 0;
        });
      });
    });

    $(".box-estrategia").removeClass("selected");
    $(".planejamento").addClass("hidden");

    this.setState({
      areas: areas,
      loading: loading,
    });

    this.getSelfEvaluationByArea();
  }

  onClickGetListTeachers(e) {
    const _this = this;
    const { user } = _this.props.accounts;
    let schoolType = isCityAdmin(user) ? "Municipal" : "Estadual";
    let target =
      $(e.target).parents(".numeros").length == 0
        ? $(e.target)
        : $(e.target).parents(".numeros");

    _this.setState({
      showModalTeachers: true,
      loadingTeachers: true,
    });

    const serializedArray = this.getDataFromProfessionalFilters();

    const serializedForm = serializedArray
      .map((param) => `${param.name}=${param.value}`)
      .join("&");

    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/list_teachers_by_competences?survey_id=" +
          _this.state.survey.id +
          "&access_token=" +
          getUserToken() +
          "&network=" +
          schoolType +
          "&area=" +
          target.data("area") +
          "&competence=" +
          target.data("competencia") +
          "&nivel=" +
          target.data("nivel") +
          "&" +
          serializedForm,
        {}
      )
      .then(function (results) {
        let teachers = [];

        let anonymus = results.data.filter((r) => {
          return r.user_name == "Anônimo";
        });
        let nominal = results.data.filter((r) => {
          return r.user_name != "Anônimo";
        });

        nominal.forEach((r) => {
          teachers.push({
            school: r.school_name,
            name: r.user_name,
            email: r.email,
            stages: r.stages,
            knowledges: r.knowledges,
            results: r.results,
          });
        });

        anonymus.forEach((r) => {
          teachers.push({
            school: r.school_name,
            name: r.user_name,
            email: "-",
            stages: r.stages,
            knowledges: r.knowledges,
            results: r.results,
          });
        });

        _this.setState({
          loadingTeachers: false,
          teachers: teachers,
        });
      });
  }

  toggleViewCard(e) {
    let btn = $(e.target).parents("a");
    if ($(btn).hasClass("_180")) {
      $(btn).removeClass("_180");
    } else {
      $(btn).addClass("_180");
    }

    $(e.target)
      .parents(".card-collapse")
      .find(".toggle")
      .each(function () {
        if ($(this).hasClass("is-hidden")) {
          $(this).removeClass("is-hidden");
        } else {
          $(this).addClass("is-hidden");
        }
      });
  }

  updateSchools(city) {
    if (city) {
      const { user } = this.props.accounts;
      let schoolType = isCityAdmin(user) ? "Municipal" : "Estadual";

      setTimeout(() => {
        this.props.fetchCitySchools({
          city: city._id.$oid,
          type_school: schoolType,
        });
      }, 0);
    } else {
      this.props.apiData.schools.length = 0;
    }
  }

  handleClickViewData(e) {
    this.setState({
      viewData: !this.state.viewData,
    });
  }

  handleClickView(e) {
    $(".visualizacao a.button").removeClass("is-primary");
    $(e.target).addClass("is-primary");

    this.setState({
      viewClass: styles[e.target.dataset.id],
      situacao: e.target.dataset.id == "situacao" ? true : false,
      comparativo: e.target.dataset.id == "comparativo" ? true : false,
      planejamento: e.target.dataset.id == "planejamento" ? true : false,
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

  _closeModal() {
    this.setState({
      showModalTeachers: false,
    });
  }

  render() {
    const { user } = this.props.accounts;
    const { apiData } = this.props;
    const { isFetchingStateCities, isFetchingCitySchools } = apiData;

    apiData.cities.forEach((city) => {
      city.value = city._id.$oid;
      city.label = city.name;
    });

    apiData.schools.forEach((school) => {
      school.value = school.school_id;
      school.label = school.school_name;
    });

    var startDateSelected = this.state.filters.find((f) => f.name == "start");
    var endDateSelected = this.state.filters.find((f) => f.name == "end");
    var networkType = isCityAdmin(user) ? "Municipal" : "Estadual";
    var cityName =
      this.props.apiData.schools.length > 0 && isCityAdmin(user)
        ? this.props.apiData.schools[0].school_city
        : "";
    var stateName =
      this.props.apiData.schools.length > 0 && isCityAdmin(user)
        ? this.props.apiData.schools[0].school_state
        : user && !this.props.accounts.isSigningIn
        ? user.institution && user.institution.ente
        : "";
    var amountTeachersAt = _.get(user, "institution.amount_teachers.a_t");
    var teacherPercents =
      user && !this.props.accounts.isSigningIn && amountTeachersAt
        ? ((this.state.total * 100) / amountTeachersAt).toFixed(2)
        : 0;

    var summary = {
      title: (
        <h1 className="is-uppercase">
          DEVOLUTIVA DA{" "}
          {user && !this.props.accounts.isSigningIn
            ? user.institution && user.institution.name
            : ""}{" "}
          {isCityAdmin(user) ? "(" + stateName + ")" : ""} - AUTOAVALIAÇÃO DE
          COMPETÊNCIAS DIGITAIS DE PROFESSORES (AS)
        </h1>
      ),
      paragraphs: [
        <span>
          {parse(this.translate("Devolutive.summary.between"))}{" "}
          <strong>
            {startDateSelected && startDateSelected.value != ""
              ? startDateSelected.value
              : ""}
          </strong>{" "}
          {parse(this.translate("Devolutive.summary.and"))}{" "}
          <strong>
            {endDateSelected && endDateSelected.value != ""
              ? endDateSelected.value
              : ""}
          </strong>
          , <strong>{this.state.total}</strong>{" "}
          {parse(this.translate("Devolutive.summary.teachers"))}{" "}
          {user && !this.props.accounts.isSigningIn
            ? parse(this.translate("Devolutive.summary.relation1")) +
              " " +
              teacherPercents +
              parse(this.translate("Devolutive.summary.relation2"))
            : ""}
          , {parse(this.translate("Devolutive.summary.info"))}
        </span>,
        <span className="is-size-7 is-italic">
          *{parse(this.translate("Devolutive.summary.obs"))}
        </span>,
        <span>
          {parse(this.translate("Devolutive.summary.thisDevolutive"))}{" "}
          {user && !this.props.accounts.isSigningIn
            ? user.institution && user.institution.name
            : ""}{" "}
          {parse(this.translate("Devolutive.summary.info2"))}
        </span>,
        <span>{parse(this.translate("Devolutive.summary.report"))}:</span>,
        <div className={styles.visions}>
          <div>
            <strong>
              A) {parse(this.translate("Devolutive.summary.networkStatus"))}
            </strong>
            , {parse(this.translate("Devolutive.summary.teacherDstribution"))}
          </div>
          <div>
            <strong>
              B){" "}
              {parse(this.translate("Devolutive.summary.networkComparative"))}
            </strong>
            , {parse(this.translate("Devolutive.summary.countryComparative"))}
          </div>
        </div>,
        <span>{parse(this.translate("Devolutive.summary.info3"))}</span>,
      ],
    };

    return (
      <Layout pageHeader={this.translate("Devolutive.title")}>
        <Helmet title={this.translate("Devolutive.title")} />
        <Body>
          <section className="section">
            <div
              className={classNames(
                "devolutiva container mb-50",
                styles.container,
                styles.devolutiva,
                styles.filtros_container
              )}
            >
              {!this.state.loading.filter ? (
                <form id="filters" className="card card-collapse">
                  <header className="card-header">
                    <a
                      onClick={this.toggleViewCard}
                      className="card-header-icon rotate"
                      aria-label="more options"
                    >
                      <span className="icon">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </a>
                    <p className="card-header-title">
                      {parse(this.translate("Devolutive.filters"))}
                    </p>
                  </header>
                  <div className="card-content toggle is-hidden">
                    <div className="content">
                      <LocationFilters
                        provincesList={this.state.provincesList}
                        statesList={this.state.statesList}
                        citiesList={this.state.citiesList}
                        updateProvince={this.updateProvince}
                        updateState={this.updateState}
                        updateCity={this.updateCity}
                      />
                      <ProfessionalFilters />
                      <div className={classNames("columns")}>
                        <div
                          className={classNames("column is-4", styles.campos)}
                        >
                          <strong className={classNames("label", styles.label)}>
                            {parse(this.translate("Devolutive.analisePeriod"))}
                          </strong>
                          <DatePicker
                            className="input"
                            id={"start_date"}
                            // dateFormatCalendar={"dd/mm/yyyy"}
                            dateFormat="dd/MM/yyyy"
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            selected={this.state.startDate}
                            selectsStart
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleChangeStart}
                            name="start"
                          />
                        </div>
                        <div
                          className={classNames("column is-4", styles.campos)}
                        >
                          <strong className={classNames("label", styles.label)}>
                            {parse(this.translate("Devolutive.to"))}
                          </strong>
                          <DatePicker
                            className="input"
                            id={"end_date"}
                            // dateFormatCalendar={"dd/mm/yyyy"}
                            dateFormat="dd/MM/yyyy"
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            selected={this.state.endDate}
                            selectsEnd
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleChangeEnd}
                            name="end"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <footer className="card-footer toggle is-hidden">
                    <a
                      className={classNames(
                        "card-footer-item button is-primary is-radiusless"
                        // {
                        //   "is-loading": this.state.loading.geral,
                        // }
                      )}
                      onClick={this.onClickFilter}
                    >
                      {parse(this.translate("Devolutive.applyFilter"))}
                    </a>
                  </footer>
                </form>
              ) : null}
            </div>
            <div
              className={classNames(
                "devolutiva container",
                styles.container,
                styles.devolutiva
              )}
            >
              <div className={classNames("columns is-multiline", styles.total)}>
                {!this.state.loading.geral && summary && (
                  <div className={classNames("column is-full", styles.summary)}>
                    {summary.paragraphs.map((item, index) => (
                      <p
                        key={"summary" + index.toString()}
                        className={styles.paragraph}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                )}
                <div className="column is-full">
                  <div
                    className={classNames("notification", styles.notification)}
                  >
                    {this.state.loading.geral ? (
                      <div>
                        <div className="mb-20">
                          {parse(this.translate("Devolutive.loading"))}
                        </div>
                        <BarLoader
                          width={"100%"}
                          color={"#babcbe"}
                          loading={true}
                        />
                      </div>
                    ) : (
                      <span>
                        <FormattedMessage
                          id="Devolutive.teachersAnswers"
                          values={{
                            total: (
                              <span className={styles.quantidade}>
                                {this.state.total}
                              </span>
                            ),
                          }}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classNames(
                "devolutiva visualizacao container",
                styles.container,
                styles.devolutiva
              )}
              style={{ display: this.state.loading.geral ? "none" : "" }}
            >
              <h2 className="is-size-5 has-text-weight-bold mt-15 mb-10">
                {parse(this.translate("Devolutive.dataVisualization"))}
              </h2>
              <p className={classNames(styles.infos, "mb-15")}>
                {parse(this.translate("Devolutive.selectVisualizationType"))}
              </p>
              <div className="columns">
                <div className="column is-6">
                  <article
                    className={classNames("message", styles.tipo_visualizacao)}
                  >
                    <div className="message-header">
                      <a
                        className={classNames(
                          "button is-primary is-fullwidth",
                          styles.botao
                        )}
                        data-id="situacao"
                        onClick={this.handleClickView}
                      >
                        {this.translate("Devolutive.currentSituation")}
                      </a>
                    </div>
                    <div className="message-body">
                      {parse(this.translate("Devolutive.generalInfo"))}
                    </div>
                  </article>
                </div>
                <div className="column is-6">
                  <article
                    className={classNames("message", styles.tipo_visualizacao)}
                  >
                    <div className="message-header">
                      <a
                        className={classNames(
                          "button is-fullwidth",
                          styles.botao
                        )}
                        data-id="comparativo"
                        onClick={this.handleClickView}
                      >
                        {this.translate("Devolutive.comparative")}
                      </a>
                    </div>
                    <div className="message-body">
                      {parse(this.translate("Devolutive.networkComparison"))}
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>
          <section
            className={classNames(
              "section conteudo",
              styles.section,
              styles.conteudo,
              this.state.viewClass
            )}
          >
            {
              // SITUAÇÃO ATUAL
              this.state.situacao
                ? [
                    <div
                      className={classNames(
                        "devolutiva container",
                        styles.container,
                        styles.devolutiva,
                        styles.resumo
                      )}
                      style={{
                        display: this.state.loading.geral ? "none" : "",
                      }}
                    >
                      <hr />
                      <div className="columns is-marginless">
                        <div className="column has-text-centered has-text-weight-bold is-uppercase">
                          {parse(
                            this.translate(
                              "Devolutive.teachersDistributionArea"
                            )
                          )}
                        </div>
                      </div>
                      <div className="columns is-marginless">
                        {this.state.areas.map((area, index) => (
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
                                    "column is-6 has-text-left",
                                    styles.nivel
                                  )}
                                >
                                  {parse(
                                    this.translate("Devolutive.transformation")
                                  )}
                                </div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right",
                                    styles.valor
                                  )}
                                >
                                  {area.quantidade[4]}
                                </div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right",
                                    styles.valor
                                  )}
                                >
                                  {Math.round(area.niveis[4])}%
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
                                    "column is-6 has-text-left",
                                    styles.nivel
                                  )}
                                >
                                  {parse(
                                    this.translate("Devolutive.integration")
                                  )}
                                </div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right",
                                    styles.valor
                                  )}
                                >
                                  {area.quantidade[3]}
                                </div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right",
                                    styles.valor
                                  )}
                                >
                                  {Math.round(area.niveis[3])}%
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
                                    "column is-6 has-text-left",
                                    styles.nivel
                                  )}
                                >
                                  {parse(
                                    this.translate("Devolutive.adaptation")
                                  )}
                                </div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right",
                                    styles.valor
                                  )}
                                >
                                  {area.quantidade[2]}
                                </div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right",
                                    styles.valor
                                  )}
                                >
                                  {Math.round(area.niveis[2])}%
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
                                    "column is-6 has-text-left",
                                    styles.nivel
                                  )}
                                >
                                  {parse(
                                    this.translate("Devolutive.familiarization")
                                  )}
                                </div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right",
                                    styles.valor
                                  )}
                                >
                                  {area.quantidade[1]}
                                </div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right",
                                    styles.valor
                                  )}
                                >
                                  {Math.round(area.niveis[1])}%
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
                                    "column is-6 has-text-left",
                                    styles.nivel
                                  )}
                                >
                                  {parse(this.translate("Devolutive.exposure"))}
                                </div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right",
                                    styles.valor
                                  )}
                                >
                                  {area.quantidade[0]}
                                </div>
                                <div
                                  className={classNames(
                                    "column is-3 has-text-right",
                                    styles.valor
                                  )}
                                >
                                  {Math.round(area.niveis[0])}%
                                </div>
                              </li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>,
                    <div
                      className={classNames(
                        "devolutiva situacao container",
                        styles.container,
                        styles.devolutiva
                      )}
                      data-ref="situacao"
                      style={{
                        display: this.state.loading.geral ? "none" : "",
                      }}
                    >
                      <hr />
                      <div className="columns is-marginless">
                        <div className="column has-text-centered has-text-weight-bold is-uppercase">
                          {parse(
                            this.translate(
                              "Devolutive.teachersDistributionCompetence"
                            )
                          )}
                        </div>
                      </div>
                      <div className="columns">
                        <div className="column">
                          {this.state.areas.map((area, index) => (
                            <div
                              key={area.referencia + index.toString()}
                              className={classNames(
                                "devolutiva box",
                                styles.container,
                                styles.devolutiva
                              )}
                              data-ref={area.referencia}
                              style={{
                                display: this.state.loading.geral ? "none" : "",
                              }}
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
                                                  "Devolutive.notDisplayValues"
                                                )
                                              )}
                                            </span>
                                          ) : (
                                            <span>
                                              <i className="far fa-eye"></i>{" "}
                                              {parse(
                                                this.translate(
                                                  "Devolutive.displayValuesChart"
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
                                              {competencia.valores[
                                                level.idx - 1
                                              ].numero === 0 ? (
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
                                                    className={
                                                      styles.porcentagem
                                                    }
                                                  >
                                                    {(
                                                      competencia.valores[
                                                        level.idx - 1
                                                      ].porcentagem * 100
                                                    ).toFixed(0)}
                                                    %
                                                  </span>
                                                </span>
                                              ) : (
                                                <a
                                                  onClick={
                                                    this.onClickGetListTeachers
                                                  }
                                                  data-area={area.titulo}
                                                  data-competencia={
                                                    competencia.titulo
                                                  }
                                                  data-nivel={level.idx}
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
                                                    className={
                                                      styles.porcentagem
                                                    }
                                                  >
                                                    {(
                                                      competencia.valores[
                                                        level.idx - 1
                                                      ].porcentagem * 100
                                                    ).toFixed(0)}
                                                    %
                                                  </span>
                                                </a>
                                              )}
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
                                {parse(this.translate("Devolutive.infoColor"))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>,
                  ]
                : null
            }
            {
              // COMPARATIVO
              this.state.comparativo
                ? [
                    <div
                      className={classNames(
                        "devolutiva subfiltro_grafico",
                        styles.container,
                        styles.devolutiva,
                        styles.subfiltro_grafico
                      )}
                    >
                      <hr />
                      <div className="columns is-marginless">
                        <div className="column has-text-centered has-text-weight-bold is-uppercase">
                          {parse(
                            this.translate(
                              "Devolutive.comparasionEducationNetworks"
                            )
                          )}
                        </div>
                      </div>
                      <div
                        className={classNames("columns", styles.total)}
                        style={{
                          display: this.state.loading.radar ? "none" : "",
                        }}
                      >
                        <div className="column">
                          <div
                            className={classNames(
                              "notification",
                              styles.notification
                            )}
                          >
                            <div>
                              {parse(
                                this.translate(
                                  "Devolutive.totalAnsweredNetwork"
                                )
                              )}
                              {": "}
                              <span className={styles.quantidade}>
                                {this.state.totalNacional}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="columns">
                        <div className="column">
                          <div className={styles.grafico}>
                            {this.state.loading.radar ? (
                              <div className={styles.loading}>
                                <BounceLoader
                                  color={"#85c440"}
                                  loading={true}
                                />
                                <div className={styles.text}>
                                  {parse(this.translate("Devolutive.loading"))}
                                </div>
                              </div>
                            ) : (
                              <Radar
                                width={580}
                                height={340}
                                padding={50}
                                domainMax={5}
                                highlighted={null}
                                data={{
                                  variables: [
                                    {
                                      key: "pratica_pedagogica",
                                      label: this.translate(
                                        "Devolutive.pedagogicalPractice"
                                      ),
                                    },
                                    {
                                      key: "avaliacao",
                                      label: this.translate(
                                        "Devolutive.evaluation"
                                      ),
                                    },
                                    {
                                      key: "personalizacao",
                                      label: this.translate(
                                        "Devolutive.customization"
                                      ),
                                    },
                                    {
                                      key: "curadoria_criacao",
                                      label: this.translate(
                                        "Devolutive.criation"
                                      ),
                                    },
                                    {
                                      key: "uso_responsavel",
                                      label: this.translate(
                                        "Devolutive.responsible"
                                      ),
                                    },
                                    {
                                      key: "uso_seguro",
                                      label: this.translate("Devolutive.safe"),
                                    },
                                    {
                                      key: "uso_critico",
                                      label: this.translate(
                                        "Devolutive.critical"
                                      ),
                                    },
                                    {
                                      key: "inclusao",
                                      label: this.translate(
                                        "Devolutive.inclusion"
                                      ),
                                    },
                                    {
                                      key: "autodesenvolvimento",
                                      label: this.translate(
                                        "Devolutive.selfDevelopment"
                                      ),
                                    },
                                    {
                                      key: "autoavaliacao",
                                      label: this.translate(
                                        "Devolutive.selfEvaluation"
                                      ),
                                    },
                                    {
                                      key: "compartilhamento",
                                      label: this.translate("Devolutive.share"),
                                    },
                                    {
                                      key: "comunicacao",
                                      label: this.translate(
                                        "Devolutive.communication"
                                      ),
                                    },
                                  ],
                                  sets: [
                                    this.state.radarRede,
                                    this.state.radarEstadual,
                                    this.state.radarNacional,
                                  ],
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div className={classNames("column", styles.legenda)}>
                          {isCityAdmin(this.props.accounts.user) ? (
                            <span>
                              {parse(
                                this.translate("Devolutive.municipalTeachers")
                              )}
                            </span>
                          ) : (
                            <span>
                              {parse(
                                this.translate("Devolutive.stateTeachers")
                              )}
                            </span>
                          )}
                          <h3>
                            {parse(this.translate("Devolutive.subtitle"))}:
                          </h3>
                          {isCityAdmin(this.props.accounts.user) ? (
                            <ul className={styles.bullets}>
                              <li>
                                <span
                                  className={classNames(
                                    styles.dados,
                                    styles.rede
                                  )}
                                ></span>
                                {parse(
                                  this.translate("Devolutive.municipalNetwork")
                                )}
                              </li>
                              <li>
                                <span
                                  className={classNames(
                                    styles.dados,
                                    styles.estados
                                  )}
                                ></span>
                                {parse(
                                  this.translate(
                                    "Devolutive.municipalStateNetwork"
                                  )
                                )}
                              </li>
                              <li>
                                <span
                                  className={classNames(
                                    styles.dados,
                                    styles.nacional
                                  )}
                                ></span>
                                {parse(
                                  this.translate(
                                    "Devolutive.municipalStateCountryNetwork"
                                  )
                                )}
                              </li>
                            </ul>
                          ) : (
                            <ul className={styles.bullets}>
                              <li>
                                <span
                                  className={classNames(
                                    styles.dados,
                                    styles.rede
                                  )}
                                ></span>
                                {parse(
                                  this.translate("Devolutive.stateNetwork")
                                )}
                              </li>
                              <li>
                                <span
                                  className={classNames(
                                    styles.dados,
                                    styles.nacional
                                  )}
                                ></span>
                                {parse(
                                  this.translate(
                                    "Devolutive.stateCountryNetwork"
                                  )
                                )}
                              </li>
                            </ul>
                          )}
                          <h3>
                            {parse(
                              this.translate("Devolutive.settlementLevel")
                            )}
                            :
                          </h3>
                          <ul>
                            {arrLevel
                              .slice(0)
                              .reverse()
                              .map((level) => (
                                <li key={level.name + level.idx.toString()}>
                                  {level.idx} - {level.name}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>,
                    <div className="container">
                      <div className="columns is-marginless">
                        <div className="column has-text-centered has-text-weight-bold is-uppercase">
                          {parse(
                            this.translate("Devolutive.comparativeNetwork")
                          )}
                        </div>
                      </div>
                    </div>,
                    <div className="container">
                      {this.state.areas.map((area, index) => (
                        <div
                          key={area.referencia + index.toString()}
                          className={classNames(
                            "devolutiva box",
                            styles.container,
                            styles.devolutiva
                          )}
                          data-ref={area.referencia}
                          style={{
                            display: this.state.loading.geral ? "none" : "",
                          }}
                        >
                          <div className={classNames("columns", styles.not_mb)}>
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
                                  <div className="column">
                                    <h2>{area.titulo}</h2>
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
                                    {area.competencias.map((competencia) => (
                                      <div
                                        key={
                                          competencia.referencia +
                                          index.toString()
                                        }
                                        data-index={level.idx.toString()}
                                        data-name={competencia.referencia}
                                        className={classNames(
                                          "column is-one-fifth valor",
                                          styles.valor,
                                          competencia.valores[level.idx - 1]
                                            .objetivo
                                            ? styles.objetivo
                                            : ""
                                        )}
                                      >
                                        <div className={styles.comparacao}>
                                          {this.state.loading.comparativo ? (
                                            <div className={styles.loading}>
                                              <BeatLoader
                                                size={10}
                                                color={"#D3D5D7"}
                                                loading={true}
                                              />
                                            </div>
                                          ) : (
                                            <ul>
                                              <li
                                                className={styles.r}
                                                style={{
                                                  width:
                                                    (
                                                      competencia.valores[
                                                        level.idx - 1
                                                      ].porcentagem * 100
                                                    ).toFixed(0) + "%",
                                                }}
                                              >
                                                {(
                                                  competencia.valores[
                                                    level.idx - 1
                                                  ].porcentagem * 100
                                                ).toFixed(0)}
                                                %
                                              </li>
                                              {isCityAdmin(
                                                this.props.accounts.user
                                              ) ? (
                                                <li
                                                  className={styles.e}
                                                  style={{
                                                    width:
                                                      (
                                                        competencia.valores[
                                                          level.idx - 1
                                                        ].estados * 100
                                                      ).toFixed(0) + "%",
                                                  }}
                                                >
                                                  {(
                                                    competencia.valores[
                                                      level.idx - 1
                                                    ].estados * 100
                                                  ).toFixed(0)}
                                                  %
                                                </li>
                                              ) : null}
                                              <li
                                                className={styles.n}
                                                style={{
                                                  width:
                                                    (
                                                      competencia.valores[
                                                        level.idx - 1
                                                      ].nacional * 100
                                                    ).toFixed(0) + "%",
                                                }}
                                              >
                                                {(
                                                  competencia.valores[
                                                    level.idx - 1
                                                  ].nacional * 100
                                                ).toFixed(0)}
                                                %
                                              </li>
                                            </ul>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {isCityAdmin(this.props.accounts.user) ? (
                            <ul className={styles.legenda_comparativo}>
                              <li className={styles.item}>
                                <p className={styles.rede}>
                                  {parse(
                                    this.translate(
                                      "Devolutive.municipalNetwork"
                                    )
                                  )}
                                </p>
                              </li>
                              <li className={styles.item}>
                                <p className={styles.estados}>
                                  {parse(
                                    this.translate(
                                      "Devolutive.municipalStateNetwork"
                                    )
                                  )}
                                </p>
                              </li>
                              <li className={styles.item}>
                                <p className={styles.nacional}>
                                  {parse(
                                    this.translate(
                                      "Devolutive.municipalStateCountryNetwork"
                                    )
                                  )}
                                </p>
                              </li>
                            </ul>
                          ) : (
                            <ul className={styles.legenda_comparativo}>
                              <li className={styles.item}>
                                <p className={styles.rede}>
                                  {parse(
                                    this.translate("Devolutive.stateNetwork")
                                  )}
                                </p>
                              </li>
                              <li className={styles.item}>
                                <p className={styles.nacional}>
                                  {parse(
                                    this.translate(
                                      "Devolutive.stateCountryNetwork"
                                    )
                                  )}
                                </p>
                              </li>
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>,
                  ]
                : null
            }
          </section>
        </Body>
        <Modal
          isActive={this.state.showModalTeachers}
          title="Lista de Professores"
          closeModal={() => this._closeModal()}
          hideFooter={true}
          classNameCard={classNames(stylesModal.modal__card__lg)}
          children={
            this.state.loadingTeachers ? (
              <div className={styles.loading_teachers}>
                <PropagateLoader color={"#babcbe"} loading={true} />
              </div>
            ) : (
              <Table teachers={this.state.teachers} />
            )
          }
        />
      </Layout>
    );
  }
}

Devolutive.propTypes = {
  apiData: PropTypes.object,
};

export default injectIntl(
  compose(NonUserRedir, NonAdminRedir, APIDataContainer)(Devolutive)
);
