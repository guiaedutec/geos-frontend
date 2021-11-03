import React from "react";
import { FormattedMessage } from "react-intl";

export default {
  password: {
    presence: {
      message: (
        <FormattedMessage id="SchemaPasswordChangeForm.password.presence.message" />
      ),
    },
    length: {
      minimum: 5,
      tooShort: (
        <FormattedMessage id="SchemaPasswordChangeForm.password.length.tooShort" />
      ),
    },
  },
  confirmPassword: {
    presence: {
      message: (
        <FormattedMessage id="SchemaPasswordChangeForm.confirmPassword.presence.message" />
      ),
    },
    equality: {
      attribute: "password",
      message: (
        <FormattedMessage id="SchemaPasswordChangeForm.confirmPassword.equality.message" />
      ),
    },
  },
};
