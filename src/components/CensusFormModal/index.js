import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { compose } from "redux";
import validate from "validate.js";
import _ from "lodash";
import classnames from "classnames";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";

import API from "~/api";
import history from "~/core/history";

// Components
import schema from "./schema";
import Field from "~/components/Form/Field";
import FieldTextArea from "~/components/Form/FieldTextArea";
import SubmitBtn from "~/components/SubmitBtn";
import Modal from "~/components/Modal";

// Containers
import APIDataContainer from "~/containers/api_data";
import AccountsContainer from "~/containers/accounts";

import styles from "./CensusFormModal.styl";

const updateSchoolCensus = (schoolId, values) => {
  return API.Schools.update(schoolId, {
    /* eslint-disable camelcase */
    student_diurnal_count: values.numberStudentsDiurnal,
    student_vespertine_count: values.numberStudentsVespertine,
    student_nocturnal_count: values.numberStudentsNocturnal,
    student_full_count: values.numberStudentsFull,
    student_observations: values.observationStudents,
    staff_count: values.numberTeachers,
    staff_observations: values.observationTeachers,
    kindergarten: values.kindergarten,
    elementary_1: values.elementary1,
    elementary_2: values.elementary2,
    highschool: values.highschool,
    technical: values.technical,
    adult: values.adult,
    /* eslint-enable camelcase */
  });
};

class CensusFormModal extends React.Component {
  componentDidMount() {
    if (this.props.schoolId)
      this.props.fetchSchool(this.props.accounts.user.school_id.$oid);
  }

  componentDidMount() {
    const school = this.props.accounts.user.school;
    if (this.props.accounts.user) {
      this.handleInitialize(school);
    }
  }

  handleInitialize(school) {
    const initData = {
      numberStudentsDiurnal: school.student_diurnal_count,
      numberStudentsVespertine: school.student_vespertine_count,
      numberStudentsNocturnal: school.student_nocturnal_count,
      numberStudentsFull: school.student_full_count,
      observationStudents: school.student_observations,
      numberTeachers: school.staff_count,
      observationTeachers: school.staff_observations,
      kindergarten: school.kindergarten,
      elementary1: school.elementary_1,
      elementary2: school.elementary_2,
      highschool: school.highschool,
      technical: school.technical,
      adult: school.adult,
    };

    this.props.initializeForm(initData);
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  handleDirtyFields(rawSchema) {
    let updateObservationStudents = {};
    let updateObservationTeachers = {};
    // Check for dirty inputs on numberStudents and numberTeachers
    const fields = this.props.fields;

    if (
      fields.numberStudentsDiurnal.dirty ||
      fields.numberStudentsVespertine.dirty ||
      fields.numberStudentsNocturnal.dirty ||
      fields.numberStudentsFull.dirty
    ) {
      updateObservationStudents = {
        observationStudents: {
          presence: true,
        },
      };
    }

    if (fields.numberTeachers.dirty) {
      updateObservationTeachers = {
        observationTeachers: {
          presence: true,
        },
      };
    }

    return Object.assign(
      rawSchema,
      updateObservationStudents,
      updateObservationTeachers
    );
  }

  _submit(values) {
    const schemaValidation = this.handleDirtyFields(schema);
    const schoolId = _.get(this.props, "accounts.user.school_id.$oid");

    return new Promise((resolve, reject) => {
      const errors = _.mapValues(
        validate(values, schemaValidation, { fullMessages: false }),
        (value) => {
          return value[0];
        }
      );

      /* eslint-disable no-console */
      if (_.isEmpty(errors)) {
        updateSchoolCensus(schoolId, values).then((response) => {
          this._closeModal();
          resolve();
        });
      } else {
        reject(errors);
      }
    });
  }

  _closeModal() {
    this.props.toggleModal();
    history.replace("/recursos");
  }

  render() {
    const { fields, handleSubmit, submitting } = this.props;

    const onSubmit = handleSubmit(this._submit.bind(this));

    return (
      <Modal
        title={this.translate("CensusFormModal.title")}
        isActive={this.props.isActive}
        closeModal={() => this._closeModal()}
      >
        <form className={styles.form} onSubmit={onSubmit}>
          <p className={styles.modal__sayings}>
            {parse(this.translate("CensusFormModal.description"))}
          </p>
          <Field
            type="number"
            label={this.translate("CensusFormModal.label1")}
            {...fields.numberStudentsDiurnal}
          />
          <Field
            type="number"
            label={this.translate("CensusFormModal.label2")}
            {...fields.numberStudentsVespertine}
          />
          <Field
            type="number"
            label={this.translate("CensusFormModal.label3")}
            {...fields.numberStudentsNocturnal}
          />
          <Field
            type="number"
            label={this.translate("CensusFormModal.label4")}
            {...fields.numberStudentsFull}
          />
          <FieldTextArea
            label={this.translate("CensusFormModal.label6")}
            {...fields.observationStudents}
          />
          <Field
            type="number"
            label="N°. de professores"
            {...fields.numberTeachers}
          />
          <FieldTextArea
            label={this.translate("CensusFormModal.label6")}
            {...fields.observationTeachers}
          />

          <label>
            {parse(this.translate("CensusFormModal.educationLevel"))}
          </label>
          <div className="label Field_field__label_2FT">
            <div className={styles.checkbox__column}>
              <p className="checkbox">
                <label>
                  <input
                    name="elementary1"
                    type="checkbox"
                    {...fields.kindergarten}
                  />
                  {parse(this.translate("CensusFormModal.childEducation"))}
                </label>
              </p>

              <p className="checkbox">
                <label>
                  <input
                    name="elementary1"
                    type="checkbox"
                    {...fields.elementary1}
                  />
                  {parse(this.translate("CensusFormModal.elementary1"))}
                </label>
              </p>

              <p className="checkbox">
                <label>
                  <input
                    name="elementary2"
                    type="checkbox"
                    {...fields.elementary2}
                  />
                  {parse(this.translate("CensusFormModal.elementary2"))}
                </label>
              </p>
            </div>

            <div className={styles.checkbox__column}>
              <p className="checkbox">
                <label>
                  <input
                    name="highschool"
                    type="checkbox"
                    {...fields.highschool}
                  />
                  {parse(this.translate("CensusFormModal.highSchool"))}
                </label>
              </p>

              <p className="checkbox">
                <label>
                  <input
                    name="technical"
                    type="checkbox"
                    {...fields.technical}
                  />
                  {parse(this.translate("CensusFormModal.technicalHighSchool"))}
                </label>
              </p>

              <p className="checkbox">
                <label>
                  <input name="adult" type="checkbox" {...fields.adult} />
                  {parse(this.translate("CensusFormModal.eja"))}
                </label>
              </p>
            </div>
          </div>

          <p className={classnames("control", styles.form__submit_button)}>
            <SubmitBtn
              className={classnames("is-primary", {
                "is-loading": submitting,
              })}
            >
              {parse(this.translate("CensusFormModal.confirm"))}
            </SubmitBtn>
          </p>
        </form>
      </Modal>
    );
  }
}

CensusFormModal.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default injectIntl(
  reduxForm({
    form: "censusFormModal",
    fields: _.keys(schema),
  })(compose(APIDataContainer, AccountsContainer)(CensusFormModal))
);
