import React from "react";
import { FormattedMessage } from "react-intl";

const requiredOnPrincipalAndNoInepCode = (value, attrs) => {
  if (
    (attrs.profile === "principal" || attrs.profile === "teacher") &&
    !attrs.inepCode
  ) {
    return {
      presence: {
        message: (
          <FormattedMessage id="SchemaSignUpForm.requiredOnPrincipalAndNoInepCode.presence.message" />
        ),
      },
    };
  }
};

const isNoRequiredIfIsTeacherOrPrincipalWithoutLinks = (values, attrs) => {
  if (attrs.isUserWithoutLinks === false && attrs.profile === "gestor") {
    return {
      presence: {
        message: (
          <FormattedMessage id="SchemaSignUpForm.isNoRequiredIfIsTeacherOrPrincipalWithoutLinks.presence.message" />
        ),
      },
    };
  }
};

const requiredForOther = (value, attrs) => {
  if (attrs.profile === "other") {
    return {
      presence: {
        message: (
          <FormattedMessage id="SchemaSignUpForm.requiredForOther.presence.message" />
        ),
      },
    };
  }
};

const requiredForTeacherPrivate = (value, attrs) => {
  if (attrs.profile === "teacher" && attrs.school_type === "Particular") {
    return {
      presence: {
        message: (
          <FormattedMessage id="SchemaSignUpForm.requiredForTeacherPrivate.presence.message" />
        ),
      },
    };
  }
};

const requiredForTeacher = (value, attrs) => {
  if (attrs.profile === "teacher") {
    return {
      presence: {
        message: (
          <FormattedMessage id="SchemaSignUpForm.requiredForTeacher.presence.message" />
        ),
      },
    };
  }
};

const requiredForTeacherWithFormation = (value, attrs) => {
  if (attrs.profile === "teacher" && attrs.formation) {
    return {
      presence: {
        message: (
          <FormattedMessage id="SchemaSignUpForm.formation_level.presence.message" />
        ),
      },
    };
  }
};

export default {
  name: {
    presence: true,
    length: {
      minimum: 5,
      tooShort: "insira pelo menos %{count} caracteres",
    },
  },

  cpf: {},

  born: requiredForTeacher,

  email: {
    presence: true,
    email: {
      message: "Deve ser um email",
    },
  },

  school_type: {
    presence: false,
  },

  affiliation_id: {},
  affiliation_name: {},
  responsible_name: {},
  responsible_email: {},
  responsible_phone_number: {},

  country: isNoRequiredIfIsTeacherOrPrincipalWithoutLinks,
  province: isNoRequiredIfIsTeacherOrPrincipalWithoutLinks,
  state: isNoRequiredIfIsTeacherOrPrincipalWithoutLinks,

  city: isNoRequiredIfIsTeacherOrPrincipalWithoutLinks,

  school: isNoRequiredIfIsTeacherOrPrincipalWithoutLinks,

  stages: requiredForTeacher,

  knowledges: requiredForTeacher,

  formation_level: requiredForTeacher,

  sharing: isNoRequiredIfIsTeacherOrPrincipalWithoutLinks,

  profile: {
    presence: false,
  },

  locked: {},

  institution: requiredForTeacherPrivate,

  role: requiredForOther,

  gender: requiredForTeacher,

  initial_formation: requiredForTeacher,

  final_year_of_initial_formation: requiredForTeacher,

  internship_practice: requiredForTeacher,

  institution_initial_formation: requiredForTeacher,

  technology_in_teaching_and_learning: requiredForTeacher,

  cont_educ_in_the_use_of_digital_technologies: requiredForTeacher,

  course_modality: requiredForTeacher,

  years_teaching: requiredForTeacher,

  years_of_uses_technology_for_teaching: requiredForTeacher,

  technology_application: requiredForTeacher,
};
