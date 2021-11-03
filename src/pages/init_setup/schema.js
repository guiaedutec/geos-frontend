import React from "react";
import { FormattedMessage } from "react-intl";

export default {
  email: {
    presence: {
      message: <FormattedMessage id="SchemaInitSetup.email.presence.message" />,
    },
  },
  password: {
    presence: {
      message: (
        <FormattedMessage id="SchemaInitSetup.password.presence.message" />
      ),
    },
    length: {
      minimum: 6,
      message: (
        <FormattedMessage id="SchemaInitSetup.password.length.message" />
      ),
    },
  },
  colorPrimary: {
    presence: {
      message: (
        <FormattedMessage id="SchemaInitSetup.colorPrimary.presence.message" />
      ),
    },
  },
  colorSecondary: {
    presence: {
      message: (
        <FormattedMessage id="SchemaInitSetup.colorSecondary.presence.message" />
      ),
    },
  },
  imgBgHome: {
    presence: {
      message: (
        <FormattedMessage id="SchemaInitSetup.imgBgHome.presence.message" />
      ),
    },
  },
  imgLogoFooter: {
    presence: {
      message: (
        <FormattedMessage id="SchemaInitSetup.imgLogoFooter.presence.message" />
      ),
    },
  },
  imgLogoFooterSec: {
    presence: {
      message: (
        <FormattedMessage id="SchemaInitSetup.imgLogoFooterSec.presence.message" />
      ),
    },
  },
  imgLogoHeader: {
    presence: {
      message: (
        <FormattedMessage id="SchemaInitSetup.imgLogoHeader.presence.message" />
      ),
    },
  },
  imgLogoHeaderSec: {
    presence: {
      message: (
        <FormattedMessage id="SchemaInitSetup.imgLogoHeaderSec.presence.message" />
      ),
    },
  },
};
