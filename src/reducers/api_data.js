import {
  FETCH_TRANSLATIONS,
  FETCH_REGIONS,
  FETCH_COUNTRIES,
  FETCH_PROVINCES,
  FETCH_STATES,
  FETCH_CITIES,
  FETCH_SCHOOLS,
  FETCH_SCHOOL,
  FETCH_LANGUAGES,
  IS_FETCHING_SURVEY_ANSWERS,
  IS_FETCHING_SCHOOL_PLANS_ANSWERS,
  IS_FETCHING_SCHOOL_PLANS_RESULTS,
  IS_FETCHING_SCHOOLS,
  IS_FETCHING_MANAGERS,
  IS_FETCHING_TECHNICALS,
  RECEIVE_TRANSLATIONS,
  RECEIVE_REGIONS,
  RECEIVE_COUNTRIES,
  RECEIVE_PROVINCES,
  RECEIVE_STATES,
  RECEIVE_CITIES,
  RECEIVE_SCHOOLS,
  RECEIVE_SURVEY_ANSWERS,
  RECEIVE_SCHOOL_PLANS_ANSWERS,
  RECEIVE_SCHOOL_PLANS_RESULTS,
  RECEIVE_MANAGERS,
  RECEIVE_REGIONALS,
  RECEIVE_TECHNICALS,
  RECEIVE_SCHOOL,
  RECEIVE_LANGUAGES,
} from "~/actions/api_data";

export default function (
  state = {
    regions: [],
    countries: [],
    provinces: [],
    translations: [],
    states: [],
    cities: [],
    school: {},
    schools: [],
    managers: [],
    regionals: [],
    technicals: [],
    languages: [],
    user: {},
    isFetchingCountries: false,
    isFetchingProvinces: false,
    isFetchingRegions: false,
    isFetchingStates: false,
    isFetchingCities: false,
    isFetchingSchools: false,
    isFetchingSchool: false,
    surveyAnswers: {},
    schoolPlansAnswers: {},
    schoolPlansResults: {},
    isFetchingSurveyAnswers: false,
    isFetchingSchoolPlansAnswers: false,
    isFetchingSchoolPlansResults: false,
    isFetchingSchools: false,
    isFetchingManagers: false,
    isFetchingTechnicals: false,
    surveyAnswersFetchParams: {
      page: 0,
      filters: {},
    },
    schoolPlansAnswersFetchParams: {
      page: 0,
      filters: {},
    },
    schoolPlansResultsFetchParams: {},
    fetchParams: {
      page: 0,
      filters: {},
    },
  },
  action
) {
  switch (action.type) {
    case RECEIVE_REGIONS:
      return {
        ...state,
        isFetchingRegions: false,
        regions: action.regions,
        schools: [],
      };
    case RECEIVE_TRANSLATIONS:
      return {
        ...state,
        translations: action.translations,
      };
    case RECEIVE_COUNTRIES:
      return {
        ...state,
        isFetchingStates: false,
        countries: action.countries,
      };
    case RECEIVE_PROVINCES:
      return {
        ...state,
        isFetchingProvinces: false,
        provinces: action.provinces,
      };
    case RECEIVE_STATES:
      return {
        ...state,
        isFetchingStates: false,
        states: action.states,
      };
    case RECEIVE_CITIES:
      return {
        ...state,
        isFetchingCities: false,
        cities: action.cities,
      };
    case RECEIVE_SCHOOLS:
      return {
        ...state,
        isFetchingSchools: false,
        schools: action.schools,
      };
    case RECEIVE_SCHOOL:
      return {
        ...state,
        isFetchingSchool: false,
        school: action.school,
      };
    case RECEIVE_SURVEY_ANSWERS:
      return {
        ...state,
        isFetchingSurveyAnswers: false,
        surveyAnswers: action.surveyAnswers,
      };
    case RECEIVE_SCHOOL_PLANS_ANSWERS:
      return {
        ...state,
        isFetchingSchoolPlansAnswers: false,
        schoolPlansAnswers: action.schoolPlansAnswers,
      };
    case RECEIVE_SCHOOL_PLANS_RESULTS:
      return {
        ...state,
        isFetchingSchoolPlansResults: false,
        schoolPlansResults: action.schoolPlansResults,
      };
    // case RECEIVE_SCHOOLS:
    //   return {
    //     ...state,
    //     isFetchingSchools: false,
    //     schools: action.listData,
    //   };
    case RECEIVE_MANAGERS:
      return {
        ...state,
        isFetchingManagers: false,
        managers: action.listData,
      };
    case RECEIVE_REGIONALS:
      return {
        ...state,
        regionals: action.listData,
      };
    case RECEIVE_TECHNICALS:
      return {
        ...state,
        isFetchingTechnicals: false,
        technicals: action.listData,
      };
    case RECEIVE_LANGUAGES:
      return {
        ...state,
        isFetchingLanguages: false,
        languages: action.languages,
      };
    case IS_FETCHING_SURVEY_ANSWERS:
      return {
        ...state,
        isFetchingSurveyAnswers: true,
        surveyAnswersFetchParams: action.surveyAnswersFetchParams,
      };
    case IS_FETCHING_SCHOOL_PLANS_ANSWERS:
      return {
        ...state,
        isFetchingSchoolPlansAnswers: true,
        schoolPlansAnswersFetchParams: action.schoolPlansAnswersFetchParams,
      };
    case IS_FETCHING_SCHOOL_PLANS_RESULTS:
      return {
        ...state,
        isFetchingSchoolPlansResults: true,
        schoolPlansResultsFetchParams: action.schoolPlansResultsFetchParams,
      };
    case IS_FETCHING_SCHOOLS:
      return {
        ...state,
        isFetchingSchools: true,
        fetchParams: action.fetchParams,
      };
    case IS_FETCHING_MANAGERS:
      return {
        ...state,
        isFetchingManagers: true,
        fetchParams: action.fetchParams,
      };
    case IS_FETCHING_TECHNICALS:
      return {
        ...state,
        isFetchingTechnicals: true,
        fetchParams: action.fetchParams,
      };
    case FETCH_SCHOOLS:
      return {
        ...state,
        isFetchingSchools: true,
      };
    case FETCH_SCHOOL:
      return {
        ...state,
        isFetchingSchool: true,
      };
    case FETCH_TRANSLATIONS:
      return {
        ...state,
      };
    case FETCH_CITIES:
      return {
        ...state,
        isFetchingCities: true,
      };

    case FETCH_COUNTRIES:
      return {
        ...state,
        isFetchingCountries: true,
      };
    case FETCH_PROVINCES:
      return {
        ...state,
        isFetchingProvinces: true,
      };
    case FETCH_STATES:
      return {
        ...state,
        isFetchingStates: true,
      };
    case FETCH_REGIONS:
      return {
        ...state,
        isFetchingRegions: true,
      };
    case FETCH_LANGUAGES:
      return {
        ...state,
        isFetchingLanguages: true,
      };
    default:
      return Object.assign({}, state);
  }
}
