import React from "react";
import Helmet from "react-helmet";
import _ from "lodash";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import parse from "html-react-parser";
import { compose } from "redux";

// components
import Layout from "~/components/Layout";
import Body from "~/components/Body";
import TechnicalsTable from "./components/TechnicalList/TechnicalsTable";

// containers
import APIContainer from "~/containers/api_data";
import AccountsContainer from "~/containers/accounts";
import NonUserRedir from "~/containers/non_user_redir";
import NonAdminStateCityRedir from "~/containers/non_admin_state_city_redir";
import { isStateAdmin, isCityAdmin } from "~/helpers/users";

// styles
import styles from "./technicals.styl";

class ListTechnicals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: "",
    };
  }

  componentDidMount() {
    const routeProfile = this.props.route.path.replace("/listar-usuario/", "");

    if (routeProfile === "administradores") {
      this.setState({
        profile: this.translate("ListUsersAdmin.pageHeaderTitle"),
      });
    } else if (routeProfile === "diretores") {
      this.setState({
        profile: this.translate("ListUsersDirectors.pageHeaderTitle"),
      });
    } else if (routeProfile === "professores") {
      this.setState({
        profile: this.translate("ListUsersProfessores.pageHeaderTitle"),
      });
    }
  }
  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    const { user } = this.props.accounts;

    return (
      <Layout pageHeader={this.state.profile}>
        <Helmet title={_.capitalize(this.state.profile)} />

        <Body>
          <section className="section">
            <div className="container mb-30">
              <div className="columns">
                <div className="column">
                  {this.state.profile.toLowerCase() === "administradores" &&
                    parse(this.translate("TechnicalsList.managersDescription"))}
                  {this.state.profile.toLowerCase() === "diretores" &&
                    parse(this.translate("TechnicalsList.principalDescription"))}
                  {this.state.profile.toLowerCase() === "professores" &&
                    parse(this.translate("TechnicalsList.teachersDescription"))}
                </div>
              </div>
            </div>
           
            <TechnicalsTable profile={this.state.profile} />
          </section>
        </Body>
      </Layout>
    );
  }
}

ListTechnicals.propTypes = {};

export default injectIntl(
  compose(
    AccountsContainer,
    APIContainer,
    NonAdminStateCityRedir
  )(ListTechnicals)
);
