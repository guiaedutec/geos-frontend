import React from "react";
import { reduxForm } from "redux-form";
import Field from "~/components/Form/Field";
import SubmitBtn from "~/components/SubmitBtn";
import schema from "./schema";
import _ from "lodash";
import classnames from "classnames";
import styles from "../../adminCountry.styl";
import API from "~/api";
import { compose } from "redux";
import stylesField from "~/components/Form/Field.styl";
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
import validate from "validate.js";
import Button from "../../../../components/Button";

import { injectIntl } from "react-intl";
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

class AdminCountryForm extends React.Component {
  constructor() {
    super();
    this.state = {
      admin_country_id: null,
      isAdminCountryEdit: false,
      adminCountryAlreadyExists: false,
      showModal: false,
      hasCountries: false,
      geo_structure_level1_name: "",
      message_error: "",
      showModalRegisterAdminCountry: false,
      errors: {},
    };
    this.remove = this.remove.bind(this);
    this.hasError = this.hasError.bind(this);
  }

  insertDataIntoTheForm = (data) => {
    const fields = this.props.fields;
    fields.name.onChange(data.name);
    fields.email.onChange(data.email);
    fields.phone_number.onChange(data.phone_number);
    fields.country_id.onChange(data.country_id.$oid);
    fields.country_name.onChange(data.country_name);
  };

  loadAdminCountry = async (id) => {
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/admin_country/${id}?access_token=${getUserToken()}`;
    const response = await axios.get(URL_REQUEST);
    return await response.data;
  };

  async componentDidMount() {
    this.props.fetchCountries();
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    this.setState({ admin_country_id: id });
    if (id !== null) {
      this.setState({ isAdminCountryEdit: true });
      const data = await this.loadAdminCountry(id);
      this.insertDataIntoTheForm(data.data);
    }
  }

  updateSelectedCountry = (e) => {
    if (e) {
      var index = e.target.selectedIndex;
      var optionElement = e.target.childNodes[index];
      var optionName = optionElement.getAttribute("name");
      this.props.fields.country_name.onChange(optionName);
      this.props.fields.country_id.onChange(e);
    }
  };

  getLang = () => localStorage.getItem("lang");

  hasError = (data, schema) => {
    const errors = validate(data, schema, { fullMessages: false });
    if (errors) {
      this.setState({ errors });
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return true;
    } else {
      this.setState({ errors: {} });
      return false;
    }
  };

  async _submit(values) {
    if (this.state.isAdminCountryEdit) {
      const { password, ...editSchema } = schema;
      if (this.hasError(values, editSchema)) return;
      this.setState({ message_error: "" });
      const URL_REQUEST =
        CONF.ApiURL +
        `/api/v1/admin_country/edit/${
          this.state.admin_country_id
        }?access_token=${getUserToken()}&lang=${this.getLang()}`;
      try {
        const response = await axios.post(URL_REQUEST, values);
        await this.showModalRegisterAdminCountry();
      } catch (error) {
        this.setState({
          message_error: error.response.data.message,
        });
        this.showModalRegisterAdminCountry();
      }
    } else {
      if (this.hasError(values, schema)) return;
      this.setState({ message_error: "" });
      const URL_REQUEST =
        CONF.ApiURL +
        `/api/v1/admin_country/save/?access_token=${getUserToken()}&lang=${this.getLang()}`;
      try {
        const response = await axios.post(URL_REQUEST, values);
        await this.showModalRegisterAdminCountry();
      } catch (error) {
        this.setState({
          message_error: error.response.data.message,
        });
        this.showModalRegisterAdminCountry();
      }
    }
  }

  async remove() {
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/admin_country/delete/${
        this.state.admin_country_id
      }?access_token=${getUserToken()}&lang=${this.getLang()}`;
    try {
      await axios.post(URL_REQUEST);
      this.setState({ showModal: !this.state.showModal });
      history.push("/listar-admin-paises");
    } catch (error) {
      console.log(error);
    }
  }

  translate = (id) => this.props.intl.formatMessage({ id });

  showModal = (id) => {
    this.setState({ showModal: !this.state.showModal });
    if (typeof id === "string") this.setState({ idToBeRemoved: id });
  };

