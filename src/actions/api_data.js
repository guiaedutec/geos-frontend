import API from "~/api";

export const FETCH_TRANSLATIONS = "apiData/FETCH_TRANSLATIONS";
export const FETCH_REGIONS = "apiData/FETCH_REGIONS";
export const FETCH_STATES = "apiData/FETCH_STATES";
export const FETCH_COUNTRIES = "apiData/FETCH_COUNTRIES";
export const FETCH_PROVINCES = "apiData/FETCH_PROVINCES";
export const FETCH_CITIES = "apiData/FETCH_CITIES";
export const FETCH_SCHOOLS = "apiData/FETCH_SCHOOLS";
export const FETCH_SCHOOL = "apiData/FETCH_SCHOOL";
export const UPDATE_SCHOOL = "apiData/UPDATE_SCHOOL";
export const FETCH_ANSWERS = "apiData/FETCH_ANSWERS";
export const FETCH_SCHOOL_PLANS = "apiData/FETCH_SCHOOL_PLANS";
export const FETCH_SCHOOL_PLANS_RESULTS = "apiData/FETCH_SCHOOL_PLANS_RESULTS";
export const FETCH_MANAGERS = "apiData/FETCH_MANAGERS";
export const FETCH_REGIONALS = "apiData/FETCH_REGIONALS";
export const FETCH_TECHNICALS = "apiData/FETCH_TECHNICALS";
export const FETCH_LANGUAGES = "apiData/FETCH_LANGUAGES";
export const IS_FETCHING_SURVEY_ANSWERS = "apiData/IS_FETCHING_SURVEY_ANSWERS";
export const IS_FETCHING_SCHOOL_PLANS_ANSWERS =
  "apiData/IS_FETCHING_SCHOOL_PLANS_ANSWERS";
export const IS_FETCHING_SCHOOL_PLANS_RESULTS =
  "apiData/IS_FETCHING_SCHOOL_PLANS_RESULTS";
export const IS_FETCHING_SCHOOLS = "apiData/IS_FETCHING_SCHOOLS";
export const IS_FETCHING_MANAGERS = "apiData/IS_FETCHING_MANAGERS";
export const IS_FETCHING_TECHNICALS = "apiData/IS_FETCHING_TECHNICALS";
export const RECEIVE_STATES = "apiData/RECEIVE_STATES";
export const RECEIVE_COUNTRIES = "apiData/RECEIVE_COUNTRIES";
export const RECEIVE_PROVINCES = "apiData/RECEIVE_PROVINCES";
export const RECEIVE_CITIES = "apiData/RECEIVE_CITIES";
export const RECEIVE_SCHOOLS = "apiData/RECEIVE_SCHOOLS";
export const RECEIVE_SCHOOL = "apiData/RECEIVE_SCHOOL";
export const RECEIVE_SURVEY_ANSWERS = "apiData/RECEIVE_SURVEY_ANSWERS";
export const RECEIVE_SCHOOL_PLANS_ANSWERS =
  "apiData/RECEIVE_SCHOOL_PLANS_ANSWERS";
export const RECEIVE_SCHOOL_PLANS_RESULTS =
  "apiData/RECEIVE_SCHOOL_PLANS_RESULTS";
export const RECEIVE_MANAGERS = "apiData/RECEIVE_MANAGERS";
export const RECEIVE_REGIONALS = "apiData/RECEIVE_REGIONALS";
export const RECEIVE_REGIONS = "apiData/RECEIVE_REGIONS";
export const RECEIVE_TECHNICALS = "apiData/RECEIVE_TECHNICALS";
export const RECEIVE_LANGUAGES = "apiData/RECEIVE_LANGUAGES";
export const RECEIVE_TRANSLATIONS = "apiData/RECEIVE_TRANSLATIONS";

export function receiveTranslations({ translations }) {
  return {
    type: RECEIVE_TRANSLATIONS,
    translations,
  };
}

export function receiveCountries({ countries }) {
  return {
    type: RECEIVE_COUNTRIES,
    countries,
  };
}

export function receiveProvinces({ provinces }) {
  return {
    type: RECEIVE_PROVINCES,
    provinces,
  };
}

