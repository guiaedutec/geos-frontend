import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import classnames from "classnames";
import tableStyles from "./AnswersTable.styl";
import APIDataContainer from "~/containers/api_data";
import Select from "react-select";
import _ from "lodash";
import { FormattedHTMLMessage, injectIntl } from "react-intl";
import parse from "html-react-parser";

class AnswersTableFilterField extends React.Component {
  _onChange(options) {
    const values = _.isArray(options)
      ? options.map((option) => option.value)
      : [options && options.value];

    this.props.fetchSurveyAnswers(
      {
        filters: {
          [this.props.name]: values,
        },
      },
      this.props.apiData.surveyAnswersFetchParams
    );
    return true;
  }
  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    const {
      name,
      isMulti,
      isClearable,
      options,
      apiData: { surveyAnswersFetchParams },
    } = this.props;
    const values = _.map(surveyAnswersFetchParams.filters[name], (value) => {
      return _.find(options, { value });
    });

    return (
      <div className="column">
        <label
          className={classnames(
            "control-label",
            tableStyles.table__filter_field
          )}
        >
          {this.props.label}
        </label>
        <p className="control">
          <Select
            name={`filter-${this.props.name}`}
            options={options}
            placeholder={this.translate("FollowUp.placeholderSelect")}
            // value={!isMulti ? _.get(values, "[0]") : values}
            onChange={this.props.onChange}
            isClearable={isClearable}
            {...this.props}
          />
        </p>
      </div>
    );
  }
}

AnswersTableFilterField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  multiple: PropTypes.bool,
  fetchSurveyAnswers: PropTypes.func,
  apiData: PropTypes.object,
};

export default injectIntl(compose(APIDataContainer)(AnswersTableFilterField));
