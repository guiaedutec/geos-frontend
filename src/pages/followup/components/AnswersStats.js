import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import CirclePie from "../../../components/Chart/CirclePie";
import styles from "../followup.styl";
import { FormattedHTMLMessage, injectIntl } from "react-intl";
import parse from "html-react-parser";

class AnswersStats extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }
  render() {
    return (
      <div
        className={classnames("column", styles.followup_stats__answers_stat)}
      >
        <div className={classnames("columns", styles.followup__info)}>
          <div
            className={classnames(
              "column",
              styles.followup__info,
              styles.followup__info__sample
            )}
          >
            <span className="title is-5">{this.props.title}</span>
          </div>
          <div className={classnames("column", styles.followup__info_number)}>
            <span className="title">
              {this.props.count} / {this.props.total}
            </span>
            <p>{parse(this.translate("FollowUp.total"))}</p>
          </div>
          <div className={classnames("column", styles.followup__info_number)}>
            <CirclePie
              strokeColor={"#85c440"}
              percent={
                isNaN(this.props.percent) ? 0 : Number(this.props.percent)
              }
              width={80}
              height={80}
              railColor={"#D0D1D3"}
            />
            <p>{parse(this.translate("FollowUp.answers"))}</p>
          </div>
        </div>
      </div>
    );
  }
}

AnswersStats.propTypes = {
  title: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  circlePieColor: PropTypes.string,
};

export default injectIntl(AnswersStats);
