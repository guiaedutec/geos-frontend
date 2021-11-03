import React from "react";
import PropTypes from "prop-types";
import styles from "./Header.styl";
import classNames from "classnames";
import DropdownLanguage from "./DropdownLanguage";
import Menu from "./Menu";
import Profile from "./Profile";
import _ from "lodash";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
class UserActionsMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      lang: process.env.DEFAULT_LOCALE,
    };
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  getLang = () => localStorage.getItem("lang");

  componentDidMount() {
    const lang = this.getLang();
    lang && this.setState({ lang });
  }

  render() {
    const { logout, type, user } = this.props;
    return (
      <div
        className={classNames(
          "navbar-start",
          styles.navbar_start,
          "is-hidden-touch"
        )}
      >
        <div className={classNames(styles.navbar_main)}>
          <div className={styles.top_line}>
            <p>{parse(this.translate("UserActionsMenu.title"))}</p>
            <div className={styles.base_right}>
              <DropdownLanguage />
              <div className={classNames(styles.social_media, "ml-20")}>
                <a
                  href={parse(this.translate("SocialMedia.twitter"))}
                  target="_blank"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href={parse(this.translate("SocialMedia.facebook"))}
                  target="_blank"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href={parse(this.translate("SocialMedia.youtube"))}
                  target="_blank"
                >
                  <i className="fab fa-youtube"></i>
                </a>
                <a
                  href={parse(this.translate("SocialMedia.instagram"))}
                  target="_blank"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <div className={styles.bottom_line}>
            <Menu type={type} user={user} />
            <div className={styles.base_right}>
              {!_.isEmpty(user) && <Profile user={user} logout={logout} />}
              <img
                className={styles.footer_logo_secondary}
                src={`/images/theme/logo-header-secondary.png`}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UserActionsMenu.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func,
  type: PropTypes.string,
};

export default injectIntl(UserActionsMenu);
