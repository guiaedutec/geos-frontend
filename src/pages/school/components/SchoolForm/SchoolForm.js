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
import CONF from "~/api/index";
import axios from "axios";
import history from "~/core/history";
import Button from "../../../../components/Button";
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
import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminRedir from "~/containers/non_admin_redir";
import ManagersContainer from "~/containers/managers_table";
import SchoolInfra from "./ShoolInfra";
import SchoolClasses from "./SchoolClasses";
import {
  set_school_form_data,
  assemble_school_form_json,
} from "~/helpers/school";

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

class SchoolForm extends React.Component {
  constructor() {
    super();
    this.state = {
      has_infra: false,
      school_id: "",
      country_id: "",
      geo_structure_level2_name: "",
      geo_structure_level3_name: "",
      geo_structure_level4_name: "",
      hasUser: false,
      showModal: false,
      isDeleting: false,
      managers: [],
    };
    this.remove = this.remove.bind(this);
  }

  async remove() {
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/school/delete/${
        this.props.fields._id.value
      }?access_token=${getUserToken()}`;

    try {
      this.setState({ isDeleting: true });
      await axios.post(URL_REQUEST);
      this.setState({ isDeleting: false });

      history.push("/listar-escolas");
      this.setState({ showModal: !this.state.showModal });
    } catch (error) {
      console.log(error);
    }
  }

  showModal = (id) => {
    this.setState({ showModal: !this.state.showModal });
    if (typeof id === "string") this.setState({ idToBeRemoved: id });
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  updateGeographicElements = (country_id) => {
    const {
      geo_structure_level2_name,
      geo_structure_level3_name,
      geo_structure_level4_name,
    } = this.props.apiData.countries.find(
      (country) => country._id.$oid === country_id
    );

    this.setState({
      geo_structure_level2_name,
      geo_structure_level3_name,
      geo_structure_level4_name,
    });
  };

  getAttribute = (e, attributeName) => {
    var index = e.target.selectedIndex;
    var optionElement = e.target.childNodes[index];
    var optionName = optionElement.getAttribute(attributeName);
    return optionName;
  };

  getProvinces = (e) => {
    const country_id = e.target.value;
    this.props.fetchProvinces(country_id);
  };

  getStates = (e) => {
    const province_id = e.target.value;
    this.props.fetchStates(this.props.fields.country_id.value, province_id);
  };

  getCities = (e) => {
    const state_id = e.target.value;
    this.props.fetchCities(
      this.props.fields.country_id.value,
      this.props.fields.province_id.value,
      state_id
    );
  };

  updateSelectedCountry = (e) => {
    if (e) {
      const user = this.props.accounts.user;
      this.props.fields.affiliation_id.onChange(user.affiliation_id.$oid);
      this.props.fields.affiliation_name.onChange(user.affiliation_name);
      const country_name = this.getAttribute(e, "name");
      this.props.fields.province_id.onChange("");
      this.props.fields.state_id.onChange("");
      this.props.fields.city_id.onChange("");
      this.props.fields.country_id.onChange(e);
      this.props.fields.country_name.onChange(country_name);
      this.updateGeographicElements(e.target.value);
      this.setState({
        country_id: e.target.value,
      });
    }
  };

  updateSelectedProvince = (e) => {
    if (e) {
      const province_name = this.getAttribute(e, "name");
      this.props.fields.state_id.onChange("");
      this.props.fields.city_id.onChange("");
      this.props.fields.province_id.onChange(e);
      this.props.fields.province_name.onChange(province_name);
    }
  };

  updateSelectedState = (e) => {
    if (e) {
      const state_name = this.getAttribute(e, "name");
      this.props.fields.city_id.onChange("");
      this.props.fields.state_id.onChange(e);
      this.props.fields.state_name.onChange(state_name);
    }
  };
  updateSelectedCity = (e) => {
    if (e) {
      const city_name = this.getAttribute(e, "name");
      this.props.fields.city_id.onChange(e);
      this.props.fields.city_name.onChange(city_name);
    }
  };

  // _updateSelectedCity(event) {
  //   this.props.fields.city.onChange(event);
  // }

  _updateSelectedManager(event) {
    this.props.fields.manager.onChange(event);
  }

  _submit(values) {
    var redir_url = getQueryString("redir");
    if (!redir_url)
      redir_url =
        "/listar-escolas" +
        (getQueryString("ref") ? getQueryString("ref") : "");

    if (values._id) {
      //update
      return new Promise((resolve, reject) => {
        let obj_post = assemble_school_form_json(values);
        obj_post._id = values._id ? values._id : "";

        API.Schools.patch(obj_post).then(
          (response) => {
            if (response._id) {
              window.location = redir_url;
              resolve();
            } else {
              reject(formatRejectErrors(response));
            }
            history.push(redir_url);
          },
          (err) => {
            console.log(err);
            reject({
              _error:
                "Desculpe, Não foi possível atualizar as informações no servidor",
            });
          }
        );
      });
    } else {
      //create
      return new Promise((resolve, reject) => {
        let obj_post = assemble_school_form_json(values);

        API.Schools.create(obj_post).then(
          (response) => {
            if (response._id) {
              window.location = redir_url;
              resolve();
            } else {
              reject(formatRejectErrors(response));
            }

            history.push(redir_url);
          },
          (err) => {
            reject({
              _error:
                "Desculpe, Não foi possível cadastrar as informações no servidor",
            });
          }
        );
      });
    }
  }

  componentDidUpdate(prevProps) {
    const user = this.props.accounts.user;
    if (prevProps.accounts.user !== user && this.state.hasUser === false) {
      const country_id = user.country_id.$oid;
      const countries = this.props.apiData.countries;
      const country = countries.find(
        (country) => country._id.$oid === country_id
      );
      const country_name = country && country.name;
      this.props.fetchProvinces(country_id);
      this.props.fields.affiliation_id.onChange(user.affiliation_id.$oid);
      this.props.fields.affiliation_name.onChange(user.affiliation_name);
      this.props.fields.country_id.onChange(country_id);
      this.props.fields.country_name.onChange(country_name);
      if (country_id && countries.length) {
        this.updateGeographicElements(country_id);
        this.setState({ hasUser: true });
      }
    }
  }

  async fetchManagers() {
    try {
      const URL_REQUEST =
        CONF.ApiURL + "/api/v1/managers.json?access_token=" + getUserToken();
      const response = await axios.get(URL_REQUEST);
      this.setState({
        managers: response.data.managers,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    this.props.fetchCountries();
    this.props.loginWithToken().then(() => {
      this.loadData();
    });
    this.fetchManagers();
  }

  loadData() {
    var formDataParam = getQueryString("form_data");

    let formData;
    if (formDataParam) {
      try {
        formData = JSON.parse(decrypt(formDataParam));
      } catch (e) {}
    }

    var idParam = getQueryString("id");
    if (idParam) {
      API.Schools.findOne(idParam).then((schoolFound) => {
        if (schoolFound._id) {
          this.props.fetchProvinces(schoolFound.country_id.$oid);
          this.props.fetchStates(
            schoolFound.country_id.$oid,
            schoolFound.province_id.$oid || schoolFound.province_id
          );
          this.props.fetchCities(
            schoolFound.country_id.$oid,
            schoolFound.province_id.$oid || schoolFound.province_id,
            schoolFound.state_id.$oid
          );

          set_school_form_data(this.props.fields, schoolFound);
          this._add_infra(schoolFound.school_infra);
        }

        if (formData) {
          set_school_form_data(this.props.fields, formData);
          this._add_infra(formData.school_infra);
        }
      });
    } else {
      if (formData) {
        set_school_form_data(this.props.fields, formData);
        this._add_infra(formData.school_infra);
      }
    }
  }

  _add_manager() {
    let form_data = encrypt(JSON.stringify(this._get_form_values()));

    let idParam = getQueryString("id");
    let url_redirect =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    if (idParam) {
      url_redirect =
        url_redirect + "?id=" + idParam + "&form_data=" + form_data;
    } else {
      url_redirect = url_redirect + "?form_data=" + form_data;
    }
    window.location =
      "/criar-contato?redir=" + encodeURIComponent(url_redirect);
  }

  _add_infra = (school_infra) => {
    if (school_infra) {
      this.setState({
        has_infra: true,
      });
    }
  };

  _get_form_values() {
    let ret = {};
    let fields = this.props.values;
    console.log(fields);

    Object.keys(fields).forEach(function (key) {
      console.log(fields[key]);
      switch (key) {
        case "_id": {
          ret["_id"] = { $oid: fields[key] };
          break;
        }

        case "manager": {
          ret["manager_id"] = { $oid: fields[key] };
          break;
        }
        case "city": {
          ret["city_id"] = { $oid: fields[key] };
          break;
        }
        default: {
          ret[key] = fields[key];
          break;
        }
      }
    });

    return ret;
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

    //TODO update-lib redux-form checkbox bug
    delete fields.kindergarten["checked"];
    delete fields.elementary_1["checked"];
    delete fields.elementary_2["checked"];
    delete fields.highschool["checked"];
    delete fields.technical["checked"];
    delete fields.adult["checked"];

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
                    {parse(this.translate("CreateSchool.registerData"))}
                  </h1>
                </div>

                <div className="column is-full">
                  <Field
                    label={this.translate("CreateSchool.name")}
                    classField="slim-max"
                    {...fields.name}
                  />
                </div>

                <div className="column is-4">
                  <Field
                    label={this.translate("CreateSchool.uniqueCode")}
                    classField="slim-max"
                    {...fields.unique_code}
                  />
                </div>

                <div className="column is-4">
                  <label className="label Field_field__label_2FT">
                    {parse(this.translate("CreateSchool.localizationType"))}
                  </label>
                  <div className={classnames("select", styles.form__select)}>
                    <select id="network_type" {...fields.location_type}>
                      <option value="">
                        {this.translate("CreateSchool.selectOption")}
                      </option>
                      <option value="Urbana">
                        {this.translate("CreateSchool.urban")}
                      </option>
                      <option value="Rural">
                        {this.translate("CreateSchool.rural")}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="column is-4">
                  <label className="label Field_field__label_2FT">
                    {parse(this.translate("CreateSchool.contact"))}
                  </label>
                  <div className={classnames("select", styles.form__select)}>
                    <select
                      {...fields.manager}
                      onChange={this._updateSelectedManager.bind(this)}
                    >
                      <option value="">
                        {this.translate("CreateSchool.selectOption")}
                      </option>
                      {this.state.managers.map((manager) => (
                        <option key={manager._id} value={manager._id}>
                          {manager.name} - {manager.email}
                        </option>
                      ))}
                    </select>
                    <div
                      className={styles.add}
                      onClick={() => this._add_manager()}
                    >
                      <a href="#">
                        <i className="fa fa-plus" />{" "}
                        {parse(this.translate("CreateSchool.new"))}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="column is-4">
                  {/* Província */}
                  <label className="label Field_field__label_2FT">
                    {this.state.geo_structure_level2_name === ""
                      ? parse(this.translate("CreateSchool.province"))
                      : this.state.geo_structure_level2_name}
                  </label>

                  <span
                    className={classnames("select", styles.form__select, {
                      "is-danger": Boolean(fields.province_id.error),
                    })}
                  >
                    <select
                      {...fields.province_id}
                      onChange={(e) => {
                        this.updateSelectedProvince(e);
                        this.getStates(e);
                      }}
                    >
                      <option value="">
                        {this.translate("CreateSchool.selectOption")}
                      </option>
                      {this.props.apiData.provinces instanceof Array &&
                        this.props.apiData.provinces.map((province) => (
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

                  {fields.province_id.error ? (
                    <span className="help is-danger">
                      {fields.province_id.error}
                    </span>
                  ) : null}
                </div>

                <div className="column is-4">
                  {/* Estado */}
                  <label className="label Field_field__label_2FT">
                    {this.state.geo_structure_level3_name === ""
                      ? parse(this.translate("CreateSchool.state"))
                      : this.state.geo_structure_level3_name}
                  </label>

                  <span
                    className={classnames("select", styles.form__select, {
                      "is-danger": Boolean(fields.state_id.error),
                    })}
                  >
                    <select
                      {...fields.state_id}
                      onChange={(e) => {
                        this.updateSelectedState(e);
                        this.getCities(e);
                      }}
                    >
                      <option value="">
                        {this.translate("CreateSchool.selectOption")}
                      </option>
                      {this.props.apiData.states instanceof Array &&
                        this.props.apiData.states.map((state) => (
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

                  {fields.state_id.error ? (
                    <span className="help is-danger">
                      {fields.state_id.error}
                    </span>
                  ) : null}
                </div>

                <div className="column is-4">
                  {/* Cidade */}
                  <label className="label Field_field__label_2FT">
                    {this.state.geo_structure_level4_name === ""
                      ? parse(this.translate("CreateSchool.city"))
                      : this.state.geo_structure_level4_name}
                  </label>

                  <span
                    className={classnames("select", styles.form__select, {
                      "is-danger": Boolean(fields.city_id.error),
                    })}
                  >
                    <select
                      {...fields.city_id}
                      onChange={(e) => {
                        this.updateSelectedCity(e);
                      }}
                    >
                      <option value="">
                        {this.translate("CreateSchool.selectOption")}
                      </option>
                      {this.props.apiData.cities instanceof Array &&
                        this.props.apiData.cities.map((city) => (
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

                  {fields.city_id.error ? (
                    <span className="help is-danger">
                      {fields.city_id.error}
                    </span>
                  ) : null}
                </div>

                {/* <div className="column is-4">
                  <Field
                    label="Regional"
                    classField="slim-max"
                    {...fields.regional}
                  />
                </div> */}

                <div className="column is-full">
                  <Field
                    label={this.translate("CreateSchool.comments")}
                    classField="slim-max"
                    {...fields.observations}
                  />
                </div>

                {/* <div className="column is-4">
                  <Field
                    label={this.translate("CreateSchool.regional")}
                    classField="slim-max"
                    {...fields.regional}
                  />
                </div> */}
              </div>

              <div className="columns is-multiline">
                <div className="column is-half">
                  <Field
                    label={this.translate("CreateSchool.numberOfTeacher")}
                    classField="slim-max"
                    type="number"
                    {...fields.staff_count}
                  />
                </div>
                <div className="column is-half">
                  <Field
                    label={this.translate(
                      "CreateSchool.numberOfIntegralStudents"
                    )}
                    classField="slim-max"
                    type="number"
                    {...fields.student_full_count}
                  />
                </div>
                <div className="column is-4">
                  <Field
                    label={this.translate(
                      "CreateSchool.numberOfMorningStudents"
                    )}
                    classField="slim-max"
                    type="number"
                    {...fields.student_diurnal_count}
                  />
                </div>
                <div className="column is-4">
                  <Field
                    label={this.translate(
                      "CreateSchool.numberOfAfternoonStudents"
                    )}
                    classField="slim-max"
                    type="number"
                    {...fields.student_vespertine_count}
                  />
                </div>
                <div className="column is-4">
                  <Field
                    label={this.translate("CreateSchool.numberOfNightStudents")}
                    classField="slim-max"
                    type="number"
                    {...fields.student_nocturnal_count}
                  />
                </div>
              </div>
            </div>

            <SchoolInfra
              hasInfra={this.state.has_infra}
              _add_infra={this._add_infra}
              school_infra={fields.school_infra}
            />

            <div className={styles.field}>
              <p className={classnames("control", styles.form__submit_button)}>
                <SubmitBtn
                  className={classnames("is-primary", {
                    "is-loading": submitting,
                  })}
                >
                  {getQueryString("id")
                    ? this.translate("CreateSchool.btnSave")
                    : this.translate("CreateSchool.btnregister")}
                </SubmitBtn>

                {this.props.fields._id.value && (
                  <Button onClick={this.showModal}>
                    {parse(this.translate("CreateSchool.btnRemove"))}
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
              <h4>{parse(this.translate("DeleteSchoolModal.warning"))}</h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              <p>
                <FormattedMessage
                  id="DeleteSchoolModal.description1"
                  values={{
                    itemsToBeDeleted: (
                      <strong>
                        {this.translate("DeleteSchoolModal.itemsToBeDeleted")}
                      </strong>
                    ),
                  }}
                />
                .
              </p>
              <p>{parse(this.translate("DeleteSchoolModal.description2"))}</p>
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.showModal}
              >
                {parse(this.translate("DeleteSchoolModal.btnCancel"))}
              </button>
              <button
                className={classnames("button", stylesModal.modal__btn, {
                  "is-loading": this.state.isDeleting,
                })}
                onClick={this.remove}
              >
                {parse(this.translate("DeleteSchoolModal.btnConfirm"))}
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
    form: "schoolForm",
    fields: _.keys(schema),
  })(
    compose(
      APIDataContainer,
      NonUserRedir,
      NonAdminRedir,
      ManagersContainer
    )(SchoolForm)
  )
);
