import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import styles from "./Header.styl";
import { isAdminStateCity, isAdminUser, isAdminCountry } from "~/helpers/users";

import AccountsContainer from "~/containers/accounts";
import classnames from "classnames";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";

class Settings extends React.Component {
  getUserCountryId() {
    const country_id = this.props.user.country_id.$oid;
    return country_id;
  }

  getUserProfile() {
    const { user } = this.props;
    return user;
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    const { user } = this.props;
    return (
      <div
        className={classnames(
          "navbar-dropdown is-hidden-touch",
          styles.navbar_dropdown
        )}
      >
        {/* Seção de escolas */}
        {(isAdminStateCity(this.getUserProfile()) ||
          isAdminCountry(this.getUserProfile())) && (
          <div
            className={classnames(
              "navbar-item has-text-weight-bold",
              styles.link_subtitle
            )}
          >
            {parse(this.translate("ActionsMenu.schools"))}
          </div>
        )}
        {(isAdminStateCity(this.getUserProfile()) ||
          isAdminCountry(this.getUserProfile())) && (
          <div className={classnames(styles.submenu)}>
            <a className="navbar-item" href="/listar-escolas?config=geral">
              {parse(this.translate("ActionsMenu.general"))}
            </a>

            {isAdminStateCity(this.getUserProfile()) && (
              <a
                className="navbar-item"
                href="/listar-escolas-infra?config=infraestrutura"
              >
                {parse(this.translate("ActionsMenu.infrastructure"))}
              </a>
            )}
            {/* <a
              className="navbar-item"
              href="/listar-escolas-classes?config=turmas"
            >
              {parse(this.translate("ActionsMenu.classes"))}
            </a> */}
          </div>
        )}

        {/* Seção de usuarios */}
        {isAdminStateCity(this.getUserProfile()) && [
          <hr className="navbar-divider" />,
          <div
            className={classnames(
              "navbar-item has-text-weight-bold",
              styles.link_subtitle
            )}
          >
            {parse(this.translate("ActionsMenu.users"))}
          </div>,
        ]}
        {isAdminStateCity(this.getUserProfile()) && (
          <div className={classnames(styles.submenu)}>
            <a className="navbar-item" href="/listar-usuario/diretores">
              {parse(this.translate("ActionsMenu.directors"))}
            </a>
            <a className="navbar-item" href="/listar-usuario/professores">
              {parse(this.translate("ActionsMenu.teachers"))}
            </a>

            <a className="navbar-item" href="/listar-usuario/administradores">
              {parse(this.translate("ActionsMenu.admin"))}
            </a>
          </div>
        )}

        {/* Seção de paises */}
        {isAdminUser(this.getUserProfile()) && [
          <hr className="navbar-divider" />,
          <div
            className={classnames(
              "navbar-item has-text-weight-bold",
              styles.link_subtitle
            )}
          >
            {parse(this.translate("ActionsMenu.countries"))}
          </div>,
        ]}
        {isAdminUser(this.getUserProfile()) && (
          <div className={classnames(styles.submenu)}>
            <a className="navbar-item" href="/listar-paises">
              {parse(this.translate("ActionsMenu.general"))}
            </a>
          </div>
        )}
        {isAdminUser(this.getUserProfile()) && (
          <div className={classnames(styles.submenu)}>
            <a className="navbar-item" href="/listar-admin-paises">
              {parse(this.translate("ActionsMenu.adminCountry"))}
            </a>
          </div>
        )}
        {isAdminUser(this.getUserProfile()) && (
          <div className={classnames(styles.submenu)}>
            <a className="navbar-item" href="/listar-afiliacoes">
              {parse(this.translate("ActionsMenu.affiliations"))}
            </a>
          </div>
        )}

        {/* Seção de gestores */}
        {isAdminUser(this.getUserProfile()) && [
          <hr className="navbar-divider" />,
          <div
            className={classnames(
              "navbar-item has-text-weight-bold",
              styles.link_subtitle
            )}
          >
            {parse(this.translate("ActionsMenu.adminStates"))}
          </div>,
        ]}
        {isAdminUser(this.getUserProfile()) && (
          <div className={classnames(styles.submenu)}>
            <a className="navbar-item" href="/listar-gestores">
              {parse(this.translate("ActionsMenu.general"))}
            </a>
          </div>
        )}

        {/* Seção de tradução */}
        {isAdminUser(this.getUserProfile()) && [
          <hr className="navbar-divider" />,
          <div
            className={classnames(
              "navbar-item has-text-weight-bold",
              styles.link_subtitle
            )}
          >
            {parse(this.translate("ActionsMenu.translations"))}
          </div>,
        ]}
        {isAdminUser(this.getUserProfile()) && (
          <div className={classnames(styles.submenu)}>
            <a className="navbar-item" href="/traducoes">
              {parse(this.translate("ActionsMenu.pages"))}
            </a>
            <a className="navbar-item" href="/questionario">
              {parse(this.translate("ActionsMenu.questions"))}
            </a>
            <a className="navbar-item" href="/devolutivas">
              {parse(this.translate("ActionsMenu.devolutives"))}
            </a>
          </div>
        )}

        {isAdminCountry(this.getUserProfile()) && (
          <div
            className={classnames(
              "navbar-item has-text-weight-bold",
              styles.link_subtitle
            )}
          >
            {parse(this.translate("ActionsMenu.country"))}
          </div>
        )}

        {isAdminCountry(this.getUserProfile()) && (
          <div className={classnames(styles.submenu)}>
            <a
              className="navbar-item"
              href={`/criar-pais?id=${this.getUserCountryId()}`}
            >
              {parse(this.translate("ActionsMenu.general"))}
            </a>
          </div>
        )}

        {isAdminCountry(this.getUserProfile()) && (
          <div className={classnames(styles.submenu)}>
            <a className="navbar-item" href="/listar-afiliacoes">
              {parse(this.translate("ActionsMenu.affiliations"))}
            </a>
          </div>
        )}

        {isAdminCountry(this.getUserProfile()) && (
          <div className={classnames(styles.submenu)}>
            <a className="navbar-item" href="/listar-gestores">
              {parse(this.translate("ActionsMenu.adminStates"))}
            </a>
          </div>
        )}
      </div>
    );
  }
}

Settings.propTypes = {
  user: PropTypes.object,
};

export default injectIntl(compose(AccountsContainer)(Settings));
