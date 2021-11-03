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
import SchoolsTable from "./components/SchoolList/SchoolsTable";
import ReactModal from "react-modal";
import { isAdminCountry } from "~/helpers/users";

// containers
import APIContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminRedir from "~/containers/non_admin_redir";
// styles
import styles from "./schools.styl";

class ListSchools extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      showModal2: false,
      showModal3: false,
      visibleInstructions: false,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModal2 = this.handleOpenModal2.bind(this);
    this.handleCloseModal2 = this.handleCloseModal2.bind(this);
    this.handleOpenModal3 = this.handleOpenModal3.bind(this);
    this.handleCloseModal3 = this.handleCloseModal3.bind(this);
  }
  translate = (id) => this.props.intl.formatMessage({ id });

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
  handleOpenModal2() {
    this.setState({ showModal2: true });
  }
  handleCloseModal2() {
    this.setState({ showModal2: false });
  }
  handleOpenModal3() {
    this.setState({ showModal3: true });
  }
  handleCloseModal3() {
    this.setState({ showModal3: false });
  }

  render() {
    const {
      apiData: { surveyAnswers },
    } = this.props;

    return (
      <Layout pageHeader={this.translate("SchoolList.pageHeader")}>
        <Helmet title={this.translate("SchoolList.pageHeader")} />

        <Body>
          <section className="section">
            <div className="container">
              <div className="columns">
                <div className="column">
                  {!isAdminCountry(
                    this.props.accounts && this.props.accounts.user
                  ) && (
                    <div className={classnames(styles.instructions)}>
                      <h1 className="is-size-4">
                        {this.translate("SchoolList.pageHeader")}
                      </h1>
                      <ReactModal
                        isOpen={this.state.showModal}
                        className={classnames(styles.modal)}
                        overlayClassName={classnames(styles.overlay)}
                        contentLabel=""
                      >
                        <div className={classnames(styles.modal__header)}>
                          <h4>
                            {parse(this.translate("SchoolList.modal1Title"))}
                          </h4>
                        </div>
                        <div className={classnames(styles.modal__body)}>
                          <p>
                            {parse(
                              this.translate("SchoolList.modal1Description1")
                            )}
                          </p>
                          <p>
                            {parse(
                              this.translate("SchoolList.modal1Description2")
                            )}
                          </p>
                        </div>
                        <div className={classnames(styles.modal__footer)}>
                          <button
                            className="button"
                            onClick={this.handleCloseModal}
                          >
                            {parse(this.translate("SchoolList.btnClose"))}
                          </button>
                        </div>
                      </ReactModal>
                      <ReactModal
                        isOpen={this.state.showModal2}
                        className={classnames(styles.modal)}
                        overlayClassName={classnames(styles.overlay)}
                        contentLabel=""
                      >
                        <div className={classnames(styles.modal__header)}>
                          <h4>
                            {parse(this.translate("SchoolList.modal2Title"))}
                          </h4>
                        </div>
                        <div className={classnames(styles.modal__body)}>
                          <p>
                            {parse(
                              this.translate("SchoolList.modal2Description1")
                            )}
                          </p>
                          <p>
                            {parse(
                              this.translate("SchoolList.modal2Description2")
                            )}
                            <ul>
                              <li>
                                {parse(
                                  this.translate(
                                    "SchoolList.modal2DescriptionBullet1"
                                  )
                                )}
                              </li>
                              <li>
                                {parse(
                                  this.translate(
                                    "SchoolList.modal2DescriptionBullet2"
                                  )
                                )}
                              </li>
                              <li>
                                {parse(
                                  this.translate(
                                    "SchoolList.modal2DescriptionBullet3"
                                  )
                                )}
                              </li>
                            </ul>
                          </p>
                        </div>
                        <div className={classnames(styles.modal__footer)}>
                          <button
                            className="button"
                            onClick={this.handleCloseModal2}
                          >
                            {parse(this.translate("SchoolList.btnClose"))}
                          </button>
                        </div>
                      </ReactModal>
                      <ReactModal
                        isOpen={this.state.showModal3}
                        className={classnames(styles.modal)}
                        overlayClassName={classnames(styles.overlay)}
                        contentLabel=""
                      >
                        <div className={classnames(styles.modal__header)}>
                          <h4>
                            {parse(this.translate("SchoolList.modal3Title"))}
                          </h4>
                        </div>
                        <div className={classnames(styles.modal__body)}>
                          <p>
                            {parse(
                              this.translate("SchoolList.modal3Description1")
                            )}
                          </p>
                          <p>
                            <FormattedMessage
                              id="SchoolList.modal3Description2"
                              values={{
                                census: (
                                  <strong>
                                    {this.translate("SchoolList.census")}
                                  </strong>
                                ),
                              }}
                            />
                          </p>
                          <p>
                            <FormattedMessage
                              id="SchoolList.modal3Description3"
                              values={{
                                sample: (
                                  <strong>
                                    {this.translate("SchoolList.sample")}
                                  </strong>
                                ),
                              }}
                            />
                          </p>
                        </div>
                        <div className={classnames(styles.modal__footer)}>
                          <button
                            className="button"
                            onClick={this.handleCloseModal3}
                          >
                            {parse(this.translate("SchoolList.btnClose"))}
                          </button>
                        </div>
                      </ReactModal>
                    </div>
                  )}
                  <SchoolsTable />
                </div>
              </div>
            </div>
          </section>
        </Body>
      </Layout>
    );
  }
}

ListSchools.propTypes = {
  apiData: PropTypes.object,
};

export default injectIntl(
  compose(APIContainer, NonUserRedir, NonAdminRedir)(ListSchools)
);
