import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";

import classnames from "classnames";
import _ from "lodash";
import NProgress from "nprogress";
import SchoolsTableContainer from "~/containers/schools_table";
import styles from "../../schools.styl";
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

// Import React Table
import ReactTable from "react-table";
// import "!style!css!react-table/react-table.css";

import API from "~/api";
import SchoolTableSize from "./SchoolTableSize";

/* eslint-disable camelcase */
class SchoolsTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pages: null,
      loading: false,
      config: "",
      schools: [],
      geo_structure_level1_name: "",
      geo_structure_level2_name: "",
      geo_structure_level3_name: "",
      geo_structure_level4_name: "",
      hasCountries: false,
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
  }

  componentWillMount() {
    const url = window.location.href;
    const config = "?" + url.split("?")[1];
    this.setState({ config: config });
  }
  translate = (id) => this.props.intl.formatMessage({ id });

  fetchData = (state, instance) => {
    let _this = this;
    let sort = null;
    let sort_dir = null;
    _this.setState({
      loading: true,
    });
    if (state.sorted.length > 0) {
      _this.props.fetchSchools({
        page: state.page + 1,
        sort: state.sorted[0].id,
        sort_dir: state.sorted[0].desc == false ? "asc" : "desc",
        limit: state.pageSize,
      });
    } else {
      _this.props.fetchSchools({
        page: state.page + 1,
        limit: state.pageSize,
      });
    }
  };

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
  }

  _queryAnswersSubmit(e) {
    e.preventDefault();

    // this.props.fetchSchools({
    //   q: e.currentTarget.querySelector("input").value,
    // });
  }

  // componentDidMount() {
  //   this.fetchData = this.fetchData.bind(this);
  // }

  componentWillReceiveProps(nextProps) {
    // const { isFetchingSchools } = nextProps.apiData;
    // if (isFetchingSchools === false) {
    //   this.setState({ loading: false });
    //   NProgress.done();
    // } else if (isFetchingSchools === true) {
    //   NProgress.start();
    // }
  }

  downloadAnswers = (e) => {
    e.preventDefault();
    let url = API.SurveyAnswers.getDownloadSurveyAnswerLink(
      this.props.apiData.fetchParams
    );
    window.open(url);
  };

  render() {
    // const {
    //   highlightedColumn,
    //   apiData: {
    //     schools,
    //     fetchParams: { sort_dir },
    //   },
    // } = this.props;
    // const { user } = this.props.accounts;

    const pages = this.state.schools.total_pages;
    const tableData = this.state.schools.map((school) => ({
      ...school,
      editBox: school.school_id,
    }));

    const tableOptions = {
      data: tableData,
      customrender: {
        editBox: (value, rowData) => (
          <a href="#">
            <span
              onClick={() => {
                window.location = "/criar-escola?id=" + rowData.school_id;
              }}
            >
              Editar
            </span>
          </a>
        ),
      },
    };

    const columns = [
      {
        Header: "",
        columns: [
          {
            Header: "",
            accessor: "editBox",
            style: { textAlign: "center" },
            maxWidth: 50,
            Cell: (props) => (
              <a href="#">
                <span
                  onClick={() => {
                    window.location =
                      "/criar-escola?ref=-classes&id=" + props.value;
                  }}
                >
                  <i className="far fa-edit" />
                </span>
              </a>
            ),
          },
        ],
      },
      {
        Header: "",
        columns: [
          {
            Header: this.translate("SchoolTableClasses.tableHeaderInepCode"),
            accessor: "inep",
          },
        ],
      },
      {
        Header: "",
        columns: [
          {
            Header: this.translate("SchoolTableClasses.tableHeaderSchool"),
            accessor: "school_name",
          },
        ],
      },
      {
        Header: "",
        columns: [
          {
            Header:
              this.state.geo_structure_level3_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderState")
                : this.state.geo_structure_level3_name,
            accessor: "school_state",
          },
        ],
      },
      {
        Header: "",
        columns: [
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            accessor: "school_city",
          },
        ],
      },
      {
        Header: () => (
          <div>
            <div className="columns is-marginless">
              <div className="column is-full">
                {parse(this.translate("SchoolTableClasses.kindergarten"))}
              </div>
            </div>
            <div className="columns is-marginless">
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.morning")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.afternoon")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.night")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.integral")}
              </div>
            </div>
          </div>
        ),
        columns: [
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "kindergarten.manha.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderStudents"),
            sortable: false,
            maxWidth: 60,
            accessor: "kindergarten.manha.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.AMT"),
            sortable: false,
            maxWidth: 60,
            accessor: "kindergarten.manha.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "kindergarten.tarde.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "kindergarten.tarde.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderStudents"),
            sortable: false,
            maxWidth: 60,
            accessor: "kindergarten.tarde.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "kindergarten.noite.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "kindergarten.noite.num_aluno",
          },
          {
            Header: this.translate(
              "SchoolTableClasses.tableHeaderbiggestClassStudents"
            ),
            sortable: false,
            maxWidth: 60,
            accessor: "kindergarten.noite.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "kindergarten.integral.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "kindergarten.integral.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "kindergarten.integral.num_alunos_maior_turma",
          },
        ],
      },
      {
        Header: () => (
          <div>
            <div className="columns is-marginless">
              <div className="column is-full">
                {parse(this.translate("SchoolTableClasses.elementarySchool1"))}
              </div>
            </div>
            <div className="columns is-marginless">
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.morning")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.afternoon")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.night")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.integral")}
              </div>
            </div>
          </div>
        ),
        columns: [
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_1.manha.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_1.manha.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_1.manha.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_1.tarde.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_1.tarde.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_1.tarde.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_1.noite.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_1.noite.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_1.noite.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_1.integral.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_1.integral.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_1.integral.num_alunos_maior_turma",
          },
        ],
      },
      {
        Header: () => (
          <div>
            <div className="columns is-marginless">
              <div className="column is-full">
                {parse(this.translate("SchoolTableClasses.elementarySchool2"))}
              </div>
            </div>
            <div className="columns is-marginless">
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.morning")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.afternoon")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.night")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.integral")}
              </div>
            </div>
          </div>
        ),
        columns: [
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_2.manha.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_2.manha.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_2.manha.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_2.tarde.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_2.tarde.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_2.tarde.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_2.noite.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_2.noite.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_2.noite.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_2.integral.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_2.integral.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "elementary_2.integral.num_alunos_maior_turma",
          },
        ],
      },
      {
        Header: () => (
          <div>
            <div className="columns is-marginless">
              <div className="column is-full">
                {parse(this.translate("SchoolTableClasses.highSchool"))}
              </div>
            </div>
            <div className="columns is-marginless">
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.morning")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.afternoon")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.night")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.integral")}
              </div>
            </div>
          </div>
        ),
        columns: [
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "highschool.manha.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "highschool.manha.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "highschool.manha.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "highschool.tarde.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "highschool.tarde.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            accessor: "highschool.tarde.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "highschool.noite.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "highschool.noite.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "highschool.noite.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "highschool.integral.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "highschool.integral.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "highschool.integral.num_alunos_maior_turma",
          },
        ],
      },
      {
        Header: () => (
          <div>
            <div className="columns is-marginless">
              <div className="column is-full">
                {parse(
                  this.translate("SchoolTableClasses.technicalHighSchool")
                )}
              </div>
            </div>
            <div className="columns is-marginless">
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.morning")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.afternoon")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.night")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.integral")}
              </div>
            </div>
          </div>
        ),
        columns: [
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "technical.manha.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "technical.manha.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "technical.manha.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "technical.tarde.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "technical.tarde.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "technical.tarde.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "technical.noite.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "technical.noite.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "technical.noite.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "technical.integral.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "technical.integral.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "technical.integral.num_alunos_maior_turma",
          },
        ],
      },
      {
        Header: () => (
          <div>
            <div className="columns is-marginless">
              <div className="column is-full">
                {parse(this.translate("SchoolTableClasses.eja"))}
              </div>
            </div>
            <div className="columns is-marginless">
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.morning")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.afternoon")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.night")}
              </div>
              <div className="column is-quarter">
                {this.translate("SchoolTableClasses.integral")}
              </div>
            </div>
          </div>
        ),
        columns: [
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "adult.manha.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "adult.manha.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "adult.manha.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "adult.tarde.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "adult.tarde.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "adult.tarde.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "adult.noite.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "adult.noite.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "adult.noite.num_alunos_maior_turma",
          },
          {
            Header:
              this.state.geo_structure_level4_name === ""
                ? this.translate("SchoolTableClasses.tableHeaderCity")
                : this.state.geo_structure_level4_name,
            sortable: false,
            maxWidth: 60,
            accessor: "adult.integral.num_turmas",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "adult.integral.num_aluno",
          },
          {
            Header: this.translate("SchoolTableClasses.tableHeaderClasses"),
            sortable: false,
            maxWidth: 60,
            accessor: "adult.integral.num_alunos_maior_turma",
          },
        ],
      },
    ];

    return (
      <div ref="container" className="container">
        <div className="columns">
          <div className="column">
            {isHaveCityInUser(this.props.accounts.user) ? (
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
                    {parse(
                      this.translate("SchoolsTable.btnDownloadSchoolList")
                    )}
                  </button>
                </p>
              </div>
            ) : (
              <div className={classnames(styles.msg_non_city)}></div>
            )}
          </div>
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

        {/* <SchoolTableSize
          apiData={this.props.apiData}
          fetchSchools={this.props.fetchSchools}
        /> */}
        <div>
          <ReactTable
            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
            data={tableData}
            pages={pages} // Display the total number of pages
            loading={this.state.loading} // Display the loading overlay when we need it
            // onFetchData={this.fetchData} // Request new data when things change
            defaultPageSize={50}
            multiSort={false}
            filterable={false}
            columns={columns}
            className="-striped -highlight"
            style={{
              height: "500px", // This will force the table body to overflow and scroll, since there is not enough room
            }}
          />
          <div>{parse(this.translate("SchoolTableClasses.AMTObs"))}</div>
        </div>
      </div>
    );
  }

  _queryAnswersSubmit(e) {
    e.preventDefault();

    // this.props.fetchSchools({
    //   q: e.currentTarget.querySelector("input").value,
    // });
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
