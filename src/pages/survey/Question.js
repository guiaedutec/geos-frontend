import React from "react";
import { isDirector } from "~/helpers/users";
import Option from "./Option";
import classNames from "classnames";
import styles from "./styles.styl";

const Question = ({
  surveyId,
  user,
  elThis,
  question,
  questions,
  userResponses,
  handleCheckbox,
  handleInputText,
  handleInputRadio,
  labelDirectorOne,
  labelDirectorTwo,
  labelMandatory
}) => (
  <div>
    {!isDirector(user) && question.only_principal ? (
      <div className={styles.instruction_question_disabled}>
        {labelDirectorOne}{" "}
        {question.name ? (
          <strong
            dangerouslySetInnerHTML={{
              __html: question.name,
            }}
          ></strong>
        ) : null}{" "}
        {labelDirectorTwo}
      </div>
    ) : (
      <div>
        {!question.compound ? (
          <div>
            <div className={styles.question__title}>
              <div className={styles.question_title}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: question.question_order,
                  }}
                />

                <div>
                  <p
                    className={styles.bold}
                    dangerouslySetInnerHTML={{
                      __html: question.name,
                    }}
                  />

                  <div className={styles.question__obs}>
                    {labelMandatory}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.question__options}>
              {question.survey_question_description
                .filter(
                  (question) =>
                    question.id !== 888 &&
                    question.id !== 777 &&
                    question.id !== 999
                )
                .map((option) => (
                  <div key={option.id}>
                    <Option
                      elThis={elThis}
                      option={option}
                      type={question.type}
                      hasChild={question.has_child ? question.has_child : false}
                      idQuestion={question._id.$oid}
                      userResponses={userResponses}
                      disableOptions={
                        elThis.state.disableOptions
                          ? elThis.state.disableOptions
                          : false
                      }
                      handleCheckbox={handleCheckbox}
                      handleInputRadio={handleInputRadio}
                    />
                  </div>
                ))}
            </div>
          </div>
        ) : null}

        {question.compound ? (
          <div className="field">
            <label className={classNames("label", styles.text__label)}>
              {
                question.survey_question_description.filter(
                  (question) =>
                    question.id !== 888 &&
                    question.id !== 777 &&
                    question.id !== 999
                )[0].value
              }
            </label>

            <div className="control">
              <input
                id={question._id.$oid}
                className="input"
                type={
                  question.type === "pc" || question.type === "table"
                    ? "number"
                    : question.type
                }
                name={question._id.$oid}
                data-type={question.survey_question_description
                  .filter(
                    (question) =>
                      question.id !== 888 &&
                      question.id !== 777 &&
                      question.id !== 999
                  )[0]
                  .value.toLowerCase()
                  .replace(/-/g, "")}
                defaultValue={
                  question._id.$oid in userResponses
                    ? userResponses[question._id.$oid]
                    : null
                }
                onChange={(e) => handleInputText(e, question)}
              />
            </div>
          </div>
        ) : null}
      </div>
    )}
  </div>
);

export default Question;
