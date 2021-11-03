import React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import Layout from "../../components/Layout";
import styles from "./styles.styl";
import axios from "axios";
import Body from "~/components/Body";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import { compose } from "redux";

import {
  getUserToken,
  setUserToken,
  removeUserToken,
  createUrlWithParams,
} from "~/api/utils";

import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminStateCityRedir from "~/containers/non_admin_state_city_redir";

import CONF from "~/api/index";

class DevolutiveList extends React.Component {
  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    return (
      <Layout
        className={styles.layout}
        pageHeader={this.translate("DevolutiveList.pageHeader")}
      >
        <Helmet title={this.translate("DevolutiveList.helmetTitle")} />

        <Body>
          <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column">
                <h1 className={styles.highlighted}>
                  {parse(this.translate("DevolutiveList.title"))}
                  {/* Customize a devolutiva para sua rede */}
                </h1>
                <p>
                  {parse(this.translate("DevolutiveList.description1"))}
                  {/* Nesta seção você pode personalizar a devolutiva que é enviada ao
                  diretor da escola após ele ter respondido o Guia EduTec. Esta
                  personalização pode ser feita de duas formas: */}
                </p>
                <ul>
                  <li>
                    {parse(this.translate("DevolutiveList.bullet1"))}
                    {/* 1 - Personalização das orientações: para cada dimensão e nível
                    possível do Guia EduTec há um conjunto de instruções ou
                    recomendações do que o diretor pode fazer para melhorar naquela
                    dimensão. Estes textos podem ser personalizados, indicando
                    programas e orientações específicas da sua rede. */}
                  </li>
                  <li>
                    {parse(this.translate("DevolutiveList.bullet2"))}
                    {/* 2 - Adicionar informações para sua rede: é possível que se adicionem novas
                    páginas com conteúdos específicos da sua rede. Indicamos esta
                    opção para divulgar políticas e programas disponíveis ou
                    implementados. */}
                  </li>
                </ul>
                <p>
                  {parse(this.translate("DevolutiveList.description2"))}
                  {/* Para ver a devolutiva enviada ao diretor na integra, com a
                  formatação clique no botão "Visualizar" abaixo. */}
                </p>
                <p>
                  {parse(this.translate("DevolutiveList.description3"))}
                  {/* Para editar uma página existente clique em "Editar" da linha
                  desejada na tabela abaixo. */}
                </p>
                <p>
                  {parse(this.translate("DevolutiveList.description4"))}
                  {/* Para adicionar um nova página, clique no botão "Nova Página"
                  abaixo. */}
                </p>
                <p>
                  {parse(this.translate("DevolutiveList.description5"))}
                  {/* Além do conteúdo é possivel personalizar a úlltima página,
                  adicionando até 3 imagens (logotipos) de sua rede e/ou secretaria
                  no rodapé. Para isso basta clicar em "Editar imagens da última
                  página". */}
                </p>
              </div>
            </div>
          <div className="columns">
            <div className="column"></div>
              <DevolutiveTable />
            </div>
          </div>
          </section>
        </Body>
      </Layout>
    );
  }
}

class DevolutiveTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      survey: [],
      fetchedDevolutives: false,
      devolutives: [],
    };
  }

  componentWillMount() {
    this.getSurveys();
  }

  getSurveys = () => {
    const _this = this;
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/surveys_list?access_token=" +
          getUserToken(),
        {}
      )
      .then(function (surveys) {
        if (surveys.data) {
          var surveySchool = [];
          surveys.data.surveys.forEach(function (survey) {
            if (survey.type === "school") {
              surveySchool = survey;
            }
          });
          _this.setState({
            survey: surveySchool,
          });
          _this.getDevolutives();
        }
      });
  };

  getDevolutives = () => {
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/survey/retrieve_all_devolutive/" +
          this.state.survey.id +
          "?access_token=" +
          getUserToken(),
        {}
      )
      .then((devolutives) => {
        this.setState({
          fetchedDevolutives: true,
          devolutives: devolutives.data,
        });
      });
  };

  translate = (id) => this.props.intl.formatMessage({ id });

  render() {
    return (
      <div ref="container">
        <p className="control has-addons">
          <button
            className={classnames("button", styles.btn)}
            onClick={() => {
              window.location = "/customizar-devolutiva";
            }}
          >
            {parse(this.translate("DevolutiveTable.btnNewPage"))}
            {/* Nova Página */}
          </button>
          &nbsp;
          <button
            className={classnames("button", styles.btn)}
            onClick={() => {
              window.open(
                CONF.ApiURL +
                  "/api/v1/survey/feedback/" +
                  this.state.survey.id +
                  "/00?access_token=" +
                  getUserToken(),
                "_blank"
              );
            }}
          >
            {parse(this.translate("DevolutiveTable.btnView"))}
            {/* Visualizar */}
          </button>
          <button
            className={classnames("button", styles.btn, styles.last_page)}
            onClick={() => {
              window.location = "/editar-footer-feedback";
            }}
          >
            {parse(this.translate("DevolutiveTable.btnEditImages"))}
            {/* Editar imagens da última página */}
          </button>
        </p>
        <table
          className={classnames(
            "table is-bordered is-fullwidth is-hoverable",
            styles.followup__info__table
          )}
        >
          <thead>
            <tr className={classnames("reactable-column-header")}>
              <th className={classnames("reactable-th-page")}>
                {parse(
                  this.translate("DevolutiveTable.tableHeaderPagesNumber")
                )}
                {/* Número Página PDF */}
              </th>
              <th className={classnames("reactable-th-title")}>
                {parse(this.translate("DevolutiveTable.tableHeaderPageTitle"))}
                {/* Título da Página / Subtítulo da Página */}
              </th>
              <th className={classnames("reactable-th-action")}>
                {parse(this.translate("DevolutiveTable.tableHeaderActions"))}
                {/* Ações */}
              </th>
            </tr>
          </thead>
          <tbody className={classnames("reactable-data")}>
            {this.state.devolutives.length > 0 ? (
              this.state.devolutives.map((devolutive, index) => (
                <tr key={devolutive._id.$oid}>
                  <td>{devolutive.page}</td>
                  <td
                    className={classnames(styles.main__table__content)}
                    dangerouslySetInnerHTML={{
                      __html: devolutive.title + " / " + devolutive.subtitle,
                    }}
                  />
                  <td>
                    <a href="#">
                      <span
                        onClick={() => {
                          window.location =
                            "/customizar-devolutiva?id=" + devolutive._id.$oid;
                        }}
                      >
                        {parse(this.translate("DevolutiveTable.btnEdit"))}
                        {/* Editar */}
                      </span>
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className={styles.devolutive__title}>
                  {parse(this.translate("DevolutiveTable.withoutDevolutives"))}
                  {/* [sem devolutivas customizadas cadastradas] */}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default injectIntl(
  compose(
    APIDataContainer,
    NonUserRedir,
    NonAdminStateCityRedir
  )(DevolutiveList)
);
