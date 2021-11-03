import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import classnames from "classnames";
import { compose } from "redux";

// Components
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import SubmitBtn from "../../components/SubmitBtn";
import Body from "~/components/Body";
import axios from "axios";
// Style
import styles from "./styles.styl";

import CONF from "~/api/index";

import {
  getUserToken,
  setUserToken,
  removeUserToken,
  createUrlWithParams,
} from "~/api/utils";

import APIDataContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminStateCityRedir from "~/containers/non_admin_state_city_redir";
import DropzoneComponent from "react-dropzone-component";
import ReactDOMServer from "react-dom/server";

class FeedBackFooterForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var componentConfig = {
      iconFiletypes: [".jpg", ".png", ".gif"],
      showFiletypeIcon: true,
      postUrl:
        CONF.ApiURL +
        "/api/v1/upload_files_feedback/?access_token=" +
        getUserToken(),
    };
    var djsConfig = {
      addRemoveLinks: true,
      previewTemplate: ReactDOMServer.renderToStaticMarkup(
        <div className="dz-preview dz-file-preview">
          <div className="dz-details">
            <div className="dz-filename">
              <span data-dz-name="true"></span>
            </div>
            <img
              className={classnames(styles.thumbnail)}
              data-dz-thumbnail="true"
            />
          </div>
          <div className="dz-progress">
            <span className="dz-upload" data-dz-uploadprogress="true"></span>
          </div>
          <div className="dz-error-message">
            <span data-dz-errormessage="true"></span>
          </div>
        </div>
      ),
    };
    var count_value = 0;
    var dropZone;
    function initCallback(dropzone) {
      dropZone = dropzone;
      axios
        .get(
          CONF.ApiURL +
            "/api/v1/find_images_school?access_token=" +
            getUserToken(),
          {}
        )
        .then(function (response) {
          if (response.data) {
            for (var i = 0; i < response.data.length; i++) {
              var file = {
                name: response.data[i].name,
                size: response.data[i].size,
                status: "ADD",
                accepted: true,
                _id: response.data[i]._id.$oid,
              };
              dropZone.emit("addedfile", file);
              dropZone.emit("thumbnail", file, response.data[i].url);
              dropZone.emit("complete", file);
              dropZone.files.push(file);
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    var eventHandlers = {
      init: initCallback,
      processingmultiple: true,
      addedfile: (fileObj) => {
        count_value = count_value + 1;
        if (count_value > 3) {
          alert("Já possui 3 imagens.");
          dropZone.removeFile(fileObj);
          count_value = count_value - 1;
        }
      },
      success: function (fileObj, responseText) {
        fileObj["_id"] = responseText.upload._id.$oid;
        return fileObj;
      },
      removedfile: (fileObj) => {
        axios
          .post(
            CONF.ApiURL + "/api/v1/remove_file?access_token=" + getUserToken(),
            { _id: fileObj._id }
          )
          .then(function (response) {
            if (response.data) {
              if (response.data.valid == true) {
                count_value = count_value - 1;
              }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
    };
    return (
      <Layout pageHeader="Imagens da Última Página da Devolutiva">
        <Helmet title="Edição Imagens da Última Página" />
        <Body>
          <section className="section">
            <div className="container">
              <div className="columns">
                <div className="column">
                  <h1 className={styles.highlighted}>
                    Adicionar ou alterar imagens da última página da devolutiva
                  </h1>
                  A última página da devolutiva possui informação sobre a
                  elaboração e aplicação do Guia EduTec, e nela é possível
                  adicionar até 3 imagens (logotipos) de sua rede ou secretaria,
                  no rodapé da página.
                  <br />
                  Para isso basta arrastar as imagens desejadas para a caixa
                  abaixo, as imagens (logotipos) irão aparece na ordem em que
                  estão colocados abaixo.
                </div>
              </div>
            </div>

            <div className={classnames("container")}>
              <div className={classnames("columns", styles.section)}>
                <div className="column" id="new">
                  <input type="hidden" name="id" id="id" />
                  <br></br>
                  <br></br>
                  <DropzoneComponent
                    config={componentConfig}
                    eventHandlers={eventHandlers}
                    djsConfig={djsConfig}
                  >
                    <div
                      className={classnames("dz-message", styles.div__round)}
                    >
                      <div className={styles.div__dropzone}></div>
                      <div className={styles.div__dropzone__footer}>
                        <strong>Clique ou Arraste/Solte</strong> as suas 3
                        logomarcas/imagens
                        <br></br>
                        Os formatos permitidos são:{" "}
                        <strong>png, jpg e gif</strong>
                      </div>
                    </div>
                  </DropzoneComponent>
                </div>
              </div>
            </div>
          </section>
        </Body>
      </Layout>
    );
  }
}

export default compose(
  APIDataContainer,
  NonUserRedir,
  NonAdminStateCityRedir
)(FeedBackFooterForm);
