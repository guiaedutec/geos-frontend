import React from "react";
import Layout from "../../components/Layout";
import Body from "../../components/Body";
import Helmet from "react-helmet";
import styles from "~/pages/signup/signup.styl";
import classnames from "classnames";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import PasswordForgotForm from "./components/PasswordForgotForm";

class PasswordForgot extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    return (
      <Layout
        className={styles.layout}
        pageHeader={this.translate("PasswordForgot.pageHeader")}
      >
        <Helmet title={this.translate("PasswordForgot.titleHelmet")} />
        <Body className="container">
          <section className={classnames("section columns", styles.section)}>
            <div className="column is-half">
              <div className={classnames("title is-5 mb-15", styles.header__holder)}>
                {parse(this.translate("PasswordForgot.title"))}
              </div>
              <p>
                {parse(this.translate("PasswordForgot.description"))}
              </p>
            </div>
            <div className="column is-half">
              <PasswordForgotForm />
            </div>
          </section>
        </Body>
      </Layout>
    );
  }
}

export default injectIntl(PasswordForgot);
