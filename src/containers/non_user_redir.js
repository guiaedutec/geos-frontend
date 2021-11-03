import React from 'react';
import AccountsContainer from './accounts';
import { getUserToken } from '../api/utils';
import history from '~/core/history';
import _ from 'lodash';

function composer(Component){
  function NonUserRedir(props){
    if(_.isEmpty(props.accounts.user) && !props.accounts.isSigningIn && !getUserToken()){
      history.replace('/');
      return <div/>;
    }

    return <Component {...props}/>;
  }

  NonUserRedir.displayName = 'NonUserRedir';

  return AccountsContainer(NonUserRedir);
}

export default composer;
