import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import classNames from "classnames";
import AccountsContainer from "~/containers/accounts";
import Helmet from "react-helmet";

import Layout from "~/components/Layout";
import Body from "~/components/Body";

class UserActionsMenu extends React.Component {
  render() {
    return (
      <Layout>
        <Helmet title="Questionário & Devolutiva" />

        <Body className={classNames("section")}>
          Click no menu superior para sair.
        </Body>
      </Layout>
    );
  }
}

export default compose(AccountsContainer)(UserActionsMenu);
