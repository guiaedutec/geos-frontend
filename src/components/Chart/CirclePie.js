import React, { Component } from "react";
import PropTypes from "prop-types";

import Chart from "./Chart";

export default class CirclePie extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    strokeWidth: PropTypes.number,
    strokeColor: PropTypes.string,
    fillColor: PropTypes.string,
    startAngle: PropTypes.number,
    endAngle: PropTypes.number,
    radius: PropTypes.number,
  };

  static defaultProps = {
    width: 150,
    height: 150,
    border: "none",
    strokeWidth: 10,
    labelColor: "#111111",
    labelFontSize: "18px",
    strokeColor: "#408AE5",
    railColor: "#f5f5f5",
    fillColor: "none",
    percent: 70,
    padding: 0,
  };

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  describeArc(x, y, radius, startAngle, endAngle) {
    if (!x || !y) console.error("x or y missing to describeArc");

    let start = this.polarToCartesian(x, y, radius, endAngle),
      end = this.polarToCartesian(x, y, radius, startAngle),
      arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      arcSweep,
      0,
      end.x,
      end.y,
    ].join(" ");
  }

  render() {
    let radius =
        this.props.width / 2 - this.props.strokeWidth / 2 - this.props.padding,
      center = radius + this.props.strokeWidth / 2 + this.props.padding,
      startAngle = 0,
      endAngle =
        this.props.percent <= 100 ? 3.5999 * this.props.percent : 359.99,
      arc = this.describeArc(center, center, radius, startAngle, endAngle),
      xTextCenter;

    switch (parseInt(this.props.percent).toString().length) {
      case 1:
        xTextCenter = center;
        break;
      case 2:
        xTextCenter = center - 8;
        break;
      case 3:
        xTextCenter = center - 12;
        break;
    }

    return (
      <Chart
        width={this.props.width}
        height={this.props.height}
        border={this.props.border}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill={this.props.fillColor}
          stroke={this.props.railColor}
          strokeWidth={this.props.strokeWidth}
        />
        <path
          fill={this.props.fillColor}
          stroke={this.props.strokeColor}
          strokeWidth={this.props.strokeWidth}
          d={arc}
        />
        <text
          x={xTextCenter}
          y={center}
          dx="-.5em"
          dy=".4em"
          fill={this.props.labelColor}
          fontSize={this.props.labelFontSize}
        >
          {`${this.props.percent}%`}
        </text>
      </Chart>
    );
  }
}
