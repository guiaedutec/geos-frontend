import React from "react";
import _ from "lodash";
import history from "~/core/history";
import { isAdmin, isAdminCountry } from "~/helpers/users";
import AccountsContainer from "./accounts";

function composer(Component) {
  function NonAdminRedir(props) {
    const {
      accounts: { user, isSigningIn },
    } = props;

    if (
      !_.isEmpty(user) &&
      !isSigningIn &&
      !isAdmin(user) &&
      !isAdminCountry(user)
    ) {
      history.push("/");
      return <div />;
    }

    return <Component {...props} />;
  }

  NonAdminRedir.displayName = "NonAdminRedir";

  return AccountsContainer(NonAdminRedir);
}

export default composer;
