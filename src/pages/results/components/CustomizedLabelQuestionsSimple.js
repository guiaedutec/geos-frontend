import React from "react";
import PropTypes from "prop-types";

class CustomizedLabelQuestionsSimple extends React.Component {
  render() {
    const { x, y, width, fill, height, payload } = this.props;
    return (
      <text width={width} height={height} x={x} y={y} stroke="none" fill={fill}>
        <tspan
          x={
            payload.value === 0
              ? x - 5
              : payload.value === 100
              ? x - 15
              : x - 10
          }
          dy="0.75em"
        >
          {payload.value}%
        </tspan>
      </text>
    );
  }
}

CustomizedLabelQuestionsSimple.propTypes = {};

export default CustomizedLabelQuestionsSimple;
