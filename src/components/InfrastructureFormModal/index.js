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
import SchoolFormSurvey from "../../pages/school/components/SchoolForm/SchoolFormSurvey";
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

import styles from "./InfrastructureFormModal.styl";

class InfrastructureFormModal extends React.Component {
  componentDidMount() {
    if (this.props.schoolId)
      this.props.fetchSchool(this.props.accounts.user.school_id.$oid);
  }

  componentDidMount() {
    const school = this.props.accounts.user.school;
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
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
        title={this.translate("InfraStructureFormModal.title")}
        isActive={this.props.isActive}
        closeModal={() => this._closeModal()}
      >
        <SchoolFormSurvey
          idSchool={this.props.schoolId}
          hideSchoolData={true}
          hideEducationLevel={true}
        />
      </Modal>
    );
  }
}

InfrastructureFormModal.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default injectIntl(
  reduxForm({
    form: "infrastructureFormModal",
    fields: _.keys(schema),
  })(compose(APIDataContainer, AccountsContainer)(InfrastructureFormModal))
);
