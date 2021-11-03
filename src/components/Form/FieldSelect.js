import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./Field.styl";
import Select from "react-select";

export default function FieldSelect({
  name,
  label,
  placeholder,
  touched,
  error,
  classField,
  value,
  ...customFields
}) {
  return (
    <div className={classnames(styles[classField], styles.field)}>
      <label className={classnames("label", styles.field__label)}>
        {label}
      </label>
      <div
        className={classnames("control", {
          "has-icon has-icon-right": touched,
        })}
      >
        <Select
          name={name}
          closeMenuOnSelect={false}
          isMulti
          placeholder={placeholder}
          className={classnames("react-select-container", {
            "is-danger": Boolean(error),
          })}
          classNamePrefix="react-select"
          value={value}
          {...customFields}
        />
        {Boolean(error) ? (
          <i
            className={classnames(
              "fas fa-exclamation-triangle",
              styles.field__warning
            )}
          ></i>
        ) : null}
        {Boolean(error) ? (
          <span className="help is-danger">{error}</span>
        ) : null}
      </div>
    </div>
  );
}

FieldSelect.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
  okMessage: PropTypes.string,
  classField: PropTypes.string,
};
