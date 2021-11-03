import axios from "axios";
import classnames from "classnames";
import _ from "lodash";
import NProgress from "nprogress";
import React from "react";
import PropTypes from "prop-types";
import Reactable from "reactable";
import { compose } from "redux";
import API from "~/api";
import CONF from "~/api/index";
import { getUserToken } from "~/api/utils";
import Button from "~/components/Button";
import GraphsData from "./GraphsData";
import ObsFormModal from "~/components/ObsFormModal";
import LoadingComponent from "../../../components/Loading";
import AnswersTableContainer from "~/containers/answers_table";
import APIContainer from "~/containers/api_data";
import ModalContainer from "~/containers/modal";
import styles from "../followup.styl";
import stylesAnswersTable from "./AnswersTable.styl";
import AnswersPagination from "./AnswersPagination";
import tableStyles from "./AnswersTable.styl";
import AnswersTableFilterFieldsPanel from "./AnswersTableFilterFieldsPanel";
import Select from "react-select";
import { PulseLoader } from "react-spinners";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
/* eslint-disable camelcase */
class AnswersTable extends React.Component {
  downloadAnswers = (e) => {
    e.preventDefault();
    let url = API.SurveyAnswers.getDownloadSurveyAnswerLink(
      this.props.apiData.surveyAnswersFetchParams
    );
    window.open(url);
  };

  constructor(props) {
    super(props);
    this.state = {
      surveyList: [],
      listOptionsSchedule: [],
      selectedOption: null,
      isLoading: true,
      isLoadingTable: true,
      surveyAnswersMock: {},
      surveyAnswersMockRender: {},
      sample: {},
      answered: {},
      competence_level: [],
      vision_level: [],
      resource_level: [],
      infrastructure_level: [],
    };
  }

  componentDidMount() {
    this.getSurveys();
  }

  componentWillReceiveProps(nextProps) {
    const { isFetchingSurveyAnswers } = nextProps.apiData;
    if (isFetchingSurveyAnswers === false) {
      const isAnswers =
        nextProps.apiData.surveyAnswers.answered_sample != undefined
          ? true
          : false;
      NProgress.done();

      // if (isAnswers) {
      //   this.setState({
      //     isLoadingTable: false,
      //   });
      // }
    } else if (isFetchingSurveyAnswers === true) {
      NProgress.start();
      this.setState({
        isLoadingTable: true,
      });
    }
  }

  getSurveys = () => {
    const _this = this;
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/surveys_list?access_token=" +
          getUserToken(),
        {}
      )
      .then(function (surveys) {
        if (surveys.data) {
          var surveyScheduleList = [];
          var options = [];
          surveys.data.surveys.forEach(function (survey) {
            if (survey.type === "school") {
              if (survey.schedule.length > 0) {
                surveyScheduleList = survey.schedule;
                options = survey.schedule.map((schedule) => {
                  return {
                    label: schedule.name,
                    value: schedule.id.$oid,
                  };
                });
              }
            }
          });
          _this.setState(
            {
              surveyList: surveyScheduleList,
              listOptionsSchedule: options,
              selectedOption: options[0],
              isLoading: false,
            },
            () => {
              _this.fetchData();
            }
          );
        }
      });
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  async fetchSurveyAnswers(survey_schedule_id) {
    try {
      this.setState({ isLoadingTable: true });
      const response = await axios.get(
        `${
          CONF.ApiURL
        }/api/v1/survey/answers.json?survey_schedule_id=${survey_schedule_id}&access_token=${getUserToken()}`
      );
      this.setState({ isLoadingTable: false });
      this.setState({ surveyAnswersMock: response.data });
      this.setState({ surveyAnswersMockRender: response.data });
    } catch (error) {
      this.setState({ isLoadingTable: false });
      console.log(error);
    }
  }

  fetchData = () => {
    this.fetchSurveyAnswers(this.state.selectedOption.value);
    const container = this.refs.container;
    container.addEventListener("click", (e) => {
      const el = e.target;
      if (el.tagName !== "TH") {
        return;
      }

      const field = el.classList[0].replace("reactable-th-", "");
      this.props.fetchSurveyAnswers(
        {
          survey_schedule_id: this.state.selectedOption.value,
          sort: field,
          sort_dir: this._getSortDirection(field),
        },
        this.props.apiData.surveyAnswersFetchParams
      );
      this.props.highlightSelectedColumn(field);
    });
  };

