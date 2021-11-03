import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import classNames from "classnames";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import styles from "./Header.styl";
import Link from "../Link";
import Settings from "./Settings";
import _ from "lodash";
import {
  isAdminStateCity,
  isAdminUser,
  isAdminCountry,
  isStateAdmin,
  isMonitor,
  isDirectorOrTeacher,
  diagnosisSchoolMenu,
  diagnosisTeacherMenu,
} from "~/helpers/users";

import AccountsContainer from "~/containers/accounts";

class Menu extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  anchorHref = () => {
    const { user } = this.props;

    if (isDirectorOrTeacher(user)) {
      return "/recursos";
    } else {
      return "/painel";
    }
  };

  render() {
    const { type, user } = this.props;
    return (
      <div className={styles.menu_itens}>
        <Link
          className={classNames(
            "navbar-item",
            styles.header__mobile_links,
            styles.menu__item
          )}
          to="/"
        >
          <strong>{parse(this.translate("UserActionsMenu.start"))}</strong>
        </Link>

        {!_.isEmpty(user) && (
          <Link
            className={classNames(
              "navbar-item",
              styles.header__mobile_links,
              styles.menu__item
            )}
            to={this.anchorHref()}
          >
            <strong>{parse(this.translate("UserActionsMenu.main"))}</strong>
          </Link>
        )}

        {(isAdminStateCity(user) ||
          isAdminUser(user) ||
          isAdminCountry(user)) && (
          <div
            className={classNames(
              "navbar-item has-dropdown is-hoverable",
              styles.navbar
            )}
          >
            <Link
              className={classNames(
                "navbar-link",
                styles.header__mobile_links,
                styles.menu__item,
                styles.is_not_first
              )}
              to=""
            >
              <strong>
                {parse(this.translate("UserActionsMenu.settings"))}
              </strong>
            </Link>

            <Settings user={user} isHidden="is-hidden-touch" />
          </div>
        )}

        {isStateAdmin(user) && diagnosisSchoolMenu(user) && (
          <div
            className={classNames(
              "navbar-item has-dropdown is-hoverable",
              styles.navbar
            )}
          >
            <Link
              className={classNames(
                "navbar-link",
                styles.header__mobile_links,
                styles.menu__item,
                styles.is_not_first
              )}
              to=""
            >
              <strong>
                {parse(this.translate("SchoolDiagnosis.menu.title"))}
              </strong>
            </Link>

            <div
              className={classNames(
                "navbar-dropdown is-hidden-touch",
                styles.navbar_dropdown
              )}
            >
              <a className="navbar-item" href="/diagnostico-escola">
                {parse(this.translate("SchoolDiagnosis.menu.home"))}
              </a>
              {!isMonitor(user) && [
                <a className="navbar-item" href="/listar-escolas">
                  {parse(this.translate("SchoolDiagnosis.menu.schools"))}
                </a>,
                <a className="navbar-item" href="/criar-pergunta">
                  {parse(this.translate("SchoolDiagnosis.menu.questions"))}
                </a>,
                <a className="navbar-item" href="/periodo-questionario">
                  {parse(this.translate("SchoolDiagnosis.menu.period"))}
                </a>,
              ]}
              <a className="navbar-item" href="/listar-atividades">
                {parse(this.translate("SchoolDiagnosis.menu.disclosure"))}
              </a>
              <a className="navbar-item" href="/acompanhamento-respostas">
                {parse(this.translate("SchoolDiagnosis.menu.followUp"))}
              </a>
              <a className="navbar-item" href="/resultado">
                {parse(this.translate("SchoolDiagnosis.menu.results"))}
              </a>
            </div>
          </div>
        )}

        {isStateAdmin(user) && diagnosisTeacherMenu(user) && (
          <div
            className={classNames(
              "navbar-item has-dropdown is-hoverable",
              styles.navbar
            )}
          >
            <Link
              className={classNames(
                "navbar-link",
                styles.header__mobile_links,
                styles.menu__item,
                styles.is_not_first
              )}
              to=""
            >
              <strong>
                {parse(this.translate("TeacherMappingMenu.title"))}
              </strong>
            </Link>

            <div
              className={classNames(
                "navbar-dropdown is-hidden-touch",
                styles.navbar_dropdown
              )}
            >
              <a className="navbar-item" href="/mapeamento-professor">
                {parse(this.translate("TeacherMappingMenu.home"))}
              </a>
              {!isMonitor(user) && [
                <a
                  className="navbar-item"
                  href="/mapeamento-professor/frequencia"
                >
                  {parse(this.translate("TeacherMappingMenu.frequency"))}
                </a>,
              ]}
              <a
                className="navbar-item"
                href="/mapeamento-professor/divulgacao"
              >
                {parse(this.translate("TeacherMappingMenu.disclosure"))}
              </a>
              <a
                className="navbar-item"
                href="/mapeamento-professor/resultados"
              >
                {parse(this.translate("TeacherMappingMenu.results"))}
              </a>
            </div>
          </div>
        )}

        <Link
          className={classNames(
            "navbar-item",
            styles.header__mobile_links,
            styles.menu__item
          )}
          to={parse(this.translate("StaticLinks.mainLink"))}
        >
          <strong>
            {parse(this.translate("UserActionsMenu.meetTheMain"))}
          </strong>
        </Link>

        {_.isEmpty(user) && type != undefined && (
          <Link
            className={classNames(
              "navbar-item",
              styles.header__mobile_links,
              styles.menu__item
            )}
            to={"/criar-conta/" + type}
          >
            <strong>
              {parse(this.translate("UserActionsMenu.btnRegister"))}
            </strong>
          </Link>
        )}
      </div>
    );
  }
}

Menu.propTypes = {
  user: PropTypes.object,
  type: PropTypes.string,
};

export default injectIntl(compose(AccountsContainer)(Menu));
