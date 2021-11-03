import { createUrlWithParams, getUserToken, getUrlParamString } from "./utils";
import _ from "lodash";

export default function ({ apiURL, schoolPlansAnswers }) {
  return {
    getSchoolPlansAnswers(params = { page: 0 }) {
      let state_id = getUrlParamString("state_id");
      let city_id = getUrlParamString("city_id");
      let network = getUrlParamString("network");

      if (state_id) params["state_id"] = state_id;

      if (city_id) params["city_id"] = city_id;

      if (network) params["network"] = network;

      const requestUrl = createUrlWithParams(
        `${apiURL}/${schoolPlansAnswers.getSchoolPlansAnswers}`,
        {
          ...params,
          access_token: getUserToken(),
        }
      );

      return fetch(requestUrl).then((response) => response.json());
    },
  };
}
