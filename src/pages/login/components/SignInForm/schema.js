import React from "react";
import { FormattedMessage } from "react-intl";

export default {
  email: {
    presence: {
      message: (
        <FormattedMessage id="SchemaSignInForm.email.presence.message" />
      ),
    },
  },
  password: {
    presence: {
      message: (
        <FormattedMessage id="SchemaSignInForm.password.presence.message" />
      ),
    },
  },
};
