import React from "react";
import PropTypes from "prop-types";
import Header from "../Header";
import Footer from "../Footer";
import { compose } from "redux";
import styles from "./Layout.styl";

// Containers
import MenuContainer from "~/containers/menu";
import AccountsContainer from "~/containers/accounts";

class Layout extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    loginHeader: PropTypes.bool,
    bgSecondary: PropTypes.bool
  };

  render() {
    const {
      menu,
      toggleMobileMenu,
      accounts,
      receiveCurrentUser,
      loginWithToken,
      loginUser,
      logoutUser,
      completedSurvey,
      pageHeader,
      ...rest
    } = this.props;
    return (
      <div className={styles.site}>
        <Header
          type={this.props.type}
          login={this.props.loginHeader}
          menu={this.props.menu}
          toggleMenu={this.props.toggleMobileMenu}
          user={this.props.accounts.user}
          logout={this.props.logoutUser}
          pageHeader={this.props.pageHeader}
        />
        <main className={styles.site__content, this.props.bgSecondary ? styles.bg_secondary : null}>
          <div {...rest} />
        </main>
        <Footer isLoggedIn={!_.isEmpty(this.props.accounts.user)} />
      </div>
    );
  }
}

export default compose(MenuContainer, AccountsContainer)(Layout);
