import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import classnames from "classnames";
import { FormattedHTMLMessage, injectIntl } from "react-intl";
import parse from "html-react-parser";

class AnswersPagination extends React.Component {
  _changePage(page) {
    this.props.fetchSurveyAnswers(
      { page },
      this.props.apiData.surveyAnswersFetchParams
    );
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  _renderPaginationButton(itemNumber) {
    const {
      apiData: {
        surveyAnswersFetchParams: { page },
      },
    } = this.props;
    return (
      <li key={itemNumber}>
        <a
          className={classnames("pagination-link", {
            "is-current": itemNumber === page,
          })}
          onClick={this._changePage.bind(this, itemNumber)}
          aria-label={"Goto page " + itemNumber}
        >
          {itemNumber}
        </a>
      </li>
    );
  }

  render() {
    const {
      apiData: { surveyAnswers },
      paginationStart,
    } = this.props;

    return (
      <nav
        className="pagination is-centered"
        role="navigation"
        aria-label="pagination"
      >
        <button
          className={classnames("button pagination-previous")}
          onClick={this.props.decreasePaginationStart}
          {...(paginationStart < 1 ? { disabled: true } : {})}
        >
          {parse(this.translate("FollowUp.btnBack"))}
          {/* Anteriores */}
        </button>
        <button
          className={classnames("button pagination-next")}
          onClick={this.props.increasePaginationStart}
          {...(paginationStart + 10 >= surveyAnswers.total_pages
            ? { disabled: true }
            : {})}
        >
          {parse(this.translate("FollowUp.btnNext"))}
        </button>

        {surveyAnswers.total_pages ? (
          <ul className="pagination-list">
            {_.times(
              surveyAnswers.total_pages > 10 ? 10 : surveyAnswers.total_pages,
              (page) => {
                const itemNumber = page + 1 + paginationStart;

                return this._renderPaginationButton(itemNumber);
              }
            )}
          </ul>
        ) : null}
      </nav>
    );
  }
}

AnswersPagination.propTypes = {
  apiData: PropTypes.object,
  fetchSurveyAnswers: PropTypes.func,
  paginationStart: PropTypes.number,
  increasePaginationStart: PropTypes.func,
  decreasePaginationStart: PropTypes.func,
};

export default injectIntl(AnswersPagination);
