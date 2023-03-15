import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { compose } from "redux";
import { connect } from "react-redux";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import APIDataContainer from "~/containers/api_data";
import AccountsContainer from "~/containers/accounts";
import NonUserRedir from "~/containers/non_user_redir";

import API from "~/api";
import schema from "./schema";
import Field from "~/components/Form/Field";
import stylesField from "~/components/Form/Field.styl";
import FieldSelect from "~/components/Form/FieldSelect";
import FieldSimpleSelect from "~/components/Form/FieldSimpleSelect";
import FieldRadio from "~/components/Form/FieldRadio";
import Layout from "~/components/Layout";
import Body from "~/components/Body";
import SignUpFormPrincipalFields from "~/pages/signup/components/SignUpForm/PrincipalFields";
import FieldCreatableSelect from "~/components/Form/FieldCreatableSelect";
import { removeCPFMask } from "~/helpers/form";
import SubmitBtn from "~/components/SubmitBtn";
import {
  getStages,
  getKnowledges,
  getFormation,
  getDevices,
  getComputerFrequency,
  getUseTechnologies,
} from "~/helpers/data_const";

import { omitFieldProperties } from "~/helpers/redux-form-fields";

import { isAdmin } from "~/helpers/users";
import ReactModal from "react-modal";

import classNames from "classnames";
import styles from "./styles.styl";
import { reduxForm } from "redux-form";
import CONF from "~/api/index";
import { getUserToken } from "~/api/utils";

import _ from "lodash";
import validate from "validate.js";
import axios from "axios";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import $ from "jquery";
import stylesModal from "../../components/Modal/Modal.styl";
import history from "~/core/history";

const updateUser = (values, affiliation_id) => {
  let user = {
    /* eslint-disable camelcase */
    _id: values._id,
    name: values.name,
    cpf: values.cpf,
    born: values.born,
    affiliation_id: affiliation_id,
    country_id: values.country,
    province_id: values.province,
    state_id: values.state,
    city_id: values.city,
    profile: values.profile,
    school_id: values.school._id.$oid,
    institution: values.institution,
    school_type: values.school_type,
    stages: values.stages,
    knowledges: values.knowledges,
    sharing: values.sharing,
    formation: values.formation,
    formation_level: values.formation_level,
    geo_structure_level1_name: "",
    geo_structure_level2_name: "",
    geo_structure_level3_name: "",
    geo_structure_level4_name: "",
  };

  if (values.profile === "teacher") {
    user = {
      ...user,
      gender: values.gender,
      initial_formation: values.initial_formation.value,
      institution_initial_formation: values.institution_initial_formation.value,
      internship_practice: values.internship_practice.value,
      technology_in_teaching_and_learning:
        values.technology_in_teaching_and_learning,
      course_modality: values.course_modality,
      final_year_of_initial_formation: values.final_year_of_initial_formation,
      teacher_data: {
        formation_level: values.formation_level.value,
        cont_educ_in_the_use_of_digital_technologies:
          values.cont_educ_in_the_use_of_digital_technologies.value,
        years_teaching: values.years_teaching.value,
        years_of_uses_technology_for_teaching:
          values.years_of_uses_technology_for_teaching.value,
        technology_application: values.technology_application,
      },
    };
  }

  return API.Users.patch(user);
};

const getUser = (id) => {
  return API.Users.find(id);
};

class EditUser extends React.Component {
  constructor() {
    super();
    this.state = {
      maxDate: moment().subtract(10, "years"),
      born: new Date(),
      stages: [],
      knowledges: [],
      knowledgesDyn: [],
      knowledgesSelect: [],
      formationAnswers: false,
      formation_level: [],
      formationLevelDyn: [],
      setUser: false,
      sharingAnswers: true,
      updateStatus: "none",
      user: null,
      adminStateOrCity: false,
      disabledAdmin: false,
      disabledState: false,
      disabledCity: false,
      disabledSchool: false,
      hasUser: false,
      geo_structure_level1_name: "",
      geo_structure_level2_name: "",
      geo_structure_level3_name: "",
      geo_structure_level4_name: "",
      showModal: false,
      user_id: "",
      stages_keys: [],
      knowledges_keys: [],
      initial_formation_options: [],
      institution_initial_formation_options: [],
      survey_id: null,
      survey_response_id: null,
      have_response: false,
    };
    this.remove = this.remove.bind(this);
    this._logout = this._logout.bind(this);
    this.setInitialFormation = this.setInitialFormation.bind(this);
  }

  async fetchSurveys() {
    const response = await axios.get(
      CONF.ApiURL + "/api/v1/survey/surveys_list?access_token=" + getUserToken()
    );
    const survey = response.data.surveys.find(
      (survey) => survey.type === "personal"
    );
    if (!survey) return;
    this.setState({ survey_id: survey.id });
  }

