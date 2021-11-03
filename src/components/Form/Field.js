import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./Field.styl";
import _ from "lodash";

export default function Field({
  noMarginBotton,
  name,
  label,
  value,
  subtitle,
  placeholder,
  touched,
  error,
  readOnly,
  description,
  classField,
  ...customFields
}) {
  const {
    initialValue,
    autofill,
    onUpdate,
    valid,
    invalid,
    dirty,
    pristine,
    active,
    visited,
    autofilled,
    ...rest
  } = customFields;
  return (
    <div
      className={classnames(
        styles[classField],
        noMarginBotton === undefined
          ? styles.field
          : styles.field_no_margin_botton
      )}
    >
      <label className={classnames("label", styles.field__label)}>
        {label}
      </label>
      <div className={classnames("is-small", styles.field__description)}>
        {description}
      </div>
      <div
        className={classnames("control", {
          "has-icon has-icon-right": touched,
        })}
      >
        <input
          className={classnames("input", {
            "is-danger": Boolean(error),
          })}
          type="text"
          placeholder={placeholder}
          value={value}
          name={name}
          readOnly={readOnly}
          {...rest}
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

Field.propTypes = {
  name: PropTypes.string.isRequired,
  noMarginBotton: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
  okMessage: PropTypes.string,
  readOnly: PropTypes.string,
  classField: PropTypes.string,
};
