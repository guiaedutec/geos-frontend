import React from "react";
import classnames from "classnames";
import { compose } from "redux";

import AnswersStats from "../components/AnswersStats";
import { FormattedHTMLMessage, injectIntl } from "react-intl";
import parse from "html-react-parser";
// styles
import styles from "./GraphsData.styl";

class GraphsData extends React.Component {
  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    const { surveyAnswers } = this.props;
    return (
      <div
        className={classnames("column", styles.graphs_data_stats__container)}
      >
        <AnswersStats
          title={this.translate("FollowUp.sample")}
          count={surveyAnswers.answered_sample}
          total={surveyAnswers.total_sample}
          percent={Number(
            (100 * surveyAnswers.answered_sample) / surveyAnswers.total_sample
          ).toFixed(1)}
        />
        <AnswersStats
          title={this.translate("FollowUp.universe")}
          count={surveyAnswers.answered_count}
          total={surveyAnswers.total_count}
          percent={Number(
            (100 * surveyAnswers.answered_count) / surveyAnswers.total_count
          ).toFixed(1)}
        />
      </div>
    );
  }
}

export default injectIntl(compose()(GraphsData));
