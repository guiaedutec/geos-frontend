import React from 'react';
import Helmet from 'react-helmet';
import classnames from 'classnames';
import {
    compose
} from 'redux';

// Components
import ManagerForm from './components/Form';
import Layout from '../../components/Layout';
import Body from '~/components/Body';

// Containers
import UserRedir from '~/containers/user_redir';

// Style
import styles from './index.styl';

class Manager extends React.Component {
    render() {
        return (
            <Layout pageHeader="Cadastrar Contato">
                <Helmet title="Escola"/>

                <Body>
                    <section className="section">
                        <div className="container">
                        <div className={classnames('columns')}>
                            <div className="column is-half">
                                <ManagerForm />
                            </div>
                        </div>
                        </div>
                    </section>
                </Body>
            </Layout>
        );
    }
}

export default compose(
)(Manager);
