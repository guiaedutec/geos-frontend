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
  if (
    (attrs.isTeacherWithoutLinks === false &&
      attrs.isPrincipalWithoutLinks === false) ||
    attrs.profile === "admin_state"
  ) {
    return {
      presence: {
        message: (
          <FormattedMessage id="SchemaSignUpForm.isNoRequiredIfIsTeacherOrPrincipalWithoutLinks.presence.message" />
        ),
      },
    };
  }
};

const specificRequiredToSchool = (values, attrs) => {
  if (
    attrs.isTeacherWithoutLinks === false &&
    attrs.isPrincipalWithoutLinks === false &&
    attrs.profile !== "admin_state"
  ) {
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

const requiredForTeacherWithLinks = (value, attrs) => {
  if (attrs.profile === "teacher" && attrs.isTeacherWithoutLinks === false) {
    return {
      presence: {
        message: (
          <FormattedMessage id="SchemaSignUpForm.requiredForTeacher.presence.message" />
        ),
      },
    };
  }
};

export default {
  name: {
    presence: {
      message: <FormattedMessage id="SchemaSignUpForm.name.presence.message" />,
    },
    length: {
      minimum: 5,
      tooShort: <FormattedMessage id="SchemaSignUpForm.name.length.tooShort" />,
    },
  },

  born: requiredForTeacher,

  cpf: {},

  email: {
    presence: {
      message: (
        <FormattedMessage id="SchemaSignUpForm.email.presence.message" />
      ),
    },
    email: {
      message: <FormattedMessage id="SchemaSignUpForm.email.message" />,
    },
  },

  emailConfirmation: {
    presence: {
      message: (
        <FormattedMessage id="SchemaSignUpForm.emailConfirmation.presence.message" />
      ),
    },
    email: {
      message: <FormattedMessage id="SchemaSignUpForm.email.message" />,
    },
    equality: {
      attribute: "email",
      message: (
        <FormattedMessage id="SchemaSignUpForm.emailConfirmation.equality.message" />
      ),
    },
  },

  password: {
    presence: {
      message: (
        <FormattedMessage id="SchemaSignUpForm.password.presence.message" />
      ),
    },
    length: {
      minimum: 6,
      tooShort: (
        <FormattedMessage id="SchemaSignUpForm.password.length.tooShort" />
      ),
    },
  },

  confirmPassword: {
    presence: {
      message: (
        <FormattedMessage id="SchemaSignUpForm.confirmPassword.presence.message" />
      ),
    },
    equality: {
      attribute: "password",
      message: (
        <FormattedMessage id="SchemaSignUpForm.confirmPassword.equality.message" />
      ),
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

  school: specificRequiredToSchool,

  stages: requiredForTeacher,

  knowledges: requiredForTeacher,

  formation_level: requiredForTeacherWithFormation,

  term: requiredForTeacher,

  sharing: requiredForTeacherWithLinks,

  profile: {
    presence: false,
  },

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

  locked: {},

  institution: requiredForTeacherPrivate,

  role: requiredForOther,
};
