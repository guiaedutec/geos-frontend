import React from "react";
import Helmet from "react-helmet";
import styles from "./styles.styl";
import classNames from "classnames";
import Layout from "../../../components/Layout";
import CONF from "~/api/index";
import { compose } from "redux";
import TablePercent from "./table_percent";

import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminUserRedir from "~/containers/non_admin_user_redir";
import axios from "axios";

import { getUserToken } from "~/api/utils";

export class SelfEvaluation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: [],
      results: new Array(),
      table_loaded: false,
      results_loaded: false,
    };
  }

  componentWillMount() {
    this.getLoadTable();
  }

  getLoadTable = () => {
    const _this = this;
    axios
      .get(
        CONF.ApiURL + "/api/v1/indicators_table?access_token=" + getUserToken(),
        {}
      )
      .then(function (response) {
        _this.setState({
          tables: response.data,
          table_loaded: true,
        });
        _this.getLoadResults(1);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getLoadResults = (index) => {
    const _this = this;
    if (index >= 0) {
      axios
        .get(
          CONF.ApiURL +
            "/api/v1/indicators_details/" +
            index +
            "/50?access_token=" +
            getUserToken(),
          {}
        )
        .then(function (response) {
          if (response.data.length > 0) {
            _this.getLoadResults(index + 1);
            let results = _this.state.results;
            results = results.concat(response.data);
            _this.setState({
              results: results,
              results_loaded: true,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  render() {
    return (
      <Layout pageHeader="Dados para Indicadores Institucionais">
        <Helmet title="Indicadores Institucionais" />
        <div className={classNames("container", styles.container)}>
          {this.state.table_loaded ? (
            <TablePercent data_percent={this.state.tables} />
          ) : null}
          {this.state.results_loaded ? (
            <div>
              <h1>Geral</h1>
              <table
                className={classNames(
                  "table is-bordered is-striped is-narrow is-hoverable is-fullwidth",
                  styles.table
                )}
              >
                <thead>
                  <tr className="is-selected">
                    <th></th>
                    <th>Estado</th>
                    <th>Cidade</th>
                    <th>Tipo</th>
                    <th>INEP</th>
                    <th>Nome</th>
                    <th>Visão</th>
                    <th>Competência</th>
                    <th>Recursos</th>
                    <th>Infra</th>
                    <th>Visão</th>
                    <th>Competência</th>
                    <th>Recursos</th>
                    <th>Infra</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.results.map((result, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{result.estate_name}</td>
                      <td>{result.city_name}</td>
                      <td>{result.school_type}</td>
                      <td>{result.school_inep}</td>
                      <td>{result.school_name}</td>
                      <td>{result.vision_level}</td>
                      <td>{result.competence_level}</td>
                      <td>{result.resource_level}</td>
                      <td>{result.infrastructure_level}</td>
                      <td>{result.result.vision_level.toFixed(0)}</td>
                      <td>{result.result.competence_level.toFixed(0)}</td>
                      <td>{result.result.resource_level.toFixed(0)}</td>
                      <td>{result.result.infrastructure_level.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </Layout>
    );
  }
}

export default compose(
  APIDataContainer,
  NonUserRedir,
  NonAdminUserRedir
)(SelfEvaluation);
