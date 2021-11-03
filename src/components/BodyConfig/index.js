import React from "react";
import classNames from "classnames";
import styles from "./BodyConfig.styl";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import { compose } from "redux";
import AccountsContainer from "~/containers/accounts";
import APIDataContainer from "~/containers/api_data";

class BodyConfig extends React.Component {
  getUserProfile() {
    const user = this.props.accounts.user;
    return user._profile;
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    return (
      <div className={classNames(styles.body, this.props.classBodyName)}>
        {!this.props.onbottom && this.getUserProfile() !== "admin_country" ? (
          <div
            className={classNames(
              "not_print",
              "container",
              styles.wrap_buttons,
              this.props.hideNext && this.props.hidePrev ? styles.hide : null
            )}
          >
            <button
              className={classNames(
                styles.button_previus,
                "button",
                this.props.hidePrev ? styles.hide : null
              )}
              onClick={() => {
                window.location = this.props.prevURL;
              }}
            >
              {parse(this.translate("BodyConfig.btnBack"))}
            </button>
            <button
              className={classNames(
                styles.button_next,
                "button",
                "is-primary",
                this.props.hideNext ? styles.hide : null
              )}
              onClick={() => {
                window.location = this.props.nextURL;
              }}
            >
              {parse(this.translate("BodyConfig.btnNext"))}
            </button>
          </div>
        ) : null}
        <div
          className={classNames(
            this.props.notContainer === undefined ? "container" : "",
            this.props.className
          )}
        >
          {this.props.children}
        </div>
        {this.props.onbottom ? (
          <div
            className={classNames(
              "not_print",
              "container",
              styles.wrap_buttons
            )}
          >
            <button
              className={classNames(
                styles.button_previus,
                "button",
                this.props.hidePrev ? styles.hide : null
              )}
              onClick={() => {
                window.location = this.props.prevURL;
              }}
            >
              {parse(this.translate("BodyConfig.btnBack"))}
            </button>

            <button
              className={classNames(
                styles.button_next,
                "button",
                "is-primary",
                this.props.hideNext ? styles.hide : null
              )}
              onClick={() => {
                window.location = this.props.nextURL;
              }}
            >
              {parse(this.translate("BodyConfig.btnNext"))}
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}
export default injectIntl(
  compose(AccountsContainer, APIDataContainer)(BodyConfig)
);
