import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./Field.styl";

export default function FieldTextArea({
  label,
  value,
  placeholder,
  touched,
  error,
  ...customFields
}) {
  return (
    <div className={styles.field}>
      <label className={classnames("label", styles.field__label)}>
        {label}
      </label>
      <p
        className={classnames("control", {
          "has-icon has-icon-right": touched,
        })}
      >
        <textarea
          className={classnames("textarea", styles.field__textarea, {
            "is-danger": Boolean(error),
          })}
          placeholder={placeholder}
          value={value || ""}
          name={name}
          {...customFields}
        />
        {Boolean(error) ? (
          <i className="fas fa-exclamation-triangle"></i>
        ) : null}
        {Boolean(error) ? (
          <span className="help is-danger">{error}</span>
        ) : null}
      </p>
    </div>
  );
}

FieldTextArea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
  okMessage: PropTypes.string,
};
