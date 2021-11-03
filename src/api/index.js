import users from "./users";
import regions from "./regions";
import countries from "./countries";
import provinces from "./provinces";
import translations from "./translations";
import cities from "./cities";
import states from "./states";
import schools from "./schools";
import languages from "./languages";
import managers from "./managers";
import surveyAnswers from "./survey_answers";
import schoolPlansAnswers from "./school_plan_answers";
import schoolPlansResults from "./school_plan_results";

const settings = {
  apiURL: process.env.API_URL,
  users: {
    operate: "api/v1/users",
    forgotPassword: "users/password.json",
    resetPassword: "users/password.json",
    changePassword: "api/v1/change_password.json",
    signIn: "users/sign_in.json",
    changeUserPasswordByAdmin: "api/v1/change_user_password.json",
  },
  regions: {
    read: "api/v1/regions.json",
  },
  countries: {
    read: "api/v1/countries.json",
  },
  provinces: {
    read: "api/v1/provincies.json",
  },
  states: {
    read: "api/v1/states.json",
  },
  cities: {
    read: "api/v1/cities.json",
  },
  schools: {
    operate: "api/v1/schools.json",
    regionals: "api/v1/school_regionals",
  },
  translations: {
    read: "api/v1/translation",
  },
  managers: {
    operate: "api/v1/managers",
  },
  surveyAnswers: {
    downloadSurveyAnswers: "api/v1/survey/answers.xls",
    getSurveyAnswers: "api/v1/survey/answers.json",
    completeSurvey: "api/v1/survey_answer.json",
  },
  schoolPlansAnswers: {
    getSchoolPlansAnswers: "api/v1/school_plans_answers.json",
  },
  schoolPlansResults: {
    getSchoolPlansResults: "api/v1/school_plans_results.json",
  },
};

export default {
  Users: users(settings),
  Regions: regions(settings),
  Cities: cities(settings),
  States: states(settings),
  Countries: countries(settings),
  Provinces: provinces(settings),
  Schools: schools(settings),
  Languages: languages(settings),
  Managers: managers(settings),
  Translations: translations(settings),
  SurveyAnswers: surveyAnswers(settings),
  SchoolPlansAnswers: schoolPlansAnswers(settings),
  SchoolPlansResults: schoolPlansResults(settings),
  ApiURL: settings.apiURL,
  CalcInfraURL: settings.calcInfraURL,
};
