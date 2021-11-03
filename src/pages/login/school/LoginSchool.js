import React from "react";
import history from "~/core/history";
import SignInForm from "../components/SignInForm";
import AccountsContainer from "~/containers/accounts";

import { redirectDefaultPageByUser } from "~/helpers/users";
import styles from "./LoginSchool.styl";
import classNames from "classnames";
import _ from "lodash";
import Icon from "../../../components/Icon";
import Dashboard from "../../../components/Dashboard";
import { FormattedMessage, injectIntl } from "react-intl";
import parse from "html-react-parser";

export class LoginSchool extends React.Component {
  componentDidMount() {
    if (!_.isEmpty(this.props.accounts.user)) {
      history.push(redirectDefaultPageByUser(this.props.accounts.user));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.accounts.user)) {
      history.push(redirectDefaultPageByUser(nextProps.accounts.user));
    }
  }
  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    return (
      <section className="section pl-0 pr-0">
        <div
          className={classNames(
            "columns is-multiline is-marginless",
            styles.login
          )}
        >
          <div className="column is-full">
            <section className={classNames("section", styles.login__section)}>
              <div className="container">
                <div className="columns">
                  <div className="column is-5">
                    <h1 className="stripe is-size-4-touch has-text-centered-mobile">
                      <FormattedMessage
                        id="LoginSchool.schoolLoginTitle"
                        values={{
                          school: (
                            <strong>
                              {this.translate("LoginSchool.school")}
                            </strong>
                          ),
                        }}
                      />
                    </h1>
                    <Dashboard
                      type={["school"]}
                      small={true}
                      clean={true}
                      centered={false}
                    />
                  </div>
                  <div className="column is-7">
                    <SignInForm type="escola" />
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div
            className={classNames(
              "column is-full has-text-centered",
              styles.call
            )}
          >
            <h2>{parse(this.translate("LoginSchool.whatIsTitle"))}</h2>
            <p>{parse(this.translate("LoginSchool.whatIsEdutecGuide"))}</p>
            <p>{parse(this.translate("LoginSchool.moreWhatIsEdutecGuide"))}</p>
          </div>
        </div>
        <section className={classNames("section is-paddingless", styles.steps)}>
          <div className="container is-fluid is-marginless">
            <div className="columns is-multiline is-marginless">
              <div className={classNames("column is-one-third", styles.step)}>
                <h1>1</h1>
                <h2>
                  {parse(this.translate("LoginSchool.questionsToSchoolTitle"))}
                </h2>
                <p>
                  {parse(
                    this.translate("LoginSchool.questionsToSchoolDescription")
                  )}
                </p>
              </div>
              <div className={classNames("column is-one-third", styles.step)}>
                <h1>2</h1>
                <h2>
                  {" "}
                  {parse(this.translate("LoginSchool.returnToSchoolTitle"))}
                </h2>
                <p>
                  {parse(
                    this.translate("LoginSchool.returnToSchoolDescription")
                  )}
                </p>
              </div>
              <div
                className={classNames(
                  "column is-one-third",
                  styles.step,
                  styles.step__green
                )}
              >
                <h1>3</h1>
                <h2>
                  {parse(this.translate("LoginSchool.networkReportTitle"))}
                </h2>
                <p>
                  {parse(
                    this.translate("LoginSchool.networkReportDescription")
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="quatro-dimensoes" className="section">
          <div className={classNames("container", styles.four_dimensions)}>
            <div className="columns">
              <div className="column is-3">
                <h2>
                  <FormattedMessage
                    id="LoginSchool.dimensionsTitle"
                    values={{
                      useTechnology: (
                        <strong>
                          {this.translate("LoginSchool.useTechnology")}
                        </strong>
                      ),
                    }}
                  />
                </h2>
                <img
                  className={styles.puzzle}
                  src={require("../../../../public/images/home/puzzle-features.png")}
                />
              </div>
              <div className="colmun is-7">
                <p>
                  {parse(this.translate("LoginSchool.dimensionsDescription"))}
                </p>
              </div>
            </div>
          </div>
          <div className="container">
            <div className={classNames("columns", styles.dimensions)}>
              <div className={classNames("column", styles.dimension)}>
                <div className={styles.vision}>
                  <Icon name="vision" />
                  <h2>{parse(this.translate("LoginSchool.vision"))}</h2>
                  <p>
                    {parse(this.translate("LoginSchool.visionDescription"))}
                  </p>
                </div>
              </div>
              <div className={classNames("column", styles.dimension)}>
                <div className={styles.competence}>
                  <Icon name="competence" />
                  <h2>{parse(this.translate("LoginSchool.degree"))}</h2>
                  <p>
                    {parse(this.translate("LoginSchool.degreeDescription"))}
                  </p>
                </div>
              </div>
              <div className={classNames("column", styles.dimension)}>
                <div className={styles.content}>
                  <Icon name="content" />
                  <h2>{parse(this.translate("LoginSchool.contentTitle"))}</h2>
                  <p>
                    {parse(this.translate("LoginSchool.contentDescription"))}
                  </p>
                </div>
              </div>
              <div className={classNames("column", styles.dimension)}>
                <div className={styles.infra}>
                  <Icon name="infra" />
                  <h2>
                    {parse(this.translate("LoginSchool.infrastructureTitle"))}
                  </h2>
                  <p>
                    {parse(
                      this.translate("LoginSchool.infrastructureDescription")
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    );
  }
}

export default injectIntl(AccountsContainer(LoginSchool));