export function receiveStates({ states }) {
  return {
    type: RECEIVE_STATES,
    states,
  };
}

export function receiveCities({ cities }) {
  return {
    type: RECEIVE_CITIES,
    cities,
  };
}

export function receiveSchools({ schools }) {
  return {
    type: RECEIVE_SCHOOLS,
    schools,
  };
}

export function receiveSchool({ school }) {
  return {
    type: RECEIVE_SCHOOL,
    school,
  };
}

export function receiveRegions({ regions }) {
  return {
    type: RECEIVE_REGIONS,
    regions,
  };
}

export function receiveSurveyAnswers({ surveyAnswers }) {
  return {
    type: RECEIVE_SURVEY_ANSWERS,
    surveyAnswers,
  };
}

export function receiveSchoolPlansAnswers({ schoolPlansAnswers }) {
  return {
    type: RECEIVE_SCHOOL_PLANS_ANSWERS,
    schoolPlansAnswers,
  };
}

export function receiveSchoolPlansResults({ schoolPlansResults }) {
  return {
    type: RECEIVE_SCHOOL_PLANS_RESULTS,
    schoolPlansResults,
  };
}

// export function receiveSchools({ listData }) {
//   return {
//     type: RECEIVE_SCHOOLS,
//     listData,
//   };
// }

export function receiveManagers({ listData }) {
  return {
    type: RECEIVE_MANAGERS,
    listData,
  };
}

export function receiveRegionals({ listData }) {
  return {
    type: RECEIVE_REGIONALS,
    listData,
  };
}

export function receiveTechnicals({ listData }) {
  return {
    type: RECEIVE_TECHNICALS,
    listData,
  };
}

export function isFetchingSurveyAnswers(surveyAnswersFetchParams) {
  return {
    type: IS_FETCHING_SURVEY_ANSWERS,
    surveyAnswersFetchParams,
  };
}

export function isFetchingSchoolPlansAnswers(schoolPlansAnswersFetchParams) {
  return {
    type: IS_FETCHING_SCHOOL_PLANS_ANSWERS,
    schoolPlansAnswersFetchParams,
  };
}

export function isFetchingSchoolPlansResults(schoolPlansResultsFetchParams) {
  return {
    type: IS_FETCHING_SCHOOL_PLANS_RESULTS,
    schoolPlansResultsFetchParams,
  };
}

export function isFetchingSchools(fetchParams) {
  return {
    type: IS_FETCHING_SCHOOLS,
    fetchParams,
  };
}

export function isFetchingManagers(fetchParams) {
  return {
    type: IS_FETCHING_MANAGERS,
    fetchParams,
  };
}

export function isFetchingTechnicals(fetchParams) {
  return {
    type: IS_FETCHING_TECHNICALS,
    fetchParams,
  };
}

export function fetchCitySchools({
  city_id,
  state_id,
  provincia_id,
  direccion_regional_id,
  type_school,
  complete,
}) {
  return {
    type: FETCH_CITY_SCHOOLS,
    city_id,
    state_id,
    provincia_id,
    direccion_regional_id,
    type_school,
    complete,
  };
}

export function fetchSchools(country_id, province_id, state_id, city_id) {
  return (dispatch) => {
    dispatch({ type: FETCH_SCHOOLS });
    API.Schools.getAllByIds(country_id, province_id, state_id, city_id).then(
      (schools) => {
        dispatch(receiveSchools({ schools }));
      }
    );
  };
}

export function fetchSchoolsByAffiliationId(affiliation_id) {
  return (dispatch) => {
    dispatch({ type: FETCH_SCHOOLS });
    API.Schools.getAllByAffiliationId(affiliation_id).then((schools) => {
      dispatch(receiveSchools({ schools }));
    });
  };
}

export function fetchSchool(school_id) {
  return (dispatch) => {
    dispatch({ type: FETCH_SCHOOL });
    API.Schools.findOne(school_id).then((school) => {
      dispatch(receiveSchool({ school }));
    });
  };
}

