import React from "react";
import Layout from "../../components/Layout";
import Body from "../../components/Body";
import Helmet from "react-helmet";
import styles from "~/pages/signup/signup.styl";
import classnames from "classnames";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import PasswordResetForm from "./components/PasswordResetForm";

class PasswordReset extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    return (
      <Layout
        className={styles.layout}
        pageHeader={parse(this.translate("PasswordReset.titleHelmet"))}
      >
        <Helmet title={parse(this.translate("PasswordReset.titleHelmet"))} />
        <Body className="container">
          <section className={classnames("section columns", styles.section)}>
            <div className="column is-half">
              <div
                className={classnames(
                  "title is-5 mb-15",
                  styles.header__holder
                )}
              >
                {parse(this.translate("PasswordReset.title"))}
              </div>
              <p>
                {parse(this.translate("PasswordReset.description"))}{" "}
                <a
                  href={`mailto: ${parse(
                    this.translate("StaticLinks.mainEmail")
                  )}`}
                >
                  {parse(this.translate("StaticLinks.mainEmail"))}
                </a>
              </p>
            </div>
            <div className="column is-half">
              <PasswordResetForm />
            </div>
          </section>
        </Body>
      </Layout>
    );
  }
}

export default injectIntl(PasswordReset);
