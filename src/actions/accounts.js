import API from "~/api";

export const IS_SIGNING_IN = "accounts/IS_SIGNING_IN";
export const LOGIN_ERROR = "accounts/LOGIN_ERROR";
export const LOGOUT_USER = "accounts/LOGOUT_USER";
export const RECEIVE_CURRENT_USER = "accounts/RECEIVE_CURRENT_USER";
export const RECEIVE_COMPLETED_SURVEY = "accounts/RECEIVE_COMPLETED_SURVEY";
export const RECEIVE_SURVEY_URL = "accounts/RECEIVE_SURVEY_URL";
export const RECEIVE_PRINT_SURVEY_URL = "accounts/RECEIVE_PRINT_SURVEY_URL";

export function receiveCurrentUser({ user }) {
  return {
    type: RECEIVE_CURRENT_USER,
    user,
  };
}

function loginError({ error }) {
  return {
    type: LOGIN_ERROR,
    error,
  };
}

function isSigningIn() {
  return {
    type: IS_SIGNING_IN,
    loginError: null,
  };
}

export function loginWithToken() {
  return (dispatch) => {
    dispatch(isSigningIn());

    return API.Users.loginWithToken().then((user) =>
      dispatch(receiveCurrentUser({ user }))
    );
  };
}

export function loginUser({ email, password }) {
  return (dispatch) => {
    dispatch(isSigningIn());

    return API.Users.login({ email, password }).then(
      (user) => dispatch(receiveCurrentUser({ user })),
      (error) => dispatch(loginError({ error: error.message }))
    );
  };
}

export function logoutUser() {
  API.Users.logout();

  return {
    type: LOGOUT_USER,
  };
}

export function completedSurvey(user) {
  return (dispatch) => {
    return API.SurveyAnswers.completeSurveyForUser(user);
  };
}
