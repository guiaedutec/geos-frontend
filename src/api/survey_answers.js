import {
  createUrlWithParams,
  getUserToken,
  getUrlParamString
} from './utils';
import _ from 'lodash';

export default function({apiURL, surveyAnswers}){
  return {
    /**
     * Fetch survey answers with the passed params
     * for a overview look on the params check the board on Trello:
     * https://trello.com/c/NEXNqpAP/5-devolutivas
    **/

    getDownloadSurveyAnswerLink(params = {}){
      const requestUrl = createUrlWithParams(`${apiURL}/${surveyAnswers.downloadSurveyAnswers}`, {
        ...params,
        access_token: getUserToken(),
      });

      return requestUrl;
    },

    getSurveyAnswers(params = { page: 0 }){

      let state_id = getUrlParamString('state_id')
      let city_id = getUrlParamString('city_id')
      let network = getUrlParamString('network')

      if (state_id)
        params['state_id'] = state_id

      if (city_id)
        params['city_id'] = city_id

      if (network)
        params['network'] = network

      const requestUrl = createUrlWithParams(`${apiURL}/${surveyAnswers.getSurveyAnswers}`, {
        ...params,
        access_token: getUserToken(),
      });

      return fetch(requestUrl).then(response => response.json());
    },

    completeSurveyForUser(user) {
      return fetch(`${apiURL}/${surveyAnswers.completeSurvey}`, {
        method: 'POST',
        body: JSON.stringify({
          access_token: getUserToken(),
          sguid: _.get(user, '_id.$oid'),
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json());
    },
  };
}
