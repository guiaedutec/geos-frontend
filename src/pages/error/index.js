import React from "react";
import Helmet from "react-helmet";
import Layout from "../../components/Layout";
import Body from "../../components/Body";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";

class Error extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }
  render() {
    return (
      <Layout>
        <Helmet title="Página de Erro" />
        <Body className="container">
          <section className="section">
            <div className="columns is-multiline">
              <div className="column is-full has-text-centered">
                <h1 className="title">{parse(this.translate("Error.ops"))}</h1>
                <h2 className="subtitle">
                  {parse(this.translate("Error.subtitle1"))}
                </h2>
                <h2 className="subtitle">
                  {parse(this.translate("Error.subtitle2"))}
                </h2>
              </div>
              <div className="column is-12-mobile is-offset-0-mobile is-8-tablet is-offset-2-tablet">
                <div className="box">
                  <article className="media">
                    <div className="media-left has-text-centered has-text-danger">
                      <figure className="image is-64x64">
                        <i className="far fa-question-circle fa-3x"></i>
                      </figure>
                    </div>
                    <div className="media-content">
                      <div className="content is-size-6">
                        <p>
                          <strong>
                            {parse(this.translate("Error.description1"))}
                          </strong>
                        </p>
                        <p>
                          {parse(this.translate("Error.description2"))}
                          <a
                            href={`mailto:${parse(
                              this.translate("StaticLinks.mainEmail")
                            )}`}
                            target="_blank"
                          >
                            {parse(this.translate("StaticLinks.mainEmail"))}
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </Body>
      </Layout>
    );
  }
}

export default injectIntl(Error);
