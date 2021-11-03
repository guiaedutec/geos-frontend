import React from "react";
import PropTypes from "prop-types";
import "url-search-params-polyfill";
import classNames from "classnames";
import { reduxForm } from "redux-form";
import _ from "lodash";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import validate from "validate.js";
import { LOGIN_ERROR, RECEIVE_CURRENT_USER } from "~/actions/accounts";
import { redirectDefaultPageByUser } from "~/helpers/users";
import history from "~/core/history";

// Components
import schema from "./schema";
import Link from "~/components/Link";
import Field from "~/components/Form/Field";
import SubmitBtn from "~/components/SubmitBtn";
import Button from "~/components/Button";

// Styles
import styles from "./Style.styl";

class SignInForm extends React.Component {
  submit(values) {
    return new Promise((resolve, reject) => {
      const errors = _.mapValues(
        validate(values, schema, { fullMessages: false }),
        (value) => {
          return value[0];
        }
      );

      console.log(errors);

      if (_.isEmpty(errors)) {
        this.props
          .loginUser({
            email: values.email,
            password: values.password,
          })
          .then((action) => {
            switch (action.type) {
              case LOGIN_ERROR:
                reject();
                return;
              case RECEIVE_CURRENT_USER:
                history.push(
                  redirectDefaultPageByUser(this.props.accounts.user)
                );
                return;
              default:
                resolve();
            }
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
    const params = new URLSearchParams(window.location.search);
    let origin =
      params.get("origem") !== null ? "?origem=" + params.get("origem") : "";

    const { fields, handleSubmit, intl } = this.props;
    const { isSigningIn } = this.props.accounts;
    this.props.accounts.profile = this.props.type;
    const emailPlaceholder = intl.formatMessage({
      id: "SignInForm.emailPlaceholder",
    });
    const passwordPlaceholder = intl.formatMessage({
      id: "SignInForm.passwordPlaceholder",
    });

    const onSubmit = handleSubmit(this.submit.bind(this));

    return (
      <div className={classNames("columns", styles.form__white_wrap)}>
        <form
          className={classNames(
            styles.form__width,
            styles.form__white,
            "column is-7"
          )}
          onSubmit={onSubmit}
        >
          <p className={styles.login__title}>
            {parse(this.translate("SignInForm.title"))}
          </p>
          <span className="help is-danger">
            {this.props.accounts.loginError &&
              parse(this.translate("SignInForm.LoginError"))}
          </span>
          <div
            className={classNames(
              "control",
              "has-icon",
              styles.login__input__password
            )}
          >
            <Field
              className={classNames("input", styles.login__input)}
              placeholder={emailPlaceholder}
              type="email"
              {...fields.email}
            />
            <i
              className={classNames("far fa-envelope", styles.placeholder_icon)}
            ></i>
          </div>
          <div
            className={classNames(
              "control",
              "has-icon",
              styles.login__input__password
            )}
          >
            <Field
              className={classNames(
                "input",
                styles.login__input,
                styles.login__input__password
              )}
              type="password"
              placeholder={passwordPlaceholder}
              {...fields.password}
            />
            <i
              className={classNames("fas fa-key", styles.placeholder_icon)}
            ></i>
          </div>
          <div className={classNames("control", styles.control__centered)}>
            <p className={classNames("control", styles.control__button)}>
              <SubmitBtn
                className={classNames(
                  "is-primary",
                  styles.control__signing__btn__size,
                  {
                    "is-loading": isSigningIn,
                  }
                )}
              >
                {parse(this.translate("SignInForm.btnLogIn"))}
              </SubmitBtn>
            </p>
          </div>
          <div className={classNames(styles.login_div_forgot_link)}>
            <Link className={styles.login__forgot_link} to="/recuperar-senha">
              {parse(this.translate("SignInForm.forgotPassword"))}
            </Link>
          </div>
        </form>
        {this.props.type === "gestor" ? (
          <form
            className={classNames(
              "column is-5",
              styles.form__width,
              styles.form__white,
              styles.form__not_registered
            )}
          >
            <h3>{parse(this.translate("SignInForm.titleNotRegistered"))}</h3>
            <div className="control">
              <Button
                className={styles.accession}
                to={"/criar-conta/" + this.props.type}
              >
                {parse(this.translate("SignInForm.btnRegister"))}
              </Button>
            </div>
          </form>
        ) : (
          <form
            className={classNames(
              "column is-5",
              styles.form__width,
              styles.form__white,
              styles.form__not_registered
            )}
          >
            <h3>{parse(this.translate("SignInForm.titleNotRegistered"))}</h3>
            <div className="control">
              <Button
                to={"/criar-conta/" + this.props.type + origin}
                className={classNames(
                  "cadastro",
                  styles.button__normal,
                  styles.control__signing__btn,
                  styles.control__signing__btn__size
                )}
                {...(isSigningIn ? { disabled: true } : {})}
              >
                {parse(this.translate("SignInForm.btnRegister"))}
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  }
}

SignInForm.propTypes = {
  type: PropTypes.string,
  user: PropTypes.object,
  isSigningIn: PropTypes.bool,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  accounts: PropTypes.object,
};

export default injectIntl(
  reduxForm({
    form: "signInForm",
    fields: _.keys(schema),
  })(SignInForm)
);
