import React from "react";
import { reduxForm } from "redux-form";
import Field from "~/components/Form/Field";
import SubmitBtn from "~/components/SubmitBtn";
import schema from "./schema";
import _ from "lodash";
import classnames from "classnames";
import styles from "../../school.styl";
import API from "~/api";
import { compose } from "redux";
import { isStateAdmin, isCityAdmin } from "~/helpers/users";
import { encrypt, decrypt } from "~/helpers/obf";
import axios from "axios";
import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminRedir from "~/containers/non_admin_redir";
import ManagersContainer from "~/containers/managers_table";
import CONF from "~/api/index";
import history from "~/core/history";
import { getUserToken } from "~/api/utils";
import ReactModal from "react-modal";
import stylesModal from "../../../../components/Modal/Modal.styl";
import Button from "../../../../components/Button";

import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
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

class AffiliationForm extends React.Component {
  constructor() {
    super();
    this.state = {
      affiliation_id: null,
      isAffiliationEdit: false,
      affiliationAlreadyExists: false,
      showModal: false,
      hasCountries: false,
      geo_structure_level1_name: "",
      geo_structure_level2_name: "",
      geo_structure_level3_name: "",
      geo_structure_level4_name: "",
      hasUser: false,
      country_id: "",
    };
    this.remove = this.remove.bind(this);
  }

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

  loadAffiliation = async (id) => {
    const URL_REQUEST =
      CONF.ApiURL + `/api/v1/institution/${id}?access_token=${getUserToken()}`;
    const response = await axios.get(URL_REQUEST);
    return await response.data;
  };

  insertDataIntoTheForm = (dataAffiliation) => {
    const country_id =
      dataAffiliation.country_id && dataAffiliation.country_id.$oid
        ? dataAffiliation.country_id.$oid
        : dataAffiliation.country_id;
    const province_id =
      dataAffiliation.province_id && dataAffiliation.province_id.$oid
        ? dataAffiliation.province_id.$oid
        : dataAffiliation.province_id;
    const state_id =
      dataAffiliation.state_id && dataAffiliation.state_id.$oid
        ? dataAffiliation.state_id.$oid
        : dataAffiliation.state_id;
    const city_id =
      dataAffiliation.city_id && dataAffiliation.city_id.$oid
        ? dataAffiliation.city_id.$oid
        : dataAffiliation.city_id;

    if (country_id) {
      this.updateGeographicElements(country_id);
      this.props.fetchProvinces(country_id);
    }
    if (country_id && province_id) {
      this.props.fetchStates(country_id, province_id);
    }
    if (country_id && province_id && state_id) {
      this.props.fetchCities(country_id, province_id, state_id);
    }
    const fields = this.props.fields;
    fields.name.onChange(dataAffiliation.name);
    fields.type_institution.onChange(dataAffiliation.type_institution);
    fields.country_id.onChange(country_id);
    fields.country_name.onChange(dataAffiliation.country_name);
    fields.province_id.onChange(province_id);
    fields.province_name.onChange(dataAffiliation.province_name);
    fields.state_id.onChange(state_id);
    fields.state_name.onChange(dataAffiliation.state_name);
    fields.city_id.onChange(city_id);
    fields.city_name.onChange(dataAffiliation.city_name);
  };

  async componentDidMount() {
    this.props.fetchCountries();
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    this.setState({ affiliation_id: id });
    if (id !== null) {
      this.setState({ isAffiliationEdit: true });
      const data = await this.loadAffiliation(id);
      const dataAffiliation = data.data;
      this.insertDataIntoTheForm(dataAffiliation);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.accounts.user === this.props.accounts.user &&
      this.state.hasUser === false &&
      this.getUserProfile() === "admin_country"
    ) {
      const country_id =
        this.props.accounts.user &&
        this.props.accounts.user.country_id &&
        this.props.accounts.user.country_id.$oid;
      this.setState({ country_id });
      if (country_id && this.getUserProfile() === "admin_country") {
        this.props.fetchProvinces(country_id);
        this.setState({ hasUser: true });
      }
    }
  }

  getUserCountryId() {
    const country_id = this.props.accounts.user.country_id.$oid;
    return country_id;
  }

  getUserProfile() {
    const user = this.props.accounts.user;
    return user._profile;
  }

  getProvinces = (e) => {
    const country_id = e.target.value;
    this.props.fetchProvinces(country_id);
  };

