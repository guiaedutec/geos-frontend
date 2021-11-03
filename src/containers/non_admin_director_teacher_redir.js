import React from 'react';
import _ from 'lodash';
import history from '~/core/history';
import { isDirectorOrTeacher, isOther } from '~/helpers/users';
import AccountsContainer from './accounts';

function composer(Component){
  function NonAdminDirectorOrTeacherRedir(props){
    const {
      accounts: {
        user,
        isSigningIn,
      },
    } = props;
    if (
      !_.isEmpty(user) &&
      !isSigningIn &&
      !(isDirectorOrTeacher(user) || isOther(user))
    ){
      history.push('/');
      return <div/>;
    }

    return <Component {...props}/>;
  }

    NonAdminDirectorOrTeacherRedir.displayName = 'NonAdminDirectorOrTeacherRedir';

  return AccountsContainer(NonAdminDirectorOrTeacherRedir);
}

export default composer;
