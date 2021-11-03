import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import classnames from "classnames";
import _ from "lodash";
import NProgress from "nprogress";
import Reactable from "reactable";
import VisibilitySensor from "react-visibility-sensor";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import TechnicalsTableContainer from "~/containers/technicals_table";
import styles from "../../technicals.styl";
import tableStyles from "./TechnicalsTable.styl";
import TechnicalsPagination from "./TechnicalsPagination";

import API from "~/api";
import APIContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminRedir from "~/containers/non_admin_redir";
import AccountsContainer from "~/containers/accounts";

import TecnicalChangePassword from "../TechnicalChangePassword";

import { isAdminStateCity, isAdminUser } from "~/helpers/users";
import axios from "axios";
import CONF from "~/api/index";
import { getUserToken } from "~/api/utils";

/* eslint-disable camelcase */
class TechnicalsTable extends React.Component {
  constructor() {
    super();
    this.state = {
      modalChangePasswordVisible: false,
      changePasswordUser: null,
      loadingUserChangePassword: false,
      users: { users: [] },
      usersRender: { users: [] },
    };
  }

  async fetchManagers(routeProfile) {
    const URL_REQUEST =
      CONF.ApiURL +
      "/api/v1/users.json" +
      `?profile=${routeProfile}` +
      "&access_token=" +
      getUserToken();
    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ users: response.data, usersRender: response.data });
    } catch (error) {
      console.log(error.message);
    }
  }

  getRouteProfile() {
    let url = new URL(window.location.href);
    return url.pathname.replace("/listar-usuario/", "");
  }

  componentDidMount() {
    const routeProfile = this.getRouteProfile();
    console.log(routeProfile);
    // this.props.fetchTechnicals({
    //   profile: this.props.profile,
    // });

    this.fetchManagers(routeProfile);
    const container = this.refs.container;
    container.addEventListener("click", (e) => {
      const el = e.target;
      if (el.tagName !== "TH") {
        return;
      }

      const field = el.classList[0].replace("reactable-th-", "");
      this.props.fetchTechnicals({
        profile: this.props.profile,
        sort: field,
        sort_dir: this._getSortDirection(field),
      });
      this.props.highlightSelectedColumn(field);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { isFetchingTechnicals } = nextProps.apiData;
    if (isFetchingTechnicals === false) {
      NProgress.done();
    } else if (isFetchingTechnicals === true) {
      NProgress.start();
    }
  }

  onChange = (isVisible) => {
    const shouldMenuGoSticky = !isVisible;
    if (shouldMenuGoSticky !== this.props.isTableMenuSticky) {
      this.props.toggleTableMenuStickness(shouldMenuGoSticky);
    }
  };

  showModalChangePassword = (user) => {
    this.setState({
      modalChangePasswordVisible: true,
      changePasswordUser: user,
    });
  };
  hideModalChangePassword = () => {
    this.setState({
      modalChangePasswordVisible: false,
      changePasswordUser: null,
    });
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  onChangePassword = (newPassword) => {
    this.setState({
      loadingUserChangePassword: true,
    });

    API.Users.changeUserPasswordByAdmin({
      id: this.state.changePasswordUser._id,
      password: newPassword,
    }).then((response) => {
      this.setState({
        loadingUserChangePassword: false,
      });
      if (response._id) {
        this.hideModalChangePassword();
        return window.alert(
          this.translate("TechnicalsTable.successChangePassword")
        );
      }
      if (response.errors) {
        if (_.get(response.errors, "password")) {
          return window.alert(
            this.translate("TechnicalsTable.insertMincharacterss")
          );
        }
      }
      return window.alert(
        this.translate("TechnicalsTable.unsuccessChangePassword")
      );
    });
  };

  makeThDict() {
    const thDict = {
      name: () => this.translate("TechnicalsTable.name"),
      email: () => this.translate("TechnicalsTable.email"),
    };
    if (this.getRouteProfile() === "administradores") {
      thDict["type"] = () => this.translate("TechnicalsTable.profile");
      thDict["editBox"] = () => this.translate("TechnicalsTable.editBox");
    } else {
      thDict["school"] = () => this.translate("TechnicalsTable.school");
      thDict["editBox"] = () => this.translate("TechnicalsTable.editBox");
    }
    return thDict;
  }

  render() {
    const {
      highlightedColumn,
      apiData: {
        technicals,
        fetchParams: { sort_dir },
      },
    } = this.props;

    const editBox = (value, rowData) => {
      if (
        isAdminStateCity(this.props.accounts.user) ||
        isAdminUser(this.props.accounts.user)
      ) {
        return this.getRouteProfile() === "administradores" ? (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <a href="javascript:void(0)">
              <span
                onClick={() => {
                  window.location =
                    "/editar-usuario/" +
                    this.props.profile +
                    "?id=" +
                    value._id;
                }}
              >
                {parse(this.translate("TechnicalsTable.edit"))}
              </span>
            </a>

            <a href="javascript:void(0)">
              <span onClick={() => this.showModalChangePassword(value)}>
                {this.translate("TechnicalsTable.changePassword")}
              </span>
            </a>
          </div>
        ) : (
          <p>-</p>
        );
      } else {
        return (
          <div>
            <a href="javascript:void(0)">
              <span
                onClick={() => {
                  window.location =
                    "/editar-usuario/" +
                    this.props.profile +
                    "?id=" +
                    value._id;
                }}
              >
                {parse(this.translate("TechnicalsTable.edit"))}
              </span>
            </a>
          </div>
        );
      }
    };

    const customRender = {
      editBox: (value, rowData) => editBox(value, rowData),
      profile: (value) => {
        switch (value) {
          case "admin_state":
            return "Administrador Estadual";
          case "monitor_state":
            return "Monitor Estadual";
          case "monitor_state_regional":
            return "Monitor Estadual Regional";
          case "admin_city":
            return "Administrador Municipal";
          case "monitor_city":
            return "Monitor Municipal";
          case "monitor_city_regional":
            return "Monitor Municipal Regional";
        }
      },
    };

    const tableData =
      this.state.usersRender.users &&
      this.state.usersRender.users.map((user) => ({
        ...user,
        school: user.school,
        profile: customRender.profile(user.profile),
        editBox: customRender.editBox({ _id: user._id }),
      }));

    const tableOptions = {
      data: tableData,
    };

    return (
      <div ref="container" className="container">
        <div className="columns">
          <div className="column">
            <p className="control has-addons">
              <button
                className="button"
                onClick={() => {
                  window.location = "/criar-usuario/" + this.props.profile;
                }}
              >
                {parse(this.translate("TechnicalsTable.addUser"))}
              </button>
            </p>
          </div>
        </div>
        <div
          className={classnames(
            styles.followup_info__table_menu,
            "columns",
            "is-marginless",
            {
              [styles.followup_info__table_menu_sticky]: this.props
                .isTableMenuSticky,
            }
          )}
        >
          <form
            className={classnames("column is-4", styles.wrap_filter)}
            onSubmit={this._queryAnswersSubmit.bind(this)}
          >
            <div className="field has-addons">
              <div className={classnames("control", styles.filter)}>
                <input
                  className="input"
                  type="text"
                  placeholder={this.translate("TechnicalsTable.placeholder")}
                />
              </div>
              <div className="control">
                <button className="button is-primary">
                  {parse(this.translate("TechnicalsTable.filter"))}
                </button>
              </div>
            </div>
          </form>
          {/* <div className="column">
            <TechnicalsPagination
              apiData={this.props.apiData}
              paginationStart={this.props.paginationStart}
              fetchTechnicals={this.props.fetchTechnicals}
              increasePaginationStart={this.props.increasePaginationStart}
              decreasePaginationStart={this.props.decreasePaginationStart}
            />
          </div> */}
        </div>
        <Reactable.Table
          className={classnames(
            "table is-bordered is-fullwidth",
            styles.followup__info__table
          )}
          {...tableOptions}
        >
          <Reactable.Thead>
            {_.map(this.makeThDict(), (renderer, column) => (
              <Reactable.Th
                key={column}
                column={column}
                className={classnames({
                  [styles.followup__info__table_highlightedTh]:
                    column === highlightedColumn,
                  [tableStyles.sorting_field]: column === highlightedColumn,
                  [tableStyles.sorting_field__asc]: sort_dir === "asc",
                  [tableStyles.sorting_field__desc]: sort_dir === "desc",
                })}
              >
                {renderer()}
              </Reactable.Th>
            ))}
          </Reactable.Thead>
        </Reactable.Table>
        {this.state.modalChangePasswordVisible ? (
          <TecnicalChangePassword
            loading={this.state.loadingUserChangePassword}
            user={this.state.changePasswordUser}
            onSave={this.onChangePassword}
            onClose={this.hideModalChangePassword}
          />
        ) : null}
      </div>
    );
  }

  _queryAnswersSubmit = (e) => {
    e.preventDefault();
    const value = e.currentTarget.querySelector("input").value;

    if (value === "") {
      this.setState({ usersRender: this.state.users }, () =>
        console.log(this.state.usersRender)
      );
    } else {
      const filteredUsers = this.state.users.users.filter(
        (user) => user.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      console.log(filteredUsers);
      this.setState({ usersRender: { users: filteredUsers } });
    }
  };

  _getSortDirection(field) {
    const {
      apiData: {
        fetchParams: { sort_dir, sort },
      },
      highlightedColumn,
    } = this.props;

    if (sort !== field) {
      return "asc";
    }

    return highlightedColumn === field && sort_dir && sort_dir === "asc"
      ? "desc"
      : "asc";
  }
}

TechnicalsTable.propTypes = {
  apiData: PropTypes.object,
  highlightSelectedColumn: PropTypes.func,
  fetchTechnicals: PropTypes.func,
  isTableMenuSticky: PropTypes.bool,
  highlightedColumn: PropTypes.string,
  decreasePaginationStart: PropTypes.func.isRequired,
  increasePaginationStart: PropTypes.func.isRequired,
};

export default injectIntl(
  compose(
    APIContainer,
    NonUserRedir,
    NonAdminRedir,
    TechnicalsTableContainer,
    AccountsContainer
  )(TechnicalsTable)
);