  getStates = (e) => {
    const province_id = e.target.value;
    if (this.getUserProfile() === "admin_country") {
      this.props.fetchStates(this.state.country_id, province_id);
    } else {
      this.props.fetchStates(this.props.fields.country_id.value, province_id);
    }
  };

  getCities = (e) => {
    const state_id = e.target.value;
    if (this.getUserProfile() === "admin_country") {
      this.props.fetchCities(
        this.state.country_id,
        this.props.fields.province_id.value,
        state_id
      );
    } else {
      this.props.fetchCities(
        this.props.fields.country_id.value,
        this.props.fields.province_id.value,
        state_id
      );
    }
  };

  updateSelectedCountry = (e) => {
    if (e) {
      var index = e.target.selectedIndex;
      var optionElement = e.target.childNodes[index];
      var optionName = optionElement.getAttribute("name");
      this.props.fields.province_name.onChange("");
      this.props.fields.state_name.onChange("");
      this.props.fields.city_name.onChange("");
      this.props.fields.country_name.onChange(optionName);
      this.props.fields.province_id.onChange("");
      this.props.fields.state_id.onChange("");
      this.props.fields.city_id.onChange("");
      this.props.fields.country_id.onChange(e);
      this.updateGeographicElements(e.target.value);
    }
  };

  updateSelectedProvince = (e) => {
    if (e) {
      var index = e.target.selectedIndex;
      var optionElement = e.target.childNodes[index];
      var optionName = optionElement.getAttribute("name");
      this.props.fields.province_name.onChange(optionName);
      this.props.fields.state_name.onChange("");
      this.props.fields.city_name.onChange("");
      this.props.fields.state_id.onChange("");
      this.props.fields.city_id.onChange("");
      this.props.fields.province_id.onChange(e);
    }
  };

  updateSelectedState = (e) => {
    if (e) {
      var index = e.target.selectedIndex;
      var optionElement = e.target.childNodes[index];
      var optionName = optionElement.getAttribute("name");
      this.props.fields.city_name.onChange("");
      this.props.fields.city_id.onChange("");
      this.props.fields.state_name.onChange(optionName);
      this.props.fields.state_id.onChange(e);
    }
  };
  updateSelectedCity = (e) => {
    if (e) {
      var index = e.target.selectedIndex;
      var optionElement = e.target.childNodes[index];
      var optionName = optionElement.getAttribute("name");
      this.props.fields.city_name.onChange(optionName);
      this.props.fields.city_id.onChange(e);
    }
  };