  updateSchoolObservation(school_id) {
    this.props.fetchSchool(school_id);
    this.props.toggleModal();
  }

  _updateSelectedCicles(event) {
    let { surveyList, survey } = this.state;
    let cicles = surveyList.find(({ id }) => id.$oid === event.target.value);
    let updatedSurvey = cicles.id.$oid;

    if (updatedSurvey !== survey)
      this.setState(
        {
          survey: updatedSurvey,
        },
        () => {
          this.fetchData();
        }
      );
  }

  onChange = (isVisible) => {
    const shouldMenuGoSticky = !isVisible;
    if (shouldMenuGoSticky !== this.props.isTableMenuSticky) {
      this.props.toggleTableMenuStickness(shouldMenuGoSticky);
    }
  };

  onChangeSelectedCicles = (selectedOption) => {
    this.setState(
      {
        selectedOption: selectedOption,
      },
      () => {
        this.fetchData();
      }
    );
  };

  applyFilter = (data, query) => {
    if (
      (query.sample && query.sample.includes(false)) ||
      (query.answered && query.answered.includes(false))
    ) {
      query.sample && query.sample.push(null);
      query.answered && query.answered.push(null);
    }

    return data.filter((obj) =>
      Object.entries(query).every(([prop, find]) => find.includes(obj[prop]))
    );
  };

  filterByParamaters = () => {
    const query = {};
    if (
      this.state.answered.value !== undefined &&
      this.state.answered.value !== null
    ) {
      query.answered = [this.state.answered.value];
    }

    if (
      this.state.sample.value !== undefined &&
      this.state.sample.value !== null
    ) {
      query.sample = [this.state.sample.value];
    }

    if (this.state.vision_level.length !== 0) {
      query.vision_level = this.state.vision_level.map(
        (item) => item !== undefined && item !== null && item.value
      );
    }

    if (this.state.competence_level.length !== 0) {
      query.competence_level = this.state.competence_level.map(
        (item) => item !== undefined && item !== null && item.value
      );
    }

    if (this.state.resource_level.length !== 0) {
      query.resource_level = this.state.resource_level.map(
        (item) => item !== undefined && item !== null && item.value
      );
    }

    if (this.state.infrastructure_level.length !== 0) {
      query.infrastructure_level = this.state.infrastructure_level.map(
        (item) => item !== undefined && item !== null && item.value
      );
    }

    const filteredAnswers = this.applyFilter(
      this.state.surveyAnswersMock.answers,
      query
    );

    this.setState({
      surveyAnswersMockRender: {
        ...this.state.surveyAnswersMock,
        answers: filteredAnswers,
      },
    });
  };

  handleSampleFilter = (options) => {
    if (options === null) {
      this.setState({ sample: { value: null } }, () =>
        this.filterByParamaters()
      );
    }
    if (options !== undefined && options !== null)
      this.setState({ sample: options }, () => this.filterByParamaters());
  };
  handleAnsweredFilter = (options) => {
    if (options === null) {
      this.setState({ answered: { value: null } }, () =>
        this.filterByParamaters()
      );
    }
    if (options !== undefined && options !== null)
      this.setState({ answered: options }, () => this.filterByParamaters());
  };

  handleVisionLevelFilter = (options) => {
    if (options === null) {
      this.setState({ vision_level: [] }, () => this.filterByParamaters());
    }
    if (options !== undefined && options !== null)
      this.setState({ vision_level: options }, () => this.filterByParamaters());
  };

  handleCompetenceLevelFilter = (options) => {
    if (options === null) {
      this.setState({ competence_level: [] }, () => this.filterByParamaters());
    }
    if (options !== undefined && options !== null) {
      this.setState({ competence_level: options }, () =>
        this.filterByParamaters()
      );
    }
  };
  handleResourcesLevelFilter = (options) => {
    if (options === null) {
      this.setState({ resource_level: [] }, () => this.filterByParamaters());
    }
    if (options !== undefined && options !== null) {
      this.setState({ resource_level: options }, () =>
        this.filterByParamaters()
      );
    }
  };

