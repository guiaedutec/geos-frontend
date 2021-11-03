import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { compose } from "redux";
import validate from "validate.js";
import _ from "lodash";
import classnames from "classnames";

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

import styles from "./ObsFormModal.styl";

const updateObservation = (schoolId, values) => {
  return API.Schools.update(schoolId, {
    observations: values.observation,
  });
};

class ObsFormModal extends React.Component {
  componentWillMount() {
    const school_id = _.get(this.props, "accounts.user.school_id.$oid");
    this.props.fetchSchool(school_id);
  }

  componentWillReceiveProps(nextProps) {
    const school = nextProps.apiData.school;
    if (!_.isEqual(nextProps.apiData, this.props.apiData)) {
      this.handleInitialize(school);
    }
  }

  handleInitialize(school) {
    const initData = {
      observation: school && school.observations,
    };

    this.props.initializeForm(initData);
  }

  handleDirtyFields(rawSchema) {
    let updateObservation = {};
    // Check for dirty inputs on numberStudents and numberTeachers
    const fields = this.props.fields;

    if (fields.observation.dirty) {
      updateObservation = {
        observation: {
          presence: false,
        },
      };
    }

    return Object.assign(rawSchema, updateObservation);
  }

  _submit(values) {
    const schemaValidation = this.handleDirtyFields(schema);
    const schoolId = _.get(this.props.apiData, "school._id.$oid");

    return new Promise((resolve, reject) => {
      const errors = _.mapValues(
        validate(values, schemaValidation, { fullMessages: false }),
        (value) => {
          return value[0];
        }
      );

      /* eslint-disable no-console */
      if (_.isEmpty(errors)) {
        updateObservation(schoolId, values).then((response) => {
          this._refetch();
          this._closeModal();
          resolve();
        });
      } else {
        reject(errors);
      }
    });
  }

  _refetch() {
    this.props.fetchSurveyAnswers(
      {
        filters: {
          [this.props.name]: "",
        },
      },
      this.props.apiData.surveyAnswersFetchParams
    );
  }

  _closeModal() {
    this.props.toggleModal();
  }

  render() {
    const { fields, handleSubmit, submitting } = this.props;

    const onSubmit = handleSubmit(this._submit.bind(this));

    return (
      <Modal
        title="Observações"
        isActive={this.props.isActive}
        closeModal={() => this._closeModal()}
      >
        <form className={styles.form} onSubmit={onSubmit}>
          <FieldTextArea label="Observações" {...fields.observation} />

          <p className={classnames("control", styles.form__submit_button)}>
            <SubmitBtn
              className={classnames("is-primary", {
                "is-loading": submitting,
              })}
            >
              SALVAR
            </SubmitBtn>
          </p>
        </form>
      </Modal>
    );
  }
}

ObsFormModal.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: "obsFormModal",
  fields: _.keys(schema),
})(compose(APIDataContainer, AccountsContainer)(ObsFormModal));
