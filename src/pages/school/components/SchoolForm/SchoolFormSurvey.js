import React, { Component } from "react";
import { reduxForm } from "redux-form";
import SubmitBtn from "~/components/SubmitBtn";
import schema from "./schema";
import _ from "lodash";
import classnames from "classnames";
import styles from "../../school.styl";
import API from "~/api";
import { compose } from "redux";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import SchoolInfra from "./ShoolInfra";
import SchoolClasses from "./SchoolClasses";
import {
  set_school_form_data,
  assemble_school_form_json,
} from "~/helpers/school";

var formatRejectErrors = (response) => {
  let rej_errors = {};
  Object.keys(response).forEach(function (key) {
    rej_errors[key] = response[key];
  });

  return rej_errors;
};

class SchoolFormSurvey extends Component {
  _submit(values) {
    if (values._id) {
      return new Promise((resolve, reject) => {
        let obj_post = assemble_school_form_json(values);
        API.Schools.patch(obj_post).then(
          (response) => {
            this.cleanDirty();
            resolve();
          },
          (err) => {
            console.log(err);
            reject({
              _error:
                "Desculpe, Não foi possível atualizar as informações no servidor",
            });
          }
        );
      });
    }
  }

  componentDidMount() {
    this.loadData();
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  loadData() {
    var idSchool = this.props.idSchool;
    if (idSchool) {
      API.Schools.findOne(idSchool).then((schoolFound) => {
        if (schoolFound._id) {
          set_school_form_data(this.props.fields, schoolFound);
        }
      });
    }
  }

  cleanDirty() {
    const classesList = [
      "kindergarten",
      "elementary_1",
      "elementary_2",
      "highschool",
      "technical",
      "adult",
    ];
    classesList.forEach((propt) => {
      let value = this.props.fields[propt];
      if (value) {
        value.dirty = false;
        value.touched = false;
      }
    });

    for (let [k, v_levels] of Object.entries(this.props.fields.school_classe)) {
      if (typeof v_levels === "object") {
        for (let [k2, v_time] of Object.entries(v_levels)) {
          if (typeof v_time === "object") {
            for (let [k3, v_field] of Object.entries(v_time)) {
              v_field.dirty = false;
              v_field.touched = false;
            }
          }
        }
      }
    }

    for (let [k, v] of Object.entries(this.props.fields.school_infra)) {
      v.dirty = false;
      v.touched = false;
    }
  }

  isDirty() {
    var dirty = false;
    const classesList = [
      "kindergarten",
      "elementary_1",
      "elementary_2",
      "highschool",
      "technical",
      "adult",
    ];
    classesList.forEach((propt) => {
      let value = this.props.fields[propt];
      if (value) {
        dirty = dirty || (value.dirty && value.touched);
      }
    });

    for (let [k, v_levels] of Object.entries(this.props.fields.school_classe)) {
      if (typeof v_levels === "object") {
        for (let [k2, v_time] of Object.entries(v_levels)) {
          if (typeof v_time === "object") {
            for (let [k3, v_field] of Object.entries(v_time)) {
              dirty = dirty || (v_field.dirty && v_field.touched);
            }
          }
        }
      }
    }

    for (let [k, v] of Object.entries(this.props.fields.school_infra)) {
      dirty = dirty || (v.dirty && v.touched);
    }
    return dirty;
  }

  render() {
    const {
      fields,
      handleSubmit,
      submitting,
      error,
      hideEducationLevel,
      hideSchoolData,
    } = this.props;

    const onSubmit = handleSubmit(this._submit.bind(this));

    //TODO update-lib redux-form checkbox bug
    delete fields.kindergarten["checked"];
    delete fields.elementary_1["checked"];
    delete fields.elementary_2["checked"];
    delete fields.highschool["checked"];
    delete fields.technical["checked"];
    delete fields.adult["checked"];

    return (
      <div>
        <form onSubmit={onSubmit}>
          {error && (
            <div className="box">
              <div className="columns">
                <div className="column is-full">
                  <strong>{error}</strong>
                </div>
              </div>
            </div>
          )}
          {hideSchoolData !== true && (
            <div className="box">
              <div className="columns is-multiline">
                <input type="hidden" {...fields._id} />

                <div className="column is-full">
                  <h1 className={styles.title_section}>
                    {parse(
                      this.translate(
                        "InfraStructureFormModal.schoolRegisterData"
                      )
                    )}
                  </h1>
                </div>

                {/* <div className="column is-4">
                <label className={"label"}>Código Inep: </label>
                <span>{fields.inep_code.value}</span>
              </div> */}

                <div className="column is-8">
                  <label className={"label"}>
                    {parse(this.translate("InfraStructureFormModal.name"))}:
                  </label>
                  <span>{fields.name.value}</span>
                </div>
              </div>
            </div>
          )}
          {hideEducationLevel !== true && (
            <SchoolClasses
              kindergarten={fields.kindergarten}
              elementary_1={fields.elementary_1}
              elementary_2={fields.elementary_2}
              highschool={fields.highschool}
              technical={fields.technical}
              adult={fields.adult}
              school_classe={fields.school_classe}
            />
          )}

          <SchoolInfra hasInfra={true} school_infra={fields.school_infra} />
          <div className={styles.field}>
            <p
              className={classnames(
                "control has-text-right",
                styles.form__submit_button
              )}
            >
              <SubmitBtn
                className={classnames("is-primary", {
                  "is-loading": submitting,
                })}
              >
                {this.isDirty()
                  ? this.translate("InfraStructureFormModal.btnSave")
                  : this.translate("InfraStructureFormModal.btnSaved")}
              </SubmitBtn>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

export default injectIntl(
  reduxForm({
    form: "schoolFormSurvey",
    fields: _.keys(schema),
  })(compose(APIDataContainer, NonUserRedir)(SchoolFormSurvey))
);