  showModalRegisterAdminCountry = () => {
    this.setState({
      showModalRegisterAdminCountry: !this.state.showModalRegisterAdminCountry,
    });
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
                {parse(this.translate("CreateAdminCountry.registerData"))}
              </h1>
              <Field
                label={this.translate("CreateAdminCountry.name")}
                classField="slim"
                {...fields.name}
                error={this.state.errors.name}
              />

              <Field
                label={this.translate("CreateAdminCountry.email")}
                classField="slim"
                type="email"
                {...fields.email}
                error={this.state.errors.email}
              />

              <Field
                label={this.translate("CreateAdminCountry.password")}
                classField="slim"
                {...fields.password}
                type="password"
                error={this.state.errors.password}
              />

              <Field
                label={this.translate("CreateAdminCountry.phone_number")}
                classField="slim"
                {...fields.phone_number}
                error={this.state.errors.phone_number}
              />

              {/* País */}
              <label className={classnames("label", styles.form__label)}>
                {parse(this.translate("SignUpForm.label.region"))}
              </label>
              <div
                className={classnames("control", styles.form__input, {
                  "has-icon has-icon-right": Boolean(fields.country_name.error),
                })}
              >
                <span
                  className={classnames("select", styles.form__select, {
                    "is-danger": Boolean(this.state.errors.country_name),
                  })}
                >
                  <select
                    {...fields.country_id}
                    onChange={(e) => {
                      this.updateSelectedCountry(e);
                    }}
                  >
                    <option value="">
                      {this.translate("SignUpForm.selectRegion")}
                    </option>
                    {this.props.apiData.countries.map((country) => (
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
                {this.state.errors.country_name ? (
                  <i
                    className={classnames(
                      "fas fa-exclamation-triangle",
                      stylesField.field__warning
                    )}
                  ></i>
                ) : null}
                {this.state.errors.country_name ? (
                  <span className="help is-danger">
                    {this.state.errors.country_name}
                  </span>
                ) : null}
              </div>
            </div>

            <div className={styles.field}>
              <p className={classnames("control", styles.form__submit_button)}>
                <SubmitBtn
                  className={classnames("is-primary", {
                    "is-loading": submitting,
                  })}
                >
                  {getQueryString("id")
                    ? this.translate("CreateAdminCountry.btnSave")
                    : this.translate("CreateAdminCountry.btnRegister")}
                </SubmitBtn>

                {this.state.admin_country_id && (
                  <Button onClick={this.showModal}>
                    {parse(this.translate("CreateAdminCountry.btnRemove"))}
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
              <h4>
                {parse(this.translate("DeleteAdminCountryModal.warning"))}
              </h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              <p>
                {parse(this.translate("DeleteAdminCountryModal.description1"))}
              </p>
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.showModal}
              >
                {parse(this.translate("DeleteAdminCountryModal.btnCancel"))}
              </button>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.remove}
              >
                {parse(this.translate("DeleteAdminCountryModal.btnConfirm"))}
              </button>
            </div>
          </ReactModal>

          <ReactModal
            isOpen={this.state.showModalRegisterAdminCountry}
            className={classnames(stylesModal.modal)}
            overlayClassName={classnames(stylesModal.overlay)}
          >
            <div className={classnames(stylesModal.modal__header)}>
              <h4>
                {this.state.message_error
                  ? parse(
                      this.translate("RegisterAdminCountryModal.titleError")
                    )
                  : parse(this.translate("RegisterAdminCountryModal.title"))}
              </h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              {this.state.message_error
                ? this.state.message_error
                : parse(
                    this.translate(
                      "RegisterAdminCountryModal.descriptionSuccess"
                    )
                  )}
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={() => {
                  this.showModalRegisterAdminCountry();
                  !this.state.message_error &&
                    history.push("/listar-admin-paises");
                }}
              >
                {parse(this.translate("RegisterAdminCountryModal.btnOk"))}
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
    form: "adminCountryForm",
    fields: _.keys(schema),
  })(
    compose(
      APIDataContainer,
      NonUserRedir,
      NonAdminRedir,
      ManagersContainer
    )(AdminCountryForm)
  )
);
