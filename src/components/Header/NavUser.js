import classnames from "classnames";
import React from "react";
import styles from "./Header.styl";
import UserActionsMenu from "./UserActionsMenu";
import _ from "lodash";
import MenuBurger from "./MenuBurger";
import parse from "html-react-parser";
import { injectIntl } from "react-intl";
class NavUser extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }
  componentDidMount() {
    document.addEventListener("DOMContentLoaded", () => {
      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(
        document.querySelectorAll(".navbar-burger"),
        0
      );

      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {
        // Add a click event on each of them
        $navbarBurgers.forEach((el) => {
          el.addEventListener("click", () => {
            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle("is-active");
            $target.classList.toggle("is-active");
          });
        });
      }
    });

    const $actionMenu = Array.prototype.slice.call(
      document.querySelectorAll("#nav-action-menu"),
      0
    );
    if ($actionMenu.length > 0) {
      $actionMenu.forEach((el) => {
        el.addEventListener("click", () => {
          const target = el.dataset.target;
          const $target = document.getElementById(target);
          $target.classList.toggle("is-hidden-touch");
        });
      });
    }
  }

  render() {
    const { logout, type, user, menu } = this.props;

    return (
      <nav
        className={classnames("navbar", styles.header)}
        role="navigation"
        aria-label="main navigation"
      >
        <div
          className={classnames(
            "navbar-brand",
            styles.itens_center,
            styles.header_brand
          )}
        >
          <a
            className={classnames("navbar-item", styles.header__logo)}
            href="/"
          >
            <img
              src={require("../../../public/images/theme/logo-footer.png")}
            />
          </a>

          <a
            role="button"
            className={classnames(
              "navbar-burger burger",
              styles.menu__collapsed
            )}
            aria-label="menu"
            aria-expanded="true"
            data-target="navbarGuiaEdutec"
          >
            <span aria-hidden="false"></span>
            <span aria-hidden="false"></span>
            <span aria-hidden="false"></span>
          </a>
        </div>

        <div
          id="navbarGuiaEdutec"
          className={classnames(
            "navbar-menu",
            styles.menu__items,
            styles.not_print,
            { "is-active": menu.isActive }
          )}
        >
          <UserActionsMenu type={type} user={user} logout={logout} />
          <div className={classnames("navbar-start", styles.hamburgerMenu)}>
            <a href="/" className="navbar-item is-hidden-desktop">
              {parse(this.translate("UserActionsMenu.start"))}
            </a>

            {user._profile && (
              <a href="" className="navbar-item is-hidden-desktop">
                {parse(this.translate("UserActionsMenu.main"))}
              </a>
            )}

            <a
              href={parse(this.translate("StaticLinks.mainLink"))}
              className="navbar-item is-hidden-desktop"
            >
              {parse(this.translate("UserActionsMenu.meetTheMain"))}
            </a>
            <MenuBurger user={user} />
          </div>
        </div>
      </nav>
    );
  }
}

export default injectIntl(NavUser);
