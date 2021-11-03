import React, { Component } from "react";
import classnames from "classnames";
import $ from "jquery";

import Field from "~/components/Form/Field";
import Modal from "~/components/Modal";
import infraModalData from "./data/infra_modal_data";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";

import styles from "../../school.styl";

class SchoolInfra extends Component {
  state = {
    showModal: false,
    infra_selected: "",
  };

  _handleClickModal = (el) => {
    let ref = $(el.target).parents("a").data("ref")
      ? $(el.target).parents("a").data("ref")
      : $(el.target).data("ref");
    this.setState({
      showModal: true,
      infra_selected: ref.split(".")[1],
    });
  };

  _closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    const { hasInfra, school_infra, _add_infra } = this.props;

    const infraFields = hasInfra
      ? Object.entries(school_infra).map((infra) => {
          return (
            <div className="column is-4" key={infra[0]}>
              <div className="media">
                <div className={classnames("media-left", styles.media_left)}>
                  <a
                    href="javascript:void(0)"
                    data-ref={"school_infra." + infra[0]}
                    onClick={this._handleClickModal.bind(this)}
                  >
                    <figure className="image is-64x64">
                      <img
                        src={infraModalData[infra[0]].field.img}
                        alt={this.translate(
                          infraModalData[infra[0]].field.img_alt
                        )}
                      />
                    </figure>
                    <span className={styles.saiba_mais}>
                      <i className="fas fa-question-circle"></i>
                    </span>
                  </a>
                </div>
                <div className="media-content">
                  <Field
                    classField="slim-max"
                    label={this.translate(infraModalData[infra[0]].field.label)}
                    type="number"
                    {...infra[1]}
                  />
                </div>
              </div>
            </div>
          );
        })
      : "";

    return (
      <div className="box">
        <div className="columns is-multiline">
          <div className="column is-full">
            <h1 className={styles.title_section}>
              {parse(
                this.translate("InfraStructureFormModal.schoolInfrastructure")
              )}
            </h1>
            <p>
              {parse(
                this.translate(
                  "InfraStructureFormModal.schoolInfrastructureDescription"
                )
              )}
            </p>
          </div>
        </div>
        {hasInfra ? (
          <div className="columns is-multiline">{infraFields}</div>
        ) : (
          <div className="columns">
            <div className="column is-full">
              <a
                className={styles.add_infra}
                onClick={() => _add_infra(school_infra)}
              >
                <i className="fa fa-plus" />
                Adicionar informações de infraestrutrua
              </a>
            </div>
          </div>
        )}
        <Modal
          isActive={this.state.showModal}
          title={this.translate("InfraStructureFormModal.hints.title")}
          closeModal={this._closeModal.bind(this)}
          children={
            <div className={styles.modal_infra}>
              {this.state.infra_selected && (
                <div className="columns is-multiline">
                  <div className="column is-full">
                    <h2>
                      {this.translate(
                        infraModalData[this.state.infra_selected].modal.titulo
                      )}
                    </h2>
                  </div>
                  <div className="column is-half">
                    <div className={styles.titulo_descritivo}>
                      <span>
                        {parse(
                          this.translate(
                            "InfraStructureFormModal.hints.whatsIs"
                          )
                        )}
                      </span>
                      <i className="far fa-lightbulb"></i>
                    </div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: this.translate(
                          infraModalData[this.state.infra_selected].modal
                            .o_que_e
                        ),
                      }}
                    />
                    <div className={styles.titulo_descritivo}>
                      <span>
                        {parse(
                          this.translate("InfraStructureFormModal.hints.whoUse")
                        )}
                      </span>
                      <i className="fas fa-users"></i>
                    </div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: this.translate(
                          infraModalData[this.state.infra_selected].modal
                            .quem_usa
                        ),
                      }}
                    />
                    <div className={styles.titulo_descritivo}>
                      <span>
                        {parse(
                          this.translate(
                            "InfraStructureFormModal.hints.whereToFind"
                          )
                        )}
                      </span>
                      <i className="fas fa-map-marked-alt"></i>
                    </div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: this.translate(
                          infraModalData[this.state.infra_selected].modal
                            .onde_encontrar
                        ),
                      }}
                    />
                  </div>
                  <div className="column is-half">
                    <figure className="image is-1by1">
                      <img
                        src={
                          infraModalData[this.state.infra_selected].modal.img
                        }
                        alt={this.translate(
                          infraModalData[this.state.infra_selected].modal
                            .img_alt
                        )}
                      />
                    </figure>
                  </div>
                </div>
              )}
            </div>
          }
        />
      </div>
    );
  }
}

export default injectIntl(SchoolInfra);
