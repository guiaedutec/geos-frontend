import React from "react";
import PropTypes from "prop-types";
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

// components
import Layout from "~/components/Layout";
import Body from "~/components/Body";
import AdminCountryTable from "./components/AdminCountryList/AdminCountryTable";
import ReactModal from "react-modal";

// containers
import APIContainer from "~/containers/api_data";

// styles
import styles from "./adminsCountries.styl";

class ListAdminsCountries extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      showModal2: false,
      showModal3: false,
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

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };
  handleCloseModal = () => {
    this.setState({ showModal: false });
  };
  handleOpenModal2 = () => {
    this.setState({ showModal2: true });
  };
  handleCloseModal2 = () => {
    this.setState({ showModal2: false });
  };
  handleOpenModal3 = () => {
    this.setState({ showModal3: true });
  };
  handleCloseModal3 = () => {
    this.setState({ showModal3: false });
  };

  render() {
    const {
      apiData: { surveyAnswers },
    } = this.props;

    return (
      <Layout
        pageHeader={this.translate("AdminsCountriesTable.adminsCountries")}
      >
        <Helmet
          title={this.translate("AdminsCountriesTable.adminsCountries")}
        />

        <Body>
          <AdminCountryTable />
        </Body>
      </Layout>
    );
  }
}

ListAdminsCountries.propTypes = {
  apiData: PropTypes.object,
};

export default injectIntl(compose(APIContainer)(ListAdminsCountries));
