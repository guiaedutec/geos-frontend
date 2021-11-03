import React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";
import { compose } from "redux";

// Components
import SchoolForm from "./components/SchoolForm";
import Layout from "../../components/Layout";
import Body from "~/components/Body";

// Containers
import UserRedir from "~/containers/user_redir";

// Style
import styles from "./school.styl";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
class School extends React.Component {
  constructor() {
    super();
    this.state = {
      visibleInstructions: false,
    };
  }

  translate = (id) => this.props.intl.formatMessage({ id });

  componentWillMount() {
    const url = window.location.href;
    const config = url.split("?")[1];

    if (config) {
      this.setState({ visibleInstructions: false });
    } else {
      this.setState({ visibleInstructions: true });
    }
  }

  render() {
    return (
      <Layout pageHeader={this.translate("CreateSchool.pageHeader")}>
        <Helmet title="Escola" />

        <Body>
          <SchoolForm />
        </Body>
      </Layout>
    );
  }
}

export default injectIntl(compose()(School));
