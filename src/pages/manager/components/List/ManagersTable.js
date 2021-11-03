import React from "react";
import PropTypes from "prop-types";
import co from "co";
import { getUserToken } from "~/api/utils";
import { compose } from "redux";
import axios from "axios";
import classnames from "classnames";
import _ from "lodash";
import NProgress from "nprogress";
import Reactable from "reactable";
import VisibilitySensor from "react-visibility-sensor";
import SchoolsTableContainer from "~/containers/schools_table";
import styles from "./styles.styl";
import tableStyles from "./ManagersTable.styl";
import ModalContainer from "~/containers/modal";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";

import APIContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import { isHaveCityInUser } from "~/helpers/users";
import NonAdminRedir from "~/containers/non_admin_redir";
import history from "~/core/history";

import CONF from "~/api/index";
import API from "~/api";

/* eslint-disable camelcase */
class ManagerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: "",
      hasUserData: false,
      managers: [],
      managersRender: [],
      hasCountries: false,
      isOrdering: true,
    };
  }

  async fetchManagers() {
    try {
      const URL_REQUEST =
        CONF.ApiURL + "/api/v1/managers.json?access_token=" + getUserToken();

      const response = await axios.get(URL_REQUEST);
      this.setState({
        managers: response.data.managers,
        managersRender: response.data.managers,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    this.fetchManagers();
    const container = this.refs.container;
    container.addEventListener("click", (e) => {
      const el = e.target;

      if (el.tagName === "TH") {
        this.setState({ selectedColumn: el.innerHTML });
        this.setState({ isOrdering: !this.state.isOrdering });
      }
      if (el.tagName !== "TH") {
        return;
      }

      const field = el.classList[0].replace("reactable-th-", "");

      this.props.highlightSelectedColumn(field);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedColumn !== this.state.selectedColumn) {
      this.setState({ isOrdering: true });
    }
  }

  componentWillMount() {
    const url = window.location.href;
    const config = "?" + url.split("?")[1];
    this.setState({ config: config });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ setting_valid: false });

    const { isFetchingSchools } = nextProps.apiData;
    if (isFetchingSchools === false) {
      NProgress.done();
    } else if (isFetchingSchools === true) {
      NProgress.start();
    }
  }

  translate = (id) => this.props.intl.formatMessage({ id });

  downloadAnswers = (e) => {
    e.preventDefault();
    let url = API.SurveyAnswers.getDownloadSurveyAnswerLink(
      this.props.apiData.fetchParams
    );
    window.open(url);
  };

  onChange = (isVisible) => {
    const shouldMenuGoSticky = !isVisible;
    if (shouldMenuGoSticky !== this.props.isTableMenuSticky) {
      this.props.toggleTableMenuStickness(shouldMenuGoSticky);
    }
  };

  createTableData = () => {
    const customRender = {
      schools: (value) => (
        <div>
          {value.map((item, index) => (
            <span key={index}>
              <span>{item.name}</span>
              <br />
              <span>
                {item.city_name} / {item.state_name}
              </span>
              <br />
            </span>
          ))}
        </div>
      ),

      editBox: (value) => (
        <a href="#">
          <span
            onClick={() => {
              console.log(value._id);
              window.location = "/criar-contato?id=" + value._id;
            }}
          >
            {parse(this.translate("ManagersTable.btnEdit"))}
          </span>
        </a>
      ),
    };

    const tableData = this.state.managersRender.map((manager) => ({
      name: manager.name,
      email: manager.email,
      schools: customRender.schools(manager.schools),
      editBox: customRender.editBox({
        name: manager.name,
        _id: manager._id,
      }),
    }));

    return tableData;
  };

  render() {
    const {
      highlightedColumn,
      apiData: {
        fetchParams: { sort_dir },
      },
    } = this.props;
    const { user } = this.props.accounts;

    const thDict = {
      name: () => this.translate("ManagersTable.name"),
      email: () => this.translate("ManagersTable.email"),
      schools: () => this.translate("ManagersTable.schools"),
      editBox: () => this.translate("ManagersTable.actions"),
    };

    const tableOptions = {
      data: this.createTableData(),
    };

    return (
      <div ref="container" className="container">
        {isHaveCityInUser(user) ? (
          <div className="field is-grouped is-grouped-multiline">
            <p className="control">
              <button
                className="button"
                onClick={() => {
                  window.location = "/criar-contato";
                }}
              >
                {parse(this.translate("ManagersTable.btnNewContact"))}
              </button>
            </p>
          </div>
        ) : (
          <div className={classnames(styles.msg_non_city)}></div>
        )}
        <div
          className={classnames(styles.followup_info__table_menu, "columns", {
            [styles.followup_info__table_menu_sticky]: this.props
              .isTableMenuSticky,
          })}
        >
          <form
            className="column"
            onSubmit={this._queryAnswersSubmit.bind(this)}
          >
            <div className="field has-addons">
              <div className={classnames("control", styles.filter)}>
                <input
                  className="input"
                  type="text"
                  placeholder={this.translate(
                    "ManagersTable.placeholderFilter"
                  )}
                />
              </div>
              <div className="control">
                <button className="button is-primary">
                  {parse(this.translate("ManagersTable.btnFilter"))}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className={classnames(tableStyles.table_h_size)}>
          <Reactable.Table
            className={classnames(
              "table is-bordered is-fullwidth",
              styles.followup__info__table
            )}
            {...tableOptions}
            sortable={true}
          >
            <Reactable.Thead>
              {_.map(thDict, (renderer, column) => (
                <Reactable.Th
                  column={column}
                  key={column}
                  className={classnames({
                    [styles.followup__info__table_highlightedTh]:
                      column === highlightedColumn,
                    [tableStyles.sorting_field]: column === highlightedColumn,
                    [tableStyles.sorting_field__asc]:
                      this.state.isOrdering === true,
                    [tableStyles.sorting_field__desc]:
                      this.state.isOrdering === false,
                  })}
                >
                  {renderer()}
                </Reactable.Th>
              ))}
            </Reactable.Thead>
          </Reactable.Table>
        </div>
      </div>
    );
  }

  _queryAnswersSubmit(e) {
    e.preventDefault();
    const value = e.currentTarget.querySelector("input").value;
    if (value === "") {
      this.setState({ managersRender: this.state.managers });
    } else {
      const filteredManagers = this.state.managers.filter(
        (manager) =>
          manager.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.setState({ managersRender: filteredManagers });
    }
  }

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

ManagerTable.propTypes = {
  apiData: PropTypes.object,
  highlightSelectedColumn: PropTypes.func,
  fetchSchools: PropTypes.func,
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
    SchoolsTableContainer,
    ModalContainer
  )(ManagerTable)
);
