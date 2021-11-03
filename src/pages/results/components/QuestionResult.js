import React, { Component } from "react";
import classNames from "classnames";
import styles from "../styles.styl";
import CustomizedLabelQuestions from "./CustomizedLabelQuestions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

let color = [];

const colorsSection1 = [
  "#d9d9d9",
  "#acacac",
  "#7f7f7f",
  "#edc718",
  "#ffdd00",
  "#fffc6d",
];

const colorsSection2 = [
  "#d9d9d9",
  "#acacac",
  "#7f7f7f",
  "#d11f79",
  "#fa2a79",
  "#fd99bf",
];

const colorsSection3 = [
  "#d9d9d9",
  "#acacac",
  "#7f7f7f",
  "#007ada",
  "#00a3da",
  "#6dd9ff",
];

const colorsSection4 = [
  "#d9d9d9",
  "#acacac",
  "#7f7f7f",
  "#00c900",
  "#00fa00",
  "#7dff7d",
];

const colorsSectiondefault = [
  "#d9d9d9",
  "#acacac",
  "#7f7f7f",
  "#edc718",
  "#ffdd00",
];

const arrPageBreak = [
  "VISÃO E",
  "VISÃO H",
  "COMPETÊNCIA D",
  "COMPETÊNCIA F",
  "COMPETÊNCIA G",
  "COMPETÊNCIA J",
  "CRD B",
  "CRD E",
  "INFRA D",
  "INFRA F",
  "INFRA I",
];

const colorsPallete = {
  yellow: "#FFDD00",
  pink: "#E62270",
  blue: "#008BBC",
  green: "#85C440",
  grey: "#d1d2d4",
  greyFont: "#5b5c5d",
  darkBlue: "#131D3C",
};

export default class QuestionResult extends Component {
  render() {
    const { elThis, question, section } = this.props;

    const shadeColor = (color, percent) => {
      // obtem o RGB e fazer o parse para inteiro
      var R = parseInt(color.substring(1, 3), 16);
      var G = parseInt(color.substring(3, 5), 16);
      var B = parseInt(color.substring(5, 7), 16);

      R = parseInt((R * (100 + percent)) / 100);
      G = parseInt((G * (100 + percent)) / 100);
      B = parseInt((B * (100 + percent)) / 100);

      R = R < 255 ? R : 255;
      G = G < 255 ? G : 255;
      B = B < 255 ? B : 255;

      var RR =
        R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
      var GG =
        G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
      var BB =
        B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

      // Retorna o valor com o hash (#)
      return "#" + RR + GG + BB;
    };

    const switchColorBySection = (section, index) => {
      switch (section) {
        case 1:
          return index % 2 === 0 ? "#ffdd00" : "#edc718";
        case 2:
          return index % 2 === 0 ? "#fa2a79" : "#d11f79";
        case 3:
          return index % 2 === 0 ? "#00a3da" : "#007ada";
        case 4:
          return index % 2 === 0 ? "#00fa00" : "#00c900";
        default:
          return colorsPallete.darkBlue;
      }
    };

    return (
      <div
        className={
          arrPageBreak.includes(
            question.name
              .substr(0, question.name.indexOf("-", 0) - 1)
              .toUpperCase()
          )
            ? styles.page_break
            : null
        }
      >
        <div className={classNames(styles.question_title)}>
          <u>{question.question_order.toUpperCase()}</u>
          <br />
          <span
            className={classNames(styles.content)}
            dangerouslySetInnerHTML={{
              __html: question.name,
            }}
          />
        </div>

        <ul>
          {question.survey_question_description.map((option, index) => (
            <li
              className={classNames(styles.question_result_li)}
              key={option.id}
            >
              <div className={classNames(styles.clean_column)}>
                <div
                  style={{
                    width: `${option.percent}%`,
                    height: "100%",
                    backgroundColor: switchColorBySection(section, index),
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span className={classNames(styles.clean_column_text)}>
                    {option.percent + "%"}
                  </span>
                </div>
              </div>
              <div className={classNames(styles.question_result_text_value)}>
                {option.value}
              </div>
            </li>
          ))}
        </ul>

        {/* <div className={classNames("column", "is-one-third")}>
          <BarChart
            width={300}
            height={question.survey_question_description.length * 44 + 25}
            data={question.survey_question_description}
            margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
            layout="vertical"
            barCategoryGap={0}
          >
            <XAxis type="number" domain={[0, 100]} allowDecimals={false} hide />
            <YAxis type="category" dataKey="value" hide />
            <Tooltip />
            <Bar
              dataKey="percent"
              height={43}
              label={<CustomizedLabelQuestions />}
            >
              {(() => {
                switch (section) {
                  case 1:
                    color = colorsSection1;
                    break;
                  case 2:
                    color = colorsSection2;
                    break;
                  case 3:
                    color = colorsSection3;
                    break;
                  case 4:
                    color = colorsSection4;
                    break;
                  default:
                    color = colorsSectiondefault;
                }
              })()}
              <Cell stroke={color[0]} strokeWidth={4} fill={color[0]} />
              <Cell stroke={color[1]} strokeWidth={4} fill={color[1]} />
              <Cell stroke={color[2]} strokeWidth={4} fill={color[2]} />
              <Cell stroke={color[3]} strokeWidth={4} fill={color[3]} />
              <Cell stroke={color[4]} strokeWidth={4} fill={color[4]} />
              <Cell stroke={color[5]} strokeWidth={4} fill={color[5]} />
              <Cell stroke={color[5]} strokeWidth={4} fill="#ffffff" />
              <Cell stroke={color[4]} strokeWidth={4} fill="#ffffff" />
              <Cell stroke={color[3]} strokeWidth={4} fill="#ffffff" />
              <Cell stroke={color[2]} strokeWidth={4} fill="#ffffff" />
              <Cell stroke={color[1]} strokeWidth={4} fill="#ffffff" />
              <Cell stroke={color[0]} strokeWidth={4} fill="#ffffff" />
            </Bar>
          </BarChart>
        </div>
        */}
        {/* <div className={classNames("columns", styles.columns_board)}>
          <div className={classNames(styles.div_questions)}>
            <table className={classNames(styles.table_questions)}>
              <tbody>
                {question.survey_question_description.map((option) => (
                  <tr key={option.id}>
                    <td className={classNames(styles.clean_column)}></td>
                    <td>{option.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        */}

        <br />
      </div>
    );
  }
}
