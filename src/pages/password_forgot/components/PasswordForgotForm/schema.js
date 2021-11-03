import React from "react";
import { FormattedMessage } from "react-intl";

export default {
  email: {
    presence: {
      message: (
        <FormattedMessage id="SchemaPasswordForgotForm.email.presence.message" />
      ),
    },
    email: {
      message: (
        <FormattedMessage id="SchemaPasswordForgotForm.email.email.message" />
      ),
    },
  },
};
