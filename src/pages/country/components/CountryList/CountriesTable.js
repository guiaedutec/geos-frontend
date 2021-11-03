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
import ReactModal from "react-modal";
import stylesModal from "../../../../components/Modal/Modal.styl";

import axios from "axios";
import classnames from "classnames";
import _ from "lodash";
import NProgress from "nprogress";
import Reactable from "reactable";
import SchoolsTableContainer from "~/containers/schools_table";
import styles from "../../schools.styl";
import tableStyles from "./CountriesTable.styl";
import SchoolsPagination from "./SchoolsPagination";
import SchoolTableSize from "./SchoolTableSize";
import ModalContainer from "~/containers/modal";

import APIContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import { isHaveCityInUser } from "~/helpers/users";
import NonAdminRedir from "~/containers/non_admin_redir";
import { CSVLink } from "react-csv";

import CONF from "~/api";
import API from "~/api";

/* eslint-disable camelcase */
class CountriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      has_answered: true,
      has_sampled: true,
      config: "",
      countries: [],
      isOrdering: true,
      selectedColumn: "",
      showModal: false,
      showModalUploadCSV: false,
      idToBeRemoved: "",
      file: {},
      fileUploaded: "",
      hasFile: false,
      showModalConfirmation: false,
      isLoading: false,
      wasSuccessful: false,
      isDeleting: false,
      errors: [],
      csvData: [],
      showModalDownloadSchoolsImportModel: false,
    };
    this.remove = this.remove.bind(this);
    this.uploadCSVCountries = this.uploadCSVCountries.bind(this);
    this.showModalUploadCSV = this.showModalUploadCSV.bind(this);
    this.showModalConfirmation = this.showModalConfirmation.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  async uploadCSVCountries() {
    const requestUrl = `${
      CONF.ApiURL
    }/api/v1/schools/upload/?access_token=${getUserToken()}`;
    try {
      this.setState({ isLoading: true });
      const response = await axios.post(requestUrl, this.state.file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      this.setState({
        showModalUploadCSV: false,
        showModalConfirmation: true,
        isLoading: false,
        wasSuccessful: true,
      });
      const fileUploaded = response.data;
      return fileUploaded;
    } catch (error) {
      this.setState({
        showModalUploadCSV: false,
        showModalConfirmation: true,
        isLoading: false,
        wasSuccessful: false,
      });

      this.setState({ errors: error.response.data.data.errors });
    }
  }

  fileUpload(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    this.setState({
      fileUploaded: file.name,
      hasFile: true,
      file: formData,
      showModalUploadCSV: true,
    });
    e.target.value = "";
  }

  async remove() {
    const country_id = this.state.idToBeRemoved;
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/country/delete/${country_id}?access_token=${getUserToken()}`;

    try {
      this.setState({ isDeleting: true });
      await axios.post(URL_REQUEST);
      const filteredCountries = this.state.countries.filter(
        (country) => country._id.$oid !== country_id
      );
      this.setState({ isDeleting: false });
      this.setState({ showModal: !this.state.showModal });
      this.setState({ countries: filteredCountries });
      this.props.fetchCountries();
    } catch (error) {
      console.log(error);
    }
  }

  async fetchCsv() {
    const response = await fetch(
      "./download-files/geos_schools_import_model.csv"
    );
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value);
    this.setState({ csvData: csv });
  }

  componentWillMount() {
    const url = window.location.href;
    const config = "?" + url.split("?")[1];
    this.setState({ config: config });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.apiData.countries !== this.props.apiData.countries) {
      this.setState({
        countries: this.props.apiData.countries,
      });
    }
    if (prevState.selectedColumn !== this.state.selectedColumn) {
      this.setState({ isOrdering: true });
    }
  }
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

  componentWillReceiveProps(nextProps) {
    this.setState({ setting_valid: false });

    const { isFetchingSchools } = nextProps.apiData;
    if (isFetchingSchools === false) {
      NProgress.done();
    } else if (isFetchingSchools === true) {
      NProgress.start();
    }
  }

  downloadAnswers = (e) => {
    e.preventDefault();
    let url = API.SurveyAnswers.getDownloadSurveyAnswerLink(
      this.props.apiData.fetchParams
    );
    window.open(url);
  };

  check_has_answered_schools() {
    let _this = this;
    return axios
      .get(
        CONF.ApiURL +
          "/api/v1/has_answered_schools?access_token=" +
          getUserToken()
      )
      .then((result) => {
        if (!result.data.has_answereds) {
          _this.setState({
            has_answered: false,
          });
        }
      });
  }

  check_has_sampled_schools() {
    let _this = this;
    return axios
      .get(
        CONF.ApiURL +
          "/api/v1/has_sampled_schools?access_token=" +
          getUserToken()
      )
      .then((result) => {
        if (!result.data.has_samples) {
          _this.setState({
            has_sampled: false,
          });
        }
      });
  }

  translate = (id) => this.props.intl.formatMessage({ id });

  validate_schools() {
    this.setState({ setting_valid: true });
    axios
      .get(
        CONF.ApiURL + "/api/v1/valid_schools?access_token=" + getUserToken(),
        {}
      )
      .then(function (response) {
        if (response.data) {
          if (response.data.valid == true) {
            window.location.reload();
          }
        }
      })
      .catch(function (error) {
        console.log("error");
      });
  }

  check_validate() {
    if (!this.state.has_sampled) {
      return true;
    } else {
      if (!this.state.has_answered) {
        return true;
      }
    }
    return false;
  }

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

  showModalUploadCSV() {
    this.setState({
      fileUploaded: "",
      hasFile: false,
      file: {},
      showModalUploadCSV: false,
    });
  }

  showModalConfirmation() {
    this.setState({
      showModalConfirmation: false,
      fileUploaded: "",
      hasFile: false,
      file: {},
    });
    this.state.wasSuccessful && this.props.fetchCountries();
  }

  render() {
    const {
      highlightedColumn,
      apiData: {
        countries,
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
                window.location = "/criar-pais?id=" + value.id;
              }}
            >
              {parse(this.translate("CountriesTable.btnEdit"))}
            </span>
          </a>
          <a href="#">
            <span
              onClick={() => {
                this.showModal(value.id);
              }}
            >
              {parse(this.translate("CountriesTable.btnRemove"))}
            </span>
          </a>
        </div>
      ),
    };

    const thDict = {
      country_name: () => this.translate("CountriesTable.tableHeaderCountry"),
      level_1: () => this.translate("CountriesTable.tableHeaderLevel1"),
      level_2: () => this.translate("CountriesTable.tableHeaderLevel2"),
      level_3: () => this.translate("CountriesTable.tableHeaderLevel3"),
      level_4: () => this.translate("CountriesTable.tableHeaderLevel4"),
      editBox: () => this.translate("CountriesTable.tableHeaderActions"),
    };

    const tableData = _.map(
      this.state.countries.filter(
        (country) => country.name !== "Dummy Country For Unaffiliated Users"
      ),
      (country) => ({
        id: country._id.$oid,
        country_name: country.name,
        level_1: country.geo_structure_level1_name,
        level_2: country.geo_structure_level2_name,
        level_3: country.geo_structure_level3_name,
        level_4: country.geo_structure_level4_name,
        editBox: customRender.editBox({
          name: country.name,
          id: country._id.$oid,
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
            isOpen={this.state.showModalDownloadSchoolsImportModel}
            className={classnames(stylesModal.modal)}
            overlayClassName={classnames(stylesModal.overlay)}
            contentLabel="DownloadSchoolsImportModel"
          >
            <div className={classnames(stylesModal.modal__header)}>
              <h4>
                {parse(this.translate("ModalDownloadSchoolsImportModel.title"))}
              </h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              <p>
                {parse(
                  this.translate("ModalDownloadSchoolsImportModel.description")
                )}
              </p>
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={() =>
                  this.setState({ showModalDownloadSchoolsImportModel: false })
                }
              >
                {parse(
                  this.translate("ModalDownloadSchoolsImportModel.btnCancel")
                )}
              </button>

              <CSVLink
                data={this.state.csvData}
                filename={"geos_schools_import_model.csv"}
                onClick={() =>
                  this.setState({ showModalDownloadSchoolsImportModel: false })
                }
                className={classnames("button", stylesModal.modal__btn)}
                target="_blank"
              >
                {parse(
                  this.translate("ModalDownloadSchoolsImportModel.btnConfirm")
                )}
              </CSVLink>
            </div>
          </ReactModal>
          <ReactModal
            isOpen={this.state.showModalConfirmation}
            className={classnames(stylesModal.modal)}
            overlayClassName={classnames(stylesModal.overlay)}
          >
            <div className={classnames(stylesModal.modal__header)}>
              <h4>
                {parse(
                  this.translate("ConfirmationUploadCountriesModal.upload")
                )}
              </h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              <div>
                {this.state.wasSuccessful
                  ? this.state.fileUploaded +
                    " " +
                    this.translate(
                      "ConfirmationUploadCountriesModal.msgSuccessful"
                    )
                  : this.state.errors.length !== 0
                  ? this.state.errors.map((error, index) => (
                      <p key={index} style={{ marginBottom: "10px" }}>
                        <strong style={{ color: "red" }}>{error}</strong>
                      </p>
                    ))
                  : this.translate("ConfirmationUploadCountriesModal.msgError")}
              </div>
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.showModalConfirmation}
              >
                {parse(
                  this.translate("ConfirmationUploadCountriesModal.btnClose")
                )}
              </button>
            </div>
          </ReactModal>
          <ReactModal
            isOpen={this.state.showModal}
            className={classnames(stylesModal.modal)}
            overlayClassName={classnames(stylesModal.overlay)}
          >
            <div className={classnames(stylesModal.modal__header)}>
              <h4>{parse(this.translate("DeleteCountryModal.warning"))}</h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              <p>
                <FormattedMessage
                  id="DeleteCountryModal.description1"
                  values={{
                    itemsToBeDeleted: (
                      <strong>
                        {this.translate("DeleteCountryModal.itemsToBeDeleted")}
                      </strong>
                    ),
                  }}
                />
                .
              </p>
              <p>{parse(this.translate("DeleteCountryModal.description2"))}</p>
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.showModal}
              >
                {parse(this.translate("DeleteCountryModal.btnCancel"))}
              </button>
              <button
                className={classnames("button", stylesModal.modal__btn, {
                  "is-loading": this.state.isDeleting,
                })}
                onClick={this.remove}
              >
                {parse(this.translate("DeleteCountryModal.btnConfirm"))}
              </button>
            </div>
          </ReactModal>
          <ReactModal
            isOpen={this.state.showModalUploadCSV}
            className={classnames(stylesModal.modal)}
            overlayClassName={classnames(stylesModal.overlay)}
          >
            <div className={classnames(stylesModal.modal__header)}>
              <h4>
                {parse(
                  this.translate(
                    "UploadCountriesModal.importSpreadShettCountries"
                  )
                )}
              </h4>
            </div>
            <div className={classnames(stylesModal.modal__body)}>
              {parse(this.translate("UploadCountriesModal.description1"))}{" "}
              <strong>{this.state.fileUploaded}</strong>?
            </div>
            <div className={classnames(stylesModal.modal__footer)}>
              <button
                className={classnames("button", stylesModal.modal__btn)}
                onClick={this.showModalUploadCSV}
              >
                {parse(this.translate("UploadCountriesModal.btnCancel"))}
              </button>
              <button
                className={classnames("button", stylesModal.modal__btn, {
                  "is-loading": this.state.isLoading,
                })}
                onClick={this.uploadCSVCountries}
              >
                {parse(this.translate("UploadCountriesModal.btnConfirm"))}
              </button>
            </div>
          </ReactModal>

          <div className="field is-grouped is-grouped-multiline">
            <p className="control">
              <button
                className="button"
                onClick={() => {
                  window.location = "/criar-pais";
                }}
              >
                {parse(this.translate("CountriesTable.btnNewCountry"))}
              </button>
            </p>

            <p className="control">
              <label className={classnames("button")}>
                {this.state.fileUploaded === ""
                  ? this.translate(
                      "CountriesTable.btnImportSpreadSheetCountries"
                    )
                  : this.state.fileUploaded}

                <input
                  className={classnames("button")}
                  type="file"
                  name="file"
                  style={{ display: "none" }}
                  onChange={(e) => this.fileUpload(e)}
                />
              </label>
            </p>

            <p className="control">
              <a
                className={classnames("button", styles.btnDownload)}
                href={`${
                  CONF.ApiURL
                }/api/v1/country.csv/?access_token=${getUserToken()}`}
                download
                target="_blank"
              >
                {parse(this.translate("CountriesTable.btnDownloadCountryList"))}
              </a>
            </p>

            <p className="control">
              <a
                className={classnames("button", styles.btnDownload)}
                onClick={() =>
                  this.setState({
                    showModalDownloadSchoolsImportModel: true,
                  })
                }
              >
                {parse(
                  this.translate(
                    "CountriesTable.btnDownloadSchoolsSpreadSheetModel"
                  )
                )}
              </a>
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
                      "CountriesTable.placeholderFilter"
                    )}
                  />
                </div>
                <div className="control">
                  <button className="button is-primary">
                    {parse(this.translate("CountriesTable.btnFilter"))}
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
      this.setState({ countries: this.props.apiData.countries });
    } else {
      const filteredCountries = this.props.apiData.countries.filter(
        (country) =>
          country.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.setState({ countries: filteredCountries });
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

CountriesTable.propTypes = {
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
  )(CountriesTable)
);