  async remove() {
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/users/${this.state.user_id}.json?access_token=${getUserToken()}`;

    try {
      await axios.delete(URL_REQUEST, {
        data: { user: { _id: this.state.user_id } },
      });
      this.setState({ showModal: !this.state.showModal });
      this._logout();
    } catch (error) {
      console.log(error);
    }
  }

  _logout() {
    API.Users.logout();
    history.push("/");
  }

  showModal = (id) => {
    this.setState({ showModal: !this.state.showModal });
  };

  showProfessionalsData = () => {
    return (
      this.isUserWithoutLinks() === false ||
      this.props.accounts.user._profile !== "principal"
    );
  };

  isUserWithoutLinks = () => {
    const isUserWithoutLinks =
      this.props.accounts.user &&
      this.props.accounts.user.affiliation_name ===
        "Dummy Affiliation For Unaffiliated Users";

    return isUserWithoutLinks;
  };

  formatStagesOrKnowledges = (values) => {
    const newStages = values.map((value) => {
      return { label: value, value: value };
    });
    return newStages;
  };

  async fetchResponses() {
    const response = await axios.get(
      CONF.ApiURL +
        "/api/v1/survey/responses_user/" +
        this.state.survey_id +
        "?access_token=" +
        getUserToken()
    );

    this.setState(
      { survey_response_id: response.data.response._id.$oid },
      () => {
        const { user } = this.props.accounts;
        if (
          user.teacher_data &&
          !user.teacher_data[this.state.survey_response_id]
        ) {
          this.setState({ showModalUpdateTeacherData: true });
        }

        if (!user.teacher_data) {
          this.setState({ showModalUpdateTeacherData: true });
        }
      }
    );
  }

  populateForm = () => {
    const user = this.props.accounts && this.props.accounts.user;

    if (Object.keys(user).length !== 0) {
      const country_id =
        user.country_id && user.country_id.$oid
          ? user.country_id.$oid
          : user.country_id;
      const province_id =
        user.province_id && user.province_id.$oid
          ? user.province_id.$oid
          : user.province_id;
      const state_id =
        user.state_id && user.state_id.$oid
          ? user.state_id.$oid
          : user.state_id;
      const city_id =
        user.city_id && user.city_id.$oid ? user.city_id.$oid : user.city_id;
      const school_id =
        user.school_id && user.school_id.$oid
          ? user.school_id.$oid
          : user.school_id;

      if (!this.isUserWithoutLinks() && country_id) {
        this.updateGeographicElements(country_id);
        this.props.fetchProvinces(country_id);
        this.props.fetchStates(country_id, province_id);
        this.props.fetchCities(country_id, province_id, state_id);
        this.props.fetchSchools(country_id, province_id, state_id, city_id);
      }

      this.props.fields.name.onChange(user.name);
      this.props.fields.is_admin &&
        this.props.fields.is_admin.onChange(isAdmin(this.props.accounts.user));
      this.props.fields.cpf.onChange(user.cpf);
      this.props.fields.born.onChange(new Date(user.born));
      this.props.fields.email.onChange(user.email);
      this.props.fields.country.onChange(country_id);
      this.props.fields.province.onChange(province_id);
      this.props.fields.state.onChange(state_id);
      this.props.fields.city.onChange(city_id);
      this.props.fields.school.onChange(school_id);
      this.props.fields.institution.onChange(user.institution_name);
      console.log(user);
      Object.entries(user).forEach(([key, value]) => {
        if (["born", "final_year_of_initial_formation"].includes(key)) {
          this.props.fields[key] && this.props.fields[key].onChange(new Date());
        } else {
          this.props.fields[key] && this.props.fields[key].onChange(value);
        }
      });

      this.props.fields.initial_formation.onChange({
        label: user.initial_formation,
        value: user.initial_formation,
      });
      this.props.fields.institution_initial_formation.onChange({
        label: user.institution_initial_formation,
        value: user.institution_initial_formation,
      });
      this.props.fields.internship_practice.onChange({
        label: user.internship_practice,
        value: user.internship_practice,
      });
      this.props.fields.technology_in_teaching_and_learning.onChange(
        user.technology_in_teaching_and_learning ? "sim" : "nao"
      );

      if (user._profile === "teacher" && user.teacher_data) {
        user.teacher_data[this.state.survey_response_id] &&
          Object.entries(
            user.teacher_data[this.state.survey_response_id]
          ).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              this.props.fields[key].onChange(
                value.map((option) => ({ label: option, value: option }))
              );
            } else {
              if (!["created_at", "updated_at"].includes(key)) {
                this.props.fields[key].onChange({ label: value, value: value });
              }
            }
          });
      }

      const stages_keys_without_duplicates = [...new Set(user.stages)];
      const stages_values = getStages(this.props).filter((stage) =>
        stages_keys_without_duplicates.includes(stage.key)
      );

      this.props.fields.stages.onChange(stages_values);

      const knowledges_keys_without_duplicates = [...new Set(user.knowledges)];

      const knowledges_values = [];
      const knowledgesSelect = [];

      for (let field of getKnowledges(this.props)) {
        if (stages_keys_without_duplicates.includes(field.key)) {
          knowledgesSelect.push(field);
        }
        const filteredOptions = field.options.filter((option) =>
          knowledges_keys_without_duplicates.includes(option.key)
        );

        filteredOptions.forEach((option) => knowledges_values.push(option));
      }

      this.props.fields.knowledges.onChange(knowledges_values);

      this.setState({
        knowledgesSelect: knowledgesSelect,
        knowledges_keys: knowledges_keys_without_duplicates,
        stages_keys: stages_keys_without_duplicates,
      });

      if (user.formation !== null) {
        this.setState({
          formationAnswers: user.formation,
        });
        let formation = user.formation ? "sim" : "nao";
        this.props.fields.formation.onChange(formation);
      }

      if (user.sharing != null) {
        this.setState({
          sharingAnswers: user.sharing,
        });
        let sharing = user.sharing ? "sim" : "nao";
        this.props.fields.sharing.onChange(sharing);
      }
    }
  };

  populateStages = (user) => {
    let stages = [];

    if (user.stages) {
      user.stages.forEach((stage) => {
        stages.push(
          getStages(this.props).find((s) => {
            return s.key == stage;
          })
        );
      });

      this._onChangeStages(stages);
    }
  };

  populateKnowledges = (user) => {
    let knowledges = [];

    if (user.knowledges) {
      user.knowledges.forEach((knowledge) => {
        getKnowledges(this.props).forEach((st) => {
          let know = st.options.find((k) => {
            return k.key == knowledge;
          });
          if (know != undefined) {
            knowledges.push(know);
          }
        });
      });

      this._onChangeKnowledges(knowledges);
    }
  };

  componentDidMount = () => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    this.props.fetchCountries();
    this.fetchSurveys();

    this.setState({ user_id: id });

    getUser(id).then(
      (resp) => {
        this.setState({ user: resp });
      },
      (err) => {
        console.log("Error: ", err);
      }
    );

    const user = this.props.accounts.user;
    this.populateKnowledges(user);
    this.populateStages(user);
    this.setInitialFormation();

    // this.populateForm();
  };

  componentDidUpdate = (prevProps) => {
    if (!!this.state.survey_id && !this.state.have_response) {
      this.setState({ have_response: true });
      this.fetchResponses();
    }
    if (
      !this.state.hasUser &&
      // prevProps.apiData.countries !== this.props.apiData.countries &&
      this.state.survey_response_id
    ) {
      this.setState({ hasUser: true });
      this.populateForm();
      const user = this.props.accounts.user;
      this.populateKnowledges(user);
      this.populateStages(user);
    }

    if (
      (this.props.route.path === "/editar-usuario/diretores" ||
        this.props.route.path === "/editar-usuario/professores") &&
      !this.state.adminStateOrCity
    ) {
      this.setState({ adminStateOrCity: true });
    }
  };

  _handleChangeDate = (date) => {
    this.props.fields.born.onChange(date);
    this.setState({
      born: date,
    });
  };

  _updateSelectedState = (event) => {
    if (event) {
      this.props.fields.state.onChange(event);
    }
  };

  _onChangeStages = (options) => {
    options = options || [];
    const values = _.isArray(options)
      ? options.map((option) => option.value)
      : [options && options.value];
    const options_keys = options.map((option) => option.key);
    const stages_keys_without_duplicates = [...new Set(options_keys)];
    this.props.fields.stages.onChange(options);

    let know = [];

    values.forEach((s) => {
      getKnowledges(this.props).forEach((k) => {
        if (s.includes(k.label)) {
          know.push(k);
        }
      });
    });

    this.props.fields.knowledges.onChange(know);

    this.setState({
      stages: options || [],
      stages_keys: stages_keys_without_duplicates,
      knowledgesSelect: know,
    });
  };

  _onChangeKnowledges = (options) => {
    options = options || [];
    const options_keys = options.map((option) => option.key);
    const knowledges_keys_without_duplicates = [...new Set(options_keys)];
    this.props.fields.knowledges.onChange(options);
    this.setState({
      knowledges: options,
      knowledges_keys: knowledges_keys_without_duplicates,
      knowledgesDyn: options,
    });
  };

  _onChangeFormation = (event) => {
    if (event.target.value == "sim") {
      this.props.fields.formation.onChange("sim");
      this.setState({
        formationAnswers: true,
        user: { ...this.state.user, formation: true },
      });
    } else if (event.target.value == "nao") {
      this.props.fields.formation.onChange("nao");
      this.setState({
        formationAnswers: false,
        user: { ...this.state.user, formation: false },
      });
    }
  };

  _onChangeFormationLevel = (options) => {
    const values = _.isArray(options)
      ? options.map((option) => option.value)
      : [options && options.value];
    this.props.fields.formation_level.onChange(values);
    this.setState({
      formation_level: values,
      formationLevelDyn: options,
    });
  };

  _onChangeDevices = (options) => {
    const values = _.isArray(options)
      ? options.map((option) => option.value)
      : [options && options.value];

    this.setState({
      devices: values,
      devicesDyn: options,
    });
  };

  _onChangeSharing = (event) => {
    if (event && event.target) {
      if (event.target.value == "sim") {
        this.props.fields.sharing.onChange("sim");
        this.setState({
          sharingAnswers: true,
        });
      } else if (event.target.value == "nao") {
        this.props.fields.sharing.onChange("nao");
        this.setState({
          sharingAnswers: false,
        });
      }
    }
  };

  _updateUser = (values) => {
    let affiliation_id;

    if (
      values.profile !== "admin_state" &&
      !this.state.isPrincipalWithoutLinks &&
      !this.state.isTeacherWithoutLinks
    ) {
      affiliation_id = this.props.apiData.schools.find(
        (school) => school._id.$oid === values.school._id.$oid
      ).affiliation_id;
      if (affiliation_id instanceof Object) {
        affiliation_id = affiliation_id.$oid;
      }
    }

    return updateUser(values, affiliation_id).then(
      (response) => {
        if (response.error) {
          this.setState({ updateStatus: "fail" });
        } else {
          this.setState({ updateStatus: "success" });
        }
      },
      (err) => {
        console.log(err);
        this.setState({
          updateStatus: "fail",
        });
      }
    );
  };

  getProvinces = (e) => {
    const country_id = e.target.value;
    this.props.fetchProvinces(country_id);
  };

  getStates = (e) => {
    const province_id = e.target.value;
    this.props.fetchStates(this.props.fields.country.value, province_id);
  };

  getCities = (e) => {
    const state_id = e.target.value;
    this.props.fetchCities(
      this.props.fields.country.value,
      this.props.fields.province.value,
      state_id
    );
  };

  getSchools = (e) => {
    const city_id = e.target.value;
    this.props.fetchSchools(
      this.props.fields.country.value,
      this.props.fields.province.value,
      this.props.fields.state.value,
      city_id
    );
  };

  updateGeographicElements = (country_id) => {
    const countries = this.props.apiData.countries;
    if (countries.length !== 0) {
      const filteredCountry =
        countries &&
        countries.find((country) => country._id.$oid === country_id);

      const {
        geo_structure_level1_name,
        geo_structure_level2_name,
        geo_structure_level3_name,
        geo_structure_level4_name,
      } = filteredCountry;
      this.setState({
        geo_structure_level1_name,
        geo_structure_level2_name,
        geo_structure_level3_name,
        geo_structure_level4_name,
      });
      this.setState({ hasUser: true });
    }
  };

  updateSelectedCountry = (e) => {
    if (e) {
      this.props.fields.province.onChange("");
      this.props.fields.state.onChange("");
      this.props.fields.city.onChange("");
      this.props.fields.school.onChange("");
      this.props.fields.country.onChange(e);
    }
  };

  updateSelectedProvince = (e) => {
    if (e) {
      this.props.fields.state.onChange("");
      this.props.fields.city.onChange("");
      this.props.fields.school.onChange("");
      this.props.fields.province.onChange(e);
    }
  };

  updateSelectedState = (e) => {
    if (e) {
      this.props.fields.city.onChange("");
      this.props.fields.school.onChange("");
      this.props.fields.state.onChange(e);
    }
  };
  updateSelectedCity = (e) => {
    if (e) {
      this.props.fields.school.onChange("");
      this.props.fields.city.onChange(e);
    }
  };

  updateSelectedSchool = (e) => {
    if (e) this.props.fields.school.onChange(e);
  };

  _submit = (values) => {
    this.setState({
      updateStatus: "none",
    });
    const fields = this.props.fields;

    values._id = this.state.user._id.$oid;
    if (values.sharing == "sim") {
      values.sharing = true;
    } else if (values.sharing == "nao") {
      values.sharing = false;
    }

    if (values.formation == "sim") {
      values.formation = true;
    } else if (values.formation == "nao") {
      values.formation = false;
    }

    values.born = fields.born.value ? fields.born.value : undefined;
    values.email = values.email ? values.email.trim() : values.email;
    values.profile = this.state.user._profile;

    values.stages = this.state.stages_keys || [];
    values.knowledges = this.state.knowledges_keys || [];

    values.isUserWithoutLinks = this.isUserWithoutLinks();

    let schemaAux;

    if (values.profile === "teacher") {
      values.technology_application =
        values.technology_application && values.technology_application[0]
          ? values.technology_application.map((option) => option.value)
          : [];

      if (values.technology_in_teaching_and_learning) {
        if (values.technology_in_teaching_and_learning === "sim") {
          values.technology_in_teaching_and_learning = true;
        } else if (values.technology_in_teaching_and_learning === "nao") {
          values.technology_in_teaching_and_learning = false;
        }
      } else {
        values.technology_in_teaching_and_learning = null;
      }

      if (values.years_of_uses_technology_for_teaching) {
        if (values.years_of_uses_technology_for_teaching.value === "Não uso") {
          const { technology_application, ...rest } = schema;
          schemaAux = { ...rest };
        }
      }
    }

    values.cpf = removeCPFMask(values.cpf);

    return new Promise((resolve, reject) => {
      const errors = _.mapValues(
        validate(values, schema, { fullMessages: false }),
        (value) => {
          return value[0];
        }
      );

      console.log(errors);

      delete values["isUserWithoutLinks"];

      /* eslint-disable no-console */
      if (_.isEmpty(errors)) {
        this._updateUser(values).then(
          (err) => {
            reject(err);
          },
          (errors) => {
            reject(errors);
          }
        );
        // history.push("/recursos");
      } else {
        var name = Object.entries(errors)[0][0];
        var field = $('[name="' + name + '"]')
          .first()
          .parent();
        var dangerPos = field.length > 0 ? field.offset().top - 100 : 0;

        $("html, body").animate(
          {
            scrollTop: dangerPos,
          },
          400
        );
        reject(errors);
      }
    });
  };
  translate = (id) => this.props.intl.formatMessage({ id });

  setInitialFormation = () => {
    const initial_formation_options = this.translate(
      "SignUpForm.initial_formation.options"
    )
      .split(",")
      .map((option) => ({ label: option, value: option }));
    console.log(initial_formation_options);
    this.setState({ initial_formation_options: initial_formation_options });
  };

  render() {
    const { fields, apiData, handleSubmit, submitting } = this.props;
    const {
      user,
      disabledState,
      disabledCity,
      disabledSchool,
      adminStateOrCity,
    } = this.state;
    const { isFetchingCities, isFetchingSchools } = apiData;
    const onSubmit = handleSubmit(this._submit);

    return (
      <Layout
        pageHeader={
          this.state.adminStateOrCity
            ? this.translate("EditUser.editUser")
            : this.translate("EditUser.myRegister")
        }
      >
        <Helmet
          title={
            this.state.adminStateOrCity
              ? this.translate("EditUser.editUser")
              : this.translate("EditUser.myRegister")
          }
        />
        <Body className={classNames("container")}>
          <ReactModal
            isOpen={this.state.showModal}
            className={classNames(stylesModal.modal)}
            overlayClassName={classNames(stylesModal.overlay)}
          >
            <div className={classNames(stylesModal.modal__header)}>
              <h4>{parse(this.translate("UsersModal.title"))}</h4>
            </div>
            <div className={classNames(stylesModal.modal__body)}>
              <p>{parse(this.translate("UsersModal.description"))}</p>
            </div>
            <div className={classNames(stylesModal.modal__footer)}>
              <button
                className={classNames("button", stylesModal.modal__btn)}
                onClick={this.showModal}
              >
                {parse(this.translate("TechnicalsModal.btnCancel"))}
              </button>
              <button
                className={classNames("button", stylesModal.modal__btn)}
                onClick={this.remove}
              >
                {parse(this.translate("UsersModal.btnConfirm"))}
              </button>
            </div>
          </ReactModal>
          <div className="section">
            {!this.state.adminStateOrCity && (
              <div className="columns">
                <div className="column is-full">
                  {parse(this.translate("EditUser.alert"))}
                </div>
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div
                className={classNames(
                  "columns",
                  _.result(user, "_profile") === "teacher"
                    ? null
                    : "is-multiline"
                )}
              >
                <div
                  className={classNames(
                    "column",
                    _.result(user, "_profile") === "teacher"
                      ? "is-half"
                      : "is-offset-2 is-8"
                  )}
                >
                  <div className="box">
                    <h1 className={styles.title_section}>
                      {parse(this.translate("SignUpForm.personalData"))}
                    </h1>
                    <Field
                      label={this.translate("SignUpForm.label.name")}
                      classField="slim"
                      {...fields.name}
                    />
                    {_.result(user, "_profile") === "teacher" && (
                      <Field
                        label={this.translate("SignUpForm.label.cpf")}
                        classField="slim"
                        {...fields.cpf}
                      />
                    )}

                    {_.result(user, "_profile") === "teacher" && (
                      <div>
                        <label
                          className={classNames("label", styles.form__label)}
                        >
                          {this.translate("SignUpForm.label.gender")}
                        </label>
                        <div
                          className={classNames(
                            "control columns is-multiline",
                            styles.form__input
                          )}
                        >
                          <label
                            className={classNames(
                              "radio column is-3",
                              styles.form__radio
                            )}
                          >
                            <input
                              type="radio"
                              {...omitFieldProperties(fields.gender)}
                              value={this.translate(
                                "SignUpForm.gender.feminine"
                              )}
                              checked={
                                fields.gender.value ===
                                this.translate("SignUpForm.gender.feminine")
                              }
                              {...(this.state.disabledAdminCity ||
                              this.state.disabledAdminState
                                ? { disabled: true }
                                : {})}
                            />
                            {this.translate("SignUpForm.gender.feminine")}
                          </label>
                          <label
                            className={classNames(
                              "radio column is-3",
                              styles.form__radio
                            )}
                          >
                            <input
                              type="radio"
                              {...omitFieldProperties(fields.gender)}
                              value={this.translate(
                                "SignUpForm.gender.masculine"
                              )}
                              checked={
                                fields.gender.value ===
                                this.translate("SignUpForm.gender.masculine")
                              }
                              {...(this.state.disabledAdminCity ||
                              this.state.disabledAdminState
                                ? { disabled: true }
                                : {})}
                            />
                            {this.translate("SignUpForm.gender.masculine")}
                          </label>
                          <label
                            className={classNames(
                              "radio column is-3",
                              styles.form__radio
                            )}
                          >
                            <input
                              type="radio"
                              {...omitFieldProperties(fields.gender)}
                              value={this.translate("SignUpForm.gender.others")}
                              checked={
                                fields.gender.value ===
                                this.translate("SignUpForm.gender.others")
                              }
                              {...(this.state.disabledAdminCity ||
                              this.state.disabledAdminState
                                ? { disabled: true }
                                : {})}
                            />
                            {this.translate("SignUpForm.gender.others")}
                          </label>
                          <label
                            className={classNames(
                              "radio column is-3",
                              styles.form__radio
                            )}
                          >
                            <input
                              type="radio"
                              {...omitFieldProperties(fields.gender)}
                              value={this.translate(
                                "SignUpForm.gender.preferNotToSay"
                              )}
                              checked={
                                fields.gender.value ===
                                this.translate(
                                  "SignUpForm.gender.preferNotToSay"
                                )
                              }
                              {...(this.state.disabledAdminCity ||
                              this.state.disabledAdminState
                                ? { disabled: true }
                                : {})}
                            />
                            {this.translate("SignUpForm.gender.preferNotToSay")}
                          </label>
                        </div>
                        {fields.gender.error && (
                          <i
                            className={classNames(
                              "fas fa-exclamation-triangle",
                              styles.field__warning
                            )}
                          ></i>
                        )}
                        {fields.gender.error && (
                          <span className="help is-danger">
                            {fields.gender.error}
                          </span>
                        )}
                      </div>
                    )}

                    {_.result(user, "_profile") === "teacher" && (
                      <div>
                        <label
                          className={classNames("label", styles.form__label)}
                        >
                          {parse(this.translate("SignUpForm.label.birthDate"))}
                        </label>
                        <div
                          className={classNames(
                            "control react-datepicker-width-large",
                            styles.is_relative
                          )}
                        >
                          <DatePicker
                            name="born"
                            className={classNames(
                              "input",
                              styles.field__datepicker,
                              Boolean(fields.born.error)
                                ? styles.is_danger
                                : null
                            )}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            disabled={false}
                            selected={fields.born.value}
                            onChange={this._handleChangeDate}
                            dateFormat="dd/MM/yyyy"
                          />
                          <i
                            className={classNames(
                              "fas fa-calendar-alt",
                              styles.field__calendar
                            )}
                          ></i>
                          {fields.born.error ? (
                            <i
                              className={classNames(
                                "fas fa-exclamation-triangle",
                                styles.field__warning
                              )}
                            ></i>
                          ) : null}
                          {fields.born.error ? (
                            <span className="help is-danger">
                              {fields.born.error}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )}
                    <Field
                      label={this.translate("SignUpForm.label.email")}
                      classField="slim"
                      {...fields.email}
                      disabled
                    />
                  </div>
                </div>
                {/* Professionals Data */}
                {this.showProfessionalsData() && (
                  <div
                    className={classNames(
                      "column",
                      _.result(user, "_profile") === "teacher"
                        ? "is-half"
                        : "is-offset-2 is-8"
                    )}
                  >
                    <div className="box">
                      <h1 className={styles.title_section}>
                        {parse(this.translate("SignUpForm.professionalsData"))}
                      </h1>
                      {/* País */}
                      {this.isUserWithoutLinks() === false && (
                        <div>
                          {" "}
                          <label
                            className={classNames("label", styles.form__label)}
                          >
                            {parse(this.translate("SignUpForm.label.region"))}
                          </label>
                          <div
                            className={classNames(
                              "control",
                              styles.form__input,
                              {
                                "has-icon has-icon-right": Boolean(
                                  fields.country.error
                                ),
                              }
                            )}
                          >
                            <span
                              className={classNames(
                                "select",
                                styles.form__select,
                                {
                                  "is-danger": Boolean(fields.country.error),
                                }
                              )}
                            >
                              <select
                                {...fields.country}
                                onChange={(e) => {
                                  this.updateSelectedCountry(e);
                                  this.getProvinces(e);
                                }}
                                disabled={true}
                              >
                                <option value="">
                                  {this.translate("SignUpForm.selectRegion")}
                                </option>
                                {apiData.countries.map((country) => (
                                  <option
                                    key={country._id.$oid}
                                    value={country._id.$oid}
                                  >
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                            </span>
                            {fields.country.error ? (
                              <i
                                className={classNames(
                                  "fas fa-exclamation-triangle",
                                  stylesField.field__warning
                                )}
                              ></i>
                            ) : null}
                            {fields.country.error ? (
                              <span className="help is-danger">
                                {fields.country.error}
                              </span>
                            ) : null}
                          </div>
                          {/* Província */}
                          <label
                            className={classNames("label", styles.form__label)}
                          >
                            {this.state.geo_structure_level2_name === ""
                              ? parse(
                                  this.translate("SignUpForm.label.province")
                                )
                              : this.state.geo_structure_level2_name}
                          </label>
                          <div
                            className={classNames(
                              "control",
                              styles.form__input,
                              {
                                "has-icon has-icon-right": Boolean(
                                  fields.province.error
                                ),
                              }
                            )}
                          >
                            <span
                              className={classNames(
                                "select",
                                styles.form__select,
                                {
                                  "is-danger": Boolean(fields.province.error),
                                }
                              )}
                            >
                              <select
                                {...fields.province}
                                onChange={(e) => {
                                  this.updateSelectedProvince(e);
                                  this.getStates(e);
                                }}
                                disabled={true}
                                // disabled={fields.country.value === "" ? true : false}
                              >
                                <option value="">
                                  {this.translate("SignUpForm.selectProvince")}
                                </option>
                                {apiData.provinces &&
                                  apiData.provinces.map((province) => (
                                    <option
                                      key={province._id.$oid}
                                      value={province._id.$oid}
                                    >
                                      {province.name}
                                    </option>
                                  ))}
                              </select>
                            </span>
                            {fields.province.error ? (
                              <i
                                className={classNames(
                                  "fas fa-exclamation-triangle",
                                  stylesField.field__warning
                                )}
                              ></i>
                            ) : null}
                            {fields.province.error ? (
                              <span className="help is-danger">
                                {fields.province.error}
                              </span>
                            ) : null}
                          </div>
                          {/* Estado */}
                          <label
                            className={classNames("label", styles.form__label)}
                          >
                            {this.state.geo_structure_level3_name === ""
                              ? parse(this.translate("SignUpForm.label.state"))
                              : this.state.geo_structure_level3_name}
                          </label>
                          <div
                            className={classNames(
                              "control",
                              styles.form__input,
                              {
                                "has-icon has-icon-right": Boolean(
                                  fields.state.error
                                ),
                              }
                            )}
                          >
                            <span
                              className={classNames(
                                "select",
                                styles.form__select,
                                {
                                  "is-danger": Boolean(fields.state.error),
                                }
                              )}
                            >
                              <select
                                {...fields.state}
                                onChange={(e) => {
                                  this.updateSelectedState(e);
                                  this.getCities(e);
                                }}
                                // disabled={fields.province.value === "" ? true : false}
                                disabled={true}
                              >
                                <option value="">
                                  {this.translate("SignUpForm.selectState")}
                                </option>
                                {apiData.states &&
                                  apiData.states.map((state) => (
                                    <option
                                      key={state._id.$oid}
                                      value={state._id.$oid}
                                    >
                                      {state.name}
                                    </option>
                                  ))}
                              </select>
                            </span>
                            {fields.state.error ? (
                              <i
                                className={classNames(
                                  "fas fa-exclamation-triangle",
                                  stylesField.field__warning
                                )}
                              ></i>
                            ) : null}
                            {fields.state.error ? (
                              <span className="help is-danger">
                                {fields.state.error}
                              </span>
                            ) : null}
                          </div>
                          {/* Cidade */}
                          <label
                            className={classNames("label", styles.form__label)}
                          >
                            {this.state.geo_structure_level4_name === ""
                              ? parse(
                                  this.translate(
                                    "SignUpFormPrincipalFields.label.city"
                                  )
                                )
                              : this.state.geo_structure_level4_name}
                          </label>
                          <div
                            className={classNames(
                              "control",
                              styles.form__input,
                              {
                                "has-icon has-icon-right": Boolean(
                                  fields.city.error
                                ),
                                "is-loading": isFetchingCities,
                              }
                            )}
                          >
                            <span
                              className={classNames(
                                "select",
                                styles.form__select,
                                {
                                  "is-danger": Boolean(fields.city.error),
                                }
                              )}
                            >
                              <select
                                {...fields.city}
                                onChange={(e) => {
                                  this.updateSelectedCity(e);
                                  this.getSchools(e);
                                }}
                                disabled={true}
                                // disabled={fields.state.value === "" ? true : false}
                              >
                                {apiData.cities &&
                                apiData.cities.length !== 0 &&
                                !isFetchingCities ? (
                                  <option value="">
                                    {this.translate(
                                      "SignUpFormPrincipalFields.selectCity"
                                    )}
                                  </option>
                                ) : null}
                                {this.props.apiData.cities instanceof Array &&
                                  this.props.apiData.cities.map((city) => (
                                    <option
                                      key={city._id.$oid}
                                      value={city._id.$oid}
                                    >
                                      {city.name}
                                    </option>
                                  ))}
                              </select>
                            </span>
                            {fields.city.error ? (
                              <i
                                className={classNames(
                                  "fas fa-exclamation-triangle",
                                  stylesField.field__warning
                                )}
                              ></i>
                            ) : null}
                            {fields.city.error ? (
                              <span className="help is-danger">
                                {fields.city.error}
                              </span>
                            ) : null}
                          </div>
                          {/* Escola */}
                          <label
                            className={classNames("label", styles.form__label)}
                          >
                            {parse(
                              this.translate(
                                "SignUpFormPrincipalFields.label.school"
                              )
                            )}
                          </label>
                          <div
                            className={classNames(
                              "control",
                              styles.form__input,
                              {
                                "has-icon has-icon-right": Boolean(
                                  fields.school.error
                                ),
                                "is-loading": isFetchingSchools,
                              }
                            )}
                          >
                            <input
                              className={classNames(
                                "input",
                                {
                                  "is-hidden":
                                    fields.school_type.value != "Particular",
                                },
                                {
                                  "is-danger": Boolean(
                                    fields.institution.error
                                  ),
                                }
                              )}
                              type="text"
                              placeholder={this.props.intl.formatMessage({
                                id: "SignUpFormPrincipalFields.placeholderSchool",
                              })}
                              {...fields.institution}
                            />
                            <span
                              className={classNames(
                                "select",
                                styles.form__select,
                                {
                                  "is-hidden":
                                    fields.school_type.value == "Particular",
                                },
                                { "is-danger": Boolean(fields.school.error) }
                              )}
                            >
                              <select
                                {...fields.school}
                                // disabled={fields.city.value === "" ? true : false}
                                disabled={true}
                              >
                                {/* {apiData.schools.length && !isFetchingSchools ? (
                            <option value="">Selecione uma escola</option>
                          ) : null}
                          {apiData.schools.length <= 0 && !isFetchingSchools ? (
                            <option value="">Nenhuma escola encontrada</option>
                          ) : null} */}
                                {apiData.schools instanceof Array &&
                                  apiData.schools.map((school) => (
                                    <option
                                      key={school._id.$oid}
                                      value={school._id.$oid}
                                    >
                                      {school.name}
                                    </option>
                                  ))}
                              </select>
                            </span>
                            {fields.school.error || fields.institution.error ? (
                              <i
                                className={classNames(
                                  "fas fa-exclamation-triangle",
                                  stylesField.field__warning
                                )}
                              ></i>
                            ) : null}
                            {fields.school.error || fields.institution.error ? (
                              <span className="help is-danger">
                                {fields.state.error}
                              </span>
                            ) : null}
                          </div>
                          <span className="help is-danger"></span>{" "}
                        </div>
                      )}

                      {_.result(user, "_profile") === "teacher" && (
                        <FieldSelect
                          error={fields.stages.error}
                          label={this.translate(
                            "SignUpForm.label.teachingStages"
                          )}
                          options={getStages(this.props)}
                          defaultValue={fields.stages.value}
                          classField="slim"
                          onChange={this._onChangeStages}
                          noOptionsMessage={() => {
                            return parse(
                              this.translate("SignUpForm.noOptions")
                            );
                          }}
                          loadingMessage={() => {
                            return parse(this.translate("Global.loading"));
                          }}
                          placeholder={this.translate(
                            "SignUpForm.placeholderSelectOptions"
                          )}
                        />
                      )}
                      {_.result(user, "_profile") === "teacher" && (
                        <FieldSelect
                          error={fields.knowledges.error}
                          label={this.translate("SignUpForm.label.knowledges")}
                          options={this.state.knowledgesSelect}
                          defaultValue={fields.knowledges.value}
                          classField="slim"
                          onChange={this._onChangeKnowledges}
                          noOptionsMessage={() => {
                            return parse(
                              this.translate("SignUpForm.noOptions")
                            );
                          }}
                          loadingMessage={() => {
                            return parse(this.translate("Global.loading"));
                          }}
                          placeholder={this.translate(
                            "SignUpForm.placeholderSelectOptions"
                          )}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="columns">
                <div className="column is-12">
                  {_.result(user, "_profile") === "teacher" && (
                    <div className="box">
                      <h1 className={styles.title_section}>
                        {this.translate("SignUpForm.formation")}
                      </h1>
                      <FieldSelect
                        name="formation_level"
                        {...omitFieldProperties(fields.formation_level)}
                        error={fields.formation_level.error}
                        label={this.translate(
                          "SignUpForm.label.formationLevel"
                        )}
                        options={getFormation(this.props)}
                        isMulti={false}
                        closeMenuOnSelect={true}
                        classField="slim"
                        noOptionsMessage={() => {
                          return "Sem opções.";
                        }}
                        loadingMessage={() => {
                          return "Carregando...";
                        }}
                        placeholder="Selecione uma opção"
                      />

                      <FieldCreatableSelect
                        name="initial_formation"
                        error={fields.initial_formation.error}
                        label={this.translate(
                          "SignUpForm.label.initial_formation"
                        )}
                        options={this.state.initial_formation_options}
                        {...omitFieldProperties(fields.initial_formation)}
                        onCreateOption={(option) => {
                          if (!option.trim()) return;
                          // if (!regex.test(option)) return;
                          const value = { label: option, value: option };
                          fields.initial_formation.onChange(value);
                          this.setState({
                            initial_formation_options: [
                              ...this.state.initial_formation_options,
                              value,
                            ],
                          });
                        }}
                        isMulti={false}
                        closeMenuOnSelect={true}
                        classField="slim"
                        noOptionsMessage={() => {
                          return "Sem opções.";
                        }}
                        loadingMessage={() => {
                          return "Carregando...";
                        }}
                        placeholder="Selecione uma opção"
                      />

                      <div className={classNames("", styles.form_born)}>
                        <label
                          className={classNames("label", styles.form__label)}
                        >
                          {this.translate(
                            "SignUpForm.label.final_year_of_initial_formation"
                          )}
                        </label>

                        <div className={styles.is_relative}>
                          <div
                            className={classNames(
                              "control react-datepicker-width-large"
                            )}
                          >
                            <DatePicker
                              name="final_year_of_initial_formation"
                              {...omitFieldProperties(
                                fields.final_year_of_initial_formation
                              )}
                              className={classNames(
                                "input",
                                styles.field__datepicker,
                                Boolean(
                                  fields.final_year_of_initial_formation.error
                                )
                                  ? styles.is_danger
                                  : null
                              )}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              disabled={false}
                              selected={
                                fields.final_year_of_initial_formation.value
                              }
                              dateFormat="dd/MM/yyyy"
                            />
                          </div>
                          <i
                            className={classNames(
                              "fas fa-calendar-alt",
                              styles.field__calendar
                            )}
                          ></i>
                          {fields.final_year_of_initial_formation.error ? (
                            <i
                              className={classNames(
                                "fas fa-exclamation-triangle",
                                styles.field__warning
                              )}
                            ></i>
                          ) : null}
                          {fields.final_year_of_initial_formation.error ? (
                            <span className="help is-danger">
                              {fields.final_year_of_initial_formation.error}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <FieldSelect
                        name="internship_practice"
                        {...omitFieldProperties(fields.internship_practice)}
                        error={fields.internship_practice.error}
                        label={this.translate(
                          "SignUpForm.label.internship_practice"
                        )}
                        options={[
                          {
                            label: this.translate(
                              "SignUpForm.internship_practice.0"
                            ),
                            value: this.translate(
                              "SignUpForm.internship_practice.0"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.internship_practice.1"
                            ),
                            value: this.translate(
                              "SignUpForm.internship_practice.1"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.internship_practice.2"
                            ),
                            value: this.translate(
                              "SignUpForm.internship_practice.2"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.internship_practice.3"
                            ),
                            value: this.translate(
                              "SignUpForm.internship_practice.3"
                            ),
                          },
                        ]}
                        isMulti={false}
                        closeMenuOnSelect={true}
                        classField="slim"
                        noOptionsMessage={() => {
                          return "Sem opções.";
                        }}
                        loadingMessage={() => {
                          return "Carregando...";
                        }}
                        placeholder="Selecione uma opção"
                      />

                      <FieldCreatableSelect
                        name="institution_initial_formation"
                        error={fields.institution_initial_formation.error}
                        label={this.translate(
                          "SignUpForm.label.institution_initial_formation"
                        )}
                        options={
                          this.state.institution_initial_formation_options
                        }
                        {...omitFieldProperties(
                          fields.institution_initial_formation
                        )}
                        onCreateOption={(option) => {
                          const value = { label: option, value: option };
                          fields.institution_initial_formation.onChange(value);
                          this.setState({
                            institution_initial_formation_options: [
                              ...this.state
                                .institution_initial_formation_options,
                              value,
                            ],
                          });
                        }}
                        isMulti={false}
                        closeMenuOnSelect={true}
                        classField="slim"
                        noOptionsMessage={() => {
                          return "Sem opções.";
                        }}
                        loadingMessage={() => {
                          return "Carregando...";
                        }}
                        placeholder="Selecione uma opção"
                      />

                      <label
                        className={classNames("label", styles.form__label)}
                      >
                        {this.translate(
                          "SignUpForm.label.technology_in_teaching_and_learning"
                        )}
                      </label>
                      <div
                        className={classNames(
                          "control columns is-multiline",
                          styles.form__input,
                          Boolean(
                            fields.technology_in_teaching_and_learning.error
                          )
                            ? styles.is_danger
                            : null
                        )}
                      >
                        <label
                          className={classNames(
                            "radio column is-3",
                            styles.form__radio
                          )}
                        >
                          <input
                            type="radio"
                            {...omitFieldProperties(
                              fields.technology_in_teaching_and_learning
                            )}
                            value={this.translate(
                              "SignUpForm.technology_in_teaching_and_learning.yes"
                            )}
                            checked={
                              fields.technology_in_teaching_and_learning
                                .value ===
                              this.translate(
                                "SignUpForm.technology_in_teaching_and_learning.yes"
                              )
                            }
                            {...(this.state.disabledAdminCity ||
                            this.state.disabledAdminState
                              ? { disabled: true }
                              : {})}
                          />
                          {this.translate(
                            "SignUpForm.technology_in_teaching_and_learning.yes"
                          )}
                        </label>
                        <label
                          className={classNames(
                            "radio column is-3",
                            styles.form__radio
                          )}
                        >
                          <input
                            type="radio"
                            {...omitFieldProperties(
                              fields.technology_in_teaching_and_learning
                            )}
                            value={this.translate(
                              "SignUpForm.technology_in_teaching_and_learning.no"
                            )}
                            checked={
                              fields.technology_in_teaching_and_learning
                                .value ===
                              this.translate(
                                "SignUpForm.technology_in_teaching_and_learning.no"
                              )
                            }
                            {...(this.state.disabledAdminCity ||
                            this.state.disabledAdminState
                              ? { disabled: true }
                              : {})}
                          />
                          {this.translate(
                            "SignUpForm.technology_in_teaching_and_learning.no"
                          )}
                        </label>
                      </div>
                      {fields.technology_in_teaching_and_learning.error ? (
                        <i
                          className={classNames(
                            "fas fa-exclamation-triangle",
                            styles.field__warning
                          )}
                        ></i>
                      ) : null}
                      {fields.technology_in_teaching_and_learning.error ? (
                        <span className="help is-danger">
                          {fields.technology_in_teaching_and_learning.error}
                        </span>
                      ) : null}
                      <label
                        className={classNames("label", styles.form__label)}
                      >
                        {this.translate("SignUpForm.label.course_modality")}
                      </label>
                      <div
                        className={classNames(
                          "control columns is-multiline",
                          styles.form__input,
                          Boolean(fields.course_modality.error)
                            ? styles.is_danger
                            : null
                        )}
                      >
                        <label
                          className={classNames(
                            "radio column is-3",
                            styles.form__radio
                          )}
                        >
                          <input
                            type="radio"
                            {...omitFieldProperties(fields.course_modality)}
                            value={this.translate(
                              "SignUpForm.course_modality.inPerson"
                            )}
                            checked={
                              fields.course_modality.value ===
                              this.translate(
                                "SignUpForm.course_modality.inPerson"
                              )
                            }
                            {...(this.state.disabledAdminCity ||
                            this.state.disabledAdminState
                              ? { disabled: true }
                              : {})}
                          />
                          {this.translate(
                            "SignUpForm.course_modality.inPerson"
                          )}
                        </label>
                        <label
                          className={classNames(
                            "radio column is-3",
                            styles.form__radio
                          )}
                        >
                          <input
                            type="radio"
                            {...omitFieldProperties(fields.course_modality)}
                            value={this.translate(
                              "SignUpForm.course_modality.blended"
                            )}
                            checked={
                              fields.course_modality.value ===
                              this.translate(
                                "SignUpForm.course_modality.blended"
                              )
                            }
                            {...(this.state.disabledAdminCity ||
                            this.state.disabledAdminState
                              ? { disabled: true }
                              : {})}
                          />
                          {this.translate("SignUpForm.course_modality.blended")}
                        </label>
                        <label
                          className={classNames(
                            "radio column is-3",
                            styles.form__radio
                          )}
                        >
                          <input
                            type="radio"
                            {...omitFieldProperties(fields.course_modality)}
                            value={this.translate(
                              "SignUpForm.course_modality.fromADistance"
                            )}
                            checked={
                              fields.course_modality.value ===
                              this.translate(
                                "SignUpForm.course_modality.fromADistance"
                              )
                            }
                            {...(this.state.disabledAdminCity ||
                            this.state.disabledAdminState
                              ? { disabled: true }
                              : {})}
                          />
                          {this.translate(
                            "SignUpForm.course_modality.fromADistance"
                          )}
                        </label>
                      </div>
                      {fields.course_modality.error ? (
                        <i
                          className={classNames(
                            "fas fa-exclamation-triangle",
                            styles.field__warning
                          )}
                        ></i>
                      ) : null}
                      {fields.course_modality.error ? (
                        <span className="help is-danger">
                          {fields.course_modality.error}
                        </span>
                      ) : null}
                      <FieldSelect
                        name="cont_educ_in_the_use_of_digital_technologies"
                        {...omitFieldProperties(
                          fields.cont_educ_in_the_use_of_digital_technologies
                        )}
                        error={
                          fields.cont_educ_in_the_use_of_digital_technologies
                            .error
                        }
                        label={this.translate(
                          "SignUpForm.label.cont_educ_in_the_use_of_digital_technologies"
                        )}
                        options={[
                          {
                            label: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.0"
                            ),
                            value: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.0"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.1"
                            ),
                            value: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.1"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.2"
                            ),
                            value: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.2"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.3"
                            ),
                            value: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.3"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.4"
                            ),
                            value: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.4"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.5"
                            ),
                            value: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.5"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.6"
                            ),
                            value: this.translate(
                              "SignUpForm.cont_educ_in_the_use_of_digital_technologies.6"
                            ),
                          },
                        ]}
                        isMulti={false}
                        closeMenuOnSelect={true}
                        classField="slim"
                        noOptionsMessage={() => {
                          return "Sem opções.";
                        }}
                        loadingMessage={() => {
                          return "Carregando...";
                        }}
                        placeholder="Selecione uma opção"
                      />
                      <FieldSelect
                        {...omitFieldProperties(fields.years_teaching)}
                        name="years_teaching"
                        error={fields.years_teaching.error}
                        label={this.translate(
                          "SignUpForm.label.years_teaching"
                        )}
                        options={[
                          {
                            label: this.translate(
                              "SignUpForm.years_teaching.0"
                            ),
                            value: this.translate(
                              "SignUpForm.years_teaching.0"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.years_teaching.1"
                            ),
                            value: this.translate(
                              "SignUpForm.years_teaching.1"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.years_teaching.2"
                            ),
                            value: this.translate(
                              "SignUpForm.years_teaching.2"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.years_teaching.3"
                            ),
                            value: this.translate(
                              "SignUpForm.years_teaching.3"
                            ),
                          },
                        ]}
                        isMulti={false}
                        closeMenuOnSelect={true}
                        classField="slim"
                        noOptionsMessage={() => {
                          return "Sem opções.";
                        }}
                        loadingMessage={() => {
                          return "Carregando...";
                        }}
                        placeholder="Selecione uma opção"
                      />
                      <FieldSelect
                        {...omitFieldProperties(
                          fields.years_of_uses_technology_for_teaching
                        )}
                        onChange={(value) => {
                          fields.years_of_uses_technology_for_teaching.onChange(
                            value
                          );
                          if (
                            value.value ===
                            this.translate(
                              "SignUpForm.years_of_uses_technology_for_teaching.0"
                            )
                          ) {
                            fields.technology_application.onChange("");
                          }
                        }}
                        name={this.translate(
                          "SignUpForm.label.years_of_uses_technology_for_teaching"
                        )}
                        error={
                          fields.years_of_uses_technology_for_teaching.error
                        }
                        label={this.translate(
                          "SignUpForm.label.years_of_uses_technology_for_teaching"
                        )}
                        options={[
                          {
                            label: this.translate(
                              "SignUpForm.years_of_uses_technology_for_teaching.0"
                            ),
                            value: this.translate(
                              "SignUpForm.years_of_uses_technology_for_teaching.0"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.years_of_uses_technology_for_teaching.1"
                            ),
                            value: this.translate(
                              "SignUpForm.years_of_uses_technology_for_teaching.1"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.years_of_uses_technology_for_teaching.2"
                            ),
                            value: this.translate(
                              "SignUpForm.years_of_uses_technology_for_teaching.2"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.years_of_uses_technology_for_teaching.3"
                            ),
                            value: this.translate(
                              "SignUpForm.years_of_uses_technology_for_teaching.3"
                            ),
                          },
                          {
                            label: this.translate(
                              "SignUpForm.years_of_uses_technology_for_teaching.4"
                            ),
                            value: this.translate(
                              "SignUpForm.years_of_uses_technology_for_teaching.4"
                            ),
                          },
                        ]}
                        isMulti={false}
                        closeMenuOnSelect={true}
                        classField="slim"
                        noOptionsMessage={() => {
                          return "Sem opções.";
                        }}
                        loadingMessage={() => {
                          return "Carregando...";
                        }}
                        placeholder="Selecione uma opção"
                      />
                      {fields.years_of_uses_technology_for_teaching.value
                        .value !==
                        this.translate(
                          "SignUpForm.years_of_uses_technology_for_teaching.0"
                        ) && (
                        <FieldSelect
                          {...omitFieldProperties(
                            fields.technology_application
                          )}
                          name="technology_application"
                          error={fields.technology_application.error}
                          label={this.translate(
                            "SignUpForm.label.technology_application"
                          )}
                          options={[
                            {
                              label: this.translate(
                                "SignUpForm.technology_application.0"
                              ),
                              value: this.translate(
                                "SignUpForm.technology_application.0"
                              ),
                            },
                            {
                              label: this.translate(
                                "SignUpForm.technology_application.1"
                              ),
                              value: this.translate(
                                "SignUpForm.technology_application.1"
                              ),
                            },
                            {
                              label: this.translate(
                                "SignUpForm.technology_application.2"
                              ),
                              value: this.translate(
                                "SignUpForm.technology_application.2"
                              ),
                            },
                            {
                              label: this.translate(
                                "SignUpForm.technology_application.3"
                              ),
                              value: this.translate(
                                "SignUpForm.technology_application.3"
                              ),
                            },
                            {
                              label: this.translate(
                                "SignUpForm.technology_application.4"
                              ),
                              value: this.translate(
                                "SignUpForm.technology_application.4"
                              ),
                            },
                            {
                              label: this.translate(
                                "SignUpForm.technology_application.5"
                              ),
                              value: this.translate(
                                "SignUpForm.technology_application.5"
                              ),
                            },
                            {
                              label: this.translate(
                                "SignUpForm.technology_application.6"
                              ),
                              value: this.translate(
                                "SignUpForm.technology_application.6"
                              ),
                            },
                            {
                              label: this.translate(
                                "SignUpForm.technology_application.7"
                              ),
                              value: this.translate(
                                "SignUpForm.technology_application.7"
                              ),
                            },
                          ]}
                          isMulti={true}
                          classField="slim"
                          noOptionsMessage={() => {
                            return "Sem opções.";
                          }}
                          loadingMessage={() => {
                            return "Carregando...";
                          }}
                          placeholder="Selecione uma ou mais opções"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {_.result(user, "_profile") === "teacher" &&
                !isAdmin(this.props.accounts.user) && (
                  <div className="columns">
                    <div className="column is-12">
                      <div className="box">
                        <h1 className={styles.title_section}>
                          {parse(
                            this.translate(
                              "SignUpForm.termsOfUseAndDataSharing"
                            )
                          )}
                        </h1>
                        <div className={styles.terms_of_use}>
                          {parse(this.translate("useTerms"))}
                        </div>
                        <div
                          className={classNames(
                            "control",
                            styles.shared,
                            styles.form__input,
                            Boolean(fields.sharing.error)
                              ? styles.is_danger
                              : null
                          )}
                        >
                          <h2>
                            {parse(this.translate("SignUpForm.shareData"))}
                          </h2>
                          <div>
                            <label
                              className={classNames(
                                "radio",
                                styles.form__radio
                              )}
                            >
                              <input
                                type="radio"
                                {...fields.sharing}
                                value="sim"
                                onChange={this._onChangeSharing.bind(this)}
                                checked={
                                  fields.sharing.value != null &&
                                  fields.sharing.value == "sim"
                                }
                              />
                              {parse(
                                this.translate(
                                  "SignUpForm.radioAcceptshareData"
                                )
                              )}
                            </label>
                          </div>
                          <div>
                            <label
                              className={classNames(
                                "radio is-marginless",
                                styles.form__radio
                              )}
                            >
                              <input
                                type="radio"
                                {...fields.sharing}
                                value="nao"
                                onChange={this._onChangeSharing.bind(this)}
                                checked={
                                  fields.sharing.value != null &&
                                  fields.sharing.value == "nao"
                                }
                              />
                              {parse(
                                this.translate(
                                  "SignUpForm.radioNoAcceptshareData"
                                )
                              )}
                            </label>
                          </div>
                          {fields.sharing.error ? (
                            <i
                              className={classNames(
                                "fas fa-exclamation-triangle",
                                styles.field__warning
                              )}
                            ></i>
                          ) : null}
                          {fields.sharing.error ? (
                            <span className="help is-danger">
                              {fields.sharing.error}
                            </span>
                          ) : null}
                          {!this.state.sharingAnswers ? (
                            <div
                              className={classNames(
                                "notification is-warning",
                                styles.notification
                              )}
                            >
                              {parse(
                                this.translate(
                                  "SignUpForm.notificationNoSharingAnswers"
                                )
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              <div className="columns">
                <div
                  className={classNames(
                    "column",
                    _.result(user, "_profile") === "teacher"
                      ? ""
                      : "is-offset-2 is-8"
                  )}
                >
                  <div
                    className={classNames(
                      "control",
                      styles.form__input,
                      styles.form__submit_button
                    )}
                  >
                    <SubmitBtn
                      className={classNames("is-primary", "submitBtn", {
                        "is-loading": submitting,
                      })}
                      {...(isFetchingCities || isFetchingSchools
                        ? { disabled: true }
                        : {})}
                    >
                      {parse(this.translate("SignUpForm.btnSave"))}
                    </SubmitBtn>
                    {this.state.updateStatus != "none" ? (
                      this.state.updateStatus == "success" ? (
                        <span
                          className={classNames(
                            "has-text-success",
                            styles.update_message
                          )}
                        >
                          {parse(
                            this.translate(
                              "EditUser.messageSuccessEditUserData"
                            )
                          )}
                        </span>
                      ) : (
                        <span
                          className={classNames(
                            "has-text-danger",
                            styles.update_message
                          )}
                        >
                          Ocorreu um erro ao tentar atualizar os dados. Tente
                          novamente mais tarde.
                        </span>
                      )
                    ) : null}
                    <a
                      href="#"
                      className={classNames(
                        "button is-rounded is-pulled-right",
                        styles.remove
                      )}
                      onClick={this.showModal}
                    >
                      <i className="fa fa-times" />{" "}
                      {parse(this.translate("SignUpForm.deleteAccount"))}
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Body>
      </Layout>
    );
  }
}

EditUser.propTypes = {
  fields: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.accounts.user,
  // any props you need else
});

export default injectIntl(
  connect(mapStateToProps)(
    reduxForm({
      form: "editUser",
      fields: _.keys(schema),
    })(compose(AccountsContainer, APIDataContainer, NonUserRedir)(EditUser))
  )
);
