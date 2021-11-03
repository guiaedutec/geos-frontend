import React from "react";
import PropTypes from "prop-types";
import co from "co";
import {
  getUserToken,
  setUserToken,
  removeUserToken,
  createUrlWithParams,
} from "~/api/utils";
import SubmitBtn from "~/components/SubmitBtn";

import { compose } from "redux";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import { BarLoader } from "react-spinners";
import axios from "axios";
import classnames from "classnames";
import _ from "lodash";
import NProgress from "nprogress";
import Reactable from "reactable";
import VisibilitySensor from "react-visibility-sensor";
import SchoolsTableContainer from "~/containers/schools_table";
import styles from "../../schools.styl";
import tableStyles from "./AdminStateTable.styl";
import AdminStatePagination from "./AdminStatePagination";
import AdminStateTableSize from "./AdminStateTableSize";
import ModalContainer from "~/containers/modal";
import { isEqual } from "lodash";

import APIContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import { isHaveCityInUser } from "~/helpers/users";
import NonAdminRedir from "~/containers/non_admin_redir";

import CONF from "~/api";
import API from "~/api";

/* eslint-disable camelcase */
class AdminStateTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      has_answered: true,
      has_sampled: true,
      config: "",
      countries: [],
      adminsState: [],
      adminsStateRender: [],
      isOrdering: true,
      selectedColumn: "",
      isFetchingAdminState: true,
      permissionChanged: [],
      isSaving: false,
    };
    this.saveChangesInPermission = this.saveChangesInPermission.bind(this);
  }

  componentWillMount() {
    const url = window.location.href;

    const config = "?" + url.split("?")[1];
    this.setState({ config: config });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.apiData.countries !== this.props.apiData.countries) {
      this.setState({ countries: this.props.apiData.countries });
    }
  }

  filterAdminStateByCountryId(data, country_id) {
    return data.filter(
      (adminState) => adminState.institution.country_id.$oid === country_id
    );
  }

  getUserCountryId() {
    const country_id =
      this.props.accounts.user.country_id &&
      this.props.accounts.user.country_id.$oid;
    return country_id;
  }

  getUserProfile() {
    const user = this.props.accounts.user;
    return user._profile;
  }

  async fetchAdminStates() {
    this.setState({ isFetchingAdminState: true });
    const URL_REQUEST = `${
      CONF.ApiURL
    }/api/v1/list_managers?access_token=${getUserToken()}`;

    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ adminsState: response.data });
      this.setState({ adminsStateRender: response.data });
      this.setState({ isFetchingAdminState: false });
      const country_id = this.getUserCountryId();
      if (this.getUserProfile() === "admin_country") {
        const adminsState = this.filterAdminStateByCountryId(
          response.data,
          country_id
        );
        this.setState({ adminsState: adminsState });
        this.setState({ adminsStateRender: adminsState });
      }
      return response.data.data;
    } catch (error) {
      console.log(error.message);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedColumn !== this.state.selectedColumn) {
      this.setState({ isOrdering: true });
    }
  }
  componentDidMount() {
    this.fetchAdminStates();
    // this.props.fetchCountries();
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

  componentWillReceiveProps(nextProps) {
    this.setState({ setting_valid: false });
  }

  translate = (id) => this.props.intl.formatMessage({ id });

  onChange = (isVisible) => {
    const shouldMenuGoSticky = !isVisible;
    if (shouldMenuGoSticky !== this.props.isTableMenuSticky) {
      this.props.toggleTableMenuStickness(shouldMenuGoSticky);
    }
  };

  handlePermissionChanged = (e, value) => {
    const newItem = { id: value.id, isLocked: !value.locked };

    const newPermissionChanged = this.state.permissionChanged.map((item) =>
      item.id === value.id ? { ...item, isLocked: !value.locked } : item
    );
    const findItem = this.state.permissionChanged.find(
      (item) => item.id === value.id
    );
    if (newPermissionChanged.length === 0 || findItem === undefined) {
      this.setState({
        permissionChanged: [...this.state.permissionChanged, newItem],
      });
    } else {
      this.setState({ permissionChanged: newPermissionChanged });
    }
    const newAdminsStateRender = this.state.adminsStateRender.map((admin) =>
      admin._id.$oid === value.id ? { ...admin, locked: !value.locked } : admin
    );
    this.setState({ adminsStateRender: newAdminsStateRender });
  };

  saveChangesInPermission = () => {
    this.setState({ isSaving: true });
    const permissionChanged = this.state.permissionChanged;
    permissionChanged.forEach((item) =>
      this.setPermission(item.id, item.isLocked)
    );
  };

  async setPermission(id, isLocked) {
    const URL_REQUEST = `${
      CONF.ApiURL
    }/api/v1/change_lock?access_token=${getUserToken()}&id=${id}&locked=${isLocked}`;
    try {
      this.setState({ isSaving: true });
      const response = await axios.post(URL_REQUEST);
      this.setState({ isSaving: false });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const {
      highlightedColumn,
      apiData: {
        fetchParams: { sort_dir },
      },
    } = this.props;
    const { user } = this.props.accounts;
    const thDict = {
      name: () => this.translate("AdminStateTable.tableHeaderName"),
      email: () => this.translate("AdminStateTable.tableHeaderEmail"),
      affiliation_name: () =>
        this.translate("AdminStateTable.tableHeaderAffiliation"),
      responsible_name: () =>
        this.translate("AdminStateTable.tableResponsibleName"),
      responsible_email: () =>
        this.translate("AdminStateTable.tableHeaderResponsibleEmail"),
      responsible_phone_number: () =>
        this.translate("AdminStateTable.tableHeaderPhoneNumber"),
      manager_file: () => this.translate("AdminStateTable.tableHeaderTerm"),
      editBox: () => this.translate("AdminStateTable.tableHeaderPermissions"),
    };

    const customRender = {
      sample: (value) => (
        <div
          className={classnames({
            [styles.followup__info__table__dot_yes]: Boolean(value),
            [styles.followup__info__table__dot_no]: !value,
          })}
        />
      ),
      editBox: (value, rowData) => (
        <div
          style={{
            display: "flex",
            gap: "6px",
            justifyContent: "center",
          }}
        >
          <input
            type="checkbox"
            checked={!value.locked}
            onChange={(e) => this.handlePermissionChanged(e, value)}
          />
        </div>
      ),
    };

    const tableData = _.map(this.state.adminsStateRender, (admin) => ({
      id: admin._id.$oid,
      name: admin.name,
      email: admin.email,
      affiliation_name: admin.affiliation_name,
      responsible_name: admin.responsible_name,
      responsible_email: admin.responsible_email,
      responsible_phone_number: admin.responsible_phone_number,
      manager_file: admin.manager_file[0] ? (
        <a
          href={CONF.ApiURL + admin.manager_file[0].file_upload.url}
          target="_blank"
        >
          {parse(this.translate("AdminStateTable.term"))}
        </a>
      ) : (
        ""
      ),
      editBox: customRender.editBox({
        id: admin._id.$oid,
        locked: admin.locked,
      }),
    }));

    const tableOptions = {
      data: tableData,
    };

    return (
      <section className="section">
        <div ref="container" className="container">
          <div className="field is-grouped is-grouped-multiline">
            <p className="control">
              <button className={classnames("button")}>
                {parse(
                  this.translate(
                    "AdminStateTable.btnImportSpreadSheetAdminState"
                  )
                )}
                {/* Importar planilha de Gestores */}
              </button>
            </p>
            <p className="control">
              <button className={classnames("button")}>
                {parse(
                  this.translate("AdminStateTable.btnDownloadAdminStateList")
                )}
                {/* Baixar lista de Gestores */}
              </button>
            </p>
          </div>

          <div
            className={classnames(styles.followup_info__table_menu, "columns", {
              [styles.followup_info__table_menu_sticky]:
                this.props.isTableMenuSticky,
            })}
          >
            <form className="column" onSubmit={this._queryAnswersSubmit}>
              <div className="field has-addons">
                <div className={classnames("control", styles.filter)}>
                  <input
                    className="input"
                    type="text"
                    placeholder={this.translate(
                      "AdminStateTable.placeholderFilter"
                    )}
                  />
                </div>
                <div className="control">
                  <button className="button is-primary">
                    {parse(this.translate("AdminStateTable.btnFilter"))}
                  </button>
                </div>
              </div>
              <p
                className={classnames("control", styles.form__submit_button)}
              ></p>
            </form>

            <SubmitBtn
              className={classnames("is-primary", {
                "is-loading": this.state.isSaving && this.state.isSaving,
              })}
              onClick={() => {
                this.saveChangesInPermission();
              }}
            >
              {parse(this.translate("AdminStateTable.btnSave"))}
            </SubmitBtn>
          </div>

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
                  className={classnames({
                    [styles.followup__info__table_highlightedTh]:
                      column === highlightedColumn,
                    [tableStyles.sorting_field]: column === highlightedColumn,
                    [tableStyles.sorting_field__asc]:
                      this.state.isOrdering === true,
                    [tableStyles.sorting_field__desc]:
                      this.state.isOrdering === false,
                  })}
                  key={renderer}
                >
                  {renderer()}
                </Reactable.Th>
              ))}
            </Reactable.Thead>
          </Reactable.Table>
          {this.state.isFetchingAdminState && (
            <div style={{ marginBottom: "30px" }}>
              {parse(this.translate("Global.loading"))}
              <BarLoader
                width={"100%"}
                color={"#babcbe"}
                loading={this.state.isFetchingAdminState}
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  _queryAnswersSubmit = (e) => {
    e.preventDefault();
    const value = e.currentTarget.querySelector("input").value;
    if (value === "") {
      this.setState({ adminsStateRender: this.state.adminsState });
    } else {
      const filteredAdminsState =
        this.state.adminsState &&
        this.state.adminsState.filter(
          (admin) =>
            admin.affiliation_name &&
            admin.affiliation_name
              .toLowerCase()
              .indexOf(value.toLowerCase()) !== -1
        );
      this.setState({ adminsStateRender: filteredAdminsState });
    }
  };

  _getSortDirection = (field) => {
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
  };
}

AdminStateTable.propTypes = {
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
  )(AdminStateTable)
);
