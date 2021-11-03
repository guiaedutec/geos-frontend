import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./Profile.styl";
import AccountsContainer from "~/containers/accounts";
import Button from "../../../components/Button";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
class Profile extends React.Component {
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }
  render() {
    return (
      <section className={styles.profile__body}>
        <div className="columns">
          <div className="column has-text-centered is-uppercase">
            <div className={styles.item}>
              {/* <div className={styles.icon}>
                <img
                  src={require("../../../../public/images/icons/educador.svg")}
                  alt=""
                />
              </div> */}
              <div className="is-size-4 mb-5">
                {" "}
                {parse(this.translate("Home.teacher"))}
              </div>
              {/* <p>
                {parse(this.translate("Home.teacherDescription"))}
              </p> */}
              <Button
                to="/educador"
                className={classNames(
                  "button is-size-7 has-text-weight-bold",
                  styles.btn__light
                )}
              >
                {parse(this.translate("Home.clickHere"))}
              </Button>
            </div>
          </div>
          <div className="column has-text-centered is-uppercase">
            <div className={styles.item}>
              {/* <div className={styles.icon}>
                <img
                  src={require("../../../../public/images/icons/escola.svg")}
                  alt=""
                />
              </div> */}
              <div className="is-size-4 mb-5">
                {parse(this.translate("Home.school"))}
              </div>
              {/* <p>
                {parse(this.translate("Home.schoolDescription"))}
              </p> */}
              <Button
                to="/escola"
                className={classNames(
                  "button is-size-7 has-text-weight-bold",
                  styles.btn__light
                )}
              >
                {parse(this.translate("Home.clickHere"))}
              </Button>
            </div>
          </div>
          <div className="column has-text-centered is-uppercase">
            <div className={styles.item}>
              {/* <div className={styles.icon}>
                <img
                  src={require("../../../../public/images/icons/rede.svg")}
                  alt=""
                />
              </div> */}
              <div className="is-size-4 mb-5">
                {parse(this.translate("Home.teachingNetwork"))}
              </div>
              {/* <p>
                {parse(this.translate("Home.teachingNetworkDescription"))}
              </p> */}
              <Button
                to="/gestor"
                className={classNames(
                  "button is-size-7 has-text-weight-bold",
                  styles.btn__light
                )}
              >
                {parse(this.translate("Home.clickHere"))}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Profile.propTypes = {
  accounts: PropTypes.object.isRequired,
};

export default injectIntl(AccountsContainer(Profile));
