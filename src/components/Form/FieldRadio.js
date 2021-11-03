import React from "react";
import PropTypes from 'prop-types';
import classnames from "classnames";
import styles from "./Field.styl";
import _ from "lodash";

export default function FieldRadio({
  noMarginBotton,
  name,
  label,
  value,
  placeholder,
  touched,
  error,
  readOnly,
  description,
  classField,
  options,
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
    addonText,
    type,
    ...rest
  } = customFields;

  return (
    <div style={{ margin: "20px 0" }}>
      <label className={classnames("label", styles.field__label)}>
        {label}
      </label>
      <div className={classnames("is-small", styles.field__description)}>
        {description && (
          <span>
            <i className="fas fa-info-circle"></i> {description}
          </span>
        )}
      </div>
      <div
        className={classnames("control", {
          "has-icon has-icon-right": touched,
        })}
      >
        <div
          className={classnames(
            "control columns",
            styles.field__input,
            Boolean(error) ? styles.is_danger : null
          )}
        >
          {options.map((o) => (
            <label
              className={classnames("radio", styles.field__radio)}
              style={{ marginRight: "30px" }}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                {...rest}
                checked={o.checked}
              />
              {o.text}
            </label>
          ))}
        </div>

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

FieldRadio.propTypes = {
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
