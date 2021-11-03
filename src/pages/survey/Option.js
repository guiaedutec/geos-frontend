import React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import Layout from "../../components/Layout";
import styles from "./styles.styl";
import axios from "axios";
import $ from "jquery";
import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminDirectorOrTeacherRedir from "~/containers/non_admin_director_teacher_redir";

import {
  getUserToken,
  setUserToken,
  removeUserToken,
  createUrlWithParams,
} from "~/api/utils";

import CONF from "~/api/index";
import Form from "./Form";

class Option extends React.Component {
  unselectAll(question, e) {
    if (question.option.weight <= 0) {
      if (question.option.text_piece) {
        $("#" + question.idQuestion)
          .find("input[type='checkbox']")
          .each(function () {
            if (
              $(this).data("piece").toLowerCase() ==
              question.option.text_piece.toLowerCase()
            ) {
              if ($(this).data("weight") > 0) {
                $(this).prop("checked", false);
                question.handleCheckbox({
                  question: `${question.idQuestion}`,
                  option: $(this).attr("id"),
                  checked: e.target.checked,
                  weight: $(this).attr("weight"),
                });
              }
            }
          });
        return { optionUnselectAll: false };
      } else {
        $("#" + question.idQuestion)
          .find("input[type='checkbox']")
          .each(function () {
            if ($(this).data("weight") > 0) {
              $(this).prop("checked", false);
              question.handleCheckbox({
                question: `${question.idQuestion}`,
                option: $(this).attr("id"),
                checked: false,
                weight: $(this).attr("weight"),
              });
            }
          });
        return { optionUnselectAll: false };
      }
    } else {
      if (question.option.text_piece) {
        $("#" + question.idQuestion)
          .find(
            "input[type='checkbox'][data-weight='0'][data-piece='" +
              question.option.text_piece.toLowerCase() +
              "']"
          )
          .each(function () {
            $(this).prop("checked", false);
            question.handleCheckbox({
              question: `${question.idQuestion}`,
              option: $(this).attr("id"),
              checked: false,
              weight: 0,
            });
          });

        return { optionUnselectAll: false };
      } else {
        let option;
        $("#" + question.idQuestion)
          .find("input[type='checkbox'][data-weight='0']")
          .each(function () {
            $(this).prop("checked", false);
            option = $(this).attr("id");

            question.handleCheckbox({
              question: `${question.idQuestion}`,
              option: $(this).attr("id"),
              checked: false,
              weight: 0,
              optionUnselectAll: true,
            });
          });
        console.log(option);
        return { optionUnselectAll: true, option };
      }
    }
  }

  changeChildValues(question) {
    if (question.option.weight <= 0) {
      $("#" + question.idQuestion)
        .next()
        .find("input")
        .each(function () {
          if ($("#" + question.option.id).prop("checked")) {
            $(this).prop("disabled", true);
          } else {
            $(this).prop("disabled", false);
          }

          if ($(this).data("weight") <= 0) {
            $(this).prop("checked", true);
          } else {
            $(this).prop("checked", false);
          }
        });
    } else {
      $("#" + question.idQuestion)
        .next()
        .find("input")
        .each(function () {
          $(this).prop("disabled", false);
        });
    }
  }

  proxyFunction(e) {
    const checked = e.target.checked;

    if (this.props.hasChild) {
      this.changeChildValues(this.props);
    }

    if (this.props.type === "checkbox") {
      const response = this.unselectAll(this.props, e);

      this.props.handleCheckbox({
        question: `${this.props.idQuestion}`,
        option: `${this.props.option.id}`,
        checked: checked,
        weight: this.props.option.weight,
        type: this.props.type,
      });
    } else if (this.props.type === "radio") {
      this.props.handleInputRadio({
        question: `${this.props.idQuestion}`,
        option: `${this.props.option.id}`,
        checked: checked,
        weight: this.props.option.weight,
        type: this.props.type,
      });
    } else {
      return;
    }
  }

  render() {
    return (
      <div className={styles.question__option}>
        <label className={classnames(styles.label__radio, this.props.type)}>
          <input
            type={this.props.type}
            name={this.props.idQuestion}
            data-weight={this.props.option.weight}
            data-piece={
              this.props.option.text_piece &&
              this.props.option.text_piece.toLowerCase()
            }
            id={this.props.option.id}
            // id={"text" !== this.props.type ? this.props.option.id : ""}
            onClick={this.proxyFunction.bind(this)}
            // value={"text" !== this.props.type ? this.props.option.id : ""}
            value={this.props.option.id}
            ref={this.props.option.id}
            className={"table" !== this.props.type ? "" : styles.input_txt}
            defaultChecked={
              this.props.idQuestion in this.props.userResponses &&
              ((this.props.userResponses[this.props.idQuestion].length === 0 &&
                this.props.userResponses[this.props.idQuestion] ===
                  "" + this.props.option.id) ||
                this.props.userResponses[this.props.idQuestion].includes(
                  "" + this.props.option.id
                ))
            }
            disabled={this.props.disableOptions}
          />
          &nbsp;
          <div
            className={styles.div_html}
            dangerouslySetInnerHTML={{ __html: this.props.option.value }}
          />
        </label>
      </div>
    );
  }
}
export default (APIDataContainer, NonUserRedir, NonAdminDirectorOrTeacherRedir)(
  Option
);
