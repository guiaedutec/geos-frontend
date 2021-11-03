import React from "react";
import { FormattedMessage } from "react-intl";

export default {
  email: {
    presence: {
      message: (
        <FormattedMessage id="SchemaScheduling.email.presence.message" />
      ),
    },
  },

  password: {
    presence: {
      message: (
        <FormattedMessage id="SchemaScheduling.password.presence.message" />
      ),
    },
  },

  name: {
    presence: {
      message: <FormattedMessage id="SchemaScheduling.name.presence.message" />,
    },
    length: {
      minimum: 5,
      tooShort: <FormattedMessage id="SchemaScheduling.name.length.tooShort" />,
    },
  },
};