  handleInfrastructureLevelFilter = (options) => {
    if (options === null) {
      this.setState({ infrastructure_level: [] }, () =>
        this.filterByParamaters()
      );
    }
    if (options !== undefined && options !== null) {
      this.setState({ infrastructure_level: options }, () =>
        this.filterByParamaters()
      );
    }
  };

  render() {
    const { selectedOption, listOptionsSchedule } = this.state;

    const {
      highlightedColumn,
      apiData: {
        surveyAnswers,
        surveyAnswersFetchParams: { sort_dir },
      },
    } = this.props;

    const customRender = {
      sample: (value) => (
        <div
          className={classnames({
            [styles.followup__info__table__dot_yes]: Boolean(value),
            [styles.followup__info__table__dot_no]: !value,
          })}
        />
      ),
      answered: (value) => (
        <div
          className={classnames({
            [styles.followup__info__table__dot_yes]: Boolean(value),
            [styles.followup__info__table__dot_no]: !value,
          })}
        />
      ),
      schoolPrincipal: (value) => (
        <span>
          {value.name} <br />
          <span className="grey"> {value.email} </span>
          <br />
          <span className="grey"> {value.phone} </span>
        </span>
      ),
      observations: (value, rowData) => (
        <span
          className={tableStyles.followup__info__table_obs_td}
          onClick={() => this.updateSchoolObservation(rowData.school_id)}
        >
          {value}
        </span>
      ),
    };

    const thDict = {
      sample: () => this.translate("AnswersTable.sample"),
      answered: () => this.translate("AnswersTable.answered"),
      unique_code: () => this.translate("AnswersTable.uniqueCode"),
      school_name: () => this.translate("AnswersTable.school"),
      school_city: () => this.translate("AnswersTable.city"),
      regional: () => this.translate("AnswersTable.regional"),
      vision_level: () => this.translate("AnswersTable.visionLevel"),
      competence_level: () => this.translate("AnswersTable.competenceLevel"),
      resource_level: () => this.translate("AnswersTable.resourceLevel"),
      infrastructure_level: () =>
        this.translate("AnswersTable.infrastructureLevel"),
      schoolPrincipal: () => (
        <span className={styles.followup__info__table__principal_th}>
          {this.translate("AnswersTable.contact")}
          <i className="fas fa-envelope"></i>
          <i className="fa fa-phone" />
        </span>
      ),
      observations: () => this.translate("AnswersTable.obs"),
    };

    const answers =
      this.state.surveyAnswersMockRender &&
      this.state.surveyAnswersMockRender.answers &&
      this.state.surveyAnswersMockRender.answers.map((answer) => ({
        ...answer,
        sample: customRender.sample(answer.sample),
        answered: customRender.answered(answer.sample),
        unique_code: answer.unique_code,
        schoolPrincipal: customRender.schoolPrincipal({
          name: answer.manager_name,
          email: answer.manager_email,
          phone: answer.manager_phone,
        }),
        observations: customRender.observations(answer.observations),
      }));

    const tableOptions = {
      data: answers,
    };

    return this.state.isLoading ? (
      <LoadingComponent />
    ) : (
      <section className="section">
        <div className="container">
          <div ref="container" className="columns is-multiline">
            <div className="column is-full">
              <label className="label Field_field__label_2FT">
                {parse(this.translate("FollowUp.select"))}
              </label>
              <Select
                className={classnames(styles.form__select)}
                name="filter"
                onChange={this.onChangeSelectedCicles}
                options={listOptionsSchedule}
                value={selectedOption}
              />
            </div>
            <GraphsData surveyAnswers={this.state.surveyAnswersMock} />
            <div
              className={classnames(
                "column is-full",
                styles.followup__info__table__menu_sticky_container,
                {
                  [styles.followup_info__table_menu_sticky]: this.props
                    .isTableMenuSticky,
                }
              )}
            >
              <form
                className="column is-4-tablet is-4-desktop"
                onSubmit={this._queryAnswersSubmit.bind(this)}
              >
                <div className="field has-addons">
                  <div
                    className={classnames(
                      "control",
                      "is-expanded",
                      styles.filter
                    )}
                  >
                    <input
                      className="input"
                      type="text"
                      placeholder={this.translate("FollowUp.placeholderFilter")}
                    />
                  </div>
                  <div className="control">
                    <button className="button is-primary">
                      {parse(this.translate("FollowUp.btnFilter"))}
                    </button>
                  </div>
                </div>
              </form>

              <div className="column is-3-tablet is-2-desktop">
                <Button
                  className={styles.download_button}
                  onClick={this.downloadAnswers}
                >
                  {parse(this.translate("FollowUp.btnDownloadAnswers"))}
                </Button>
              </div>
            </div>
            <AnswersTableFilterFieldsPanel
              handleSampleFilter={this.handleSampleFilter}
              handleAnsweredFilter={this.handleAnsweredFilter}
              handleVisionLevelFilter={this.handleVisionLevelFilter}
              handleCompetenceLevelFilter={this.handleCompetenceLevelFilter}
              handleResourcesLevelFilter={this.handleResourcesLevelFilter}
              handleInfrastructureLevelFilter={
                this.handleInfrastructureLevelFilter
              }
            />
            <div className="column is-full">
              {answers && answers.length <= 0 ? (
                <div
                  className={classnames(
                    "column",
                    stylesAnswersTable.answers_table_container_msg
                  )}
                >
                  {this.state.isLoadingTable ? (
                    <div
                      className={classnames(stylesAnswersTable.loader_table)}
                    >
                      <PulseLoader color="#e65c2d" />
                    </div>
                  ) : (
                    <p
                      className={
                        stylesAnswersTable.anwsers_table_container_text
                      }
                    >
                      Nenhum dado encontrado
                    </p>
                  )}
                </div>
              ) : this.state.isLoadingTable ? (
                <div className={classnames(stylesAnswersTable.loader_table)}>
                  <PulseLoader color="#e65c2d" />
                </div>
              ) : (
                <Reactable.Table
                  className={classnames(
                    "table is-bordered is-fullwidth is-hoverable"
                  )}
                  {...tableOptions}
                >
                  <Reactable.Thead>
                    {_.map(thDict, (renderer, column) => (
                      <Reactable.Th
                        key={column}
                        column={column}
                        className={classnames({
                          [styles.followup__info__table_highlightedTh]:
                            column === highlightedColumn,
                          [tableStyles.sorting_field]:
                            column === highlightedColumn,
                          [tableStyles.sorting_field__asc]: sort_dir === "asc",
                          [tableStyles.sorting_field__desc]:
                            sort_dir === "desc",
                        })}
                      >
                        {renderer()}
                      </Reactable.Th>
                    ))}
                  </Reactable.Thead>
                </Reactable.Table>
              )}
            </div>
            <ObsFormModal
              isActive={this.props.modal.isActive}
              toggleModal={this.props.toggleModal}
            />
          </div>
        </div>
      </section>
    );
  }

