import React from "react";
import _ from "lodash";
import history from "~/core/history";
import { isAdminUser, isAdminCountry } from "~/helpers/users";
import AccountsContainer from "./accounts";

function composer(Component) {
  function NonAdminUserRedir(props) {
    const {
      accounts: { user, isSigningIn },
    } = props;

    if (
      !_.isEmpty(user) &&
      !isSigningIn &&
      !isAdminUser(user) &&
      !isAdminCountry(user) &&
      !(
        isAdminStateCity(this.props.accounts.user) &&
        this.props.accounts.user.institutions_admin
      )
    ) {
      history.push("/");
      return <div />;
    }

    return <Component {...props} />;
  }

  NonAdminUserRedir.displayName = "NonAdminUserRedir";

  return AccountsContainer(NonAdminUserRedir);
}

export default composer;
