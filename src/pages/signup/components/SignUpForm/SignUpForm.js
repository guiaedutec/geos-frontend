import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { compose } from "redux";
import "url-search-params-polyfill";
import validate from "validate.js";
import _ from "lodash";
import classnames from "classnames";
import axios from "axios";
import Select from "react-select";
import Button from "../../../../components/Button";
import history from "~/core/history";
import API from "~/api";
import CONF from "~/api/index";
import $ from "jquery";
import { FormattedMessage, injectIntl } from "react-intl";
import parse from "html-react-parser";

// Components
import SignUpFormPrincipalFields from "./PrincipalFields";
import SignUpFormOtherProfileFields from "./OtherProfileFields";
import schema from "./schema";
import Field from "~/components/Form/Field";
import stylesField from "~/components/Form/Field.styl";
import FieldSelect from "~/components/Form/FieldSelect";
import SubmitBtn from "~/components/SubmitBtn";
import CensusFormModal from "~/components/CensusFormModal";
import Modal from "~/components/Modal";
import ReactModal from "react-modal";
import { getStages, getKnowledges, getFormation } from "~/helpers/data_const";

import APIDataContainer from "~/containers/api_data";
import AccountsContainer from "~/containers/accounts";
import ModalContainer from "~/containers/modal";

import styles from "../../signup.styl";
import stylesModal from "../../../../components/Modal/Modal.styl";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { setUserId, setUserToken } from "~/api/utils";

const createUser = (values, affiliation_id, noLogin = false, noaff = false) => {
  let user = {
    /* eslint-disable camelcase */
    profile: values.profile || "principal",
    name: values.name,
    password: values.password,
    email: values.email,
    cpf: values.cpf,
    born: values.born,
    affiliation_id: affiliation_id,
    country_id: values.country,
    province_id: values.province,
    state_id: values.state,
    city_id: values.city,
    school_id: values.school,
    inep_code: values.inepCode,
    institution: values.institution,
    role: values.role,
    stages: values.stages,
    knowledges: values.knowledges,
    term: values.term,
    sharing: values.sharing,
    formation: values.formation,
    formation_level: values.formation_level,

    /* eslint-enable camelcase */
  };
  if (values.profile === "admin_state") user.locked = true;
  if (values.origin) user.origin = values.origin;
  if (values.profile === "admin_state") {
    user.affiliation_id = values.affiliation_id;
    user.affiliation_name = values.affiliation_name;
    user.responsible_name = values.responsible_name;
    user.responsible_email = values.responsible_email;
    user.responsible_phone_number = values.responsible_phone_number;
  }

  return API.Users.create(user, noLogin, noaff);
};
class SignUpForm extends React.Component {
  submitted = false;

