import React from 'react';
import _ from 'lodash';
import history from '~/core/history';
import { isAdminStateCity } from '~/helpers/users';
import AccountsContainer from './accounts';

function composer(Component){
  function NonAdminStateCityRedir(props){
    const {
      accounts: {
        user,
        isSigningIn,
      },
    } = props;
    if (
      !_.isEmpty(user) &&
      !isSigningIn &&
      !isAdminStateCity(user)
    ){
      history.push('/');
      return <div/>;
    }

    return <Component {...props}/>;
  }

    NonAdminStateCityRedir.displayName = 'NonAdminStateCityRedir';

  return AccountsContainer(NonAdminStateCityRedir);
}

export default composer;
