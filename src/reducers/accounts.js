import {
  IS_SIGNING_IN,
  RECEIVE_CURRENT_USER,
  RECEIVE_SURVEY_URL,
  RECEIVE_COMPLETED_SURVEY,
  RECEIVE_PRINT_SURVEY_URL,
  LOGOUT_USER,
  LOGIN_ERROR,
} from '~/actions/accounts';

export default function(state = {
  user: {},
  isSigningIn: false,
}, action){
  switch(action.type){
    case IS_SIGNING_IN:
      return {
        ...state,
        isSigningIn: true,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loginError: action.error,
        isSigningIn: false,
      };
    case RECEIVE_CURRENT_USER:
      return {
        ...state,
        user: action.user,
        isSigningIn: false,
        loginError: null,
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: {},
      };
    case RECEIVE_SURVEY_URL:
      return {
        ...state,
        userSurveyUrl: action.url,
      };
    case RECEIVE_PRINT_SURVEY_URL:
      return {
        ...state,
        userPrintSurveyUrl: action.url,
      };
    default:
      return Object.assign({}, state);
  }
}
