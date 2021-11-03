import React from "react";
import styles from "./styles.styl";
import classNames from "classnames";

class Table extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {
          <table
            className={classNames(
              "table is-bordered is-narrow is-hoverable is-fullwidth",
              styles.table
            )}
          >
            <thead>
              <tr>
                <th>Escola</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Etapa de Ensino</th>
                <th>Área do Conhecimento</th>
              </tr>
            </thead>
            <tbody>
              {this.props.teachers.map((teacher, idx) => (
                <tr key={idx}>
                  <td>{teacher.school}</td>
                  <td>{teacher.name.toUpperCase()}</td>
                  <td>{teacher.email.toLowerCase()}</td>
                  <td>{teacher.stages && teacher.stages.join(", ")}</td>
                  <td>{teacher.knowledges && teacher.knowledges.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    );
  }
}
export default Table;