  async _submit(values) {
    if(this.getUserProfile() === "admin_country" && values.country_id == undefined && values.country_name == undefined){
      values.country_id = this.props.accounts.user.country_id.$oid;
      values.country_name = this.props.accounts.user.country_name;
    }
    
    if (this.state.isAffiliationEdit) {
      const URL_REQUEST =
        CONF.ApiURL +
        `/api/v1/institution/edit/${
          this.state.affiliation_id
        }?access_token=${getUserToken()}`;
      try {
        const response = await axios.post(URL_REQUEST, values);
        history.push("/listar-afiliacoes");
      } catch (error) {
        if (error.message === "Request failed with status code 422") {
          this.setState({ affiliationAlreadyExists: true });
        }
      }
    } else {
      const URL_REQUEST =
        CONF.ApiURL +
        `/api/v1/institution/save/?access_token=${getUserToken()}`;
      try {
        const response = await axios.post(URL_REQUEST, values);
        history.push("/listar-afiliacoes");
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  async remove() {
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/institution/delete/${
        this.state.affiliation_id
      }?access_token=${getUserToken()}`;
    try {
      await axios.post(URL_REQUEST);
      this.setState({ showModal: !this.state.showModal });
      history.push("/listar-afiliacoes");
    } catch (error) {
      console.log(error);
    }
  }

  translate = (id) => this.props.intl.formatMessage({ id });

  showModal = (id) => {
    this.setState({ showModal: !this.state.showModal });
    if (typeof id === "string") this.setState({ idToBeRemoved: id });
  };

  render() {
    const {
      fields,
      handleSubmit,
      submitting,
      error,

      apiData: { managers },
    } = this.props;

    const onSubmit = handleSubmit(this._submit.bind(this));

    return (
      <section className="section">
        <div className="container">
          <form className={styles.form} onSubmit={onSubmit}>
            {error && (
              <div className="box">
                <div className="columns">
                  <div className="column is-full">
                    <strong>{error}</strong>
                  </div>
                </div>
              </div>
            )}
            <div className="box">
              <h1 className={styles.title_section}>
                {parse(this.translate("CreateAffiliation.registerData"))}
              </h1>
              <Field
                label={this.translate("CreateAffiliation.name")}
                classField="slim"
                {...fields.name}
              />

              <Field
                label={this.translate("CreateAffiliation.typeInstitution")}
                classField="slim"
                {...fields.type_institution}
              />

              {/* País */}
              {this.getUserProfile() !== "admin_country" && (
                <div>
                  <label className={classnames("label", styles.form__label)}>
                    {parse(this.translate("SignUpForm.label.region"))}
                  </label>
                  <div
                    className={classnames("control", styles.form__input, {
                      "has-icon has-icon-right": Boolean(
                        fields.country_name.error
                      ),
                    })}
                  >
                    <span
                      className={classnames("select", styles.form__select, {
                        "is-danger": Boolean(fields.country_name.error),
                      })}
                    >
                      <select
                        {...fields.country_id}
                        onChange={(e) => {
                          this.updateSelectedCountry(e);
                          this.getProvinces(e);
                        }}

                        // {...(fields.country.value == "" ||
                        // this.state.disabledAdminState ||
                        // this.state.disabledAdminCity
                        //   ? { disabled: false }
                        //   : {})}
                      >
                        <option value="">
                          {this.translate("SignUpForm.selectRegion")}
                        </option>
                        {this.props.apiData.countries &&
                          this.props.apiData.countries.map((country) => (
                            <option
                              key={country._id.$oid}
                              name={country.name}
                              value={country._id.$oid}
                            >
                              {country.name}
                            </option>
                          ))}
                      </select>
                    </span>
                    {fields.country_name.error ? (
                      <i
                        className={classnames(
                          "fas fa-exclamation-triangle",
                          stylesField.field__warning
                        )}
                      ></i>
                    ) : null}
                    {fields.country_name.error ? (
                      <span className="help is-danger">
                        {fields.country_name.error}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Província */}
              <label className={classnames("label", styles.form__label)}>
                {this.state.geo_structure_level2_name === ""
                  ? parse(this.translate("SignUpForm.label.province"))
                  : this.state.geo_structure_level2_name}
              </label>
              <div
                className={classnames("control", styles.form__input, {
                  "has-icon has-icon-right": Boolean(
                    fields.province_name.error
                  ),
                })}
              >
                <span
                  className={classnames("select", styles.form__select, {
                    "is-danger": Boolean(fields.province_name.error),
                  })}
                >
                  <select
                    {...fields.province_id}
                    onChange={(e) => {
                      this.updateSelectedProvince(e);
                      this.getStates(e);
                    }}
                    disabled={false}
                    // disabled={fields.country.value === "" ? true : false}
                    // onChange={this._updateSelectedState.bind(this)}
                    // {...(fields.school_type.value == "" ||
                    // this.state.disabledAdminState ||
                    // this.state.disabledAdminCity
                    //   ? { disabled: true }
                    //   : {})}
                  >
                    <option value="">
                      {this.translate("SignUpForm.selectProvince")}
                    </option>
                    {this.props.apiData &&
                      this.props.apiData.provinces.map((province) => (
                        <option
                          key={province._id.$oid}
                          name={province.name}
                          value={province._id.$oid}
                        >
                          {province.name}
                        </option>
                      ))}
                  </select>
                </span>
                {fields.province_name.error ? (
                  <i
                    className={classnames(
                      "fas fa-exclamation-triangle",
                      stylesField.field__warning
                    )}
                  ></i>
                ) : null}
                {fields.province_name.error ? (
                  <span className="help is-danger">
                    {fields.province_name.error}
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
                  "has-icon has-icon-right": Boolean(fields.state_name.error),
                })}
              >
                <span
                  className={classnames("select", styles.form__select, {
                    "is-danger": Boolean(fields.state_name.error),
                  })}
                >
                  <select
                    {...fields.state_id}
                    onChange={(e) => {
                      this.updateSelectedState(e);
                      this.getCities(e);
                    }}
                    disabled={false}
                    // disabled={fields.province.value === "" ? true : false}
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
                        <option
                          key={state._id.$oid}
                          name={state.name}
                          value={state._id.$oid}
                        >
                          {state.name}
                        </option>
                      ))}
                  </select>
                </span>
                {fields.state_name.error ? (
                  <i
                    className={classnames(
                      "fas fa-exclamation-triangle",
                      stylesField.field__warning
                    )}
                  ></i>
                ) : null}
                {fields.state_name.error ? (
                  <span className="help is-danger">
                    {fields.state_name.error}
                  </span>
                ) : null}
              </div>

              {/* Cidade */}

              <label className={classnames("label", styles.form__label)}>
                {this.state.geo_structure_level4_name === ""
                  ? parse(
                      this.translate("SignUpFormPrincipalFields.label.city")
                    )
                  : this.state.geo_structure_level4_name}
              </label>
              <div
                className={classnames("control", styles.form__input, {
                  "has-icon has-icon-right": Boolean(fields.city_name.error),
                })}
              >
                <span
                  className={classnames("select", styles.form__select, {
                    "is-danger": Boolean(fields.city_name.error),
                  })}
                >
                  <select
                    {...fields.city_id}
                    onChange={(e) => {
                      this.updateSelectedCity(e);
                    }}
                    disabled={false}
                    // disabled={fields.province.value === "" ? true : false}
                    // {...(fields.school_type.value == "" ||
                    // this.state.disabledAdminState ||
                    // this.state.disabledAdminCity
                    //   ? { disabled: false }
                    //   : {})}
                  >
                    <option value="">
                      {this.translate("SignUpFormPrincipalFields.selectCity")}
                    </option>
                    {this.props.apiData.cities instanceof Array &&
                      this.props.apiData.cities.map((city) => (
                        <option
                          key={city._id.$oid}
                          name={city.name}
                          value={city._id.$oid}
                        >
                          {city.name}
                        </option>
                      ))}
                  </select>
                </span>
                {fields.city_name.error ? (
                  <i
                    className={classnames(
                      "fas fa-exclamation-triangle",
                      stylesField.field__warning
                    )}
                  ></i>
                ) : null}
                {fields.city_name.error ? (
                  <span className="help is-danger">
                    {fields.city_name.error}
                  </span>
                ) : null}
              </div>
            </div>
            {this.state.affiliationAlreadyExists && (
              <p style={{ color: "red" }}>Esta afiliação já existe !</p>
            )}
            <div className={styles.field}>
              <p className={classnames("control", styles.form__submit_button)}>
                <SubmitBtn
                  className={classnames("is-primary", {
                    "is-loading": submitting,
                  })}
                >
                  {getQueryString("id")
                    ? this.translate("CreateAffiliation.btnSave")
                    : this.translate("CreateAffiliation.btnRegister")}
                </SubmitBtn>
                {this.state.affiliation_id && (
                  <Button onClick={this.showModal}>
                    {parse(this.translate("CreateAffiliation.btnRemove"))}
                  </Button>
                )}
              </p>
            </div>
          </form>
          <ReactModal
            isOpen={this.state.showModal}
            className={classnames(stylesModal.modal)}
            overlayClassName={classnames(stylesModal.overlay)}
          >
            <div className={classnames(stylesModal.modal__header)}>
              <h4>{parse(this.translate("DeleteAffiliationModal.warning"))}</h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              <p>
                <FormattedMessage
                  id="DeleteAffiliationModal.description1"
                  values={{
                    itemsToBeDeleted: (
                      <strong>
                        {this.translate(
                          "DeleteAffiliationModal.itemsToBeDeleted"
                        )}
                      </strong>
                    ),
                  }}
                />
                .
              </p>
              <p>
                {parse(this.translate("DeleteAffiliationModal.description2"))}
              </p>
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.showModal}
              >
                {parse(this.translate("DeleteAffiliationModal.btnCancel"))}
              </button>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.remove}
              >
                {parse(this.translate("DeleteAffiliationModal.btnConfirm"))}
              </button>
            </div>
          </ReactModal>
        </div>
      </section>
    );
  }
}

export default injectIntl(
  reduxForm({
    form: "affiliationForm",
    fields: _.keys(schema),
  })(
    compose(
      APIDataContainer,
      NonUserRedir,
      NonAdminRedir,
      ManagersContainer
    )(AffiliationForm)
  )
);
