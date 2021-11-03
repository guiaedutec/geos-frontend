import React from "react";
import PropTypes from "prop-types";

class CustomizedLabelGeral extends React.Component {
  render() {
    const { x, y, fill, value, width } = this.props;
    return (
      <text
        x={width / 2 + x}
        y={y}
        dy={-10}
        fontSize="38"
        fontFamily="sans-serif"
        fill={fill}
        textAnchor="middle"
      >
        {value}%
      </text>
    );
  }
}

CustomizedLabelGeral.propTypes = {
  value: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  fill: PropTypes.string,
  width: PropTypes.number,
};

export default CustomizedLabelGeral;
