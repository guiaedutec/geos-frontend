import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import classNames from "classnames";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import styles from "./Header.styl";
import history from "~/core/history";
import { isDirectorOrTeacher } from "~/helpers/users";

import AccountsContainer from "~/containers/accounts";

class Profile extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  _logout() {
    this.props.logout();
    history.push("/");
  }

  _changePasswordRoute() {
    history.push("/mudar-senha");
  }

  render() {
    const { logout, user } = this.props;
    return (
      <div className="navbar-item has-dropdown is-hoverable mr-50">
        <a className={classNames("navbar-link", styles.btn_profile)}>
          <i className="fas fa-user mr-15"></i>
          {parse(this.translate("UserMenu.myCadastre"))}
        </a>
        
        <div className={classNames("navbar-dropdown", styles.navbar_dropdown)}>
          {
            isDirectorOrTeacher(user) && (
              <a className="navbar-item" href={`editar-dados?id=${user._id.$oid}`}>
                {parse(this.translate("UserMenu.editCadastre"))}
              </a>
            )
          }

          <a className="navbar-item" href="#" onClick={this._changePasswordRoute}>
            {parse(this.translate("UserMenu.changePassword"))}
          </a>

          <a className="navbar-item" href="#" onClick={this._logout.bind(this)}>
            {parse(this.translate("UserMenu.goOut"))}
          </a>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func
};

export default injectIntl(compose(AccountsContainer)(Profile));