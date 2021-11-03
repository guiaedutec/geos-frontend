import React from "react";
import { FormattedMessage } from "react-intl";

export default {
  password: {
    presence: {
      message: (
        <FormattedMessage id="SchemaPasswordResetForm.password.presence.message" />
      ),
    },
    length: {
      minimum: 5,
      tooShort: (
        <FormattedMessage id="SchemaPasswordResetForm.password.length.tooShort" />
      ),
    },
  },
  confirmPassword: {
    presence: {
      message: (
        <FormattedMessage id="SchemaPasswordResetForm.confirmPassword.presence.message" />
      ),
    },
    equality: {
      attribute: "password",
      message: (
        <FormattedMessage id="SchemaPasswordResetForm.confirmPassword.equality.message" />
      ),
    },
  },
};
