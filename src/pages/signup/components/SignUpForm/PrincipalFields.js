import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

// Components
import stylesField from "~/components/Form/Field.styl";

import styles from "../../signup.styl";

class SignUpFormPrincipalFields extends React.Component {
  translate = (id) => this.props.intl.formatMessage({ id });
  render() {
    const { fields, apiData } = this.props;

    const { isFetchingCities, isFetchingSchools } = apiData;

    return (
      <div>
        {/* Cidade */}
        {this.props.user && Object.keys(this.props.user).length === 0 && (
          <div>
            <label className={classnames("label", styles.form__label)}>
              {this.props.geo_structure_level4_name === ""
                ? parse(this.translate("SignUpFormPrincipalFields.label.city"))
                : this.props.geo_structure_level4_name}
            </label>
            <div
              className={classnames("control", styles.form__input, {
                "has-icon has-icon-right": Boolean(fields.city.error),
                "is-loading": isFetchingCities,
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
                    this.props.updateSelectedCity(e);
                    this.props.getSchools(e);
                  }}
                  disabled={fields.state.value === "" ? true : false}
                >
                  {apiData.cities.length && !isFetchingCities ? (
                    <option value="">
                      {this.translate("SignUpFormPrincipalFields.selectCity")}
                    </option>
                  ) : null}
                  {apiData.cities.length <= 0 && !isFetchingCities ? (
                    <option value="">
                      {this.translate("SignUpFormPrincipalFields.noCityFound")}
                    </option>
                  ) : null}
                  {this.props.apiData.cities instanceof Array &&
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
        )}
        {/* Escola */}
        {this.props.profile !== "gestor" && (
          <div>
            <label className={classnames("label", styles.form__label)}>
              {parse(this.translate("SignUpFormPrincipalFields.label.school"))}
            </label>
            <div
              className={classnames("control", styles.form__input, {
                "has-icon has-icon-right": Boolean(fields.school.error),
                "is-loading": isFetchingSchools,
              })}
            >
              <input
                className={classnames(
                  "input",
                  { "is-hidden": fields.school_type.value != "Particular" },
                  { "is-danger": Boolean(fields.institution.error) }
                )}
                type="text"
                placeholder={this.props.intl.formatMessage({
                  id: "SignUpFormPrincipalFields.placeholderSchool",
                })}
                {...fields.institution}
              />
              <span
                className={classnames(
                  "select",
                  styles.form__select,
                  { "is-hidden": fields.school_type.value == "Particular" },
                  { "is-danger": Boolean(fields.school.error) }
                )}
              >
                <select
                  {...fields.school}
                  disabled={
                    this.props.apiData.schools &&
                    this.props.apiData.schools.length === 0
                      ? true
                      : false
                  }
                  onChange={this.props.insertGeographicElements}
                >
                  <option value="">
                    {this.translate("SignUpFormPrincipalFields.selectSchool")}
                  </option>
                  {apiData.schools instanceof Array &&
                    apiData.schools.map((school) => (
                      <option key={school._id.$oid} value={school._id.$oid}>
                        {school.name}
                      </option>
                    ))}
                </select>
              </span>
              {fields.school.error || fields.institution.error ? (
                <i
                  className={classnames(
                    "fas fa-exclamation-triangle",
                    stylesField.field__warning
                  )}
                ></i>
              ) : null}
              {fields.school.error || fields.institution.error ? (
                <span className="help is-danger">{fields.state.error}</span>
              ) : null}
            </div>
          </div>
        )}
        <span className="help is-danger"></span>
      </div>
    );
  }
}

SignUpFormPrincipalFields.propTypes = {
  fields: PropTypes.object.isRequired,
  updateSchools: PropTypes.func,
  apiData: PropTypes.object,
  getSchools: PropTypes.func,
  updateSelectedCity: PropTypes.func,
};

export default injectIntl(SignUpFormPrincipalFields);
