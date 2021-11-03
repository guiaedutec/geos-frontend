import React from "react";
import { FormattedMessage } from "react-intl";

export default {
  _id: {},
  name: {
    presence: {
      message: <FormattedMessage id="SchemaForm.name.presence.message" />,
    },
    length: {
      minimum: 5,
      tooShort: <FormattedMessage id="SchemaForm.name.length.tooShort" />,
    },
  },
  email: {
    presence: {
      message: <FormattedMessage id="SchemaForm.email.presence.message" />,
    },
    email: {
      message: <FormattedMessage id="SchemaForm.email.email.message" />,
    },
  },
  phone: {
    presence: {
      message: <FormattedMessage id="SchemaForm.phone.presence.message" />,
    },
    email: {
      message: <FormattedMessage id="SchemaForm.phone.email.message" />,
    },
  },
};
