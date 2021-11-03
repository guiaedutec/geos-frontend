import React, { Component } from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import Layout from "../../components/Layout";
import styles from "./styles.styl";
import axios from "axios";
import { FormattedMessage, injectIntl } from "react-intl";
import parse from "html-react-parser";
import { getUserToken } from "~/api/utils";
import CONF from "~/api/index";
import { compose } from "redux";
import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminUserRedir from "~/containers/non_admin_user_redir";
import LocationFilters from "./self_evaluation/LocationFilters";
import FieldSimpleSelect from "~/components/Form/FieldSimpleSelect";
import { getSelectOptions } from "~/helpers/get-select-options";
import Body from "~/components/Body";
import DiagnosisTable from "./DiagnosisTable";
import $ from "jquery";
import ReactModal from "react-modal";
import stylesModal from "../../components/Modal/Modal.styl";
import ExportMicrodata from "../../components/ExportMicrodata";

const schema = {
  year: {
    presence: true,
  },
};

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveys: [],
      mapData: [],
      mapDataRender: [],
      country_id: "",
      affiliation_id: "",
      year: "",
      hasUser: false,
      jobsMicrodata: [],
      requestDisabled: false,
      showModalExportMicrodata: false,
      jobType: "",
      isLoading: false,
      yearError: false,
    };
    this.toggleViewCard.bind(this);
  }

  getLang = () => localStorage.getItem("lang");

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  getUserProfile() {
    const user = this.props.accounts.user;
    return user._profile;
  }

  getCountryId(country_id) {
    this.setState({ surveys: [] });
    this.getSurveys(country_id);
    this.setState({ country_id, affiliation_id: "" });
  }

  getAffiliationId(affiliation_id) {
    this.setState({ surveys: [] });
    if (this.getUserProfile() === "admin_country") {
      this.getSurveys(this.props.accounts.user.country_id.$oid, affiliation_id);
    }
    this.getSurveys(this.state.country_id, affiliation_id);
    this.setState({ affiliation_id });
  }

  modifySurveyList(data) {
    return data.map((item) => {
      return { name: item, id: item };
    });
  }

  async getSurveys(country_id = "", affiliation_id = "") {
    const URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/survey/surveys_list?country_id=${country_id}&affiliation_id=${affiliation_id}&access_token=` +
      getUserToken();

    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ year: "" });
      const newSurveyList = this.modifySurveyList(
        response.data.surveys[1].years
      );
      this.setState({ surveys: newSurveyList });
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getMapData(year, country_id, affiliation_id) {
    try {
      if (!this.state.affiliation_id && !this.state.year) {
        this.setState({ yearError: true });
        return;
      }
      if (this.state.affiliation_id) {
        this.setState({ yearError: true });
        if (!this.state.year) return;
      }
      this.setState({ yearError: false });
      const response = await axios.get(
        CONF.ApiURL +
          "/api/v1/schools_diagnostic_data" +
          `?year=${year}` +
          `&country_id=${country_id}` +
          `&affiliation_id=${affiliation_id}` +
          `&access_token=${getUserToken()}`
      );

      if (!response.data) return;
      this.setState({ mapData: response.data, mapDataRender: response.data });
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.accounts.user === this.props.accounts.user &&
      !this.state.hasUser
    ) {
      if (this.getUserProfile() === "admin_country") {
        this.setState({
          country_id: this.props.accounts.user.country_id.$oid,
          hasUser: true,
        });
        this.getSurveys(this.props.accounts.user.country_id.$oid);
      }
    }
  }

  componentDidMount() {
    this.getSurveys();
  }

  handleSurveySchedule(e) {
    this.setState({ year: e.target.value });
  }

  onClickFilter() {
    const { year, country_id, affiliation_id } = this.state;
    this.getMapData(year, country_id, affiliation_id);
  }

  setMapDataRender = (data) => {
    this.setState({ mapDataRender: data });
  };

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

  render() {
    return (
      <Layout pageHeader={this.translate("DiagnosisPanel.pageHeader")}>
        <Helmet title={this.translate("DiagnosisPanel.pageHeader")} />
        <Body>
          <section className="section">
            <ExportMicrodata type="school" />
            <div className={classnames("container", styles.container)}>
              <form className={classnames("card", styles.card)}>
                <div className="card-content">
                  <div className="columns">
                    <div className="column is-4">
                      <FieldSimpleSelect
                        name="survey_schedule"
                        label={this.translate("DiagnosisPanel.surveys")}
                        onChange={this.handleSurveySchedule.bind(this)}
                        options={getSelectOptions(this.state.surveys, "id")}
                        emptyOptionText={this.translate(
                          "DiagnosisPanel.selectSurveySchedule"
                        )}
                        loading={false}
                        hiddenMargin
                        error={this.state.yearError}
                      />
                    </div>
                    <div
                      className={`column is-${
                        this.getUserProfile() === "admin_country" ? 4 : 8
                      }`}
                    >
                      <LocationFilters
                        hideCountry={
                          this.getUserProfile() === "admin_country"
                            ? true
                            : false
                        }
                        hideProvince={true}
                        hideState={true}
                        hideCity={true}
                        userProfile={this.getUserProfile()}
                        hideAffiliation={false}
                        getCountryId={this.getCountryId.bind(this)}
                        getAffiliationId={this.getAffiliationId.bind(this)}
                      />
                    </div>
                  </div>
                  <div>
                    <a
                      className={classnames(
                        "card-footer-item button is-primary",
                        {
                          "is-loading": false,
                        }
                      )}
                      onClick={this.onClickFilter.bind(this)}
                    >
                      {parse(
                        this.translate(
                          "DiagnosisTeacher.selfEvaluation.applyFilter"
                        )
                      )}
                    </a>
                  </div>
                </div>
              </form>

              <DiagnosisTable
                mapData={this.state.mapData}
                mapDataRender={this.state.mapDataRender}
                setMapDataRender={this.setMapDataRender.bind(this)}
                country_id={this.state.country_id}
                affiliation_id={this.state.affiliation_id}
                year={this.state.year}
              />
            </div>
          </section>
        </Body>
      </Layout>
    );
  }
}

export default injectIntl(
  compose(APIDataContainer, NonUserRedir, NonAdminUserRedir)(DashBoard)
);
