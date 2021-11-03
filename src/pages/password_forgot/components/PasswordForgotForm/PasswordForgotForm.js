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

// Components
import schema from "./schema";
import Field from "~/components/Form/Field";
import SubmitBtn from "~/components/SubmitBtn";
import APIDataContainer from "~/containers/api_data";
import AccountsContainer from "~/containers/accounts";

import styles from "~/pages/signup/signup.styl";

const forgotPassword = (values) => {
  return API.Users.forgotPassword({
    /* eslint-disable camelcase */
    email: values.email,
    /* eslint-enable camelcase */
  });
};

class PasswordForgotForm extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

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
        forgotPassword(values).then((response) => {
          history.push("/");
          window.alert(this.translate("PasswordForgot.alertMessage"));
          resolve();
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
          label={this.translate("PasswordForgot.labelEmail")}
          {...fields.email}
        />
        <p className="control">
          <SubmitBtn
            className={classnames("is-primary", {
              "is-loading": submitting,
            })}
          >
            {parse(this.translate("PasswordForgot.btnSubmit"))}
          </SubmitBtn>
        </p>
      </form>
    );
  }
}

PasswordForgotForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default injectIntl(
  reduxForm({
    form: "passwordForgotForm",
    fields: _.keys(schema),
  })(compose(APIDataContainer, AccountsContainer)(PasswordForgotForm))
);