  constructor() {
    super();
    this.state = {
      maxDate: new Date(),
      dataConfirmation: false,
      showModalProfile: false,
      showModal: false,
      princialEmailValidate: false,
      showModal2: false,
      born: new Date(),
      stages: [],
      knowledges: [],
      knowledgesSelect: [],
      modalTerm: false,
      sharingAnswers: true,
      formationAnswers: false,
      formation_level: [],
      setUser: false,
      accountsUser: null,
      disabledAdminState: false,
      disabledAdminCity: false,
      authenticity_token: "",
      radioOption: "withLink",
      file: {},
      fileUploaded: "",
      hasFile: false,
      affiliations: [],
      affiliationsRender: [],
      country_id: "",
      geo_structure_level1_name: "",
      geo_structure_level2_name: "",
      geo_structure_level3_name: "",
      geo_structure_level4_name: "",
      isTeacherWithoutLinks: false,
      isPrincipalWithoutLinks: false,
      affiliation_id: "",
      stages_keys: [],
      knowledges_keys: [],
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModalProfile = this.handleOpenModalProfile.bind(this);
    this.handleCancelModalProfile = this.handleCancelModalProfile.bind(this);
    this.handleCloseModalAndContinue =
      this.handleCloseModalAndContinue.bind(this);
    this.handleCloseModalEmailAndContinue =
      this.handleCloseModalEmailAndContinue.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this._onClickModalTerm = this._onClickModalTerm.bind(this);
    this._onChangeFormation = this._onChangeFormation.bind(this);
    this._onChangeSharing = this._onChangeSharing.bind(this);
    this.handleButtonUserWithoutLinks =
      this.handleButtonUserWithoutLinks.bind(this);
  }

  componentDidMount() {
    this.props.fetchCountries();

    if (this.props.profile === "gestor") {
      this.fetchAffiliations();
    }
  }

  translate = (id) => this.props.intl.formatMessage({ id });

  componentDidUpdate(prevProps, prevState) {
    if (prevState.country_id !== this.state.country_id) {
      this.filterAffiliationByCountryId();
    }
    if (
      Object.keys(this.props.accounts.user).length !== 0 &&
      this.state.affiliation_id === ""
    ) {
      const user = this.props.accounts.user;
      const affiliation_id = user.affiliation_id.$oid;
      this.props.fetchSchoolsByAffiliationId(affiliation_id);
      this.setState({ affiliation_id });
    }
  }

  handleCloseModal() {
    this.setState({
      showModalProfile: false,
      showModal: false,
      showModal2: false,
    });
  }

  handleOpenModalProfile() {
    this.setState({ showModalProfile: true });
  }

  handleCancelModalProfile() {
    this.setState({ showModalProfile: false });
  }

  handleCloseModalAndContinue() {
    this.setState(
      {
        dataConfirmation: true,
        showModal: false,
      },
      () => {
        $(".submitBtn").trigger("click");
      }
    );
  }

  handleCloseModalEmailAndContinue() {
    this.setState(
      {
        princialEmailValidate: true,
        showModal2: false,
      },
      () => {
        $(".submitBtn").trigger("click");
      }
    );
  }

  handleChangeDate(date) {
    this.setState({
      born: date,
    });
  }

  _save_user(values) {
    if (values.profile.includes("principal")) {
      return axios
        .get(
          CONF.ApiURL +
            "/api/v1/validate_principal.json?schoolId=" +
            this.props.fields.school.value +
            "&email=" +
            this.props.fields.email.value,
          {}
        )
        .then((result) => {
          if (!result.data.valid) {
            if (!this.state.princialEmailValidate) {
              this.setState({ showModal2: true });
              return;
            }
          }
          return this._createUser(values);
        });
    } else {
      return this._createUser(values);
    }
  }

  _createUser(values) {
    let noaff = false;
    if (
      this.state.isPrincipalWithoutLinks ||
      this.state.isTeacherWithoutLinks
    ) {
      noaff = true;
    }

    if (!this.state.dataConfirmation && !this.props.isRouteConfig) {
      this.setState({ showModal: true });
      return Promise.resolve(true);
    }
    let affiliation_id;
    if (
      values.profile !== "admin_state" &&
      this.state.isPrincipalWithoutLinks === false &&
      this.state.isTeacherWithoutLinks === false
    ) {
      affiliation_id = this.props.apiData.schools.find(
        (school) => school._id.$oid === values.school
      ).affiliation_id;
      if (affiliation_id instanceof Object) {
        affiliation_id = affiliation_id.$oid;
      }
    }
    return createUser(
      values,
      affiliation_id,
      this.props.isRouteConfig ? true : false,
      noaff
    ).then(
      (response) => {
        if (response._id) {
          if (this.props.isRouteConfig) {
            if (this.props.profile === "escola") {
              window.location = "/listar-usuario/diretores";
            }
            if (this.props.profile === "educador") {
              window.location = "/listar-usuario/professores";
            }
            this.submitted = true;
            return;
          } else {
            setUserToken(response.authenticity_token);
            setUserId(response._id.$oid);

            this.props.loginUser({
              email: values.email,
              password: values.password,
            });

            // this.setState({ authenticity_token: response.authenticity_token });
            if (this.props.profile === "gestor") {
              API.Users.uploadTerm(
                this.state.file,
                response.authenticity_token
              );
            }
            // this.submitted = true;
            if (values.profile.includes("principal")) {
              this.props.toggleModal();
            }
            if (this.props.profile === "gestor") {
              API.Users.logout();
              history.replace("/");
            } else {
              history.replace("/recursos");
            }
            return;
          }
        } else {
          var email = $('[name="email"]').first().parent();

          $("html, body").animate(
            {
              scrollTop: email.offset().top - 100,
            },
            400
          );
          return response;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  _submit(values) {
    const params = new URLSearchParams(window.location.search);
    if (params.get("origem") !== null) values.origin = params.get("origem");

    if (values.sharing === "sim") {
      values.sharing = true;
    } else if (values.sharing === "nao") {
      values.sharing = false;
    }

    if (values.formation === "sim") {
      values.formation = true;
    } else if (values.formation === "nao") {
      values.formation = false;
    }

    if (values.school_type === "Particular") {
      values.school =
        this.props.apiData.schools.length > 0 &&
        this.props.apiData.schools[0].school_id;
      values.institution = this.props.fields.institution.value;
    } else {
      values.institution = undefined;
    }

    values.born = this.state.born ? this.state.born : undefined;

    values.email = values.email ? values.email.trim() : values.email;
    values.emailConfirmation = values.emailConfirmation
      ? values.emailConfirmation.trim()
      : values.emailConfirmation;

    values.formation_level =
      this.state.formation_level.length > 0
        ? this.state.formation_level
        : undefined;
    values.stages = this.state.stages_keys;
    values.knowledges = this.state.knowledges_keys;
    values.profile =
      this.props.profile === "educador"
        ? "teacher"
        : this.props.profile === "escola"
        ? "principal"
        : "admin_state";
    values.term = this.props.fields.term.checked
      ? this.props.fields.term.checked
      : undefined;

    values.isTeacherWithoutLinks = this.state.isTeacherWithoutLinks;
    values.isPrincipalWithoutLinks = this.state.isPrincipalWithoutLinks;

    return new Promise((resolve, reject) => {
      const errors = _.mapValues(
        validate(values, schema, { fullMessages: false }),
        (value) => {
          return value[0];
        }
      );
      delete values["isTeacherWithoutLinks"];
      delete values["isPrincipalWithoutLinks"];
      /* eslint-disable no-console */
      if (_.isEmpty(errors)) {
        this._save_user(values).then(
          (err) => {
            reject(err);
          },
          (errors) => {
            reject(errors);
          }
        );
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
  }

  _onChangeStages(options) {
    options = options || [];
    const values = _.isArray(options)
      ? options.map((option) => option.value)
      : [options && options.value];

    const options_keys = options.map((option) => option.key);
    const stages_keys_without_duplicates = [...new Set(options_keys)];

    let know = [];

    values.forEach((s) => {
      getKnowledges(this.props).forEach((k) => {
        if (s.includes(k.label)) {
          know.push(k);
        }
      });
    });

    this.setState({
      stages: options || [],
      stages_keys: stages_keys_without_duplicates,
      knowledgesSelect: know,
    });
  }

  _onChangeKnowledges(options) {
    options = options || [];
    const options_keys = options.map((option) => option.key);
    const knowledges_keys_without_duplicates = [...new Set(options_keys)];
    this.props.fields.knowledges.onChange(options);
    this.setState({
      knowledges: options,
      knowledges_keys: knowledges_keys_without_duplicates,
      knowledgesDyn: options,
    });
  }

  _onChangeFormation(e) {
    if (e.target.value == "sim") {
      this.setState({
        formationAnswers: true,
      });
    } else if (e.target.value == "nao") {
      this.setState({
        formationAnswers: false,
      });
    }
  }

  _onChangeFormationLevel(options) {
    const values = _.isArray(options)
      ? options.map((option) => option.value)
      : [options && options.value];

    this.setState({
      formation_level: values,
    });
  }

  _onChangeSharing(e) {
    if (e.target.value == "sim") {
      this.setState({
        sharingAnswers: true,
      });
    } else if (e.target.value == "nao") {
      this.setState({
        sharingAnswers: false,
      });
    }
  }

  _onClickModalTerm() {
    this.setState({
      modalTerm: true,
    });
  }

  _closeModal() {
    this.setState({
      modalTerm: false,
    });
  }

  insertGeographicElements = (e) => {
    if (
      this.props.accounts.user &&
      Object.keys(this.props.accounts.user).length !== 0 &&
      this.props.apiData.schools
    ) {
      const selectedSchool = this.props.apiData.schools.find(
        (school) => school.affiliation_id.$oid === this.state.affiliation_id
      );
      const country_id = selectedSchool.country_id.$oid
        ? selectedSchool.country_id.$oid
        : selectedSchool.country_id;
      const province_id = selectedSchool.province_id.$oid
        ? selectedSchool.province_id.$oid
        : selectedSchool.province_id;
      const state_id = selectedSchool.state_id.$oid
        ? selectedSchool.state_id.$oid
        : selectedSchool.state_id;
      const city_id = selectedSchool.city_id.$oid
        ? selectedSchool.city_id.$oid
        : selectedSchool.city_id;
      this.props.fields.school.onChange(e.target.value);
      this.props.fields.country.onChange(country_id);
      this.props.fields.province.onChange(province_id);
      this.props.fields.state.onChange(state_id);
      this.props.fields.city.onChange(city_id);
    } else {
      this.props.fields.school.onChange(e.target.value);
    }
  };

  getProvinces = (e) => {
    const country_id = e.target.value;
    if (country_id) {
      this.props.fetchProvinces(country_id);
    }
  };

  getStates = (e) => {
    const province_id = e.target.value;
    if (province_id) {
      this.props.fetchStates(this.props.fields.country.value, province_id);
    }
  };

  getCities = (e) => {
    const state_id = e.target.value;
    if (state_id) {
      this.props.fetchCities(
        this.props.fields.country.value,
        this.props.fields.province.value,
        state_id
      );
    }
  };

  getSchools = (e) => {
    const city_id = e.target.value;
    if (city_id) {
      this.props.fetchSchools(
        this.props.fields.country.value,
        this.props.fields.province.value,
        this.props.fields.state.value,
        city_id
      );
    }
  };

  updateSelectedAffiliation = (e) => {
    if (e) {
      var index = e.target.selectedIndex;
      var optionElement = e.target.childNodes[index];
      var optionName = optionElement.getAttribute("name");
      this.props.fields.affiliation_name.onChange(optionName);
      this.props.fields.affiliation_id.onChange(e);
    }
  };

  updateGeographicElements = (country_id) => {
    const {
      geo_structure_level1_name,
      geo_structure_level2_name,
      geo_structure_level3_name,
      geo_structure_level4_name,
    } = this.props.apiData.countries.find(
      (country) => country._id.$oid === country_id
    );
    this.setState({
      geo_structure_level1_name,
      geo_structure_level2_name,
      geo_structure_level3_name,
      geo_structure_level4_name,
    });
  };

  updateSelectedCountry = (e) => {
    if (e) {
      this.props.fields.province.onChange("");
      this.props.fields.state.onChange("");
      this.props.fields.city.onChange("");
      this.props.fields.school.onChange("");
      this.props.fields.country.onChange(e);
      this.updateGeographicElements(e.target.value);
      this.setState({
        country_id: e.target.value,
      });
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

  fileUpload(file) {
    const formData = new FormData();
    this.setState({ fileUploaded: file.name });
    this.setState({ hasFile: true });
    formData.append("file", file);
    this.setState({ file: formData });
  }

  filterAffiliationByCountryId() {
    const affiliations = this.state.affiliations.filter(
      (affiliation) => affiliation.country_id.$oid === this.state.country_id
    );
    this.setState({ affiliationsRender: affiliations });
  }

  async fetchAffiliations() {
    const URL_REQUEST = CONF.ApiURL + `/api/v1/institutions`;
    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ affiliations: response.data.data });
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }

  handleButtonUserWithoutLinks(e, hasLink, radioOption) {
    this.setState({ radioOption });
    if (radioOption === "withLink") {
      document.getElementById("withoutLink").checked = false;
    } else {
      document.getElementById("withLink").checked = false;
    }

    if (this.props.profile === "educador") {
      this.setState({
        isTeacherWithoutLinks: hasLink,
      });
    }
    if (this.props.profile === "escola") {
      this.setState({
        isPrincipalWithoutLinks: hasLink,
      });
    }
    if (
      this.state.isTeacherWithoutLinks == false ||
      this.state.isPrincipalWithoutLinks === false
    ) {
      this.clearFieldsAreNotRequiredToWithoutLinks();
    }
  }

  clearFieldsAreNotRequiredToWithoutLinks() {
    this.props.fields.country.onChange("");
    this.props.fields.province.onChange("");
    this.props.fields.state.onChange("");
    this.props.fields.city.onChange("");
    this.props.fields.school.onChange("");
    this.props.fields.sharing.onChange("");
  }

  render() {
    const { fields, handleSubmit, submitting, apiData } = this.props;

    const {
      isFetchingCity,
      isFetchingSchools,
      isFetchingCountry,
      isFetichingState,
    } = apiData;

    const onSubmit = handleSubmit(this._submit.bind(this));

    return (
      <div>
        {this.props.profile === "gestor" ? (
          <ReactModal
            isOpen={this.state.showModal}
            className={classnames(stylesModal.modal)}
            overlayClassName={classnames(stylesModal.overlay)}
          >
            <div className={classnames(stylesModal.modal__header)}>
              <h4>
                {parse(this.translate("ModalSignUpFormAdminState.title"))}
              </h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              {parse(this.translate("ModalSignUpFormAdminState.description"))}

              <p>
                <strong>
                  {parse(this.translate("ModalSignUpFormAdminState.network"))}{" "}
                  {this.props.fields.school_type.value}:{" "}
                </strong>{" "}
                {$("select[name='city'] :checked").text() +
                  "/" +
                  $("select[name='state'] :checked").text()}
              </p>
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames(
                  "button is-danger",
                  stylesModal.modal__btn
                )}
                onClick={this.handleCloseModal}
              >
                {parse(this.translate("ModalSignUpFormAdminState.btnRectify"))}
              </button>
              <button
                className={classnames(
                  "button is-primary",
                  stylesModal.modal__btn
                )}
                onClick={this.handleCloseModalAndContinue}
              >
                {parse(this.translate("ModalSignUpFormAdminState.btnConfirm"))}
              </button>
            </div>
          </ReactModal>
        ) : (
          <ReactModal
            isOpen={this.state.showModal}
            className={classnames(stylesModal.modal)}
            overlayClassName={classnames(stylesModal.overlay)}
          >
            <div className={classnames(stylesModal.modal__header)}>
              <h4>{parse(this.translate("ModalSignUpFormTeachers.title"))}</h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              {!this.state.isTeacherWithoutLinks &&
              !this.state.isPrincipalWithoutLinks ? (
                <div>
                  {this.props.profile === "educador" ? (
                    parse(this.translate("ModalSignUpFormTeachers.description"))
                  ) : (
                    <p>
                      {parse(
                        this.translate("ModalSignUpFormDirectors.description")
                      )}
                    </p>
                  )}
                  <p>
                    <strong>
                      {parse(
                        this.translate("ModalSignUpFormDirectors.network")
                      )}
                      {this.props.fields.school_type.value}:{" "}
                    </strong>{" "}
                    {$("select[name='city'] :checked").text() +
                      "/" +
                      $("select[name='state'] :checked").text()}
                  </p>
                  <p>
                    <strong>
                      {parse(this.translate("ModalSignUpFormDirectors.school"))}
                      :
                    </strong>{" "}
                    {fields.school_type.value == "Particular"
                      ? fields.institution.value
                      : $("select[name='school'] :checked").text()}{" "}
                  </p>
                </div>
              ) : (
                <div>
                  {this.state.isTeacherWithoutLinks
                    ? parse(
                        this.translate(
                          "ModalSignUpFormTeachers.withoutLinksDescription"
                        )
                      )
                    : this.state.isPrincipalWithoutLinks &&
                      parse(
                        this.translate(
                          "ModalSignUpFormDirectors.withoutLinksDescription"
                        )
                      )}
                </div>
              )}
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames(
                  "button is-danger",
                  stylesModal.modal__btn
                )}
                onClick={this.handleCloseModal}
              >
                {parse(
                  this.translate("SignUpFormDirectors.ModalRegister.btnRectify")
                )}
              </button>
              <button
                className={classnames(
                  "button is-primary",
                  stylesModal.modal__btn
                )}
                onClick={this.handleCloseModalAndContinue}
              >
                {parse(
                  this.translate("SignUpFormDirectors.ModalRegister.btnConfirm")
                )}
              </button>
            </div>
          </ReactModal>
        )}

        <ReactModal
          isOpen={this.state.showModal2}
          className={classnames(stylesModal.modal)}
          overlayClassName={classnames(stylesModal.overlay)}
        >
          <div className={classnames(stylesModal.modal__header)}>
            <h4>{parse(this.translate("ModalSignUpFormDirectors.title"))}</h4>
          </div>
          <div className={classnames(stylesModal.modal__body)}>
            {parse(this.translate("ModalSignUpFormDirectors.description"))}
          </div>
          <div className={classnames(stylesModal.modal__footer)}>
            <button
              className={classnames("button", stylesModal.modal__btn)}
              onClick={this.handleCloseModal}
            >
              {parse(this.translate("ModalSignUpFormDirectors.btnRectify"))}
            </button>
            <button
              className={classnames("button", stylesModal.modal__btn)}
              onClick={this.handleCloseModalEmailAndContinue}
            >
              {parse(this.translate("ModalSignUpFormDirectors.btnConfirm"))}
            </button>
          </div>
        </ReactModal>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className="box">
            <h1 className={styles.title_section}>
              {parse(this.translate("SignUpForm.personalData"))}
            </h1>
            <Field
              label={this.translate("SignUpForm.label.name")}
              classField="slim"
              {...fields.name}
            />
            {this.props.profile === "educador" ? (
              <div className="columns is-marginless">
                <div className={classnames("column is-half", styles.form_cpf)}>
                  <Field
                    label={this.translate("SignUpForm.label.cpf")}
                    classField="slim"
                    description={this.translate("SignUpForm.description.cpf")}
                    {...fields.cpf}
                  />
                </div>
                <div className={classnames("column is-half", styles.form_born)}>
                  <label className={classnames("label", styles.form__label)}>
                    {parse(this.translate("SignUpForm.label.birthDate"))}
                  </label>
                  <div
                    className={classnames(
                      "is-small",
                      styles.field__description
                    )}
                  >
                    {parse(this.translate("SignUpForm.description.birthDate"))}
                  </div>
                  <div className={styles.is_relative}>
                    <div
                      className={classnames(
                        "control react-datepicker-width-large"
                      )}
                    >
                      <DatePicker
                        name="born"
                        className={classnames(
                          "input",
                          styles.field__datepicker,
                          Boolean(fields.born.error) ? styles.is_danger : null
                        )}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        selected={this.state.born}
                        onChange={this.handleChangeDate}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                    <i
                      className={classnames(
                        "fas fa-calendar-alt",
                        styles.field__calendar
                      )}
                    ></i>
                    {fields.born.error ? (
                      <i
                        className={classnames(
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
              </div>
            ) : null}
            <Field
              label={this.translate("SignUpForm.label.email")}
              classField="slim"
              description={this.translate("SignUpForm.description.email")}
              {...fields.email}
            />
            <Field
              label={this.translate("SignUpForm.label.emailConfirmation")}
              classField="slim"
              {...fields.emailConfirmation}
            />
            <Field
              label={this.translate("SignUpForm.label.password")}
              type="password"
              classField="slim"
              {...fields.password}
            />
            <Field
              label={this.translate("SignUpForm.label.confirmPassword")}
              type="password"
              classField="slim"
              {...fields.confirmPassword}
            />
          </div>

          <div className="box">
            <h1 className={styles.title_section}>
              {parse(this.translate("SignUpForm.professionalsData"))}
            </h1>

            {/* País */}
            {this.state.isTeacherWithoutLinks === false &&
              this.state.isPrincipalWithoutLinks === false && (
                <div>
                  {this.props.accounts.user &&
                    Object.keys(this.props.accounts.user).length === 0 && (
                      <div>
                        <label
                          className={classnames("label", styles.form__label)}
                        >
                          {parse(this.translate("SignUpForm.label.region"))}
                        </label>
                        <div
                          className={classnames("control", styles.form__input, {
                            "has-icon has-icon-right": Boolean(
                              fields.country.error
                            ),
                          })}
                        >
                          <span
                            className={classnames(
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
                            >
                              <option value="">
                                {this.translate("SignUpForm.selectRegion")}
                              </option>
                              {this.props.apiData.countries instanceof Array &&
                                this.props.apiData.countries.map((country) => (
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
                              className={classnames(
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
                        <label
                          className={classnames("label", styles.form__label)}
                        >
                          {this.state.geo_structure_level2_name === ""
                            ? parse(this.translate("SignUpForm.label.province"))
                            : this.state.geo_structure_level2_name}
                        </label>
                        <div
                          className={classnames("control", styles.form__input, {
                            "has-icon has-icon-right": Boolean(
                              fields.province.error
                            ),
                          })}
                        >
                          <span
                            className={classnames(
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
                              disabled={
                                fields.country.value === "" ? true : false
                              }
                            >
                              <option value="">
                                {this.translate("SignUpForm.selectProvince")}
                              </option>
                              {this.props.apiData.provinces.map((province) => (
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
                              className={classnames(
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
                        <label
                          className={classnames("label", styles.form__label)}
                        >
                          {this.state.geo_structure_level3_name === ""
                            ? parse(this.translate("SignUpForm.label.state"))
                            : this.state.geo_structure_level3_name}
                        </label>
                        <div
                          className={classnames("control", styles.form__input, {
                            "has-icon has-icon-right": Boolean(
                              fields.state.error
                            ),
                          })}
                        >
                          <span
                            className={classnames(
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
                              disabled={
                                fields.province.value === "" ? true : false
                              }
                            >
                              <option value="">
                                {this.translate("SignUpForm.selectState")}
                              </option>
                              {this.props.apiData.states.map((state) => (
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
                              className={classnames(
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
                      </div>
                    )}
                  <SignUpFormPrincipalFields
                    getSchools={this.getSchools}
                    insertGeographicElements={this.insertGeographicElements}
                    updateSelectedCity={this.updateSelectedCity}
                    fields={fields}
                    apiData={this.props.apiData}
                    disabled={this.state.disabledAdminCity}
                    profile={this.props.profile}
                    geo_structure_level4_name={
                      this.state.geo_structure_level4_name
                    }
                    user={this.props.accounts.user}
                  />
                  {this.props.profile !== "gestor" && <hr></hr>}
                </div>
              )}
            {this.props.profile === "educador" ? (
              <div>
                <FieldSelect
                  name="stages"
                  error={fields.stages.error}
                  label={this.translate("SignUpForm.label.teachingStages")}
                  options={getStages(this.props)}
                  classField="slim"
                  onChange={this._onChangeStages.bind(this)}
                  noOptionsMessage={() => {
                    return parse(this.translate("SignUpForm.noOptions"));
                  }}
                  loadingMessage={() => {
                    return "Carregando...";
                  }}
                  placeholder={this.translate(
                    "SignUpForm.placeholderSelectOptions"
                  )}
                />
                <FieldSelect
                  name="knowledges"
                  error={fields.knowledges.error}
                  label={this.translate("SignUpForm.label.knowledges")}
                  options={this.state.knowledgesSelect}
                  classField="slim"
                  onChange={this._onChangeKnowledges.bind(this)}
                  noOptionsMessage={() => {
                    return parse(this.translate("SignUpForm.noOptions"));
                  }}
                  loadingMessage={() => {
                    return "Carregando...";
                  }}
                  placeholder={this.translate(
                    "SignUpForm.placeholderSelectOptions"
                  )}
                />
                {this.props.profile !== "gestor" && <hr></hr>}
              </div>
            ) : null}

            {this.props.profile !== "gestor" && (
              <div style={{ marginTop: "10px" }}>
                <input
                  type="radio"
                  id="withLink"
                  name="link"
                  style={{ marginBottom: "12px" }}
                  checked={this.state.radioOption === "withLink"}
                  onChange={(e) =>
                    this.handleButtonUserWithoutLinks(e, false, "withLink")
                  }
                />
                 {" "}
                <label for="withLink">
                  {parse(this.translate("SignUpForm.withLink"))}
                </label>
                <br />
                <input
                  type="radio"
                  id="withoutLink"
                  name="link"
                  checked={this.state.radioOption === "withoutLink"}
                  onChange={(e) =>
                    this.handleButtonUserWithoutLinks(e, true, "withoutLink")
                  }
                />
                 {" "}
                <label for="withoutLink">
                  {parse(this.translate("SignUpForm.noLink"))}
                </label>
              </div>
            )}
          </div>

          {this.props.profile === "gestor" && (
            <div className="box">
              <h1 className={styles.title_section}>
                {parse(
                  this.translate("SignUpFormAdminStates.affiliationBox.title")
                )}
              </h1>
              <label className={classnames("label", styles.form__label)}>
                {parse(
                  this.translate(
                    "SignUpFormAdminStates.affiliationBox.affiliationName"
                  )
                )}
              </label>
              <span style={{ fontSize: "0.9em", fontStyle: "italic" }}>
                {parse(
                  this.translate(
                    "SignUpFormAdminStates.affiliationBox.affiliationDescription"
                  )
                )}
              </span>
              <div
                className={classnames("control", styles.form__input, {
                  "has-icon has-icon-right": Boolean(
                    fields.affiliation_id.error
                  ),
                })}
              >
                <span
                  className={classnames("select", styles.form__select, {
                    "is-danger": Boolean(fields.affiliation_id.error),
                  })}
                >
                  <select
                    {...fields.affiliation_id}
                    onChange={(e) => {
                      this.updateSelectedAffiliation(e);
                    }}
                  >
                    <option value="">
                      {this.translate(
                        "SignUpFormAdminStates.affiliationBox.selectAffiliation"
                      )}
                      {/* {parse(this.translate("SignUpFormAdminStates.affiliationBox.selectAffiliation"))} */}
                    </option>
                    {this.state.affiliationsRender instanceof Array &&
                      this.state.affiliationsRender.map((affiliation) => (
                        <option
                          key={affiliation._id.$oid}
                          value={affiliation._id.$oid}
                          name={affiliation.name}
                        >
                          {affiliation.name}
                        </option>
                      ))}
                  </select>
                </span>
                {fields.affiliation_id.error ? (
                  <i
                    className={classnames(
                      "fas fa-exclamation-triangle",
                      stylesField.field__warning
                    )}
                  ></i>
                ) : null}
                {fields.affiliation_id.error ? (
                  <span className="help is-danger">
                    {fields.affiliation_id.error}
                  </span>
                ) : null}
              </div>
              <Field
                label={this.translate(
                  "SignUpFormAdminStates.affiliationBox.responsibleName"
                )}
                classField="slim"
                {...fields.responsible_name}
              />
              <Field
                label={this.translate(
                  "SignUpFormAdminStates.affiliationBox.responsibleEmail"
                )}
                classField="slim"
                {...fields.responsible_email}
              />
              <Field
                label={this.translate(
                  "SignUpFormAdminStates.affiliationBox.responsiblePhoneNumber"
                )}
                classField="slim"
                {...fields.responsible_phone_number}
              />
            </div>
          )}

          {this.props.profile === "gestor" && (
            <div className="box">
              <h1 className={styles.title_section}>
                {parse(this.translate("SignUpFormAdminStates.term.title"))}
              </h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                <div>
                  <a
                    className={styles.termLink}
                    target="_blank"
                    href={parse(this.translate("StaticLinks.termLink"))}
                  >
                    {parse(this.translate("SignUpFormAdminStates.term.link"))}
                  </a>
                </div>
                <h1 className={styles.uploadDescription}>
                  {parse(this.translate("SignUpFormAdminStates.term.upload"))}
                </h1>
                <div>
                  <label className={styles.form_label_input_file}>
                    {this.state.fileUploaded === ""
                      ? this.translate("SignUpFormAdminStates.term.selectFile")
                      : this.state.fileUploaded}

                    <input
                      type="file"
                      name="file"
                      style={{ display: "none" }}
                      onChange={(e) => this.fileUpload(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
          {this.props.profile === "educador" ? (
            <div className="box">
              <h1 className={styles.title_section}>
                {parse(this.translate("SignUpForm.formationTitle"))}
              </h1>
              <label className={classnames("label", styles.form__label)}>
                {parse(this.translate("SignUpForm.label.formation"))}
              </label>
              <div className={styles.is_relative}>
                <div
                  className={classnames(
                    "control columns",
                    styles.form__input,
                    Boolean(fields.formation.error) ? styles.is_danger : null
                  )}
                >
                  <label
                    className={classnames(
                      "radio column is-half",
                      styles.form__radio
                    )}
                  >
                    <input
                      type="radio"
                      {...fields.formation}
                      onClick={this._onChangeFormation}
                      value="sim"
                    />
                    {parse(this.translate("SignUpForm.yes"))}
                  </label>
                  <label
                    className={classnames(
                      "radio column is-half",
                      styles.form__radio
                    )}
                  >
                    <input
                      type="radio"
                      {...fields.formation}
                      onClick={this._onChangeFormation}
                      value="nao"
                    />
                    {parse(this.translate("SignUpForm.no"))}
                  </label>
                </div>
                {fields.formation.error ? (
                  <i
                    className={classnames(
                      "fas fa-exclamation-triangle",
                      styles.field__warning
                    )}
                  ></i>
                ) : null}
                {fields.formation.error ? (
                  <span className="help is-danger">
                    {fields.formation.error}
                  </span>
                ) : null}
              </div>

              {this.state.formationAnswers ? (
                <FieldSelect
                  name="formation_level"
                  error={fields.formation_level.error}
                  label={parse(
                    this.translate("SignUpForm.label.formationLevel")
                  )}
                  options={getFormation(this.props)}
                  classField="slim"
                  onChange={this._onChangeFormationLevel.bind(this)}
                  noOptionsMessage={() => {
                    return parse(this.translate("SignUpForm.noOptions"));
                  }}
                  loadingMessage={() => {
                    return parse(this.translate("Global.loading"));
                  }}
                  placeholder={this.translate(
                    "SignUpForm.placeholderSelectOptions"
                  )}
                />
              ) : null}
            </div>
          ) : null}
          {this.props.profile === "educador" ? (
            <div>
              <div
                className={classnames(
                  "control",
                  styles.form__input,
                  Boolean(fields.term.error) ? styles.is_danger : null
                )}
              >
                <input
                  type="checkbox"
                  {...fields.term}
                  className={styles.form__checkbox}
                />
                <FormattedMessage
                  id="SignUpForm.acceptTermsOfUse"
                  values={{
                    termsOfUseLink: (
                      <a onClick={this._onClickModalTerm}>
                        {this.translate("SignUpForm.termsOfUse")}
                      </a>
                    ),
                  }}
                />

                {fields.term.error ? (
                  <i
                    className={classnames(
                      "fas fa-exclamation-triangle",
                      styles.field__warning
                    )}
                  ></i>
                ) : null}
                {fields.term.error ? (
                  <span className="help is-danger">{fields.term.error}</span>
                ) : null}
              </div>
              {this.state.isTeacherWithoutLinks === false && (
                <div>
                  <label
                    className={classnames(
                      "label",
                      styles.form__label,
                      styles.sharing
                    )}
                  >
                    {parse(this.translate("SignUpForm.shareData"))}
                  </label>
                  <div className={styles.is_relative}>
                    <div
                      className={classnames(
                        "control",
                        styles.form__input,
                        Boolean(fields.sharing.error) ? styles.is_danger : null
                      )}
                    >
                      <div>
                        <label
                          className={classnames("radio", styles.form__radio)}
                        >
                          <input
                            type="radio"
                            {...fields.sharing}
                            onClick={this._onChangeSharing}
                            value="sim"
                          />
                          {parse(
                            this.translate("SignUpForm.radioAcceptshareData")
                          )}
                        </label>
                      </div>
                      <div>
                        <label
                          className={classnames(
                            "radio is-marginless",
                            styles.form__radio
                          )}
                        >
                          <input
                            type="radio"
                            {...fields.sharing}
                            onClick={this._onChangeSharing}
                            value="nao"
                          />
                          {parse(
                            this.translate("SignUpForm.radioNoAcceptshareData")
                          )}
                        </label>
                      </div>
                    </div>
                    {fields.sharing.error ? (
                      <i
                        className={classnames(
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
                      <div className="notification is-warning">
                        {parse(
                          this.translate(
                            "SignUpForm.radioNoAcceptshareDataDescription"
                          )
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ) : null}
          <div
            className={classnames(
              "control",
              styles.form__input,
              styles.form__submit_button
            )}
          >
            <SubmitBtn
              className={classnames("is-primary", "submitBtn", {
                "is-loading": submitting,
              })}
              {...(isFetchingSchools ? { disabled: true } : {})}
              disabled={
                this.props.profile === "gestor" ? !this.state.hasFile : false
              }
            >
              {parse(this.translate("SignUpForm.register"))}
            </SubmitBtn>
          </div>
        </form>

        <Modal
          isActive={this.state.modalTerm}
          title="Termos de Uso - Guia EduTec Autoavaliação de Competências Digitais de Professores"
          className={styles.modal_termo}
          closeModal={() => this._closeModal()}
          print={true}
          children={parse(this.translate("useTerms"))}
        />

        {this.submitted && (
          <CensusFormModal
            isActive={this.props.modal.isActive}
            toggleModal={this.props.toggleModal}
            schoolId={this.props.fields.school.value}
          />
        )}
      </div>
    );
  }
}

SignUpForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default injectIntl(
  reduxForm({
    form: "signUpForm",
    fields: _.keys(schema),
  })(compose(APIDataContainer, AccountsContainer, ModalContainer)(SignUpForm))
);
