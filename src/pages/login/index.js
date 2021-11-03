/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

import history from "~/core/history";
import AccountsContainer from "~/containers/accounts";
import Layout from "../../components/Layout";
import Body from "../../components/Body";
import LoginEducator from "./educator/LoginEducator";
import LoginSchool from "./school/LoginSchool";
import LoginManager from "./manager/LoginManager";
import { redirectDefaultPageByUser } from "~/helpers/users";

export class Login extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.accounts.user)) {
      history.push(redirectDefaultPageByUser(nextProps.accounts.user));
    }
  }

  render() {
    const typeOfUser = this.props.route.path.replace("/", "");

    return (
      <Layout type={typeOfUser}>
        <Helmet title="Guia EduTec" />
        <Body>
          {(function () {
            switch (typeOfUser) {
              case "educador":
                return <LoginEducator />;
              case "escola":
                return <LoginSchool />;
              case "gestor":
                return <LoginManager />;
              default:
                return null;
            }
          })()}
        </Body>
      </Layout>
    );
  }
}

Login.propTypes = {
  accounts: PropTypes.object.isRequired,
};

export default AccountsContainer(Login);
