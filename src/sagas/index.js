import {
  watchFetchAnswers,
  watchFetchSchoolPlans,
  watchFetchSchoolPlansResults,
  watchFetchSchools,
  watchFetchManagers,
  watchFetchRegionals,
  watchFetchTechnicals,
  watchUpdateSchool,
  watchFetchCitySchools,
  watchFetchSchool,
} from './api_data';

export default function* rootSaga() {
  yield [
    watchFetchAnswers(),
    watchFetchSchoolPlans(),
    watchFetchSchoolPlansResults(),
    watchFetchSchools(),
    watchFetchManagers(),
    watchFetchRegionals(),
    watchFetchTechnicals(),
    watchUpdateSchool(),
    watchFetchCitySchools(),
    watchFetchSchool(),
  ];
}
