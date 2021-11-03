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
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import ReactModal from "react-modal";
import stylesModal from "../../../../components/Modal/Modal.styl";
import { getUserToken } from "~/api/utils";
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

class CountryForm extends React.Component {
  constructor() {
    super();
    this.state = {
      isCountryEdit: false,
      countryAlreadyExists: false,
      showModal: false,
      provinces: [],
      states: [],
      cities: [],
      country_id: null,
      countryName: null,
      selectedProvince: null,
      selectedState: null,
      selectedCity: null,
      selectedStateName: "",
      selectedProvinceName: "",
      selectedCityName: "",
      showModalCreateAndEdit: false,
      geographicElement: null,
      modalOperation: null,
      newNameProvince: "",
      newNameState: "",
      newNameCity: "",
      isProvinceSelected: false,
      isStateSelected: false,
      isCitySelected: false,
      geo_structure_level1_name: "",
      geo_structure_level2_name: "",
      geo_structure_level3_name: "",
      geo_structure_level4_name: "",
    };
    this.remove = this.remove.bind(this);
    this.createGeographicElement = this.createGeographicElement.bind(this);
    this.editGeographicElement = this.editGeographicElement.bind(this);
  }

  getUserProfile() {
    const user = this.props.accounts.user;
    return user._profile;
  }

  loadCountry = async (id) => {
    const URL_REQUEST =
      CONF.ApiURL + `/api/v1/country/${id}?access_token=${getUserToken()}`;
    const response = await axios.get(URL_REQUEST);
    return await response.data;
  };

  insertDataIntoTheForm = (dataCountry) => {
    const fields = this.props.fields;
    fields.name.onChange(dataCountry.name);
    fields.geo_structure_level1_name.onChange(
      dataCountry.geo_structure_level1_name
    );
    fields.geo_structure_level2_name.onChange(
      dataCountry.geo_structure_level2_name
    );
    fields.geo_structure_level3_name.onChange(
      dataCountry.geo_structure_level3_name
    );
    fields.geo_structure_level4_name.onChange(
      dataCountry.geo_structure_level4_name
    );
  };

