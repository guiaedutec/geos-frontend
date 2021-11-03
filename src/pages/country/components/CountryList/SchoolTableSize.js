import React from "react";
import PropTypes from "prop-types";
import styles from "../../schools.styl";
import _ from "lodash";
import classNames from "classnames";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

class SchoolTableSize extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }
  render() {
    const {
      apiData: { schools },
    } = this.props;

    return (
      <div className={classNames("has-text-centered", styles.total_schools)}>
        {parse(this.translate("SchoolsTable.totalSchools"))}{" "}
        <span className={styles.number}>{schools.total_count}</span>
      </div>
    );
  }
}

SchoolTableSize.propTypes = {
  apiData: PropTypes.object,
  fetchSchools: PropTypes.func,
};

export default injectIntl(SchoolTableSize);
