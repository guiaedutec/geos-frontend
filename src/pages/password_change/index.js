import React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import { compose } from "redux";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import styles from "~/pages/signup/signup.styl";
import Layout from "../../components/Layout";
import Body from "../../components/Body";
import PasswordChangeForm from "./components/PasswordChangeForm";
import AccountsContainer from "~/containers/accounts";
import NonUserRedir from "~/containers/non_user_redir";

class PasswordChange extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    return (
      <Layout
        className={styles.layout}
        pageHeader={this.translate("PasswordChange.pageHeader")}
      >
        <Helmet title={this.translate("PasswordChange.titleHelmet")} />
        <Body className="container">
          <section className={classnames("section columns", styles.section)}>
            <div className="column is-half">
              <div
                className={classnames(
                  "title is-5 mb-15",
                  styles.header__holder
                )}
              >
                {parse(this.translate("PasswordChange.title"))}
              </div>
              <p>
                {parse(this.translate("PasswordChange.description"))}{" "}
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
              <PasswordChangeForm />
            </div>
          </section>
        </Body>
      </Layout>
    );
  }
}

export default injectIntl(
  compose(AccountsContainer, NonUserRedir)(PasswordChange)
);
