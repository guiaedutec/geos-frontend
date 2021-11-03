import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import classnames from "classnames";
import { compose } from "redux";

// components
import Layout from "~/components/Layout";
import Body from "~/components/Body";
import ManagersTable from "./components/List/ManagersTable";

// containers
import APIContainer from "~/containers/api_data";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminRedir from "~/containers/non_admin_redir";

// styles
import styles from "./list.styl";

class ListManagers extends React.Component {
  render() {
    const {
      apiData: { surveyAnswers },
    } = this.props;

    return (
      <Layout pageHeader="Contatos">
        <Helmet title="Contatos" />

        <Body>
          <section className="section">
            <ManagersTable />
          </section>
        </Body>
      </Layout>
    );
  }
}

ListManagers.propTypes = {
  apiData: PropTypes.object,
};

export default compose(APIContainer)(ListManagers);
