import React, { Component } from "react";
import classnames from "classnames";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import ReactModal from "react-modal";
import stylesModal from "../Modal/Modal.styl";
import styles from "./styles.styl";
import CONF from "~/api/index";
import $ from "jquery";
import { getUserToken } from "~/api/utils";
import axios from "axios";

class ExportMicrodata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasUser: false,
      jobsMicrodata: [],
      requestDisabled: false,
      showModalExportMicrodata: false,
      jobType: "",
      isLoading: false,
    };
    this.requestSchoolsMicrodata = this.requestSchoolsMicrodata.bind(this);
    this.requestTeachersMicrodata = this.requestTeachersMicrodata.bind(this);
    this.fetchJobs = this.fetchJobs.bind(this);
    this.toggleViewCard = this.toggleViewCard.bind(this);
  }

  requestSchoolsMicrodata = async function () {
    if (this.state.requestDisabled) return;
    const URL_REQUEST = `${CONF.ApiURL}/api/v1/export_schools_microdata`;
    try {
      this.setState({ isLoading: true });
      await axios.get(URL_REQUEST, {
        params: {
          access_token: getUserToken(),
          lang: this.getLang(),
        },
      });
      this.setState({ showModalExportMicrodata: false, isLoading: false });
    } catch (error) {
      console.log(error.message);
    }
    this.fetchJobs();
  };

  requestTeachersMicrodata = async function () {
    if (this.state.requestDisabled) return;
    const URL_REQUEST = `${CONF.ApiURL}/api/v1/export_teachers_microdata`;
    try {
      this.setState({ isLoading: true });
      await axios.get(URL_REQUEST, {
        params: {
          access_token: getUserToken(),
          lang: this.getLang(),
        },
      });
      this.setState({ showModalExportMicrodata: false, isLoading: false });
    } catch (error) {
      console.log(error.message);
    }
    this.fetchJobs();
  };

  fetchJobs = async function () {
    const URL_REQUEST = CONF.ApiURL + `/api/v1/export_jobs_microdata`;
    try {
      const response = await axios.get(URL_REQUEST, {
        params: {
          access_token: getUserToken(),
          lang: this.getLang(),
        },
      });
      this.setState({ requestDisabled: false });

      const responseSorted = response.data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .filter((job) => job.type === this.props.type);

      responseSorted.forEach((job) => {
        if (!job.status) {
          this.setState({ requestDisabled: true });
        }
      });

      this.setState({ jobsMicrodata: responseSorted });
    } catch (error) {
      console.log(error.message);
    }
  };

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }
  handleModalExportMicrodata = (jobType) => {
    this.setState({
      jobType,
      showModalExportMicrodata: !this.state.showModalExportMicrodata,
    });
  };

  getLang = () => localStorage.getItem("lang");

  toggleViewCard(e) {
    let btn = $(e.target).parents("a");
    if ($(btn).hasClass("_180")) {
      $(btn).removeClass("_180");
    } else {
      $(btn).addClass("_180");
    }

    $(e.target)
      .parents(".card-collapse")
      .find(".toggle")
      .each(function () {
        if ($(this).hasClass("is-hidden")) {
          $(this).removeClass("is-hidden");
        } else {
          $(this).addClass("is-hidden");
        }
      });
  }

  componentDidMount() {
    this.fetchJobs();
  }
  render() {
    return (
      <div className={classnames("container", styles.container)}>
        <div className="card card-collapse">
          <header className="card-header">
            <a
              onClick={this.toggleViewCard}
              className="card-header-icon rotate"
              aria-label="more options"
            >
              <span className="icon">
                <i className="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </a>
            <p className="card-header-title">
              {parse(this.translate("DiagnosisPanel.exportMicrodataTitle"))}
            </p>
          </header>
          <div
            className={classnames(
              "card-content toggle is-hidden",
              styles.collapseBody
            )}
          >
            <div className={styles.buttons}>
              {this.props.type === "school" && (
                <p className="control">
                  <a
                    className={classnames("button", styles.btnDownload)}
                    onClick={() => this.handleModalExportMicrodata("schools")}
                    style={
                      this.state.requestDisabled
                        ? { pointerEvents: "none", opacity: 0.5 }
                        : {}
                    }
                  >
                    {parse(
                      this.translate(
                        "DiagnosisPanel.btnRequestMicrodataSchools"
                      )
                    )}
                  </a>
                </p>
              )}

              {this.props.type === "teacher" && (
                <p className="control">
                  <a
                    className={classnames("button", styles.btnDownload)}
                    onClick={() => this.handleModalExportMicrodata("teachers")}
                    style={
                      this.state.requestDisabled
                        ? { pointerEvents: "none", opacity: 0.5 }
                        : {}
                    }
                  >
                    {parse(
                      this.translate(
                        "DiagnosisPanel.btnRequestMicrodataTeachers"
                      )
                    )}
                  </a>
                </p>
              )}
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{parse(this.translate("DiagnosisPanel.requestDate"))}</th>
                  <th>{parse(this.translate("DiagnosisPanel.requestHour"))}</th>
                  <th>{parse(this.translate("DiagnosisPanel.requestType"))}</th>
                  <th>
                    {parse(this.translate("DiagnosisPanel.requestStatus"))}
                  </th>
                  <th>{parse(this.translate("DiagnosisPanel.requestFile"))}</th>
                </tr>
              </thead>

              <tbody>
                {this.state.jobsMicrodata &&
                  this.state.jobsMicrodata.map((job, index) => (
                    <tr key={index}>
                      <td>
                        {new Date(job.created_at).toLocaleDateString(
                          this.getLang()
                        )}
                      </td>
                      <td>
                        {new Date(job.created_at).toLocaleTimeString(
                          this.getLang()
                        )}
                      </td>
                      <td>{job.type}</td>
                      <td>
                        {job.status
                          ? parse(this.translate("DiagnosisPanel.concluded"))
                          : parse(this.translate("DiagnosisPanel.progress"))}
                      </td>
                      <td>
                        <a
                          href={
                            CONF.ApiURL +
                            `/api/v1/export_microdata_get_file/${
                              job._id.$oid
                            }?access_token=${getUserToken()}&lang=${this.getLang()}`
                          }
                          style={
                            !job.status
                              ? { pointerEvents: "none", opacity: 0.5 }
                              : {}
                          }
                        >
                          {parse(
                            this.translate("DiagnosisPanel.btnDownloadFile")
                          )}
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <ReactModal
          isOpen={this.state.showModalExportMicrodata}
          className={classnames(stylesModal.modal)}
          overlayClassName={classnames(stylesModal.overlay)}
        >
          <div className={classnames(stylesModal.modal__header)}>
            <h4>{parse(this.translate("ModalExportMicrodata.title"))}</h4>
          </div>
          <div className={classnames(stylesModal.modal__body)}>
            <p>{parse(this.translate("ModalExportMicrodata.description"))}</p>
          </div>
          <div className={classnames(stylesModal.modal__footer)}>
            <button
              className={classnames("button", stylesModal.modal__btn)}
              onClick={() => {
                this.setState({
                  showModalExportMicrodata: false,
                });
              }}
            >
              {parse(this.translate("ModalExportMicrodata.btnCancel"))}
            </button>
            <button
              className={classnames("button", stylesModal.modal__btn, {
                "is-loading": this.state.isLoading,
              })}
              onClick={
                this.state.jobType === "schools"
                  ? this.requestSchoolsMicrodata
                  : this.requestTeachersMicrodata
              }
            >
              {parse(this.translate("ModalExportMicrodata.btnConfirm"))}
            </button>
          </div>
        </ReactModal>
      </div>
    );
  }
}

export default injectIntl(ExportMicrodata);
