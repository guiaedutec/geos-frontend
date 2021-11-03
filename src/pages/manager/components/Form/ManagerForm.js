import React from "react";
import { connect } from "react-redux";
import { change, reduxForm } from "redux-form";
import Field from "~/components/Form/Field";
import SubmitBtn from "~/components/SubmitBtn";
import schema from "./schema";
import _ from "lodash";
import classnames from "classnames";
import styles from "../../index.styl";
import { SubmissionError } from "redux-form";
import API from "~/api";
import { compose } from "redux";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import parse from "html-react-parser";
import Button from "../../../../components/Button";

import APIContainer from "~/containers/api_data";
import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminRedir from "~/containers/non_admin_redir";

var getQueryString = function (field, url) {
  var href = url ? url : window.location.href;
  var reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
  var string = reg.exec(href);
  return string ? string[1] : null;
};

var formatRejectErrors = (response) => {
  let rej_errors = {};
  Object.keys(response).forEach(function (key) {
    rej_errors[key] = response[key];
  });

  return rej_errors;
};

class ManagerForm extends React.Component {
  _submit(values) {
    var redir_url = getQueryString("redir");

    if (!redir_url) redir_url = "/listar-contatos";
    else redir_url = decodeURIComponent(redir_url);

    if (values._id) {
      //update
      return new Promise((resolve, reject) => {
        API.Managers.patch({
          _id: values._id ? values._id : "",
          name: values.name ? values.name : "",
          email: values.email ? values.email : "",
          phone: values.phone ? values.phone : "",
        }).then(
          (response) => {
            if (response._id) {
              window.location = redir_url;
              resolve();
            } else {
              reject(formatRejectErrors(response));
            }
          },
          (err) => {
            reject({
              _error:
                "Desculpe, Não foi possível atualizar as informações no servidor",
            });
          }
        );
      });
    } else {
      //create
      return new Promise((resolve, reject) => {
        API.Managers.create({
          name: values.name ? values.name : "",
          email: values.email ? values.email : "",
          phone: values.phone ? values.phone : "",
        }).then(
          (response) => {
            if (response._id) {
              window.location = redir_url;
              resolve();
            } else {
              reject(formatRejectErrors(response));
            }
          },
          (err) => {
            console.log(err);
            reject({
              _error:
                "Desculpe, Não foi possível cadastrar as informações no servidor",
            });
          }
        );
      });
    }
  }

  componentWillMount() {
    this.loadData();
  }

  loadData() {
    var idParam = getQueryString("id");
    if (idParam) {
      //fill form with row to be updated
      API.Managers.find(idParam).then((itemFound) => {
        if (itemFound._id) {
          this.props.fields._id.onChange(itemFound._id.$oid);
          this.props.fields.name.onChange(itemFound.name);
          this.props.fields.email.onChange(itemFound.email);
          this.props.fields.phone.onChange(itemFound.phone);
        }
      });
    }
  }

  remove() {
    var result = confirm("Deseja remover este registro?");
    if (result) {
      return new Promise((resolve, reject) => {
        API.Managers.delete({
          _id: this.props.fields._id.value,
        }).then(
          (response) => {
            if (response._id) {
              window.location = "/listar-contatos";
              resolve();
            } else {
              reject(formatRejectErrors(response));
            }
          },
          (err) => {
            reject({
              _error:
                "Desculpe, Não foi possível remover as informações no servidor",
            });
          }
        );
      });
    }
  }

  handleChange(event) {
    // Call the event supplied by redux-form.
    this.props.onChange(event);
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    const { fields, handleSubmit, submitting, error } = this.props;

    const onSubmit = handleSubmit(this._submit.bind(this));

    return (
      <form className={styles.form} onSubmit={onSubmit}>
        {error && <strong>{error}</strong>}

        <input type="hidden" {...fields._id} />
        {/*Nome */}
        <Field label={this.translate("ManagerForm.name")} {...fields.name} />
        {/* Email */}
        <Field label={this.translate("ManagerForm.email")} {...fields.email} />
        {/* Telefone */}
        <Field
          label={this.translate("ManagerForm.phoneNumber")}
          {...fields.phone}
        />

        <div className={styles.field}>
          <p className={classnames("control", styles.form__submit_button)}>
            <SubmitBtn
              className={classnames("is-primary", {
                "is-loading": submitting,
              })}
            >
              {getQueryString("id")
                ? parse(this.translate("ManagerForm.btnEdit"))
                : parse(this.translate("ManagerForm.btnRegister"))}
            </SubmitBtn>
            {this.props.fields._id.value && (
              <Button onClick={() => this.remove()}>
                {parse(this.translate("ManagerForm.btnRemove"))}
              </Button>
            )}
          </p>
        </div>
      </form>
    );
  }
}

export default injectIntl(
  reduxForm({
    form: "managerForm",
    fields: _.keys(schema),
  })(compose(NonUserRedir, NonAdminRedir, APIDataContainer)(ManagerForm))
);
