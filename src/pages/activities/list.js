import React from "react";
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

// Components
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import SubmitBtn from "../../components/SubmitBtn";
import Body from "~/components/Body";
import axios from "axios";
import { isMonitor } from "~/helpers/users";
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
import NonAdminRedir from "~/containers/non_admin_redir";

class ListActivities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      user_activities: [],
      checkeds: [],
      setting_valid: false,
      msg: this.translate("ListActivities.save"),
    };
  }

  translate = (id) => this.props.intl.formatMessage({ id });
  componentWillMount() {
    const _this = this;

    axios
      .get(
        CONF.ApiURL +
          "/api/v1/list_all_activities?access_token=" +
          getUserToken(),
        {}
      )
      .then(function (response) {
        _this.setState({
          activities: response.data,
        });

        _this.retrieveUserActivities();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  retrieveUserActivities() {
    const _this = this;
    axios
      .get(
        CONF.ApiURL +
          "/api/v1/list_all_user_activities?access_token=" +
          getUserToken(),
        {}
      )
      .then(function (response) {
        _this.setState({
          user_activities: response.data,
        });

        var array = [];

        for (var i = 0; i < _this.state.activities.length; i++) {
          var retrieve = false;
          for (var j = 0; j < _this.state.user_activities.length; j++) {
            if (
              _this.state.user_activities[j].activity_id.$oid ==
              _this.state.activities[i]._id.$oid
            ) {
              retrieve = true;
            }
          }
          array.push(retrieve);
        }
        _this.setState({
          checkeds: array,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  save() {
    const _this = this;
    this.setState({
      setting_valid: true,
    });
    const formArray = document.getElementById("form");
    var arrFields = [];
    for (var i = 0; i < formArray.length; i++) {
      if (formArray[i]["name"] == "check_activity") {
        if (formArray[i].checked == true) {
          arrFields.push(formArray[i].id);
        }
      }
    }
    var obj = new Object();
    obj.checkbox = arrFields;
    axios
      .post(
        CONF.ApiURL +
          "/api/v1/save_user_activity?access_token=" +
          getUserToken(),
        obj
      )
      .then(function (response) {
        _this.setState({
          setting_valid: false,
          msg: "Salvo com sucesso",
        });
      })
      .catch(function (error) {
        _this.setState({
          setting_valid: false,
        });
      });
  }

  handleInputChange(e) {
    let index = e.target.value;
    let new_checked = false;
    if (!this.state.checkeds[index]) {
      new_checked = true;
    }
    let new_checkeds = this.state.checkeds;
    new_checkeds[index] = new_checked;
    this.setState({
      checkeds: new_checkeds,
      msg: "Salvar",
    });
  }

  onSubmit(event) {
    event.preventDefault();
  }

  render() {
    const { submitting } = this.props;
    const { user } = this.props.accounts;
    return (
      <Layout pageHeader={this.translate("ListActivities.pageHeader")}>
        <Helmet title={this.translate("ListActivities.pageHeader")} />
        <Body>
          <section className="section">
            <div className="container">
              <div className="columns">
                <div className="column">
                  <h1 className="mb-20 is-size-4">
                    {parse(this.translate("ListActivities.pageHeader"))}
                  </h1>
                  <form id="form" onSubmit={this.onSubmit}>
                    <div className="mb-20">
                      {parse(this.translate("ListActivities.description1"))}
                    </div>
                    {!isMonitor(user) && (
                      <div className="mb-20">
                        {parse(this.translate("ListActivities.description2"))}{" "}
                        <i className="far fa-clock"></i>
                      </div>
                    )}
                    {this.state.activities.map((input, inputIndex) => (
                      <div key={inputIndex} className={styles.single_check_box}>
                        <p>
                          <input
                            id={input._id.$oid}
                            value={inputIndex}
                            className="checkbox-control"
                            onClick={this.handleInputChange.bind(this)}
                            name="check_activity"
                            checked={this.state.checkeds[inputIndex]}
                            type="checkbox"
                            key={inputIndex}
                          />{" "}
                          <span className={styles.activitie__title}>
                            {this.translate(
                              `ListActivities.checkbox.activity_${inputIndex}_title`
                            )}
                          </span>
                        </p>
                        <p>
                          <i>
                            {this.translate(
                              `ListActivities.checkbox.activity_${inputIndex}_description`
                            )}
                          </i>
                        </p>
                        <p className="mt-1">
                          {parse(this.translate("ListActivities.downloadFile"))}
                          :{" "}
                          <a
                            target="_blank"
                            href={this.translate(
                              `ListActivities.material${inputIndex + 1}`
                            )}
                          >
                            {parse(this.translate("ListActivities.here"))}{" "}
                            <i
                              className="fa fa-arrow-circle-down fa-3"
                              aria-hidden="true"
                            />
                          </a>
                        </p>
                      </div>
                    ))}
                    <div className={styles.field}>
                      {!isMonitor(user) && (
                        <SubmitBtn
                          onClick={this.save.bind(this)}
                          className={classnames("is-primary", {
                            "is-loading":
                              this.state && this.state.setting_valid
                                ? true
                                : false,
                          })}
                        >
                          {this.state.msg}
                        </SubmitBtn>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </Body>
      </Layout>
    );
  }
}

export default injectIntl(
  compose(APIDataContainer, NonUserRedir, NonAdminRedir)(ListActivities)
);
