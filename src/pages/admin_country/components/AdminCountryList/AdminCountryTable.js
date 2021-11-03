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
import styles from "../../adminsCountries.styl";
import tableStyles from "./AdminsCountriesTable.styl";
// import SchoolsPagination from "./SchoolsPagination";
// import SchoolTableSize from "./SchoolTableSize";
import ModalContainer from "~/containers/modal";
import ReactModal from "react-modal";
import stylesModal from "../../../../components/Modal/Modal.styl";

import APIContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import { isHaveCityInUser } from "~/helpers/users";
import NonAdminRedir from "~/containers/non_admin_redir";

import CONF from "~/api";
import API from "~/api";

/* eslint-disable camelcase */
class AdminCountryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      has_answered: true,
      has_sampled: true,
      config: "",
      countries: [],
      adminsCountries: [],
      adminsCountriesRender: [],
      isOrdering: true,
      selectedColumn: "",
      showModal: false,
      idToBeRemoved: "",
    };
    this.remove = this.remove.bind(this);
  }

  async remove() {
    const admin_country_id = this.state.idToBeRemoved;
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/admin_country/delete/${admin_country_id}?access_token=${getUserToken()}`;

    try {
      await axios.post(URL_REQUEST);
      const filteredAdminsCountries = this.state.adminsCountriesRender.filter(
        (admin_country) => admin_country._id.$oid !== admin_country_id
      );
      this.setState({ showModal: !this.state.showModal });
      this.setState({ adminsCountriesRender: filteredAdminsCountries });
      this.fetchAdminsCountries();
    } catch (error) {
      console.log(error);
    }
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

  async fetchAdminsCountries() {
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/admin_country_list/?access_token=${getUserToken()}`;
    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ adminsCountries: response.data.data });
      this.setState({ adminsCountriesRender: response.data.data });
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedColumn !== this.state.selectedColumn) {
      this.setState({ isOrdering: true });
    }
  }
  componentDidMount() {
    this.fetchAdminsCountries();
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

  showModal = (id) => {
    this.setState({ showModal: !this.state.showModal });
    if (typeof id === "string") this.setState({ idToBeRemoved: id });
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
      name: () => this.translate("AdminsCountriesTable.tableHeaderName"),
      email: () => this.translate("AdminsCountriesTable.tableHeaderEmail"),
      country_name: () =>
        this.translate("AdminsCountriesTable.tableHeaderCountry"),
      phone_number: () =>
        this.translate("AdminsCountriesTable.tableHeaderPhoneNumber"),
      editBox: () => this.translate("AdminsCountriesTable.tableHeaderActions"),
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
          <a href="#">
            <span
              onClick={() => {
                window.location = "/criar-admin-pais?id=" + value.id;
              }}
            >
              {parse(this.translate("AdminsCountriesTable.btnEdit"))}
            </span>
          </a>
          <a href="#">
            <span onClick={() => this.showModal(value.id)}>
              {parse(this.translate("AdminsCountriesTable.btnRemove"))}
            </span>
          </a>
        </div>
      ),
    };

    const tableData = _.map(
      this.state.adminsCountriesRender,
      (adminCountry) => ({
        id: adminCountry._id.$oid,
        name: adminCountry.name,
        email: adminCountry.email,
        country_name: adminCountry.country_name,
        phone_number: adminCountry.phone_number,
        editBox: customRender.editBox({
          name: adminCountry.name,
          id: adminCountry._id.$oid,
        }),
      })
    );

    const tableOptions = {
      data: tableData,
    };

    return (
      <section className="section">
        <div ref="container" className="container">
          <ReactModal
            isOpen={this.state.showModal}
            className={classnames(stylesModal.modal)}
            overlayClassName={classnames(stylesModal.overlay)}
          >
            <div className={classnames(stylesModal.modal__header)}>
              <h4>
                {parse(this.translate("DeleteAdminCountryModal.warning"))}
              </h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              <p>
                {parse(this.translate("DeleteAdminCountryModal.description1"))}
              </p>
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.showModal}
              >
                {parse(this.translate("DeleteAdminCountryModal.btnCancel"))}
              </button>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.remove}
              >
                {parse(this.translate("DeleteAdminCountryModal.btnConfirm"))}
              </button>
            </div>
          </ReactModal>
          <div className="field is-grouped is-grouped-multiline">
            <p className="control">
              <button
                className="button"
                onClick={() => {
                  window.location = "/criar-admin-pais";
                }}
              >
                {parse(
                  this.translate("AdminsCountriesTable.btnNewAdminCountry")
                )}
              </button>
            </p>
          </div>

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
                      "CountriesTable.placeholderFilter"
                    )}
                  />
                </div>
                <div className="control">
                  <button className="button is-primary">
                    {parse(this.translate("AdminsCountriesTable.btnFilter"))}
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
      </section>
    );
  }

  _queryAnswersSubmit = (e) => {
    e.preventDefault();
    const value = e.currentTarget.querySelector("input").value;
    if (value === "") {
      this.setState({ adminsCountriesRender: this.state.adminsCountries });
    } else {
      const filteredAdminsCountries = this.state.adminsCountries.filter(
        (admin_country) =>
          admin_country.country_name
            .toLowerCase()
            .indexOf(value.toLowerCase()) !== -1
      );
      this.setState({ adminsCountriesRender: filteredAdminsCountries });
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

AdminCountryTable.propTypes = {
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
  )(AdminCountryTable)
);