  async loadGeographicElements() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    this.setState({ country_id: id });
    if (id !== null) {
      this.setState({ isCountryEdit: true });
      const data = await this.loadCountry(id);
      const dataCountry = data.data;
      this.setState({
        countryName: dataCountry.name,
        geo_structure_level1_name: dataCountry.geo_structure_level1_name,
        geo_structure_level2_name: dataCountry.geo_structure_level2_name,
        geo_structure_level3_name: dataCountry.geo_structure_level3_name,
        geo_structure_level4_name: dataCountry.geo_structure_level4_name,
      });
      this.insertDataIntoTheForm(dataCountry);
      this.loadProvincesByCountryId(id);
      this.loadStatesByCountryId(id);
      this.loadCitiesByCountryId(id);
    }
  }

  componentDidMount() {
    this.loadGeographicElements();
  }

  async _submit(values) {
    if (this.state.isCountryEdit) {
      const URL_REQUEST =
        CONF.ApiURL +
        `/api/v1/country/edit/${
          this.state.country_id
        }?access_token=${getUserToken()}`;
      try {
        const response = await axios.post(URL_REQUEST, values);
        if (this.getUserProfile() === "admin_country") {
          history.push("/painel");
        } else {
          history.push("/listar-paises");
        }
      } catch (error) {
        if (error.message === "Request failed with status code 422") {
          this.setState({ countryAlreadyExists: true });
        }
      }
    } else {
      const URL_REQUEST =
        CONF.ApiURL + `/api/v1/country/save/?access_token=${getUserToken()}`;
      try {
        const response = await axios.post(URL_REQUEST, values);
        if (this.getUserProfile() === "admin_country") {
          history.push("/painel");
        } else {
          history.push("/listar-paises");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  showModal = (id) => {
    this.setState({ showModal: !this.state.showModal });
    if (typeof id === "string") this.setState({ idToBeRemoved: id });
  };

  showModalCreateAndEdit = (geographicElement, modalOperation) => {
    this.setState({
      showModalCreateAndEdit: !this.state.showModalCreateAndEdit,
      geographicElement,
      modalOperation,
      newNameState: this.state.selectedStateName,
      newNameProvince: this.state.selectedProvinceName,
      // newNameCity: this.state.selectedCityName,
    });
  };

  async remove() {
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/country/delete/${
        this.state.country_id
      }?access_token=${getUserToken()}`;

    try {
      await axios.post(URL_REQUEST);
      this.setState({ showModal: !this.state.showModal });
      history.push("/listar-paises");
    } catch (error) {
      console.log(error);
    }
  }
  translate = (id) => this.props.intl.formatMessage({ id });

  async loadProvincesByCountryId(country_id) {
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/provincies?country_id=${country_id}&access_token=${getUserToken()}`;
    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ provinces: response.data.data });
    } catch (error) {
      console.log(error);
    }
  }

  async loadStatesByCountryId(country_id) {
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/states?country_id=${country_id}&access_token=${getUserToken()}`;
    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ states: response.data.data });
    } catch (error) {
      console.log(error);
    }
  }

  async loadCitiesByCountryId(country_id) {
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/cities?country_id=${country_id}&access_token=${getUserToken()}`;
    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ cities: response.data.data });
    } catch (error) {
      console.log(error);
    }
  }

  getAttribute = (e, attributeName) => {
    var index = e.target.selectedIndex;
    var optionElement = e.target.childNodes[index];
    var optionName = optionElement.getAttribute(attributeName);
    return optionName;
  };

  updateSelectedProvince = (e) => {
    const optionName = this.getAttribute(e, "name");
    this.setState({
      selectedProvince: e.target.value,
      selectedProvinceName: optionName,
      newNameProvince: optionName,
      isProvinceSelected: true,
    });
  };

  updateSelectedState = (e) => {
    const optionName = this.getAttribute(e, "name");
    this.setState({
      selectedState: e.target.value,
      selectedStateName: optionName,
      newNameState: optionName,
      isStateSelected: true,
    });
  };

  updateSelectedCity = (e) => {
    const optionName = this.getAttribute(e, "name");
    this.setState({
      selectedCity: e.target.value,
      selectedCityName: optionName,
      newNameCity: optionName,
      isCitySelected: true,
    });
  };

  async createGeographicElement() {
    const provinceData = {
      country_id: this.state.country_id,
      country_name: this.state.countryName,
      name: this.state.newNameProvince,
    };

    const stateData = {
      country_id: this.state.country_id,
      country_name: this.state.countryName,
      province_id: this.state.selectedProvince,
      province_name: this.state.selectedProvinceName,
      name: this.state.newNameState,
    };

    const cityData = {
      country_id: this.state.country_id,
      country_name: this.state.countryName,
      province_id: this.state.selectedProvince,
      province_name: this.state.selectedProvinceName,
      state_id: this.state.selectedState,
      state_name: this.state.selectedStateName,
      name: this.state.newNameCity,
    };

    const data =
      this.state.geographicElement === "province"
        ? provinceData
        : this.state.geographicElement === "state"
        ? stateData
        : this.state.geographicElement === "city" && cityData;

    const requestURL =
      CONF.ApiURL +
      `/api/v1/${
        this.state.geographicElement
      }/save/?access_token=${getUserToken()}`;

    try {
      await axios.post(requestURL, data);
      this.loadGeographicElements();
      this.setState({
        showModalCreateAndEdit: !this.state.showModalCreateAndEdit,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async editGeographicElement() {
    const provinceData = {
      country_id: { id: this.state.country_id },
      country_name: this.state.countryName,
      name: this.state.newNameProvince,
    };

    const stateData = {
      country_id: this.state.country_id,
      country_name: this.state.countryName,
      province_id: this.state.selectedProvince,
      province_name: this.state.selectedProvinceName,
      name: this.state.newNameState,
    };

    const cityData = {
      country_id: this.state.country_id,
      country_name: this.state.countryName,
      province_id: this.state.selectedProvince,
      province_name: this.state.selectedProvinceName,
      state_id: this.state.selectedState,
      state_name: this.state.selectedStateName,
      name: this.state.newNameCity,
    };

    const data =
      this.state.geographicElement === "province"
        ? provinceData
        : this.state.geographicElement === "state"
        ? stateData
        : this.state.geographicElement === "city" && cityData;

    const id =
      this.state.geographicElement === "province"
        ? this.state.selectedProvince
        : this.state.geographicElement === "state"
        ? this.state.selectedState
        : this.state.geographicElement === "city" && this.state.selectedCity;

    const geographicElementSelected =
      this.state.geographicElement === "province"
        ? { selectedProvinceName: this.state.newNameProvince }
        : this.state.geographicElement === "state"
        ? { selectedStateName: this.state.newNameState }
        : this.state.geographicElement === "city" && {
            selectedCityName: this.state.newNameCity,
          };

    const requestURL =
      CONF.ApiURL +
      `/api/v1/${
        this.state.geographicElement
      }/edit/${id}?access_token=${getUserToken()}`;
    try {
      await axios.post(requestURL, data);
      this.loadGeographicElements();
      this.setState({
        showModalCreateAndEdit: !this.state.showModalCreateAndEdit,
        ...geographicElementSelected,
      });
    } catch (error) {
      console.log(error);
    }
  }

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
          <form onSubmit={onSubmit}>
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
              <div className="columns is-multiline">
                <input type="hidden" {...fields._id} />

                <div className="column is-full">
                  <h1 className={styles.title_section}>
                    {parse(this.translate("CreateCountry.registerData"))}
                  </h1>
                </div>

                <div className="column is-full">
                  <Field
                    label={this.translate("CreateCountry.name")}
                    classField="slim-max"
                    {...fields.name}
                  />
                </div>

                <div className="column is-6">
                  <Field
                    label={this.translate("CreateCountry.level1")}
                    classField="slim-max"
                    {...fields.geo_structure_level1_name}
                  />
                </div>
                <div className="column is-6">
                  <Field
                    label={this.translate("CreateCountry.level2")}
                    classField="slim-max"
                    {...fields.geo_structure_level2_name}
                  />
                </div>
                <div className="column is-6">
                  <Field
                    label={this.translate("CreateCountry.level3")}
                    classField="slim-max"
                    {...fields.geo_structure_level3_name}
                  />
                </div>
                <div className="column is-6">
                  <Field
                    label={this.translate("CreateCountry.level4")}
                    classField="slim-max"
                    {...fields.geo_structure_level4_name}
                  />
                </div>
              </div>
            </div>
            {this.state.country_id && (
              <div className="box">
                <div className="columns is-multiline">
                  <div className="column is-full">
                    <h1 className={styles.title_section}>
                      {parse(
                        this.translate("CreateCountry.geographicElements")
                      )}
                    </h1>
                  </div>
                </div>
                <div>
                  <label className={classnames("label", styles.form__label)}>
                    {this.state.geo_structure_level2_name === ""
                      ? parse(this.translate("CreateCountry.provinces"))
                      : this.state.geo_structure_level2_name}
                  </label>
                  <div className={classnames("control", styles.form__input)}>
                    <span className={classnames("select", styles.form__select)}>
                      <select onChange={this.updateSelectedProvince}>
                        <option value="">
                          {this.translate("CreateCountry.selectOption")}
                        </option>
                        {this.state.provinces &&
                          this.state.provinces.map((province) => (
                            <option
                              key={province._id.$oid}
                              value={province._id.$oid}
                              name={province.name}
                            >
                              {province.name}
                            </option>
                          ))}
                      </select>
                    </span>
                  </div>
                  <div className={styles.box_create_and_edit_links}>
                    <a
                      onClick={() => {
                        this.state.isProvinceSelected === true &&
                          this.showModalCreateAndEdit("province", "edit");
                      }}
                    >
                      - {parse(this.translate("CreateCountry.btnEdit"))}{" "}
                      {this.state.geo_structure_level2_name !== "" &&
                        this.state.geo_structure_level2_name}
                    </a>
                    <a
                      onClick={() => {
                        this.showModalCreateAndEdit("province", "create");
                      }}
                    >
                      + {parse(this.translate("CreateCountry.btnCreate"))}{" "}
                      {this.state.geo_structure_level2_name !== "" &&
                        this.state.geo_structure_level2_name}
                    </a>
                  </div>
                </div>
                <div>
                  <label className={classnames("label", styles.form__label)}>
                    {this.state.geo_structure_level3_name === ""
                      ? parse(this.translate("CreateCountry.states"))
                      : this.state.geo_structure_level3_name}
                  </label>
                  <div className={classnames("control", styles.form__input)}>
                    <span className={classnames("select", styles.form__select)}>
                      <select onChange={this.updateSelectedState}>
                        <option value="">
                          {this.translate("CreateCountry.selectOption")}
                        </option>
                        {this.state &&
                          this.state.states.map((state) => (
                            <option
                              key={state._id.$oid}
                              value={state._id.$oid}
                              name={state.name}
                            >
                              {state.name}
                            </option>
                          ))}
                      </select>
                    </span>
                  </div>
                  <div className={styles.box_create_and_edit_links}>
                    <a
                      onClick={() =>
                        this.state.isProvinceSelected === true &&
                        this.state.isStateSelected === true &&
                        this.showModalCreateAndEdit("state", "edit")
                      }
                    >
                      - {parse(this.translate("CreateCountry.btnEdit"))}{" "}
                      {this.state.geo_structure_level3_name !== "" &&
                        this.state.geo_structure_level3_name}
                    </a>
                    <a
                      onClick={() =>
                        this.state.isProvinceSelected === true &&
                        this.showModalCreateAndEdit("state", "create")
                      }
                    >
                      + {parse(this.translate("CreateCountry.btnCreate"))}{" "}
                      {this.state.geo_structure_level3_name !== "" &&
                        this.state.geo_structure_level3_name}
                    </a>
                  </div>
                </div>

                <div>
                  <label className={classnames("label", styles.form__label)}>
                    {this.state.geo_structure_level4_name === ""
                      ? parse(this.translate("CreateCountry.cities"))
                      : this.state.geo_structure_level4_name}
                  </label>
                  <div className={classnames("control", styles.form__input)}>
                    <span className={classnames("select", styles.form__select)}>
                      <select onChange={this.updateSelectedCity}>
                        <option value="">
                          {this.translate("CreateCountry.selectOption")}
                        </option>
                        {this.state.cities.map((city) => (
                          <option
                            key={city._id.$oid}
                            value={city._id.$oid}
                            name={city.name}
                          >
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </span>
                    {/* {this.state.isStateSelected === false && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "red",
                          paddingLeft: "5px",
                          marginTop: "10px",
                        }}
                      >
                        {parse(this.translate("CreateCountry.citiesDescription"))}
                      </span>
                    )} */}
                  </div>
                  <div className={styles.box_create_and_edit_links}>
                    <a
                      onClick={() =>
                        this.state.isProvinceSelected === true &&
                        this.state.isStateSelected === true &&
                        this.state.isCitySelected === true &&
                        this.showModalCreateAndEdit("city", "edit")
                      }
                    >
                      - {parse(this.translate("CreateCountry.btnEdit"))}{" "}
                      {this.state.geo_structure_level4_name !== "" &&
                        this.state.geo_structure_level4_name}
                    </a>
                    <a
                      onClick={() =>
                        this.state.isProvinceSelected === true &&
                        this.state.isStateSelected === true &&
                        this.showModalCreateAndEdit("city", "create")
                      }
                    >
                      + {parse(this.translate("CreateCountry.btnCreate"))}{" "}
                      {this.state.geo_structure_level4_name !== "" &&
                        this.state.geo_structure_level4_name}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {this.state.countryAlreadyExists && (
              <p style={{ color: "red" }}>Este país já existe !</p>
            )}
            <div className={styles.field}>
              <p className={classnames("control", styles.form__submit_button)}>
                <SubmitBtn
                  className={classnames("is-primary", {
                    "is-loading": submitting,
                  })}
                >
                  {getQueryString("id")
                    ? parse(this.translate("CreateCountry.btnSave"))
                    : parse(this.translate("CreateCountry.btnregister"))}
                </SubmitBtn>
                {this.state.country_id &&
                  this.getUserProfile() !== "admin_country" && (
                    <Button onClick={this.showModal}>
                      {parse(this.translate("CreateCountry.btnRemove"))}
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
              <h4>{parse(this.translate("DeleteCountryModal.warning"))}</h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              <p>
                <FormattedMessage
                  id="DeleteCountryModal.description1"
                  values={{
                    itemsToBeDeleted: (
                      <strong>
                        {this.translate("DeleteCountryModal.itemsToBeDeleted")}
                      </strong>
                    ),
                  }}
                />
                .
              </p>
              <p>{parse(this.translate("DeleteCountryModal.description2"))}</p>
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.showModal}
              >
                {parse(this.translate("DeleteCountryModal.btnCancel"))}
              </button>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.remove}
              >
                {parse(this.translate("DeleteCountryModal.btnConfirm"))}
              </button>
            </div>
          </ReactModal>

          <ReactModal
            isOpen={this.state.showModalCreateAndEdit}
            className={classnames(stylesModal.modal)}
            overlayClassName={classnames(stylesModal.overlay)}
          >
            <div className={classnames(stylesModal.modal__header)}>
              <h4>
                {this.state.modalOperation === "edit"
                  ? parse(this.translate("CreateCountry.edit"))
                  : parse(this.translate("CreateCountry.create"))}{" "}
                {this.state.geographicElement === "province"
                  ? this.state.geo_structure_level2_name !== "" &&
                    this.state.geo_structure_level2_name
                  : this.state.geographicElement === "state"
                  ? this.state.geo_structure_level3_name !== "" &&
                    this.state.geo_structure_level3_name
                  : this.state.geo_structure_level4_name !== "" &&
                    this.state.geo_structure_level4_name}
              </h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              {this.state.geographicElement === "province" && (
                <div className={styles.geographic_name}>
                  <div>
                    {this.state.geo_structure_level1_name === ""
                      ? parse(this.translate("CreateCountry.country"))
                      : this.state.geo_structure_level1_name}
                    : {this.state.countryName}
                  </div>
                </div>
              )}
              {this.state.geographicElement === "state" && (
                <div className={styles.geographic_name}>
                  <div>
                    {this.state.geo_structure_level1_name === ""
                      ? parse(this.translate("CreateCountry.country"))
                      : this.state.geo_structure_level1_name}
                    : {this.state.countryName}
                  </div>
                  <div>
                    {this.state.geo_structure_level2_name === ""
                      ? parse(this.translate("CreateCountry.province"))
                      : this.state.geo_structure_level2_name}
                    : {this.state.selectedProvinceName}
                  </div>
                </div>
              )}
              {this.state.geographicElement === "city" && (
                <div className={styles.geographic_name}>
                  <div>
                    {this.state.geo_structure_level1_name === ""
                      ? parse(this.translate("CreateCountry.country"))
                      : this.state.geo_structure_level1_name}
                    : {this.state.countryName}
                  </div>
                  <div>
                    {this.state.geo_structure_level2_name === ""
                      ? parse(this.translate("CreateCountry.province"))
                      : this.state.geo_structure_level2_name}
                    : {this.state.selectedProvinceName}
                  </div>
                  <div>
                    {this.state.geo_structure_level2_name === ""
                      ? parse(this.translate("CreateCountry.state"))
                      : this.state.geo_structure_level2_name}
                    : {this.state.selectedStateName}
                  </div>
                </div>
              )}

              <div>
                <Field
                  label={
                    this.state.geographicElement === "province"
                      ? this.state.geo_structure_level2_name === ""
                        ? parse(this.translate("CreateCountry.province"))
                        : this.state.geo_structure_level2_name
                      : this.state.geographicElement === "state"
                      ? this.state.geo_structure_level3_name === ""
                        ? parse(this.translate("CreateCountry.state"))
                        : this.state.geo_structure_level3_name
                      : this.state.geo_structure_level4_name === ""
                      ? parse(this.translate("CreateCountry.city"))
                      : this.state.geo_structure_level4_name
                  }
                  classField="slim-max"
                  value={
                    this.state.geographicElement === "province"
                      ? this.state.newNameProvince
                      : this.state.geographicElement === "state"
                      ? this.state.newNameState
                      : this.state.geographicElement === "city" &&
                        this.state.newNameCity
                  }
                  onChange={(e) =>
                    this.state.geographicElement === "province"
                      ? this.setState({ newNameProvince: e.target.value })
                      : this.state.geographicElement === "state"
                      ? this.setState({ newNameState: e.target.value })
                      : this.state.geographicElement === "city" &&
                        this.setState({ newNameCity: e.target.value })
                  }
                />
              </div>
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.showModalCreateAndEdit}
              >
                {parse(this.translate("DeleteCountryModal.btnCancel"))}
              </button>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={
                  this.state.modalOperation === "create"
                    ? this.createGeographicElement
                    : this.state.modalOperation === "edit" &&
                      this.editGeographicElement
                }
              >
                {parse(this.translate("DeleteCountryModal.btnConfirm"))}
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
    form: "countryForm",
    fields: _.keys(schema),
  })(
    compose(
      APIDataContainer,
      NonUserRedir,
      NonAdminRedir,
      ManagersContainer
    )(CountryForm)
  )
);
