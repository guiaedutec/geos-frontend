import React from "react";
import PropTypes from "prop-types";

class CustomizedLabelQuestions extends React.Component {
  render() {
    const { y, value, height } = this.props;
    return (
      <text
        x={27}
        y={y + height / 2 + 6}
        fontSize="18"
        fontFamily="sans-serif"
        fontWeight="700"
        fill="#131D3C"
      >
        {value}%
      </text>
    );
  }
}

CustomizedLabelQuestions.propTypes = {
  value: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  fill: PropTypes.string,
  height: PropTypes.number,
};

export default CustomizedLabelQuestions;
