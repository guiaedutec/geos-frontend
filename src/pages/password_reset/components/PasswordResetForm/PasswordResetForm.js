import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { compose } from "redux";
import validate from "validate.js";
import _ from "lodash";
import classnames from "classnames";

import history from "~/core/history";
import API from "~/api";

// Components
import schema from "./schema";
import Field from "~/components/Form/Field";
import SubmitBtn from "~/components/SubmitBtn";
import APIDataContainer from "~/containers/api_data";
import AccountsContainer from "~/containers/accounts";

import {
  injectIntl
} from "react-intl";
import parse from "html-react-parser";

import styles from "~/pages/signup/signup.styl";

/**
 * Based on http://stackoverflow.com/a/901144
 */
const getParamByName = (name) => {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const resetPassword = (values) => {
  return API.Users.resetPassword({
    password: values.password,
    reset_password_token: getParamByName("token"),
  });
};

class PasswordResetForm extends React.Component {
  _submit(values) {
    return new Promise((resolve, reject) => {
      const errors = _.mapValues(
        validate(values, schema, { fullMessages: false }),
        (value) => {
          return value[0];
        }
      );

      /* eslint-disable no-console */
      if (_.isEmpty(errors)) {
        resetPassword(values).then((response) => {
          if (response.errors) {
            if (_.get(response.errors, "reset_password_token")) {
              window.alert("Token inválido");
            }
            reject({
              password: _.get(response.errors, "password")
                ? "insira pelo menos 5 caracteres"
                : null,
            });
            return;
          }
          resolve();
          if (!_.get(response, "authenticity_token")) {
            window.alert("Não foi possível logar com o usuário");
            return;
          }
          this.props.loginWithToken(response.authenticity_token);
          history.push("/recursos");
        });
      } else {
        reject(errors);
      }
    });
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    const { fields, handleSubmit, submitting } = this.props;

    const onSubmit = handleSubmit(this._submit.bind(this));

    return (
      <form className={styles.form} onSubmit={onSubmit}>
        <Field label={parse(this.translate("PasswordReset.labelPassword"))} type="password" {...fields.password} />
        <Field
          label={parse(this.translate("PasswordReset.labelConfirmPassword"))}
          type="password"
          {...fields.confirmPassword}
        />

        <p className="control">
          <SubmitBtn
            className={classnames("is-primary", {
              "is-loading": submitting,
            })}
          >
            {parse(this.translate("PasswordReset.btnSubmit"))}
          </SubmitBtn>
        </p>
      </form>
    );
  }
}

PasswordResetForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default injectIntl(
  reduxForm({
    form: "passwordResetForm",
    fields: _.keys(schema),
  })(compose(APIDataContainer, AccountsContainer)(PasswordResetForm))
);