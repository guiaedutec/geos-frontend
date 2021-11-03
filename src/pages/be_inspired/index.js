import React from "react";
import classNames from "classnames";
import Helmet from "react-helmet";
import { compose } from "redux";
import StarRatingComponent from "react-star-rating-component";

import Layout from "~/components/Layout";
import Body from "~/components/Body";

import APIDataContainer from "~/containers/api_data";

import styles from "./Inspired.styl";

class Inspirate extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { value: [], rating: 0 };
  }

  componentDidMount() {
    this.props.fetchStates();
    this.props.fetchSpreadsheets();
  }

  componentWillReceiveProps() {
    var filter = this.props.apiData.spreadsheets;
    this.setState({ value: filter });
  }

  handleChange(event) {
    let filter = [];
    let checks = document.getElementsByTagName("input");
    let selects = document.getElementsByTagName("select");
    let flag = true;
    let combo = true;

    for (var index in checks) {
      if (checks[index].checked) {
        if (selects[0].value.trim() != "") {
          this.props.apiData.spreadsheets.forEach(function (list) {
            if (list.colIFoco != null) {
              checks[index].value.trim().toLowerCase() ==
                list.colIFoco.trim().toLowerCase() &&
              selects[0].value.trim().toLowerCase() ==
                list.stateName.trim().toLowerCase()
                ? filter.push(list)
                : "";
            }
          });
        } else {
          this.props.apiData.spreadsheets.forEach(function (list) {
            if (list.colIFoco != null) {
              checks[index].value.trim().toLowerCase() ==
              list.colIFoco.trim().toLowerCase()
                ? filter.push(list)
                : "";
            }
          });
        }

        flag = false;
        combo = false;
      }
    }

    if (selects[0].value.trim() != "" && combo) {
      this.props.apiData.spreadsheets.forEach(function (list) {
        if (list.stateName != null) {
          selects[0].value.trim().toLowerCase() ==
          list.stateName.trim().toLowerCase()
            ? filter.push(list)
            : "";
          flag = false;
        }
      });
    }

    if (flag && combo) {
      filter = this.props.apiData.spreadsheets;
    }

    this.setState({ value: filter });
  }

  isImg(objimg) {
    if ("null" != objimg && "" != objimg) {
      var re = /(?:\.([^.]+))?$/;
      var ext = re.exec(objimg)[1];
      if (ext === "JPG" || ext === "jpg" || ext === "PNG" || ext === "png") {
        return true;
      }
    }
    return false;
  }

  haveImage(colIFoco, param) {
    var urlimg = "";

    if (this.isImg(param[0])) {
      urlimg = param[0];
    } else if (this.isImg(param[1])) {
      urlimg = param[1];
    } else if (this.isImg(param[2])) {
      urlimg = param[2];
    } else if (this.isImg(param[3])) {
      urlimg = param[3];
    } else if (this.isImg(param[4])) {
      urlimg = param[4];
    } else if (this.isImg(param[5])) {
      urlimg = param[5];
    } else if (this.isImg(param[6])) {
      urlimg = param[6];
    }

    if (urlimg === "") {
      var imgico = "<i class=ico__" + colIFoco + "></i>";
      return <div dangerouslySetInnerHTML={{ __html: imgico }} />;
    } else {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: "<img height='79' width='79' src=" + urlimg + ">",
          }}
        />
      );
    }
  }

  render() {
    //const {rating} = this.state;
    return (
      <Layout pageHeader="Inspire-se">
        <Helmet title="Questionário e Devolutiva" />
        <Body className={styles.inspirated}>
          <div className="columns">
            <div className="column is-2">
              <p className="control">
                <span className={"select " + styles.select__inspirated}>
                  <select
                    className={styles.select__inspirated}
                    onChange={this.handleChange}
                  >
                    <option value="">Selecione o estado</option>
                    {this.props.apiData.states.map((state) => (
                      <option key={state.acronym} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </span>
              </p>
            </div>
            <div className="column is-10">
              <div className="level-item">
                <p className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      value="Visão"
                      onChange={this.handleChange}
                    />
                    Visão
                  </label>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      value="Competências"
                      onChange={this.handleChange}
                    />
                    Competência / Formação
                  </label>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      value="Recursos Educacionais Digitais"
                      onChange={this.handleChange}
                    />
                    Recursos
                  </label>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      value="Infraestrutura"
                      onChange={this.handleChange}
                    />
                    Infraestrutura
                  </label>
                </p>
              </div>
            </div>
          </div>

          <div className={styles.box__inspirated}>
            {this.state.value.map((spreadsheet) => (
              <a
                target="_blank"
                href={`/recursos/inspire-se/escola?school_id=${spreadsheet.colVEscola}`}
                className={styles.media__inspirated}
              >
                <article
                  key={spreadsheet.colVEscola}
                  className={classNames("media", styles.media__inspirated)}
                >
                  <div className="media-left">
                    {this.haveImage(spreadsheet.colIFoco, [
                      spreadsheet.colQVideo,
                      spreadsheet.colRVideo,
                      spreadsheet.colSVideo,
                      spreadsheet.colTVideo,
                      spreadsheet.colUVideo,
                    ])}
                  </div>
                  <div className="media-content">
                    <div className="content">
                      <p>
                        <StarRatingComponent
                          name={spreadsheet.colARespId}
                          starCount={5}
                          value={spreadsheet.rating / spreadsheet.ratingCount}
                          editing={false}
                          renderStarIcon={(index, value) => {
                            return (
                              <span
                                className={
                                  index <= value ? "fa fa-star" : "fa fa-star-o"
                                }
                              />
                            );
                          }}
                          renderStarIconHalf={() => (
                            <span className="fa fa-star-half-full" />
                          )}
                        />
                        <br />
                        <strong>
                          {spreadsheet.stateName} - {spreadsheet.cityName} -{" "}
                          {spreadsheet.schoolName}
                        </strong>
                        <br />
                        {spreadsheet.colHSituacao}
                      </p>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </Body>
      </Layout>
    );
  }
}

export default compose(APIDataContainer)(Inspirate);
