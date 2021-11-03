import React from "react";
import classnames from "classnames";
import _ from "lodash";
import { FormattedMessage, injectIntl } from "react-intl";
import parse from "html-react-parser";

import { isTeacher, isDirector, isStateAdmin } from "~/helpers/users";
import styles from "./Header.styl";

class PageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModalTutorial: false,
    };
  }

  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    const { user } = this.props;
    return (
      <div className={styles.pageHeader}>
        <h1 className="is-size-3 mb-15 has-text-weight-light">
          {parse(this.translate("PageHeader.hello"))}, {user.name}!
        </h1>
        <p>
          {
            isTeacher(user) ?
              parse(this.translate("PageHeader.teacherMsg"))
            : isDirector(user) ?
              parse(this.translate("PageHeader.principalMsg"))
            : isStateAdmin(user) ?
              parse(this.translate("PageHeader.adminStateMsg"))
            : null
          }
        </p>
      </div>
    );
  }
}

export default injectIntl(PageHeader);
