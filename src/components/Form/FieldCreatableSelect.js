import React, { Component } from "react";
import classnames from "classnames";
import styles from "./Field.styl";
import Creatable from "react-select/creatable";

export default class FieldCreatableSelect extends Component {
  render() {
    const {
      name,
      label,
      placeholder,
      touched,
      error,
      classField,
      ...customFields
    } = this.props;

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
          <Creatable
            name={name}
            closeMenuOnSelect={false}
            placeholder={placeholder}
            className={classnames("react-select-container", {
              "is-danger": Boolean(error),
            })}
            classNamePrefix="react-select"
            formatCreateLabel={(inputValue) => (
              <p>
                Criar <strong>{inputValue}</strong>
              </p>
            )}
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
}
