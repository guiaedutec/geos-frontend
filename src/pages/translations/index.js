import React from 'react';
import Helmet from 'react-helmet';
import classnames from 'classnames';
import {
  compose
} from 'redux';
import { injectIntl } from 'react-intl';

// Components
import Translations from './components/Translations';
import Layout from '../../components/Layout';
import BodyConfig from '~/components/BodyConfig';

// Containers
import UserRedir from '~/containers/user_redir';

// Style
import styles from './technical.styl';

var getQueryString = function (field, url) {
  var href = url ? url : window.location.href;
  var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
  var string = reg.exec(href);
  return string ? string[1] : null;
};

class Technical extends React.Component {

  constructor () {
    super();
    this.state = {
      editable: false
    };
  }

  componentWillMount(){
    var idParam = getQueryString('id');
    if (idParam) {
      this.setState({
        editable: true
      })
    }
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  render() {
    return (
      <Layout className={styles.layout} pageHeader={this.state.editable ? this.translate("Technical.adminEdit") : this.translate("Technical.adminCreate")}>
        <Helmet
          title={this.state.editable ? this.translate("Technical.adminEdit") : this.translate("Technical.adminCreate")}
        />

        <BodyConfig className={styles.followup_container} classBodyName="body_imege" hideNext="true" prevURL={'/listar-usuario/administradores'}>
          <div className="column">
            <Translations editable={this.state.editable}/>
          </div>
        </BodyConfig>
      </Layout>
    );
  }
}

export default injectIntl(compose()(Technical));
