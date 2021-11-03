import React from "react";
import classNames from "classnames";
import Helmet from "react-helmet";
import Body from "~/components/Body";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import Layout from "~/components/Layout";
import styles from "./styles.styl";

// import "./styles.css";
class ForInBalance extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }
  render() {
    return (
      <Layout>
        <Helmet title="Guia EduTec" />

        <Body>
          <div className={classNames(styles.content)}>
            <div className={classNames(styles.section, styles.section1)}>
              <div className={classNames(styles.section_wrapper)}>
                <div className={classNames(styles.first_session_padd)}>
                  <div className="columns">
                    <div className="column is-one-third">
                      <h2>
                        <strong>
                          {parse(this.translate("Dimensions.dimensionsTitle"))}
                        </strong>
                      </h2>
                      <img
                        className={classNames(styles.scale_with_grid)}
                        src={require("../../../public/images/separador-green.png")}
                        alt=""
                      />
                      <hr className={classNames("no_line", styles.hr_margin)} />
                    </div>
                    <div className="column is-two-thirds">
                      <div className={classNames(styles.intro_pad)}>
                        <p>
                          {parse(
                            this.translate("Dimensions.dimensionsDescription1")
                          )}
                        </p>
                        <div
                          className={classNames(styles.intro_pad_dimensions)}
                        >
                          <ul>
                            <li>
                              {parse(this.translate("Dimensions.visionTitle"))}
                            </li>
                            <li>
                              {parse(
                                this.translate("Dimensions.competenceTitle")
                              )}
                            </li>
                            <li>
                              {parse(
                                this.translate(
                                  "Dimensions.educationalResourcesTitle"
                                )
                              )}
                            </li>
                            <li>
                              {parse(
                                this.translate("Dimensions.infrastructureTitle")
                              )}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={classNames(styles.second_session_padd)}>
                  <div className="columns">
                    <div className="column is-three-fifth">
                      <div
                        className={classNames(
                          "columns is-multiline",
                          styles.diagram
                        )}
                      >
                        <div className="column is-half">
                          {parse(this.translate("Dimensions.management"))}
                        </div>
                        <div className="column is-half">
                          {parse(this.translate("Dimensions.quality"))}
                        </div>
                        <div className="column is-half">
                          {parse(this.translate("Dimensions.equity"))}
                        </div>
                        <div className="column is-half">
                          {parse(this.translate("Dimensions.contemporary"))}
                        </div>
                      </div>
                    </div>
                    <div className="column is-two-fifths pl-20">
                      <p>
                        {parse(
                          this.translate("Dimensions.dimensionsDescription2")
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <br />
                <div className={classNames(styles.second_session_padd)}>
                  <div className="columns">
                    <div className="column is-two-thirds">
                      <p>
                        {parse(
                          this.translate("Dimensions.dimensionsDescription3")
                        )}
                      </p>
                      <br />
                      <p>
                        {parse(
                          this.translate("Dimensions.dimensionsDescription4")
                        )}
                      </p>
                      <br />
                      <p>
                        {parse(
                          this.translate("Dimensions.dimensionsDescription5")
                        )}
                      </p>
                    </div>
                    <div className="column is-one-third">
                      <div className={styles.eyesight}>
                        <img
                          src={require("./images/image/img-icon.svg")}
                          alt=""
                        />
                        <div className={styles.items}>
                          <div className="item1">
                            <img
                              src={require("./images/image/icon-1.svg")}
                              alt=""
                            />
                            <strong>
                              {parse(this.translate("Dimensions.vision"))}
                            </strong>
                          </div>
                          <div className="item2">
                            <img
                              src={require("./images/image/icon-2.svg")}
                              alt=""
                            />
                            <strong>
                              {parse(this.translate("Dimensions.competence"))}
                            </strong>
                          </div>
                          <div className="item3">
                            <img
                              src={require("./images/image/icon-3.svg")}
                              alt=""
                            />
                            <strong>
                              {parse(
                                this.translate(
                                  "Dimensions.contentAndDigitalResources"
                                )
                              )}
                            </strong>
                          </div>
                          <div className="item4">
                            <img
                              src={require("./images/image/icon-4.svg")}
                              alt=""
                            />
                            <strong>
                              {parse(
                                this.translate("Dimensions.infrastructure")
                              )}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classNames(
                styles.section,
                styles.section2,
                styles.highlight_right
              )}
            >
              <div className={classNames(styles.section_wrapper)}>
                <div className="columns">
                  <div className="column is-half">
                    <div className={classNames(styles.description_padd_left)}>
                      <h3>
                        <strong>
                          {parse(this.translate("Dimensions.visionTitle"))}
                        </strong>
                      </h3>
                      <img
                        src={require("../../../public/images/separador-4B.jpg")}
                        className="scale-with-grid"
                        alt=""
                      />
                      <hr className={classNames("no_line", styles.hr_margin)} />
                      <p>
                        {parse(this.translate("Dimensions.visionDescription1"))}
                      </p>
                      <br />
                      <p>
                        {parse(this.translate("Dimensions.visionDescription2"))}
                      </p>
                    </div>
                  </div>
                  <div className="column is-half">
                    <div className={classNames(styles.description_padd_right)}>
                      <h3>
                        <strong>
                          {parse(this.translate("Dimensions.competenceTitle"))}
                        </strong>
                      </h3>
                      <img
                        className="scale-with-grid"
                        src={require("../../../public/images/separador-4B.jpg")}
                        alt=""
                      />
                      <hr className={classNames("no_line", styles.hr_margin)} />
                      <p>
                        {parse(
                          this.translate("Dimensions.competenceDescription")
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classNames(
                styles.section,
                styles.section2,
                styles.highlight_left
              )}
            >
              <div className={classNames(styles.section_wrapper)}>
                <div className="columns">
                  <div className="column is-half">
                    <div className={classNames(styles.description_padd_left)}>
                      <h3>
                        <strong>
                          {parse(
                            this.translate(
                              "Dimensions.educationalResourcesTitle"
                            )
                          )}
                        </strong>
                      </h3>
                      <img
                        className="scale-with-grid"
                        src={require("../../../public/images/separador-4B.jpg")}
                        alt=""
                      />
                      <hr className={classNames("no_line", styles.hr_margin)} />
                      <p>
                        {parse(
                          this.translate(
                            "Dimensions.educationalResourcesDescription1"
                          )
                        )}
                      </p>
                      <br />
                      <p>
                        {parse(
                          this.translate(
                            "Dimensions.educationalResourcesDescription2"
                          )
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="column is-half">
                    <div className={classNames(styles.description_padd_right)}>
                      <h3>
                        <strong>
                          {parse(
                            this.translate("Dimensions.infrastructureTitle")
                          )}
                        </strong>
                      </h3>
                      <img
                        className="scale-with-grid"
                        src={require("../../../public/images/separador-4B.jpg")}
                        alt=""
                      />
                      <hr className={classNames("no_line", styles.hr_margin)} />
                      <p>
                        {parse(
                          this.translate("Dimensions.infrastructureDescription")
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classNames(styles.section, styles.section4)}>
              <div className={classNames(styles.section_wrapper)}>
                <div className={classNames(styles.text_session_padd)}>
                  <br />
                  <br />
                  <p>{parse(this.translate("Dimensions.footer"))}</p>
                </div>
              </div>
            </div>
          </div>
        </Body>
      </Layout>
    );
  }
}
export default injectIntl(ForInBalance);
