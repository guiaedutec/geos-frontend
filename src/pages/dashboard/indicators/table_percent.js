import React from 'react';
import styles from './styles.styl';
import classNames from 'classnames';
import moment from "moment";

class TablePercent extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className={styles.is__responsive}>
        <h1>Geral</h1>
        <table className={classNames('table is-bordered is-striped is-narrow is-hoverable is-fullwidth', styles.table)}>
          <thead>
            <tr className="is-selected">
              <th></th>
              <th>Visão</th>
              <th>Competência</th>
              <th>Recursos Educacionais Digitais</th>
              <th>Infraestrutura</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Avançado</strong></td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["vision"][3]).toFixed(1) }%</td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["competence"][3]).toFixed(1)}%</td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["resource"][3]).toFixed(1)}%</td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["infra"][3]).toFixed(1)}%</td>
            </tr>
            <tr>
              <td><strong>Intermeediário</strong></td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["vision"][2]).toFixed(1) }%</td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["competence"][2]).toFixed(1) }%</td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["resource"][2]).toFixed(1) }%</td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["infra"][2]).toFixed(1) }%</td>
            </tr>
            <tr>
              <td><strong>Básico</strong></td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["vision"][1]).toFixed(1) }%</td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["competence"][1]).toFixed(1) }%</td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["resource"][1]).toFixed(1)}%</td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["infra"][1]).toFixed(1)}%</td>
            </tr>
            <tr>
              <td><strong>Emergente</strong></td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["vision"][0]).toFixed(1)}%</td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["competence"][0]).toFixed(1)}%</td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["resource"][0]).toFixed(1)}%</td>
              <td>{ parseFloat(100*this.props.data_percent["geral"]["infra"][0]).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>

        <h1>Estadual</h1>
        <table className={classNames('table is-bordered is-striped is-narrow is-hoverable is-fullwidth', styles.table)}>
          <thead>
          <tr className="is-selected">
            <th></th>
            <th>Visão</th>
            <th>Competência</th>
            <th>Recursos Educacionais Digitais</th>
            <th>Infraestrutura</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><strong>Avançado</strong></td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["vision"][3]).toFixed(1) }%</td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["competence"][3]).toFixed(1)}%</td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["resource"][3]).toFixed(1)}%</td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["infra"][3]).toFixed(1)}%</td>
          </tr>
          <tr>
            <td><strong>Intermeediário</strong></td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["vision"][2]).toFixed(1) }%</td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["competence"][2]).toFixed(1) }%</td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["resource"][2]).toFixed(1) }%</td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["infra"][2]).toFixed(1) }%</td>
          </tr>
          <tr>
            <td><strong>Básico</strong></td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["vision"][1]).toFixed(1) }%</td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["competence"][1]).toFixed(1) }%</td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["resource"][1]).toFixed(1)}%</td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["infra"][1]).toFixed(1)}%</td>
          </tr>
          <tr>
            <td><strong>Emergente</strong></td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["vision"][0]).toFixed(1)}%</td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["competence"][0]).toFixed(1)}%</td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["resource"][0]).toFixed(1)}%</td>
            <td>{ parseFloat(100*this.props.data_percent["estadual"]["infra"][0]).toFixed(1)}%</td>
          </tr>
          </tbody>
        </table>

        <h1>Municipal</h1>
        <table className={classNames('table is-bordered is-striped is-narrow is-hoverable is-fullwidth', styles.table)}>
          <thead>
          <tr className="is-selected">
            <th></th>
            <th>Visão</th>
            <th>Competência</th>
            <th>Recursos Educacionais Digitais</th>
            <th>Infraestrutura</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><strong>Avançado</strong></td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["vision"][3]).toFixed(1) }%</td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["competence"][3]).toFixed(1)}%</td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["resource"][3]).toFixed(1)}%</td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["infra"][3]).toFixed(1)}%</td>
          </tr>
          <tr>
            <td><strong>Intermeediário</strong></td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["vision"][2]).toFixed(1) }%</td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["competence"][2]).toFixed(1) }%</td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["resource"][2]).toFixed(1) }%</td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["infra"][2]).toFixed(1) }%</td>
          </tr>
          <tr>
            <td><strong>Básico</strong></td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["vision"][1]).toFixed(1) }%</td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["competence"][1]).toFixed(1) }%</td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["resource"][1]).toFixed(1)}%</td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["infra"][1]).toFixed(1)}%</td>
          </tr>
          <tr>
            <td><strong>Emergente</strong></td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["vision"][0]).toFixed(1)}%</td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["competence"][0]).toFixed(1)}%</td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["resource"][0]).toFixed(1)}%</td>
            <td>{ parseFloat(100*this.props.data_percent["municipal"]["infra"][0]).toFixed(1)}%</td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
export default TablePercent;
