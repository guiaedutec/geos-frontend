import React from "react";
import PropTypes from "prop-types";
import history from "~/core/history";
import SignInForm from "../components/SignInForm";
import AccountsContainer from "~/containers/accounts";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import { redirectDefaultPageByUser } from "~/helpers/users";
import styles from "./LoginManager.styl";
import classNames from "classnames";
import _ from "lodash";
import Button from "../../../components/Button";

export class LoginManager extends React.Component {
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
    return [
      <section className="section is-paddingless">
        <div className={classNames("columns is-multiline", styles.login)}>
          <div className="column is-full">
            <section className="section pt-20">
              <div className="container">
                <div className="columns is-multiline">
                  <div className="column is-6">
                    <h1 className="pr-15">
                      <FormattedMessage
                        id="LoginManager.title"
                        values={{
                          technologyUse: (
                            <div>
                              <strong>
                                {this.translate("LoginManager.technologyUse")}
                              </strong>
                              <br className="is-hidden-touch" />
                            </div>
                          ),
                        }}
                      />
                      {/* QUER PLANEJAR O <br className="is-hidden-touch" />
                      <strong>USO DE TECNOLOGIA</strong>{" "}
                      <br className="is-hidden-touch" />
                      EM SUA REDE DE ENSINO? */}
                    </h1>
                  </div>
                  <div className="column is-6">
                    <SignInForm type="gestor" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className={classNames("columns is-marginless", styles.video)}>
          <div className={classNames("column is-6", styles.call)}>
            <h2>{parse(this.translate("LoginManager.whatIsTitle"))}</h2>
            <h2>{parse(this.translate("LoginManager.whatIsDescription"))}</h2>
          </div>
          <div className="column is-6">
            <div className={styles.video_container}>
              <iframe
                width="640"
                height="360"
                src={parse(this.translate("LoginManager.videoSrcDiagnosis"))}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>,
      <section className={classNames("section is-paddingless", styles.steps)}>
        <div className="container is-fluid is-marginless">
          <div className="columns is-multiline is-marginless">
            <div className={classNames("column is-one-third", styles.step)}>
              <h1>1</h1>
              <h2>{parse(this.translate("LoginManager.accessionTitle"))}</h2>
              <p>
                {parse(this.translate("LoginManager.accessionDescription"))}
              </p>
              <Button className={styles.accession} to={"/criar-conta/gestor"}>
                {parse(this.translate("LoginManager.btnMakeAccession"))}
              </Button>
            </div>
            <div className={classNames("column is-one-third", styles.step)}>
              <h1>2</h1>
              <h2>{parse(this.translate("LoginManager.diagnosisTitle"))}</h2>
              <p>
                {parse(this.translate("LoginManager.diagnosisDescription"))}
              </p>
            </div>
            <div className={classNames("column is-one-third", styles.step)}>
              <h1>3</h1>
              <h2>{parse(this.translate("LoginManager.mappingTitle"))}</h2>
              <p>{parse(this.translate("LoginManager.mappingDescription"))}</p>
            </div>
          </div>
        </div>
      </section>,
      <section className="section">
        <div className={classNames("container", styles.summary)}>
          <div className="columns has-text-centered">
            <div className="column">
              <img src={require("../../../../public/images/home/icon01.png")} />
              <h1>{parse(this.translate("LoginManager.conceptsTitle"))}</h1>
              <p>{parse(this.translate("LoginManager.conceptsDescription"))}</p>
            </div>
            <div className="column">
              <img src={require("../../../../public/images/home/icon02.png")} />
              <h1>
                {parse(this.translate("LoginManager.diagnosticToolsTitle"))}
              </h1>
              <p>
                {parse(
                  this.translate("LoginManager.diagnosticToolsDescription")
                )}
              </p>
            </div>
            <div className="column">
              <img
                src={require("../../../../public/images/home/mapeamento.png")}
              />
              <h1>{parse(this.translate("LoginManager.mappingToolsTitle"))}</h1>
              <p>
                {parse(this.translate("LoginManager.mappingToolsDescription"))}
              </p>
            </div>
          </div>
        </div>
        <div className={classNames("container", styles.dimensions)}>
          <div className="columns is-multiline">
            <div className={classNames("column is-full", styles.introduction)}>
              <h1 className="stripe is-stripe-darkblue has-text-centered-mobile">
                {parse(this.translate("LoginManager.conceptTitle"))}
              </h1>
              <p>{parse(this.translate("LoginManager.conceptDescription1"))}</p>
              <p>{parse(this.translate("LoginManager.conceptDescription2"))}</p>
            </div>
            <div className={classNames("column is-half", styles.dimension)}>
              <h2 className="stripe is-stripe-yellow has-text-centered-mobile">
                {parse(this.translate("LoginManager.conceptVisãoTitle"))}
              </h2>
              <p>
                {parse(this.translate("LoginManager.conceptVisãoDescription"))}
              </p>
            </div>
            <div className={classNames("column is-half", styles.dimension)}>
              <h2 className="stripe is-stripe-red has-text-centered-mobile">
                {parse(this.translate("LoginManager.conceptDegreeTitle"))}
              </h2>
              <p>
                {parse(this.translate("LoginManager.conceptDegreeDescription"))}
              </p>
            </div>
            <div className={classNames("column is-half", styles.dimension)}>
              <h2 className="stripe is-stripe-blue has-text-centered-mobile">
                {parse(
                  this.translate(
                    "LoginManager.conceptEducacionalResourcesTitle"
                  )
                )}
              </h2>
              <p>
                {parse(
                  this.translate(
                    "LoginManager.conceptEducacionalResourcesDescription"
                  )
                )}
              </p>
            </div>
            <div className={classNames("column is-half", styles.dimension)}>
              <h2 className="stripe is-stripe-green has-text-centered-mobile">
                {parse(
                  this.translate("LoginManager.conceptInfrastructureTitle")
                )}
              </h2>
              <p>
                {parse(
                  this.translate(
                    "LoginManager.conceptInfrastructureDescription"
                  )
                )}
              </p>
            </div>
          </div>
        </div>
        <div className={classNames("container", styles.diagnostic)}>
          <div className="columns is-multiline">
            <div className={classNames("column is-full", styles.introduction)}>
              <h1 className="stripe is-stripe-darkblue has-text-centered-mobile">
                {parse(this.translate("LoginManager.diagnosisSectionTitle"))}
              </h1>
              <p>
                {parse(
                  this.translate("LoginManager.dignosisSectionDescription1")
                )}
              </p>
              <p>
                {parse(
                  this.translate("LoginManager.dignosisSectionDescription2")
                )}
              </p>
              <p>
                {parse(
                  this.translate("LoginManager.dignosisSectionDescription3")
                )}
              </p>
            </div>
            <div
              className={classNames(
                "column is-one-third is-flex-tablet has-text-centered",
                styles.item
              )}
            >
              <div className="box">
                <img
                  src={require("../../../../public/images/home/diagnostico_cadastro.png")}
                />
                <h2>
                  {parse(this.translate("LoginManager.diagnosisRegisterTitle"))}
                </h2>
                <p>
                  {parse(
                    this.translate("LoginManager.diagnosisRegisterDescription")
                  )}
                </p>
              </div>
            </div>
            <div
              className={classNames(
                "column is-one-third is-flex-tablet has-text-centered",
                styles.item
              )}
            >
              <div className="box">
                <img
                  src={require("../../../../public/images/home/diagnostico_questionario.png")}
                />
                <h2>
                  {parse(
                    this.translate("LoginManager.diagnosisQuestionsTitle")
                  )}
                </h2>
                <p>
                  {parse(
                    this.translate("LoginManager.diagnosisQuestionsDescription")
                  )}
                </p>
              </div>
            </div>
            <div
              className={classNames(
                "column is-one-third is-flex-tablet has-text-centered",
                styles.item
              )}
            >
              <div className="box">
                <img
                  src={require("../../../../public/images/home/diagnostico_devolutiva.png")}
                />
                <h2>
                  {parse(
                    this.translate("LoginManager.diagnosisDevolutiveTitle")
                  )}
                </h2>
                <p>
                  {parse(
                    this.translate(
                      "LoginManager.diagnosisDevolutiveDescription"
                    )
                  )}
                </p>
              </div>
            </div>
            <div
              className={classNames(
                "column is-offset-2 is-4 is-flex-tablet has-text-centered",
                styles.item
              )}
            >
              <div className="box">
                <img
                  src={require("../../../../public/images/home/diagnostico_coleta.png")}
                />
                <h2>
                  {parse(
                    this.translate(
                      "LoginManager.diagnosisCollectionOfResponsesTitle"
                    )
                  )}
                </h2>
                <p>
                  {parse(
                    this.translate(
                      "LoginManager.diagnosisCollectionOfResponsesDescription"
                    )
                  )}
                </p>
              </div>
            </div>
            <div
              className={classNames(
                "column is-4 is-flex-tablet has-text-centered",
                styles.item
              )}
            >
              <div className="box">
                <img
                  src={require("../../../../public/images/home/diagnostico_relatorio.png")}
                />
                <h2>
                  {parse(this.translate("LoginManager.diagnosisReportTitle"))}
                </h2>
                <p>
                  {parse(
                    this.translate("LoginManager.diagnosisReportDescription")
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={classNames("container", styles.diagnostic)}>
          <div className="columns is-multiline">
            <div className={classNames("column is-full", styles.introduction)}>
              <h1 className="stripe is-stripe-darkblue has-text-centered-mobile">
                {parse(this.translate("LoginManager.mappingSectionTitle"))}
              </h1>
              <p>
                {parse(
                  this.translate("LoginManager.mappingSectionDescription1")
                )}
              </p>
              <p>
                {parse(
                  this.translate("LoginManager.mappingSectionDescription2")
                )}
              </p>
              <p>
                <FormattedMessage
                  id="LoginManager.mappingSectionDescription3"
                  values={{
                    mappingSelfEvaluation: (
                      <a href="/educador" target="_blank">
                        {this.translate("LoginManager.mappingSelfEvaluation")}
                      </a>
                    ),
                  }}
                />
              </p>
            </div>
            <div
              className={classNames(
                "column is-one-quarter is-flex-tablet has-text-centered",
                styles.item
              )}
            >
              <div className="box">
                <img
                  src={require("../../../../public/images/home/autoavaliacao_cadastro.png")}
                />
                <h2>
                  {parse(this.translate("LoginManager.mappingRegisterTitle"))}
                </h2>
                <p>
                  {parse(
                    this.translate("LoginManager.mappingRegisterDescription")
                  )}
                </p>
              </div>
            </div>
            <div
              className={classNames(
                "column is-one-quarter is-flex-tablet has-text-centered",
                styles.item
              )}
            >
              <div className="box">
                <img
                  src={require("../../../../public/images/home/autoavaliacao_questionario.png")}
                />
                <h2>
                  {parse(this.translate("LoginManager.mappingQuestionsTitle"))}
                </h2>
                <p>
                  {parse(
                    this.translate("LoginManager.mappingQuestionsDescription")
                  )}
                </p>
              </div>
            </div>
            <div
              className={classNames(
                "column is-one-quarter is-flex-tablet has-text-centered",
                styles.item
              )}
            >
              <div className="box">
                <img
                  src={require("../../../../public/images/home/autoavaliacao_devolutiva_professor.png")}
                />
                <h2>
                  {parse(this.translate("LoginManager.mappingDevolutiveTitle"))}
                </h2>
                <p>
                  {parse(
                    this.translate("LoginManager.mappingDevolutiveDescription")
                  )}
                </p>
              </div>
            </div>
            <div
              className={classNames(
                "column is-one-quarter is-flex-tablet has-text-centered",
                styles.item
              )}
            >
              <div className="box">
                <img
                  src={require("../../../../public/images/home/autoavaliacao_coleta.png")}
                />
                <h2>
                  {parse(
                    this.translate(
                      "LoginManager.mappingCollectionOfResponsesTitle"
                    )
                  )}
                </h2>
                <p>
                  {parse(
                    this.translate(
                      "LoginManager.mappingCollectionOfResponsesDescription"
                    )
                  )}
                </p>
              </div>
            </div>
            <div
              className={classNames(
                "column is-offset-one-quarter is-half has-text-centered",
                styles.item
              )}
            >
              <div className="box">
                <img
                  src={require("../../../../public/images/home/autoavaliacao_devolutiva_rede.png")}
                />
                <h2>
                  {parse(this.translate("LoginManager.mappingReportTitle"))}
                </h2>
                <p>
                  {parse(
                    this.translate("LoginManager.mappingReportDescription")
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={classNames("container", styles.access)}>
          <div className="columns">
            <div className="column has-text-centered">
              <Button className={styles.accession} to={"/criar-conta/gestor"}>
                {parse(this.translate("LoginManager.btnMakeAccession"))}
              </Button>
            </div>
          </div>
        </div>
      </section>,
    ];
  }
}

LoginManager.propTypes = {
  accounts: PropTypes.object.isRequired,
};

export default injectIntl(AccountsContainer(LoginManager));
