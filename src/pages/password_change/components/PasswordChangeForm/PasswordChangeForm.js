import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { compose } from "redux";
import validate from "validate.js";
import _ from "lodash";
import classnames from "classnames";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import history from "~/core/history";
import API from "~/api";
import { isDirectorOrTeacher } from "~/helpers/users";

// Components
import schema from "./schema";
import Field from "~/components/Form/Field";
import SubmitBtn from "~/components/SubmitBtn";
import APIDataContainer from "~/containers/api_data";
import AccountsContainer from "~/containers/accounts";

import styles from "~/pages/signup/signup.styl";

/**
 * Based on http://stackoverflow.com/a/901144
 */

const changePassword = (values) => {
  return API.Users.changePassword({
    password: values.password,
  });
};

class PasswordChangeForm extends React.Component {
  constructor() {
    super();
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  _submit(values) {
    const _this = this;
    return new Promise((resolve, reject) => {
      const errors = _.mapValues(
        validate(values, schema, { fullMessages: false }),
        (value) => {
          return value[0];
        }
      );

      /* eslint-disable no-console */
      if (_.isEmpty(errors)) {
        changePassword(values).then((response) => {
          if (response.errors) {
            reject({
              password: _.get(response.errors, "password")
                ? this.translate("PasswordChange.messageMinCharacters")
                : null,
            });
            return;
          }
          resolve();
          if (!_.isEmpty(response)) {
            window.alert(this.translate("PasswordChange.messageError"));
            return;
          }

          if (isDirectorOrTeacher(_this.props.accounts.user)) {
            history.push("/recursos");
          } else {
            history.push("/painel");
          }
          window.alert(this.translate("PasswordChange.messageSuccess"));
        });
      } else {
        reject(errors);
      }
    });
  }

  render() {
    const { fields, handleSubmit, submitting } = this.props;

    const onSubmit = handleSubmit(this._submit.bind(this));

    return (
      <form className={styles.form} onSubmit={onSubmit}>
        <Field
          label={this.translate("PasswordChange.labelNewPassword")}
          type="password"
          {...fields.password}
        />
        <Field
          label={this.translate("PasswordChange.labelConfirmNewPassword")}
          type="password"
          {...fields.confirmPassword}
        />

        <p className="control">
          <SubmitBtn
            className={classnames("is-primary", {
              "is-loading": submitting,
            })}
          >
            {parse(this.translate("PasswordChange.btnSubmit"))}
          </SubmitBtn>
        </p>
      </form>
    );
  }
}

PasswordChangeForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default injectIntl(
  reduxForm({
    form: "passwordChangeForm",
    fields: _.keys(schema),
  })(compose(APIDataContainer, AccountsContainer)(PasswordChangeForm))
);
