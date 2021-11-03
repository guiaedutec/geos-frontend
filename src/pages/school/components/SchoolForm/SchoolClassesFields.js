import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

// Components
import stylesField from "~/components/Form/Field.styl";
import Field from "~/components/Form/Field";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import styles from "../../school.styl";

class SchollFormSchoolClassesFields extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    const { title, manha, tarde, noite, integral } = this.props;

    return (
      <tbody>
        <tr>
          <td className="has-text-weight-bold" rowSpan="4">
            {title}
          </td>
          <td>{parse(this.translate("InfraStructureFormModal.morning"))}</td>
          <td>
            <Field classField="slim-max" type="number" {...manha.num_turmas} />
          </td>
          <td>
            <Field classField="slim-max" type="number" {...manha.num_aluno} />
          </td>
          <td>
            <Field
              classField="slim-max"
              type="number"
              {...manha.num_alunos_maior_turma}
            />
          </td>
        </tr>
        <tr>
          <td>{parse(this.translate("InfraStructureFormModal.afternoon"))}</td>
          <td>
            <Field classField="slim-max" type="number" {...tarde.num_turmas} />
          </td>
          <td>
            <Field classField="slim-max" type="number" {...tarde.num_aluno} />
          </td>
          <td>
            <Field
              classField="slim-max"
              type="number"
              {...tarde.num_alunos_maior_turma}
            />
          </td>
        </tr>
        <tr>
          <td>{parse(this.translate("InfraStructureFormModal.night"))}</td>
          <td>
            <Field classField="slim-max" type="number" {...noite.num_turmas} />
          </td>
          <td>
            <Field classField="slim-max" type="number" {...noite.num_aluno} />
          </td>
          <td>
            <Field
              classField="slim-max"
              type="number"
              {...noite.num_alunos_maior_turma}
            />
          </td>
        </tr>
        <tr>
          <td>{parse(this.translate("InfraStructureFormModal.integral"))}</td>
          <td>
            <Field
              classField="slim-max"
              type="number"
              {...integral.num_turmas}
            />
          </td>
          <td>
            <Field
              classField="slim-max"
              type="number"
              {...integral.num_aluno}
            />
          </td>
          <td>
            <Field
              classField="slim-max"
              type="number"
              {...integral.num_alunos_maior_turma}
            />
          </td>
        </tr>
      </tbody>
    );
  }
}

SchollFormSchoolClassesFields.propTypes = {
  title: PropTypes.string.isRequired,
  manha: PropTypes.object.isRequired,
  tarde: PropTypes.object.isRequired,
  noite: PropTypes.object.isRequired,
  integral: PropTypes.object.isRequired,
};

export default injectIntl(SchollFormSchoolClassesFields);