  _queryAnswersSubmit = (e) => {
    e.preventDefault();
    const value = e.currentTarget.querySelector("input").value;
    if (value === "") {
      this.setState({ surveyAnswersMockRender: this.state.surveyAnswersMock });
    } else {
      const filteredAnswers = this.state.surveyAnswersMock.answers.filter(
        (answers) =>
          answers.school_name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.setState({
        surveyAnswersMockRender: {
          ...this.state.surveyAnswersMock,
          answers: filteredAnswers,
        },
      });
    }
    // this.fetchSurveyAnswers(this.state.selectedOption.value);
    // this.props.fetchSurveyAnswers(
    //   {
    //     survey_schedule_id: this.state.selectedOption.value,
    //     q: e.currentTarget.querySelector("input").value,
    //   },
    //   this.props.apiData.surveyAnswersFetchParams
    // );
  };

  /*
   * Return the sorting direction for a given field.
   * @param {string} field
   * @return {string} sortingDir
   */
  _getSortDirection(field) {
    const {
      apiData: {
        surveyAnswersFetchParams: { sort_dir, sort },
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

AnswersTable.propTypes = {
  apiData: PropTypes.object,
  highlightSelectedColumn: PropTypes.func,
  fetchSurveyAnswers: PropTypes.func,
  isTableMenuSticky: PropTypes.bool,
  highlightedColumn: PropTypes.string,
  decreasePaginationStart: PropTypes.func.isRequired,
  increasePaginationStart: PropTypes.func.isRequired,
};

export default injectIntl(
  compose(APIContainer, AnswersTableContainer, ModalContainer)(AnswersTable)
);
