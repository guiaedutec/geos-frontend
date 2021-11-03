import _ from "lodash";
import React from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import APIDataContainer from "~/containers/api_data";

let params = new URLSearchParams(document.location.search.substring(1));
let locale = params.get("lang") || process.env.DEFAULT_LOCALE;

class DropdownLanguage extends React.Component {
  componentDidMount() {
    const {
      apiData: { languages },
    } = this.props;

    if (_.isEmpty(languages)) {
      this.props.fetchLanguages();
    }
  }

  handleSetLangClick = (lang) => localStorage.setItem("lang", lang);

  setUrl = (lang) => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    return url.search;
  };

  render() {
    const {
      apiData: { languages },
      direction,
    } = this.props;
    const lang = localStorage.getItem("lang") || locale;
    const selectedLang = languages.find((l) => l.lang === lang) || {};

    return (
      <div
        className={classnames(
          "dropdown is-hoverable is-uppercase",
          direction == undefined ? `is-right` : `is-${direction}`
        )}
        style={{ marginLeft: "10px" }}
      >
        {lang && (
          <div className="dropdown-trigger">
            <div
              className={classnames(
                direction == undefined
                  ? `has-text-right`
                  : `has-text-${direction}`
              )}
              aria-haspopup="true"
              aria-controls="dropdown-menu"
            >
              {selectedLang.lang}
              <i
                className="fas fa-chevron-down ml-10"
                style={{ fontSize: "0.8em" }}
              ></i>
            </div>
          </div>
        )}
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div
            className={classnames(
              "dropdown-content",
              direction == undefined
                ? `has-text-right`
                : `has-text-${direction}`
            )}
          >
            {languages.map((l) => (
              <div className="dropdown-item" key={l.lang}>
                <a
                  href={this.setUrl(l.lang)}
                  onClick={() => this.handleSetLangClick(l.lang)}
                  title={l.description}
                >
                  {l.lang}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

DropdownLanguage.propTypes = {
  direction: PropTypes.string,
};

export default compose(APIDataContainer)(DropdownLanguage);
