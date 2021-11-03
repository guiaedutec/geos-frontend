import React from "react";
import PropTypes from "prop-types";
import co from "co";
import {
  getUserToken,
  setUserToken,
  removeUserToken,
  createUrlWithParams,
} from "~/api/utils";
import { compose } from "redux";
import axios from "axios";
import classnames from "classnames";
import _ from "lodash";
import NProgress from "nprogress";
import Reactable from "reactable";
import VisibilitySensor from "react-visibility-sensor";
import SchoolsTableContainer from "~/containers/schools_table";
import styles from "../../schools.styl";
import tableStyles from "./SchoolsTable.styl";
import SchoolsPagination from "./SchoolsPagination";
import SchoolTableSize from "./SchoolTableSize";
import ModalContainer from "~/containers/modal";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import APIContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import { isHaveCityInUser } from "~/helpers/users";
import NonAdminRedir from "~/containers/non_admin_redir";
import history from "~/core/history";

import CONF from "~/api/index";
import API from "~/api";

/* eslint-disable camelcase */
class SchoolsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: "",
      hasUserData: false,
      schools: [],
      geo_structure_level1_name: "",
      geo_structure_level2_name: "",
      geo_structure_level3_name: "",
      geo_structure_level4_name: "",
      hasCountries: false,
      isOrdering: true,
    };
  }

  updateGeographicElements = (country_id) => {
    const {
      geo_structure_level1_name,
      geo_structure_level2_name,
      geo_structure_level3_name,
      geo_structure_level4_name,
    } = this.props.apiData.countries.find(
      (country) => country._id.$oid === country_id
    );
    this.setState({
      geo_structure_level1_name,
      geo_structure_level2_name,
      geo_structure_level3_name,
      geo_structure_level4_name,
    });
  };

  componentDidMount() {
    this.props.fetchCountries();
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
    if (
      prevProps.apiData.countries !== this.props.apiData.countries &&
      this.state.hasCountries === false
    ) {
      this.updateGeographicElements(this.props.accounts.user.country_id.$oid);
      this.setState({ hasCountries: true });
    }

    if (prevProps.apiData.schools !== this.props.apiData.schools) {
      this.setState({ schools: this.props.apiData.schools });
    }
    if (
      this.props.accounts.user.affiliation_id &&
      this.state.hasUserData === false
    ) {
      this.setState({ hasUserData: true });
      const user = this.props.accounts.user;
      const affiliation_id = user.affiliation_id.$oid;
      this.props.fetchSchoolsByAffiliationId(affiliation_id);
    }
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
      editBox: (value, rowData) => (
        <a href="#">
          <span
            onClick={() => {
              window.location =
                "/criar-escola?ref=-infra&id=" + value.school_id;
            }}
          >
            {parse(this.translate("SchoolsTableInfra.btnEdit"))}
          </span>
        </a>
      ),
    };
    const tableData = this.state.schools.map((school) => ({
      unique_code: school.unique_code,
      name: school.name,
      state_name: school.state_name,
      city_name: school.city_name,
      comp_admins: school.school_infra && school.school_infra.comp_admins,
      comp_teachers: school.school_infra && school.school_infra.comp_teachers,
      comp_students: school.school_infra && school.school_infra.comp_students,
      printers: school.school_infra && school.school_infra.printers,
      rack: school.school_infra && school.school_infra.rack,
      nobreak: school.school_infra && school.school_infra.nobreak,
      switch: school.school_infra && school.school_infra.switch,
      firewall: school.school_infra && school.school_infra.firewall,
      wifi: school.school_infra && school.school_infra.wifi,
      projector: school.school_infra && school.school_infra.projector,
      charger: school.school_infra && school.school_infra.charger,
      maker: school.school_infra && school.school_infra.maker,
      editBox: customRender.editBox({
        name: school.name,
        school_id: school._id.$oid,
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
      unique_code: () => this.translate("SchoolsTableInfra.uniqueCode"),
      name: () => this.translate("SchoolsTableInfra.school_name"),
      state_name: () =>
        this.state.geo_structure_level3_name === ""
          ? this.translate("SchoolsTableInfra.school_state")
          : this.state.geo_structure_level3_name,
      city_name: () =>
        this.state.geo_structure_level4_name === ""
          ? this.translate("SchoolsTableInfra.school_city")
          : this.state.geo_structure_level4_name,
      comp_admins: () => this.translate("SchoolsTableInfra.comp_admins"),
      comp_teachers: () => this.translate("SchoolsTableInfra.comp_teachers"),
      comp_students: () => this.translate("SchoolsTableInfra.comp_students"),
      printers: () => this.translate("SchoolsTableInfra.printers"),
      rack: () => this.translate("SchoolsTableInfra.rack"),
      nobreak: () => this.translate("SchoolsTableInfra.nobreak"),
      switch: () => this.translate("SchoolsTableInfra.switch"),
      firewall: () => this.translate("SchoolsTableInfra.firewall"),
      wifi: () => this.translate("SchoolsTableInfra.wifi"),
      projector: () => this.translate("SchoolsTableInfra.projector"),
      charger: () => this.translate("SchoolsTableInfra.charger"),
      maker: () => this.translate("SchoolsTableInfra.maker"),
      editBox: () => this.translate("SchoolsTableInfra.editBox"),
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
                  window.location =
                    "/criar-escola" +
                    (this.state.config !== "" ? this.state.config : "");
                }}
              >
                {parse(this.translate("SchoolsTable.btnNewSchool"))}
              </button>
            </p>
            <p className="control">
              <button
                className={classnames("button")}
                onClick={this.downloadAnswers}
              >
                {parse(this.translate("SchoolsTable.btnDownloadSchoolList"))}
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
                  placeholder={this.translate("SchoolsTable.placeholderFilter")}
                />
              </div>
              <div className="control">
                <button className="button is-primary">
                  {parse(this.translate("SchoolsTable.btnFilter"))}
                </button>
              </div>
            </div>
          </form>
          {/* <div className="column">
            <SchoolsPagination
              apiData={this.props.apiData}
              paginationStart={this.props.paginationStart}
              fetchSchools={this.props.fetchSchools}
              increasePaginationStart={this.props.increasePaginationStart}
              decreasePaginationStart={this.props.decreasePaginationStart}
            />
          </div> */}
        </div>

        {/* <SchoolTableSize
          apiData={this.props.apiData}
          fetchSchools={this.props.fetchSchools}
        /> */}
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
      this.setState({ schools: this.props.apiData.schools });
    } else {
      const filteredSchools = this.props.apiData.schools.filter(
        (school) =>
          school.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.setState({ schools: filteredSchools });
    }

    // this.props.fetchSchools({
    //   q: e.currentTarget.querySelector("input").value,
    // });
  }

  /*
   * Return the sorting direction for a given field.
   * @param {string} field
   * @return {string} sortingDir
   */
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

SchoolsTable.propTypes = {
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
  )(SchoolsTable)
);
