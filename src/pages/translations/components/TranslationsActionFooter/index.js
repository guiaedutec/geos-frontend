import classnames from "classnames";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

class TranslationsActionFooter extends Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    const { isDisabledButton, onSubmit, saving } = this.props;

    return (
      <section
        style={{
          position: "fixed",
          width: "100%",
          bottom: 0,
          left: 0,
          zIndex: 1,
          backgroundColor: "#fff",
          boxShadow: "0 -2px 4px rgba(0,0,0,0.15)",
        }}
        id="footer"
      >
        <section
          style={{
            maxWidth: "998px",
            margin: "0 auto",
            padding: "16px",
            textAlign: "right",
          }}
        >
          <button
            className={classnames("button is-primary", {
              "is-loading": saving,
            })}
            onClick={onSubmit}
            disabled={isDisabledButton}
            loading
          >
            {parse(this.translate("TranslationsActionFooter.save"))}
          </button>
        </section>
      </section>
    );
  }
}

TranslationsActionFooter.propTypes = {
  isDisabledButton: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
};

export default injectIntl(TranslationsActionFooter);
