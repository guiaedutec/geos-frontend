import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./Field.styl";
import stylesField from "~/components/Form/Field.styl";
import { injectIntl } from "react-intl";
function FieldSimpleSelect({
  hiddenMargin,
  name,
  label,
  // value,
  placeholder,
  touched,
  error,
  readOnly,
  description,
  classField,
  options,
  emptyOptionText,
  loading,
  disabled,
  onChangeTeachingStage,
  intl,
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
    onChange,
    type,
    ...rest
  } = customFields;

  return (
    <div style={{ margin: hiddenMargin ? 0 : "20px 0" }}>
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
        className={classnames("control", styles.field__input, {
          "has-icon has-icon-right": Boolean(error),
          "is-loading": loading,
        })}
      >
        <span
          className={classnames("select", styles.form__select, {
            "is-danger": Boolean(error),
          })}
        >
          <select
            name={name}
            {...rest}
            disabled={loading || disabled}
            onChange={onChangeTeachingStage ? onChangeTeachingStage : onChange}
          >
            <option value="">{emptyOptionText}</option>

            {options &&
              options.map((f, index) => (
                <option key={index} value={f.value}>
                  {typeof f.label === "object"
                    ? f.label.props &&
                      intl.formatMessage({ id: f.label.props.id })
                    : f.label}
                </option>
              ))}
          </select>
        </span>

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

FieldSimpleSelect.propTypes = {
  classField: PropTypes.string,
  error: PropTypes.string,
  hiddenMargin: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  okMessage: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.string,
  touched: PropTypes.bool,
  value: PropTypes.string,
};

export default injectIntl(FieldSimpleSelect);
