import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import classnames from "classnames";

class SchoolsPagination extends React.Component {
  _changePage(page) {
    this.props.fetchManagers({ page }, this.props.apiData.fetchParams);
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

  render() {
    const {
      apiData: { managers },
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
          Anteriores
        </button>
        <button
          className={classnames("button pagination-next")}
          onClick={this.props.increasePaginationStart}
          {...(paginationStart + 10 >= managers.total_pages
            ? { disabled: true }
            : {})}
        >
          Próximas
        </button>

        {managers.total_pages ? (
          <ul className="pagination-list">
            {_.times(
              managers.total_pages > 10 ? 10 : managers.total_pages,
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
  fetchManagers: PropTypes.func,
  paginationStart: PropTypes.number,
  increasePaginationStart: PropTypes.func,
  decreasePaginationStart: PropTypes.func,
};

export default SchoolsPagination;
