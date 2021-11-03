import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import parse from "html-react-parser";
import styles from "./LogoGuiaEdutec.styl";
import classnames from "classnames";

class LogoGuiaEdutec extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }
  render() {
    return (
      <div
        className={classnames(
          this.props.isSmall && styles.logo__guiaedutec_small,
          styles.logo__guiaedutec,
          this.props.bgDark && styles.dark
        )}
      >
        <div>
          <div>
            <p>{this.translate("Home.poweredBy")}</p>
          </div>
          <h1>
            <FormattedMessage
              id="Home.logoGuiaEdutec"
              values={{
                edutec: <span>{this.translate("Home.edutec")}</span>,
              }}
            />
          </h1>
        </div>
        <p>{parse(this.translate("Home.createdByCIEB"))}</p>
      </div>
    );
  }
}

export default injectIntl(LogoGuiaEdutec);
