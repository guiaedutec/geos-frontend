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
import styles from "../../schools.styl";
import tableStyles from "./CountriesTable.styl";
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
class AffiliationTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      has_answered: true,
      has_sampled: true,
      config: "",
      countries: [],
      affiliations: [],
      affiliationsRender: [],
      isOrdering: true,
      selectedColumn: "",
      showModal: false,
      idToBeRemoved: "",
    };
    this.remove = this.remove.bind(this);
  }

  getUserCountryId() {
    const country_id = this.props.accounts.user.country_id.$oid;
    return country_id;
  }

  getUserProfile() {
    const user = this.props.accounts.user;
    return user._profile;
  }

  async remove() {
    const affiliation_id = this.state.idToBeRemoved;
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/institution/delete/${affiliation_id}?access_token=${getUserToken()}`;

    try {
      await axios.post(URL_REQUEST);
      const filteredAffiliations = this.state.affiliationsRender.filter(
        (affiliation) => affiliation._id.$oid !== affiliation_id
      );
      this.setState({ showModal: !this.state.showModal });
      this.setState({ affiliationsRender: filteredAffiliations });
      this.fetchAffiliations();
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

  filterAffiliationByCountryId(affiliations, country_id) {
    return affiliations.filter(
      (affiliation) => affiliation.country_id.$oid === country_id
    );
  }

  async fetchAffiliations(country_id) {
    let URL_REQUEST =
      CONF.ApiURL + `/api/v1/institutions?access_token=${getUserToken()}`;

    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ affiliations: response.data.data });
      this.setState({ affiliationsRender: response.data.data });
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
    if (this.getUserProfile() === "admin_country") {
      const country_id = this.getUserCountryId();
      this.fetchAffiliations(country_id);
    } else {
      this.fetchAffiliations();
    }
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
                window.location = "/criar-afiliacao?id=" + value.id;
              }}
            >
              {parse(this.translate("AffiliationsTable.btnEdit"))}
            </span>
          </a>
          {this.getUserProfile() !== "admin_country" && (
            <a href="#">
              <span onClick={() => this.showModal(value.id)}>
                {parse(this.translate("AffiliationsTable.btnRemove"))}
              </span>
            </a>
          )}
        </div>
      ),
    };

    const thDict = {
      name: () => this.translate("AffiliationsTable.tableHeaderAffiliation"),
      country_name: () =>
        this.translate("AffiliationsTable.tableHeaderCountry"),
      province_name: () =>
        this.translate("AffiliationsTable.tableHeaderProvince"),
      state_name: () => this.translate("AffiliationsTable.tableHeaderState"),
      city_name: () => this.translate("AffiliationsTable.tableHeaderCity"),
      type_institution: () =>
        this.translate("AffiliationsTable.tableHeaderType"),
      editBox: () => this.translate("AffiliationsTable.tableHeaderActions"),
    };

    const tableData = _.map(this.state.affiliationsRender, (affiliation) => ({
      id: affiliation._id.$oid,
      name: affiliation.name,
      country_name: affiliation.country_name,
      province_name: affiliation.province_name,
      state_name: affiliation.state_name,
      city_name: affiliation.city_name,
      type_institution: affiliation.type_institution,
      editBox: customRender.editBox({
        id: affiliation._id.$oid,
        name: affiliation.name,
      }),
    }));

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
              <h4>{parse(this.translate("DeleteAffiliationModal.warning"))}</h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              <p>
                <FormattedMessage
                  id="DeleteAffiliationModal.description1"
                  values={{
                    itemsToBeDeleted: (
                      <strong>
                        {this.translate(
                          "DeleteAffiliationModal.itemsToBeDeleted"
                        )}
                      </strong>
                    ),
                  }}
                />
                .
              </p>
              <p>
                {parse(this.translate("DeleteAffiliationModal.description2"))}
              </p>
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.showModal}
              >
                {parse(this.translate("DeleteAffiliationModal.btnCancel"))}
              </button>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.remove}
              >
                {parse(this.translate("DeleteAffiliationModal.btnConfirm"))}
              </button>
            </div>
          </ReactModal>
          <div className="field is-grouped is-grouped-multiline">
            <p className="control">
              <button
                className="button"
                onClick={() => {
                  window.location = "/criar-afiliacao";
                }}
              >
                {parse(this.translate("AffiliationsTable.btnNewAffiliation"))}
              </button>
            </p>

            {/* <p className="control">
              <button className={classnames("button")}>
                {parse(this.translate("AffiliationsTable.btnImportSpreadSheetAffiliations"))}
              </button>
            </p>

            <p className="control">
              <button className={classnames("button")}>
                {parse(this.translate("AffiliationsTable.btnDownloadAffiliationList"))}
              </button>
            </p> */}
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
                    {parse(this.translate("AffiliationsTable.btnFilter"))}
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
      this.setState({ affiliationsRender: this.state.affiliations });
    } else {
      const filteredAffiliations = this.state.affiliations.filter(
        (affiliation) =>
          affiliation.country_name
            .toLowerCase()
            .indexOf(value.toLowerCase()) !== -1
      );
      this.setState({ affiliationsRender: filteredAffiliations });
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

AffiliationTable.propTypes = {
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
  )(AffiliationTable)
);
