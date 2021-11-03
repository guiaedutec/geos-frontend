import React from 'react';
import { compose } from 'redux';
import _ from 'lodash';

import AccountsContainer from './accounts';
import ModalContainer from './modal';

import history from '~/core/history';


function composer(Component){
  function UserRedir(props){
    if(props.route.path !== "/criar-usuario/diretores" && props.route.path !== "/criar-usuario/professores"){
      if(!_.isEmpty(props.accounts.user) && !props.modal.isActive){
        history.replace('/recursos');
        return <div/>;
      }
    }

    return <Component {...props}/>;
  }

  UserRedir.displayName = 'UserRedir';

  return compose(AccountsContainer, ModalContainer)(UserRedir);
}

export default composer;
