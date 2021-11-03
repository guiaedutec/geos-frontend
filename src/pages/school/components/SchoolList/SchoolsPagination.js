import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import classnames from "classnames";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

class SchoolsPagination extends React.Component {
  _changePage(page) {
    this.props.fetchSchools({ page }, this.props.apiData.fetchParams);
  }

  _renderPaginationButton(itemNumber) {
    const {
      apiData: {
        fetchParams: { page },
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

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    const {
      apiData: { schools },
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
          {parse(this.translate("SchoolsTable.btnPrevious"))}
          {/* Anteriores */}
        </button>
        <button
          className={classnames("button pagination-next")}
          onClick={this.props.increasePaginationStart}
          {...(paginationStart + 10 >= schools.total_pages
            ? { disabled: true }
            : {})}
        >
          {parse(this.translate("SchoolsTable.btnNext"))}
          {/* Próximas */}
        </button>

        {schools.total_pages ? (
          <ul className="pagination-list">
            {_.times(
              schools.total_pages > 10 ? 10 : schools.total_pages,
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

SchoolsPagination.propTypes = {
  apiData: PropTypes.object,
  fetchSchools: PropTypes.func,
  paginationStart: PropTypes.number,
  increasePaginationStart: PropTypes.func,
  decreasePaginationStart: PropTypes.func,
};

export default injectIntl(SchoolsPagination);
