import React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import parse from "html-react-parser";
import styles from "./home.styl";
import Layout from "../../components/Layout";
import Body from "../../components/Body";
import Dashboard from "../../components/Dashboard";
import Profile from "./components/Profile";
import DropdownLanguage from "../../components/Header/DropdownLanguage";
import CONF from "~/api/index";
import history from "~/core/history";
import axios from "axios";
import LogoGuiaEdutec from "../../components/LogoGuiaEdutec";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      setupIsDone: true,
    };
  }
  async fetchSetupData() {
    const URL_REQUEST = CONF.ApiURL + "/api/v1/setup/";
    const response = await axios.get(URL_REQUEST);
    const { setupIsDone } = response.data.data;
    this.setState({ setupIsDone });
    return setupIsDone;
  }

  async componentDidMount() {
    const setupIsDone = await this.fetchSetupData();
    if (!setupIsDone) {
      history.push("/init-setup");
    }
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }
  render() {
    return (
      <div className={styles.site}>
        {this.state.setupIsDone && (
          <Layout>
            <Helmet title="Guia EduTec" />
            <Body>
              <section className="section">
                <div className={classnames(styles.site__content, "container")}>
                  <div
                    className={classnames(
                      "columns is-multiline",
                      styles.initial
                    )}
                  >
                    {
                      parse(this.translate("Home.title")) != " " &&
                        <p>{parse(this.translate("Home.title"))}</p>
                    }                    
                    <LogoGuiaEdutec bgDark={true} />
                  </div>
                  <div className="column is-full">
                    <h3
                      className="has-text-weight-bold is-size-6"
                      style={{ marginBottom: "20px" }}
                    >
                      {parse(this.translate("Home.description"))}
                    </h3>
                  </div>
                  <Profile />
                </div>
              </section>

              <section className={styles.what_is}>
                <div className={classnames(styles.site__content, "container")}>
                  <div className={styles.content}>
                    <div className="columns">
                      <div className="column is-three-fifths">
                        <h4 className="is-size-3 mb-30">
                          {parse(this.translate("Home.whatIsTitle"))}
                        </h4>
                        <p>{parse(this.translate("Home.whatIsEdutecGuide"))}</p>
                      </div>
                      <div className="column is-two-fifths">
                        <div className={styles.icon}>
                          <img
                            src={require("../../../public/images/icons/rede-icon.svg")}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className={classnames(styles.site__content, "container")}>
                  <section className={styles.home__dashboard}>
                    <div className="columns">
                      <div className="column is-full has-text-centered">
                        <h4 className={classnames("is-size-4", styles.strip)}>
                          {parse(this.translate("Home.edutecGuideInNumbers"))}
                        </h4>
                      </div>
                    </div>
                    <Dashboard />
                  </section>
                </div>
              </section>
            </Body>
          </Layout>
        )}
      </div>
    );
  }
}

export default injectIntl(Home);
