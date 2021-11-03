import React from "react";
import PropTypes from "prop-types";
import ReactModal from "react-modal";
import classnames from "classnames";
import $ from "jquery";

// Components
import Field from "~/components/Form/Field";
import stylesModal from "../../../../components/Modal/Modal.styl";

class OtherProfileFields extends React.Component {
  render() {
    const { fields } = this.props;

    return (
      <div>
        <Field label="Cargo" {...fields.role} />

        <Field label="Instituição" {...fields.institution} />
      </div>
    );
  }
}

OtherProfileFields.propTypes = {
  fields: PropTypes.object.isRequired,
};

export default OtherProfileFields;
