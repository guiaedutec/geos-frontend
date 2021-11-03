import React from "react";
import PropTypes from "prop-types";
import co from "co";
import ReactModal from "react-modal";
import stylesModal from "../../../../components/Modal/Modal.styl";
import { getUserToken } from "~/api/utils";
import { compose } from "redux";
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from "react-intl";
import parse from "html-react-parser";
import axios from "axios";
import classnames from "classnames";
import _, { has } from "lodash";
import NProgress from "nprogress";
import Reactable from "reactable";
import VisibilitySensor from "react-visibility-sensor";
import SchoolsTableContainer from "~/containers/schools_table";
import styles from "../../schools.styl";
import tableStyles from "./SchoolsTable.styl";
import SchoolsPagination from "./SchoolsPagination";
import SchoolTableSize from "./SchoolTableSize";
import ModalContainer from "~/containers/modal";
import APIContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminRedir from "~/containers/non_admin_redir";
import { isHaveCityInUser, isAdminCountry } from "~/helpers/users";
import CONF from "~/api/index";
import API from "~/api";
import { CSVLink } from "react-csv";
/* eslint-disable camelcase */
class SchoolsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      has_answered: true,
      has_sampled: true,
      config: "",
      hasUser: false,
      schools: [],
      schoolsRender: [],
      hasCountries: false,
      geo_structure_level1_name: "",
      geo_structure_level2_name: "",
      geo_structure_level3_name: "",
      geo_structure_level4_name: "",
      showModal: false,
      idToBeRemoved: "",
      isDeleting: false,
      affiliation_id: "",
      isOrdering: true,
      country_id: "",
      csvData: [],
      showModalDownloadSchoolsImportModel: false,
      fileUploaded: "",
      isLoading: false,
      hasFile: false,
      file: {},
      showModalUploadCSV: false,
      errors: [],
      wasSuccessful: false,
      showModalConfirmation: false,
    };
    this.remove = this.remove.bind(this);
    this.uploadCSVSchools = this.uploadCSVSchools.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.showModalUploadCSV = this.showModalUploadCSV.bind(this);
    this.showModalConfirmation = this.showModalConfirmation.bind(this);
  }

  async uploadCSVSchools() {
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

  async remove() {
    const school_id = this.state.idToBeRemoved;
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/school/delete/${school_id}?access_token=${getUserToken()}`;

    try {
      this.setState({ isDeleting: true });
      await axios.post(URL_REQUEST);
      const filteredSchools = this.state.schoolsRender.filter(
        (school) => school._id.$oid !== school_id
      );
      this.setState({ isDeleting: false });
      this.setState({ showModal: !this.state.showModal });
      this.setState({ schools: filteredSchools });
      this.props.fetchSchoolsByAffiliationId(this.state.affiliation_id);
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

  showModal = (id) => {
    this.setState({ showModal: !this.state.showModal });
    if (typeof id === "string") this.setState({ idToBeRemoved: id });
  };

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

  componentWillMount() {
    const url = window.location.href;
    const config = "?" + url.split("?")[1];
    this.setState({ config: config });
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.hasUser === false &&
      prevProps.accounts.user === this.props.accounts.user
    ) {
      const user = this.props.accounts.user;
      if (isAdminCountry(user)) {
        const country_id = user.country_id && user.country_id.$oid;
        this.setState({ country_id });
        this.getSchoolsByCountryId(country_id);
      } else {
        const affiliation_id = user.affiliation_id && user.affiliation_id.$oid;
        this.setState({ affiliation_id });
        this.props.fetchSchoolsByAffiliationId(affiliation_id);
      }
      this.setState({ hasUser: true });
    }

    if (
      prevProps.apiData.countries !== this.props.apiData.countries &&
      this.state.hasCountries === false
    ) {
      this.updateGeographicElements(this.props.accounts.user.country_id.$oid);
      this.setState({ hasCountries: true });
    }

    if (
      prevProps.apiData.schools !== this.props.apiData.schools &&
      !isAdminCountry(this.props.accounts.user)
    ) {
      this.setState({
        schools: this.props.apiData.schools,
        schoolsRender: this.props.apiData.schools,
      });
    }

    if (prevState.selectedColumn !== this.state.selectedColumn) {
      this.setState({ isOrdering: true });
    }
  }

  async getSchoolsByCountryId(country_id) {
    try {
      const response = await API.Schools.getAllByCountryId(country_id);
      this.setState({ schools: response, schoolsRender: response });
      return response;
    } catch (error) {
      this.setState({ schools: [], schoolsRender: [] });
      console.log(error.message);
    }
  }

  componentDidMount() {
    this.fetchCsv();
    this.props.fetchCountries();
    if (!isAdminCountry(this.props.accounts.user)) {
      if (this.props.apiData.accounts) {
        const affiliation_id = this.props.apiData.accounts.affiliation_id.$oid;
        this.props.fetchSchoolsByAffiliationId(affiliation_id);
        this.check_has_answered_schools();
        this.check_has_sampled_schools();
      }
    }
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

  render() {
    const {
      highlightedColumn,
      apiData: {
        schools,
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
      schoolPrincipal: (value) => (
        <a href="#">
          <span
            onClick={() => {
              window.location =
                "/criar-contato?id=" + value.id + "&redir=/listar-escolas";
            }}
          >
            {value.name}
            <br />
            <span className="grey">{value.email}</span>
            <br />
            <span className="grey">{value.phone}</span>
          </span>
        </a>
      ),
      editBox: (value, rowData) => (
        <div
          style={{
            display: "flex",
            gap: "6px",
            justifyContent: "center",
          }}
        >
          {!isAdminCountry(this.props.accounts.user) && (
            <a href="#">
              <span
                onClick={() => {
                  window.location = "/criar-escola?id=" + value.school_id;
                }}
              >
                {parse(this.translate("SchoolsTable.btnEdit"))}
              </span>
            </a>
          )}
          <a href="#">
            <span
              onClick={() => {
                this.showModal(value.school_id);
              }}
            >
              {parse(this.translate("SchoolsTable.btnRemove"))}
            </span>
          </a>
        </div>
      ),
    };
    const thDict = {
      unique_code: () => this.translate("SchoolsTable.tableHeaderUniqueCode"),
      name: () => this.translate("SchoolsTable.tableHeaderSchool"),
      state_name: () =>
        this.state.geo_structure_level3_name === ""
          ? this.translate("SchoolsTable.tableHeaderState")
          : this.state.geo_structure_level3_name,
      city_name: () =>
        this.state.geo_structure_level4_name === ""
          ? this.translate("SchoolsTable.tableHeaderCity")
          : this.state.geo_structure_level4_name,

      schoolPrincipal: () => (
        <span className={styles.followup__info__table__principal_th}>
          {this.translate("SchoolsTable.tableHeaderContact")}&nbsp;
          <i className="fa fa-envelope-o" />
          &nbsp;
          <i className="fa fa-phone" />
        </span>
      ),
      sample: () => this.translate("SchoolsTable.tableHeaderSample"),
      editBox: () => this.translate("SchoolsTable.tableHeaderActions"),
    };

    const tableData =
      this.state.schoolsRender &&
      this.state.schoolsRender.map((school) => ({
        unique_code: school.unique_code,
        name: school.name,
        state_name: school.state_name,
        city_name: school.city_name,
        sample: customRender.sample(school.sample),
        schoolPrincipal: customRender.schoolPrincipal({
          name: school.manager_name ? school.manager_name : "",
          email: school.manager_email ? school.manager_email : "",
          phone: school.manager_phone ? school.manager_phone : "",
          id: school.manager_id,
        }),
        editBox: customRender.editBox({
          name: school.manager_name,
          school_id: school._id.$oid,
        }),
      }));

    const thDictAdminCountry = {
      level_1_name: () =>
        this.state.geo_structure_level1_name === ""
          ? this.translate("SchoolsTable.tableHeaderCountry")
          : this.state.geo_structure_level1_name,
      level_2_name: () =>
        this.state.geo_structure_level2_name === ""
          ? this.translate("SchoolsTable.tableHeaderProvince")
          : this.state.geo_structure_level2_name,
      level_3_name: () =>
        this.state.geo_structure_level3_name === ""
          ? this.translate("SchoolsTable.tableHeaderState")
          : this.state.geo_structure_level3_name,
      level_4_name: () =>
        this.state.geo_structure_level4_name === ""
          ? this.translate("SchoolsTable.tableHeaderCity")
          : this.state.geo_structure_level4_name,
      unique_code: () => this.translate("SchoolsTable.tableHeaderUniqueCode"),
      name: () => this.translate("SchoolsTable.tableHeaderSchool"),
      editBox: () => this.translate("SchoolsTable.tableHeaderActions"),
    };

    const tableDataAdminCountry =
      this.state.schoolsRender &&
      this.state.schoolsRender.map((school) => ({
        level_1_name: school.country_name,
        level_2_name: school.province_name,
        level_3_name: school.state_name,
        level_4_name: school.city_name,
        unique_code: school.unique_code,
        name: school.name,
        editBox: customRender.editBox({
          name: school.manager_name,
          school_id: school._id.$oid,
        }),
      }));

    const tableOptions = {
      data: isAdminCountry(this.props.accounts.user)
        ? tableDataAdminCountry
        : tableData,
    };

    return (
      <div ref="container" className={styles.followup__info__table_container}>
        {isHaveCityInUser(user) || isAdminCountry(user) ? (
          <div
            className="field is-grouped is-grouped-multiline"
            style={{ marginBottom: "10px" }}
          >
            {isAdminCountry(user) && (
              <div className="field is-grouped is-grouped-multiline">
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
                        "SchoolsTable.btnDownloadSchoolsSpreadSheetModel"
                      )
                    )}
                  </a>
                </p>

                <p className="control">
                  <label className={classnames("button")}>
                    {this.state.fileUploaded === ""
                      ? this.translate(
                          "SchoolsTable.btnImportSchoolsSpreadSheet"
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
                    {parse(
                      this.translate("SchoolsTable.btnDownloadSchoolList")
                    )}
                  </a>
                </p>
              </div>
            )}

            {!isAdminCountry(user) && (
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
                    {/* Nova Escola */}
                  </button>
                </p>
                <p className="control">
                  <button
                    className={classnames("button")}
                    onClick={() => {
                      window.location = "/criar-contato";
                    }}
                  >
                    {parse(this.translate("SchoolsTable.btnNewContact"))}
                  </button>
                </p>
                {/* <p className="control">
                  <button
                    className={classnames("button")}
                    onClick={() => {
                      window.location = "/spreadsheet_manager";
                    }}
                  >
                    {parse(
                      this.translate("SchoolsTable.btnImportSpreadSheetContact")
                    )}
                  </button>
                </p> */}
                <p className="control">
                  <button
                    className={classnames("button")}
                    onClick={() => {
                      window.location = "/listar-contatos";
                    }}
                  >
                    {parse(this.translate("SchoolsTable.btnContactList"))}
                  </button>
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
                    {parse(
                      this.translate("SchoolsTable.btnDownloadSchoolList")
                    )}
                  </a>
                </p>
              </div>
            )}
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
        </div>
        <SchoolTableSize
          totalSchools={this.state.schools && this.state.schools.length}
        />
        <Reactable.Table
          className={classnames(
            "table is-bordered is-fullwidth",
            styles.followup__info__table
          )}
          {...tableOptions}
          sortable={true}
        >
          <Reactable.Thead>
            {_.map(
              isAdminCountry(user) ? thDictAdminCountry : thDict,
              (renderer, column) => (
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
              )
            )}
          </Reactable.Thead>
        </Reactable.Table>
        <ReactModal
          isOpen={this.state.showModal}
          className={classnames(stylesModal.modal)}
          overlayClassName={classnames(stylesModal.overlay)}
          contentLabel="DeleteSchool"
        >
          <div className={classnames(stylesModal.modal__header)}>
            <h4>{parse(this.translate("DeleteSchoolModal.warning"))}</h4>
          </div>
          <div className={classnames(stylesModal.modal__body)}>
            <p>
              <FormattedMessage
                id="DeleteSchoolModal.description1"
                values={{
                  itemsToBeDeleted: (
                    <strong>
                      {this.translate("DeleteSchoolModal.itemsToBeDeleted")}
                    </strong>
                  ),
                }}
              />
              .
            </p>
            <p>{parse(this.translate("DeleteSchoolModal.description2"))}</p>
          </div>
          <div className={classnames(stylesModal.modal__footer)}>
            <button
              className={classnames("button", stylesModal.modal__btn)}
              onClick={this.showModal}
            >
              {parse(this.translate("DeleteSchoolModal.btnCancel"))}
            </button>
            <button
              className={classnames("button", stylesModal.modal__btn, {
                "is-loading": this.state.isDeleting,
              })}
              onClick={this.remove}
            >
              {parse(this.translate("DeleteSchoolModal.btnConfirm"))}
            </button>
          </div>
        </ReactModal>
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
          isOpen={this.state.showModalUploadCSV}
          className={classnames(stylesModal.modal)}
          overlayClassName={classnames(stylesModal.overlay)}
        >
          <div className={classnames(stylesModal.modal__header)}>
            <h4>
              {parse(
                this.translate("UploadSchoolsModal.importSpreadSheetSchools")
              )}
            </h4>
          </div>
          <div className={classnames(stylesModal.modal__body)}>
            {parse(this.translate("UploadSchoolsModal.description1"))}{" "}
            <strong>{this.state.fileUploaded}</strong>?
          </div>
          <div className={classnames(stylesModal.modal__footer)}>
            <button
              className={classnames("button", stylesModal.modal__btn)}
              onClick={this.showModalUploadCSV}
            >
              {parse(this.translate("UploadSchoolsModal.btnCancel"))}
            </button>
            <button
              className={classnames("button", stylesModal.modal__btn, {
                "is-loading": this.state.isLoading,
              })}
              onClick={this.uploadCSVSchools}
            >
              {parse(this.translate("UploadSchoolsModal.btnConfirm"))}
            </button>
          </div>
        </ReactModal>

        <ReactModal
          isOpen={this.state.showModalConfirmation}
          className={classnames(stylesModal.modal)}
          overlayClassName={classnames(stylesModal.overlay)}
        >
          <div className={classnames(stylesModal.modal__header)}>
            <h4>
              {parse(this.translate("ConfirmationUploadSchoolsModal.upload"))}
            </h4>
          </div>
          <div className={classnames(stylesModal.modal__body)}>
            <div>
              {this.state.wasSuccessful
                ? this.state.fileUploaded +
                  " " +
                  this.translate("ConfirmationUploadSchoolsModal.msgSuccessful")
                : this.state.errors.length !== 0
                ? this.state.errors.map((error, index) => (
                    <p key={index} style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "red" }}>{error}</strong>
                    </p>
                  ))
                : this.translate("ConfirmationUploadSchoolsModal.msgError")}
            </div>
          </div>
          <div className={classnames(stylesModal.modal__footer)}>
            <button
              className={classnames("button", stylesModal.modal__btn)}
              onClick={this.showModalConfirmation}
            >
              {parse(this.translate("ConfirmationUploadSchoolsModal.btnClose"))}
            </button>
          </div>
        </ReactModal>
      </div>
    );
  }

  _queryAnswersSubmit(e) {
    e.preventDefault();
    const value = e.currentTarget.querySelector("input").value;
    if (value === "") {
      this.setState({ schoolsRender: this.state.schools });
    } else {
      const filteredSchools = this.state.schools.filter(
        (school) =>
          school.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.setState({ schoolsRender: filteredSchools });
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
