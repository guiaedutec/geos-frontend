import {
  createUrlWithParams,
  getUserToken,
  getUrlParamString
} from './utils';
import _ from 'lodash';

export default function({apiURL, schoolPlansResults}){
  return {
    /**
     * Fetch school plans answers with the passed params
     * for a overview look on the params check the board on Trello:
     * https://trello.com/c/NEXNqpAP/5-devolutivas
    **/

    getSchoolPlansResults(params = { page: 0 }){

      let state_id = getUrlParamString('state_id')
      let city_id = getUrlParamString('city_id')
      let institution = getUrlParamString('institution')

      if (state_id)
        params['state_id'] = state_id

      if (city_id)
        params['city_id'] = city_id

      if (institution)
        params['institution'] = institution

      const requestUrl = createUrlWithParams(`${apiURL}/${schoolPlansResults.getSchoolPlansResults}`, {
        ...params,
        access_token: getUserToken(),
      });

      return fetch(requestUrl).then(response => response.json());
    },

  };
}
