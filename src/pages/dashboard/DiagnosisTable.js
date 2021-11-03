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
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import axios from "axios";
import classnames from "classnames";
import _ from "lodash";
import NProgress from "nprogress";
import Reactable from "reactable";
import VisibilitySensor from "react-visibility-sensor";
import SchoolsTableContainer from "~/containers/schools_table";
import styles from "./dashboard.styl";
import tableStyles from "./DiagnosisTable.styl";
// import SchoolsPagination from "./SchoolsPagination";
// import SchoolTableSize from "./SchoolTableSize";

import APIContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import { isHaveCityInUser } from "~/helpers/users";
import NonAdminRedir from "~/containers/non_admin_redir";

import CONF from "~/api";
import API from "~/api";

/* eslint-disable camelcase */
class DiagnosisTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: "",
      countries: [],
      isOrdering: true,
      selectedColumn: "",
      showModal: false,
      idToBeRemoved: "",
      mapDataRender: [],
    };
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedColumn !== this.state.selectedColumn) {
      this.setState({ isOrdering: true });
    }
  }

  componentDidMount() {
    this.setState({ mapDataRender: this.props.mapData });
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

  setColumnName = () => {
    if (this.props.country_id && this.props.affiliation_id) {
      return "school_name";
    } else if (this.props.country_id) {
      return "affiliation_name";
    } else {
      return "country_name";
    }
  };

  toPercentage = (data, level) => {
    const division = data.levels[level] / data.total_schools;
    if (Number.isNaN(division)) return "0.0";
    const number = (division * 100).toFixed(1);
    return number;
  };

  render() {
    const {
      highlightedColumn,
      mapData,
      mapDataRender,
      apiData: {
        fetchParams: { sort_dir },
      },
    } = this.props;
    const { user } = this.props.accounts;

    const thDict = {
      name: () => {
        if (this.props.country_id && this.props.affiliation_id) {
          return this.translate("DiagnosisTable.school");
        } else if (this.props.country_id) {
          return this.translate("DiagnosisTable.affiliation");
        } else {
          return this.translate("DiagnosisTable.country");
        }
      },
      vision: () => this.translate("DiagnosisTable.vision"),
      competence: () => this.translate("DiagnosisTable.competence"),
      resources: () => this.translate("DiagnosisTable.resources"),
      infrastructure: () => this.translate("DiagnosisTable.infrastructure"),
    };

    const tableData = mapDataRender.map((data) => ({
      name: data[this.setColumnName()],
      vision: data.levels["1"],
      competence: data.levels["2"],
      resources: data.levels["3"],
      infrastructure: data.levels["4"],
    }));

    const tableOptions = {
      data: tableData,
    };

    return (
      <div ref="container">
        <div
          className={classnames(styles.followup_info__table_menu, "columns", {
            [styles.followup_info__table_menu_sticky]: this.props
              .isTableMenuSticky,
          })}
        >
          <form className="column" onSubmit={this._queryAnswersSubmit}>
            <div className="field has-addons">
              <div className={classnames("control", styles.filter)}>
                <input
                  className="input"
                  type="text"
                  placeholder={this.translate(
                    "DiagnosisTable.placeholderFilter"
                  )}
                />
              </div>
              <div className="control">
                <button className="button is-primary">
                  {parse(this.translate("DiagnosisTable.btnFilter"))}
                </button>
              </div>
            </div>
          </form>
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
      </div>
    );
  }

  _queryAnswersSubmit = (e) => {
    e.preventDefault();
    const value = e.currentTarget.querySelector("input").value;
    if (value === "") {
      this.props.setMapDataRender(this.props.mapData);
    } else {
      const filteredMapData = this.props.mapData.filter(
        (admin_country) =>
          admin_country[this.setColumnName()]
            .toLowerCase()
            .indexOf(value.toLowerCase()) !== -1
      );
      this.props.setMapDataRender(filteredMapData);
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

DiagnosisTable.propTypes = {
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
    SchoolsTableContainer
  )(DiagnosisTable)
);
