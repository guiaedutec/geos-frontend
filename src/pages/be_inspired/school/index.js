import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Helmet from "react-helmet";
import { compose } from "redux";
import StarRatingComponent from "react-star-rating-component";
import axios from "axios";

import Layout from "~/components/Layout";
import Body from "~/components/Body";

import AccountsContainer from "~/containers/accounts";
import APIDataContainer from "~/containers/api_data";
import { isAdmin } from "~/helpers/users";

import styles from "../Inspired.styl";
import CONF from "~/api/index";

class School extends React.Component {
  constructor() {
    super();
    this.state = {
      rating: 0,
      profile: [],
      permittedProfile: ["principal", "teacher", "other"],
    };
  }

  componentDidMount() {
    const parsed = location.search;
    this.props.fetchSpreadsheetsId(parsed);

    var self = this;
    this.props.loginWithToken().then(function (response) {
      self.setState({ profile: response.user._profile });
    });
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
    axios
      .post(CONF.ApiURL + "/admin/rating", {
        rating: nextValue,
        projectId: name,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  createMarkup(param) {
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(param)[1];
    if (
      param &&
      ext !== "JPG" &&
      ext !== "jpg" &&
      ext !== "PNG" &&
      ext !== "png"
    ) {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html:
              "<img src='https://maxcdn.icons8.com/app/uploads/2016/10/download1.png'/>",
          }}
        />
      );
    } else if (param) {
      return (
        <div dangerouslySetInnerHTML={{ __html: "<img src=" + param + ">" }} />
      );
    }
  }

  isPermitedRating(profile) {
    if (this.state.permittedProfile.indexOf(profile) != -1) {
      return true;
    }
    return false;
  }

  render() {
    const { rating } = this.state.rating;
    return (
      <Layout pageHeader="Inspire-se">
        <Helmet title="Questionário e Devolutiva" />
        <Body className={styles.inspirated}>
          {this.props.apiData.spreadsheets.map((spreadsheet) => (
            <div className="content">
              <div className="columns">
                <div className="column">
                  <h1 className="title">
                    {spreadsheet.cityName} - {spreadsheet.schoolName}{" "}
                  </h1>
                </div>
              </div>

              <div className="columns">
                <div className="column">
                  {this.isPermitedRating(this.state.profile) ? (
                    <p>
                      <strong>Avalie essa iniciativa: </strong>
                    </p>
                  ) : (
                    ""
                  )}
                  <p>
                    <StarRatingComponent
                      name={spreadsheet.colARespId}
                      starCount={5}
                      value={spreadsheet.rating / spreadsheet.ratingCount}
                      onStarClick={this.onStarClick.bind(this)}
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
                      editing={
                        this.isPermitedRating(this.state.profile) ? true : false
                      }
                    />
                  </p>
                </div>
              </div>

              <div className="columns">
                <div className="column">
                  <p>
                    <strong>Foco da iniciativa: </strong>
                    {spreadsheet.colIFoco}.
                  </p>
                </div>
              </div>

              <div className="columns">
                <div className="column">
                  <p>
                    <strong>Destinada a: </strong>
                    {spreadsheet.colJAluno} {spreadsheet.colKProfessor}{" "}
                    {spreadsheet.colLEquipeGes} {spreadsheet.colMFamiliar}{" "}
                    {spreadsheet.colNOutro}.
                  </p>
                </div>
              </div>

              <div className="columns">
                <div className="column">
                  <p>
                    <strong>Solução a ser transformada: </strong>
                    {spreadsheet.colHSituacao}.
                  </p>
                </div>
              </div>

              <div className="columns">
                <div className="column">
                  <p>
                    <strong>Iniciativa: </strong>
                    {spreadsheet.colPInicia}.
                  </p>
                </div>
              </div>

              <div className="columns">
                <div className="column is-2">
                  <a href={spreadsheet.colQVideo} target="_blank">
                    <figure className="image is-128x128">
                      {this.createMarkup(spreadsheet.colQVideo)}
                    </figure>
                  </a>
                </div>

                <div className="column is-2">
                  <a href={spreadsheet.colRVideo} target="_blank">
                    <figure className="image is-128x128">
                      {this.createMarkup(spreadsheet.colRVideo)}
                    </figure>
                  </a>
                </div>
                <div className="column is-2">
                  <a href={spreadsheet.colSVideo} target="_blank">
                    <figure className="image is-128x128">
                      {this.createMarkup(spreadsheet.colSVideo)}
                    </figure>
                  </a>
                </div>
                <div className="column is-2">
                  <a href={spreadsheet.colTVideo} target="_blank">
                    <figure className="image is-128x128">
                      {this.createMarkup(spreadsheet.colTVideo)}
                    </figure>
                  </a>
                </div>
                <div className="column is-2">
                  <a href={spreadsheet.colUVideo} target="_blank">
                    <figure className="image is-128x128">
                      {this.createMarkup(spreadsheet.colUVideo)}
                    </figure>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </Body>
      </Layout>
    );
  }
}

export default compose(APIDataContainer, AccountsContainer)(School);