export function fetchRegions() {
  return (dispatch) => {
    // Dispatching the fetching condition to update the state
    dispatch({ type: FETCH_REGIONS });
    API.Regions.getAll().then((regions) => {
      dispatch(receiveRegions({ regions }));
    });
  };
}

export function fetchTranslations(lang) {
  return (dispatch) => {
    dispatch({ type: FETCH_TRANSLATIONS });
    API.Translations.getAll(lang).then((translations) => {
      dispatch(receiveTranslations({ translations }));
    });
  };
}

export function fetchCountries() {
  return (dispatch) => {
    dispatch({ type: FETCH_COUNTRIES });
    API.Countries.getAll().then((countries) => {
      dispatch(receiveCountries({ countries }));
    });
  };
}

export function fetchProvinces(country_id) {
  return (dispatch) => {
    dispatch({ type: FETCH_PROVINCES });
    API.Provinces.getProvincesByCountryId(country_id).then((provinces) => {
      dispatch(receiveProvinces({ provinces }));
    });
  };
}

export function fetchStates(country_id, province_id) {
  return (dispatch) => {
    dispatch({ type: FETCH_STATES });
    API.States.getAllByIds(country_id, province_id).then((states) => {
      dispatch(receiveStates({ states }));
    });
  };
}

export function fetchCities(country_id, province_id, state_id) {
  return (dispatch) => {
    dispatch({ type: FETCH_CITIES });
    API.Cities.getAllByIds(country_id, province_id, state_id).then((cities) => {
      dispatch(receiveCities({ cities }));
    });
  };
}

export function fetchProvinceStatesByIds({ country_id, province_id }) {
  return (dispatch) => {
    // Dispatching the fetching condition to update the state
    dispatch({ type: FETCH_STATES });

    API.States.getAllByIds(country_id, province_id).then((states) => {
      dispatch(receiveStates({ states }));
    });
  };
}

export function fetchStateCitiesByIds({
  state_id,
  provincia_id,
  direccion_regional_id,
}) {
  return (dispatch) => {
    // Dispatching the fetching condition to update the state
    dispatch({ type: FETCH_STATE_CITIES });

    API.Cities.getAllByIds(state_id, provincia_id, direccion_regional_id).then(
      (cities) => {
        dispatch(receiveStateCities({ cities }));
      }
    );
  };
}

export function fetchSurveyAnswers(params = {}, currentParams = {}) {
  return {
    type: FETCH_ANSWERS,
    params,
    currentParams,
  };
}

export function fetchSchoolPlansAnswers(params = {}, currentParams = {}) {
  return {
    type: FETCH_SCHOOL_PLANS,
    params,
    currentParams,
  };
}

export function fetchSchoolPlansResults(params = {}, currentParams = {}) {
  return {
    type: FETCH_SCHOOL_PLANS_RESULTS,
    params,
    currentParams,
  };
}

// export function fetchSchools(params = {}, currentParams = {}) {
//   params = { ...params, complete: true };
//   return {
//     type: FETCH_SCHOOLS,
//     params,
//     currentParams,
//   };
// }

export function fetchManagers(params = {}, currentParams = {}) {
  return {
    type: FETCH_MANAGERS,
    params,
    currentParams,
  };
}

export function fetchRegionals(params = {}, currentParams = {}) {
  return {
    type: FETCH_REGIONALS,
    params,
    currentParams,
  };
}

export function fetchTechnicals(params = {}, currentParams = {}) {
  return {
    type: FETCH_TECHNICALS,
    params,
    currentParams,
  };
}

export function updateSchool({ schoolId, modifier, reFetchAnswers }) {
  return {
    type: UPDATE_SCHOOL,
    schoolId,
    modifier,
    reFetchAnswers,
  };
}

export function fetchLanguages() {
  return (dispatch) => {
    // Dispatching the fetching condition to update the state
    dispatch({ type: FETCH_LANGUAGES });

    API.Languages.getAll().then(({ data }) => {
      dispatch(receiveLanguages({ languages: data }));
    });
  };
}

export function receiveLanguages({ languages }) {
  return {
    type: RECEIVE_LANGUAGES,
    languages,
  };
}
