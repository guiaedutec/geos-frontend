import React from "react";
import { reduxForm } from "redux-form";
import Field from "~/components/Form/Field";
import SubmitBtn from "~/components/SubmitBtn";
import FieldSimpleSelect from "~/components/Form/FieldSimpleSelect";
import schema from "./schema";
import _ from "lodash";
import classNames from "classnames";
import styles from "../../technical.styl";
import stylesField from "~/components/Form/Field.styl";
import { SubmissionError } from "redux-form";
import { compose } from "redux";
import { isAdmin, isStateAdmin, isCityAdmin } from "~/helpers/users";
import APIDataContainer from "~/containers/api_data";
import API from "~/api";
import { getSelectOptions } from "~/helpers/get-select-options";
import { FormattedMessage, injectIntl } from "react-intl";
import parse from "html-react-parser";
import { BarLoader } from "react-spinners";
import classnames from "classnames";
import ReactModal from "react-modal";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminRedir from "~/containers/non_admin_redir";
import AccountsContainer from "~/containers/accounts";
import stylesModal from "../../../../components/Modal/Modal.styl";
import CONF from "~/api/index";
import { getUserToken } from "~/api/utils";
import axios from "axios";
import history from "~/core/history";
import Button from "../../../../components/Button";

var getQueryString = function (field, url) {
  var href = url ? url : window.location.href;
  var reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
  var string = reg.exec(href);
  return string ? string[1] : null;
};

var formatRejectErrors = (response) => {
  let rej_errors = {};
  Object.keys(response).forEach(function (key) {
    rej_errors[key] = response[key];
  });

  return rej_errors;
};

class TechnicalForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      country_id: "",
      geo_structure_level1_name: "",
      geo_structure_level2_name: "",
      geo_structure_level3_name: "",
      geo_structure_level4_name: "",
      hasCountryId: false,
      user_id: "",
      regionals: [],
      showModal: false,
      idToBeRemoved: "",
    };
    this.remove = this.remove.bind(this);
  }

  getLang = () => localStorage.getItem("lang");

  async remove() {
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/users/${this.state.user_id}.json?access_token=${getUserToken()}`;

    try {
      await axios.delete(URL_REQUEST, {
        user: { _id: this.state.user_id },
      });
      this.setState({ showModal: !this.state.showModal });
      history.push("/listar-usuario/administradores");
    } catch (error) {
      console.log(error);
    }
  }

  showModal = (id) => {
    this.setState({ showModal: !this.state.showModal });
    if (typeof id === "string") this.setState({ idToBeRemoved: id });
  };

  _updateSelectedProfile(event) {
    if (event) {
      var index = event.target.selectedIndex;
      var optionElement = event.target.childNodes[index];
      var optionName = optionElement.getAttribute("name");
      this.props.fields.type.onChange(optionName);
      this.props.fields.profile.onChange(event);
    }
  }

  _updateSelectedCity(event) {
    this.props.fields.city_id.onChange(event);
  }

  _updateSelectedRegional(event) {
    this.props.fields.regional.onChange(event);
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  _submit(values) {
    const state_id = _.get(this.props, "accounts.user.state_id.$oid");
    // console.log({
    //   profile: values.profile ? values.profile : "",
    //   name: values.name ? values.name : "",
    //   email: values.email ? values.email : "",
    //   province_id: values.province ? values.province : "",
    //   state_id: values.state ? values.state : "",
    //   city_id: values.city ? values.city : "",
    //   regional: values.regional ? values.regional : "",
    //   country_id: this.state.country_id ? this.state.country_id : "",
    // });
    if (this.state.user_id) {
      //update
      return new Promise((resolve, reject) => {
        const data = {
          _id: this.state.user_id,
          profile: values.profile ? values.profile : "",
          name: values.name ? values.name : "",
          email: values.email ? values.email : "",
          province_id: values.province ? values.province : "",
          country_id: this.state.country_id ? this.state.country_id : "",
          state_id: values.state ? values.state : "",
          city_id: values.city ? values.city : "",
          type: values.type ? values.type : "",
          regional: values.regional,
        };

        if (values.regional) {
          data["regional"] = values.regional;
        }

        API.Users.patch(data).then(
          (response) => {
            if (response._id) {
              window.location = "/listar-usuario/administradores";
              resolve();
            } else {
              reject(formatRejectErrors(response));
            }
          },
          (err) => {
            reject({
              _error: this.translate("TechnicalForm.updateErrorMessage"),
            });
          }
        );
      });
    } else {
      //create

      return new Promise((resolve, reject) => {
        const data = {
          profile: values.profile ? values.profile : "",
          name: values.name ? values.name : "",
          email: values.email ? values.email : "",
          password: values.password ? values.password : "",
          affiliation_id:
            this.props.accounts.user &&
            this.props.accounts.user.affiliation_id.$oid,
          province_id: values.province ? values.province : "",
          state_id: values.state ? values.state : "",
          city_id: values.city ? values.city : "",
          country_id: this.state.country_id ? this.state.country_id : "",
          type: values.type ? values.type : "",
        };
        if (values.regional) {
          data["regional"] = values.regional;
        }
        API.Users.create(data, true).then(
          (response) => {
            if (response._id) {
              window.location = "/listar-usuario/administradores";
              resolve();
            } else {
              reject(formatRejectErrors(response));
            }
          },
          (err) => {
            reject({
              _error: this.translate("TechnicalForm.createErrorMessage"),
            });
          }
        );
      });
    }
  }

  async componentDidMount() {
    await this.props.fetchCountries();
    if (this.props.accounts.user.country_id) {
      const country_id = this.props.accounts.user.country_id.$oid;
      this.setState({ country_id: country_id });
      this.updateGeographicElements(country_id);
      this.props.fetchProvinces(country_id);
    }
    const response = await API.Schools.findRegionals();
    this.setState({ regionals: response });
  }

  componentDidUpdate() {
    if (!this.props.accounts.user.country_id && !hasCountryId) {
      const country_id = this.props.accounts.user.country_id.$oid;
      this.setState({ country_id: country_id, hasCountryId: true });
      this.updateGeographicElements(country_id);
      this.props.fetchProvinces(country_id);
    }
  }

  componentWillMount() {
    this.props.loginWithToken().then(() => {
      // this.props.fetchRegionals();
      this.loadData();
      // if (isCityAdmin(this.props.accounts.user)) {
      //   this.props.fields.city_id.onChange(
      //     this.props.accounts.user.city_id.$oid
      //   );
      // }
    });
  }

  loadData() {
    var idParam = getQueryString("id");
    this.setState({ user_id: idParam });
    if (idParam) {
      //fill form with row to be updated
      API.Users.find(idParam).then((userFound) => {
        const country_id = this.state.country_id;
        const province_id =
          userFound.province_id && userFound.province_id.$oid
            ? userFound.province_id.$oid
            : userFound.province_id;
        const state_id =
          userFound.state_id && userFound.state_id.$oid
            ? userFound.state_id.$oid
            : userFound.state_id;
        const city_id =
          userFound.city_id && userFound.city_id.$oid
            ? userFound.city_id.$oid
            : userFound.city_id;

        this.props.fetchStates(country_id, province_id);
        this.props.fetchCities(country_id, province_id, state_id);
        this.props.fields.profile.onChange(userFound._profile);
        this.props.fields.name.onChange(userFound.name);
        this.props.fields.email.onChange(userFound.email);
        this.props.fields.type.onChange(userFound.type);
        userFound.province_id &&
          this.props.fields.province.onChange(province_id);
        userFound.state_id && this.props.fields.state.onChange(state_id);
        userFound.city_id && this.props.fields.city.onChange(city_id);

        // API.Schools.findRegionals();

        if (userFound.regional) {
          this.props.fields.regional.onChange(userFound.regional);
        }
      });
    }
  }

  handleChange(event) {
    // Call the event supplied by redux-form.
    this.props.onChange(event);
  }

  getProvinces = (e) => {
    const country_id = e.target.value;
    this.props.fetchProvinces(country_id);
  };

  getStates = (e) => {
    const province_id = e.target.value;
    this.props.fetchStates(this.state.country_id, province_id);
  };

  getCities = (e) => {
    const state_id = e.target.value;
    this.props.fetchCities(
      this.state.country_id,
      this.props.fields.province.value,
      state_id
    );
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

  updateSelectedProvince = (e) => {
    if (e) {
      this.props.fields.state.onChange("");
      this.props.fields.city.onChange("");
      this.props.fields.province.onChange(e);
    }
  };

  updateSelectedState = (e) => {
    if (e) {
      this.props.fields.city.onChange("");
      this.props.fields.state.onChange(e);
    }
  };
  updateSelectedCity = (e) => {
    if (e) {
      this.props.fields.city.onChange(e);
    }
  };

  render() {
    const { fields, handleSubmit, submitting, error } = this.props;

    const onSubmit = handleSubmit(this._submit.bind(this));

    return (
      <div>
        <ReactModal
          isOpen={this.state.showModal}
          className={classnames(stylesModal.modal)}
          overlayClassName={classnames(stylesModal.overlay)}
        >
          <div className={classnames(stylesModal.modal__header)}>
            <h4>{parse(this.translate("TechnicalsModal.warning"))}</h4>
          </div>
          <div className={classnames(stylesModal.modal__body)}>
            <p>{parse(this.translate("TechnicalsModal.description1"))}</p>
          </div>
          <div className={classnames(stylesModal.modal__footer)}>
            <button
              className={classnames("button", stylesModal.modal__btn)}
              onClick={this.showModal}
            >
              {parse(this.translate("TechnicalsModal.btnCancel"))}
            </button>
            <button
              className={classnames("button", stylesModal.modal__btn)}
              onClick={this.remove}
            >
              {parse(this.translate("TechnicalsModal.btnConfirm"))}
            </button>
          </div>
        </ReactModal>
        <form className={styles.form} onSubmit={onSubmit}>
          {error && <strong>{error}</strong>}

          <input type="hidden" {...fields._id} />

          <div className="box">
            <div className={styles.field}>
              <label className="label Field_field__label_1Hb">
                {parse(this.translate("TechnicalForm.profile"))}
              </label>
              <div
                className={classNames("control", styles.form__input, {
                  "has-icon has-icon-right": Boolean(fields.profile.error),
                })}
              >
                <span
                  className={classNames("select", styles.form__select, {
                    "is-danger": Boolean(fields.profile.error),
                  })}
                >
                  <select
                    {...fields.profile}
                    onChange={this._updateSelectedProfile.bind(this)}
                  >
                    <option value="">
                      {this.translate("TechnicalForm.placeholderChooseProfile")}
                    </option>
                    {isStateAdmin(this.props.accounts.user) && (
                      <option
                        key="Gestor da Afiliação"
                        value="admin_state"
                        name={this.translate("TechnicalForm.adminState")}
                      >
                        {this.translate("TechnicalForm.adminState")}
                      </option>
                    )}
                  </select>
                </span>
                {fields.profile.error ? (
                  <i
                    className={classNames(
                      "fas fa-exclamation-triangle",
                      stylesField.field__warning
                    )}
                  ></i>
                ) : null}
                {Boolean(fields.profile.error) ? (
                  <span className="help is-danger">{fields.profile.error}</span>
                ) : null}
              </div>
            </div>

            {fields.profile.value === "monitor_state_regional" ? (
              <div className={styles.field}>
                <label className="label Field_field__label_1Hb">
                  {parse(this.translate("TechnicalForm.regional"))}
                </label>
                <span className={classNames("select", styles.form__select)}>
                  <select
                    {...fields.regional}
                    onChange={this._updateSelectedRegional.bind(this)}
                  >
                    <option value="">Selecione uma regional</option>
                    {this.state.regionals.map((regional) => (
                      <option key={regional} value={regional}>
                        {regional}
                      </option>
                    ))}
                  </select>
                </span>
                {Boolean(fields.regional.error) ? (
                  <span className="help is-danger">
                    {fields.regional.error}
                  </span>
                ) : null}
              </div>
            ) : null}
            <Field
              label={this.translate("SignUpForm.label.name")}
              classField="slim"
              {...fields.name}
            />
            <Field
              label={this.translate("SignUpForm.label.email")}
              type="email"
              classField="slim"
              {...fields.email}
              disabled={this.props.editable}
            />
            {!this.props.editable ? (
              <Field
                label={this.translate("SignUpForm.label.password")}
                type="password"
                classField="slim"
                {...fields.password}
              />
            ) : null}
          </div>

          <div className="box">
            <h1 className={styles.title_section}>
              {parse(this.translate("SignUpForm.professionalsData"))}
            </h1>

            <div>
              {/* Província */}
              <label className={classnames("label", styles.form__label)}>
                {this.state.geo_structure_level2_name === ""
                  ? parse(this.translate("SignUpForm.label.province"))
                  : this.state.geo_structure_level2_name}
              </label>
              <div
                className={classnames("control", styles.form__input, {
                  "has-icon has-icon-right": Boolean(fields.province.error),
                })}
              >
                <span
                  className={classnames("select", styles.form__select, {
                    "is-danger": Boolean(fields.province.error),
                  })}
                >
                  <select
                    {...fields.province}
                    onChange={(e) => {
                      this.updateSelectedProvince(e);
                      this.getStates(e);
                    }}
                    // disabled={fields.country.value === "" ? true : false}
                  >
                    <option value="">
                      {this.translate("SignUpForm.selectProvince")}
                    </option>
                    {this.props.apiData.provinces.map((province) => (
                      <option key={province._id.$oid} value={province._id.$oid}>
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

              {/* Estado */}
              <label className={classnames("label", styles.form__label)}>
                {this.state.geo_structure_level3_name === ""
                  ? parse(this.translate("SignUpForm.label.state"))
                  : this.state.geo_structure_level3_name}
              </label>
              <div
                className={classnames("control", styles.form__input, {
                  "has-icon has-icon-right": Boolean(fields.state.error),
                })}
              >
                <span
                  className={classnames("select", styles.form__select, {
                    "is-danger": Boolean(fields.state.error),
                  })}
                >
                  <select
                    {...fields.state}
                    onChange={(e) => {
                      this.updateSelectedState(e);
                      this.getCities(e);
                    }}
                    disabled={fields.province.value === "" ? true : false}
                    // {...(fields.school_type.value == "" ||
                    // this.state.disabledAdminState ||
                    // this.state.disabledAdminCity
                    //   ? { disabled: false }
                    //   : {})}
                  >
                    <option value="">
                      {this.translate("SignUpForm.selectState")}
                    </option>
                    {this.props.apiData.states &&
                      this.props.apiData.states.map((state) => (
                        <option key={state._id.$oid} value={state._id.$oid}>
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
                  <span className="help is-danger">{fields.state.error}</span>
                ) : null}
              </div>
            </div>

            {/* Cidade */}
            <label className={classnames("label", styles.form__label)}>
              {this.state.geo_structure_level4_name === ""
                ? parse(this.translate("SignUpFormPrincipalFields.label.city"))
                : this.state.geo_structure_level4_name}
            </label>
            <div
              className={classnames("control", styles.form__input, {
                "has-icon has-icon-right": Boolean(fields.city.error),
              })}
            >
              <span
                className={classnames("select", styles.form__select, {
                  "is-danger": Boolean(fields.city.error),
                })}
              >
                <select
                  {...fields.city}
                  onChange={(e) => {
                    this.updateSelectedCity(e);
                  }}
                  disabled={fields.state.value === "" ? true : false}
                  // {...(fields.school_type.value == "" ||
                  // this.state.disabledAdminState ||
                  // this.state.disabledAdminCity
                  //   ? { disabled: false }
                  //   : {})}
                >
                  <option value="">
                    {this.translate("SignUpFormPrincipalFields.selectCity")}
                  </option>
                  {this.props.apiData.cities &&
                    this.props.apiData.cities.map((city) => (
                      <option key={city._id.$oid} value={city._id.$oid}>
                        {city.name}
                      </option>
                    ))}
                </select>
              </span>
              {fields.city.error ? (
                <i
                  className={classnames(
                    "fas fa-exclamation-triangle",
                    stylesField.field__warning
                  )}
                ></i>
              ) : null}
              {fields.city.error ? (
                <span className="help is-danger">{fields.state.error}</span>
              ) : null}
            </div>
          </div>

          <div className={styles.field}>
            <p className={classNames("control", styles.form__submit_button)}>
              <SubmitBtn
                className={classNames("is-primary", {
                  "is-loading": submitting,
                })}
              >
                {this.props.editable
                  ? this.translate("TechnicalForm.btnEdit")
                  : this.translate("TechnicalForm.btnRegister")}
              </SubmitBtn>
              {this.props.editable && (
                <Button onClick={this.showModal}>
                  {this.translate("TechnicalForm.btnRemove")}
                </Button>
              )}
            </p>
          </div>
        </form>
      </div>
    );
  }
}

export default injectIntl(
  reduxForm({
    form: "technicalForm",
    fields: _.keys(schema),
    initialValues: {},
  })(
    compose(
      NonUserRedir,
      NonAdminRedir,
      AccountsContainer,
      APIDataContainer
    )(TechnicalForm)
  )
);
