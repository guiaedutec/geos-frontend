import React from "react";
import { FormattedMessage } from "react-intl";

export default {
  numberStudentsDiurnal: {
    presence: {
      message: (
        <FormattedMessage id="SchemaCensusFormModal.numberStudentsDiurnal.presence.message" />
      ),
    },
  },
  numberStudentsVespertine: {
    presence: {
      message: (
        <FormattedMessage id="SchemaCensusFormModal.numberStudentsVespertine.presence.message" />
      ),
    },
  },
  numberStudentsNocturnal: {
    presence: {
      message: (
        <FormattedMessage id="SchemaCensusFormModal.numberStudentsNocturnal.presence.message" />
      ),
    },
  },
  numberStudentsFull: {
    presence: {
      message: (
        <FormattedMessage id="SchemaCensusFormModal.numberStudentsFull.presence.message" />
      ),
    },
  },
  observationStudents: {
    presence: false,
  },
  numberTeachers: {
    presence: {
      message: (
        <FormattedMessage id="SchemaCensusFormModal.numberTeachers.presence.message" />
      ),
    },
  },
  observationTeachers: {
    presence: false,
  },
  kindergarten: {},
  elementary1: {},
  elementary2: {},
  highschool: {},
  technical: {},
  adult: {},
};
