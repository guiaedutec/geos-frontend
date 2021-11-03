import React from "react";
import PropTypes from "prop-types";
import NavUser from "./NavUser";
import classnames from "classnames";
import _ from "lodash";
import styles from "./Header.styl";

class Header extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const $navbarBurgers = Array.prototype.slice.call(
      document.querySelectorAll(".navbar-burger"),
      0
    );
    if ($navbarBurgers.length > 0) {
      $navbarBurgers.forEach((el) => {
        el.addEventListener("click", () => {
          const target = el.dataset.target;
          const $target = document.getElementById(target);
          el.classList.toggle("is-active");
          $target.classList.toggle("is-active");
        });
      });
    }

    const $actionMenu = Array.prototype.slice.call(
      document.querySelectorAll("#nav-action-menu"),
      0
    );
    if ($actionMenu.length > 0) {
      $actionMenu.forEach((el) => {
        el.addEventListener("click", () => {
          const target = el.dataset.target;
          const $target = document.getElementById(target);
          // el.classList.toggle('is-active');
          $target.classList.toggle("is-hidden-touch");
        });
      });
    }
  }

  render() {
    const { menu } = this.props;
    return (
      <div
        className={classnames(
          styles.wrap_header
        )}
      >
        <NavUser
          user={this.props.user}
          type={this.props.type}
          logout={this.props.logout}
          menu={menu}
        />

      </div>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
  type: PropTypes.string,
  login: PropTypes.bool,
};

export default Header;
