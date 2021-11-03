import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import classnames from "classnames";
import { compose } from "redux";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

// components
import Layout from "~/components/Layout";
import Body from "~/components/Body";
import SchoolsTableClasses from "./components/SchoolList/SchoolsTableClasses";
import ReactModal from "react-modal";

// containers
import APIContainer from "~/containers/api_data";

// styles
import styles from "./schools.styl";

class ListSchools extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      visibleInstructions: false,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  componentWillMount() {
    const url = window.location.href;
    const config = url.split("?")[1];

    if (config) {
      this.setState({ visibleInstructions: false });
    } else {
      this.setState({ visibleInstructions: true });
    }
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }
  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    const {
      apiData: { surveyAnswers },
    } = this.props;

    return (
      <Layout pageHeader={this.translate("ListSchoolsClasses.pageHeaderTitle")}>
        <Helmet title={this.translate("ListSchoolsClasses.helmetTitle")} />

        <Body>
          <section className="section">
            <div className="container">
              {this.state.visibleInstructions ? (
                <div id="instructions" className={classnames(styles.instructions)}>
                  <strong>Instruções: </strong>Na tabela abaixo estão
                  pré-cadastradas as escolas de sua rede de ensino com base no CENSO
                  ESCOLAR 2019. Nesta etapa você deve validar o cadastro das escolas
                  (clique{" "}
                  <a href="#" onClick={this.handleOpenModal}>
                    aqui
                  </a>{" "}
                  para saber como) e atualizar as informações de turmas e
                  quantidades de alunos em cada escola.
                  <br />
                  <ReactModal
                    isOpen={this.state.showModal}
                    className={classnames(styles.modal)}
                    overlayClassName={classnames(styles.overlay)}
                  >
                    <div className={classnames(styles.modal__header)}>
                      <h4>INSTRUÇÕES PARA VALIDAÇÃO DE ESCOLAS</h4>
                    </div>
                    <div className={classnames(styles.modal__body)}>
                      <p>
                        Você deve validar a lista de escolas cadastradas. Para
                        validar verifique se na lista abaixo existe alguma escola
                        que não está mais ativa, ou se existem novas escolas que não
                        estão presentes na lista.
                      </p>
                    </div>
                    <div className={classnames(styles.modal__footer)}>
                      <button className="button" onClick={this.handleCloseModal}>
                        Fechar
                      </button>
                    </div>
                  </ReactModal>
                </div>
              ) : null}
            </div>
            
            <SchoolsTableClasses />
          </section>
        </Body>
      </Layout>
    );
  }
}

ListSchools.propTypes = {
  apiData: PropTypes.object,
};

export default injectIntl(compose(APIContainer)(ListSchools));
