import { takeLatest } from "redux-saga";
import { put, call } from "redux-saga/effects";
import {
  FETCH_ANSWERS,
  FETCH_SCHOOL_PLANS,
  FETCH_SCHOOL_PLANS_RESULTS,
  UPDATE_SCHOOL,
  FETCH_CITY_SCHOOLS,
  FETCH_SCHOOL,
  FETCH_SCHOOLS,
  FETCH_MANAGERS,
  FETCH_REGIONALS,
  FETCH_TECHNICALS,
  receiveSurveyAnswers,
  receiveSchoolPlansAnswers,
  receiveSchoolPlansResults,
  receiveSchools,
  receiveManagers,
  receiveRegionals,
  receiveTechnicals,
  receiveCitySchools,
  receiveSchool,
  isFetchingSurveyAnswers,
  isFetchingSchoolPlansAnswers,
  isFetchingSchoolPlansResults,
  isFetchingSchools,
  isFetchingManagers,
  isFetchingTechnicals,
} from "~/actions/api_data";
import API from "~/api";
import _ from "lodash";

export function* fetchAnswers({ currentParams, params }) {
  const finalParams = _(currentParams)
    .mergeWith(params, (objValue, srcValue) => {
      // we need to ensure that lodash.merge doesn't merge
      // an destination array with the source one, we need
      // that the source array overrides completely the destination one.
      if (_.isArray(objValue)) {
        return srcValue;
      }
    })
    .thru((merged) => ({
      ...merged,
      // Empty filters will come like
      // {sample: ['']}, so we compact them and check emptyness.
      filters: _.omitBy(merged.filters, (v) =>
        _(v).without(null, "").isEmpty()
      ),
    }))
    .value();

  yield put(isFetchingSurveyAnswers(finalParams));
  const surveyAnswers = yield API.SurveyAnswers.getSurveyAnswers(finalParams);
  yield put(receiveSurveyAnswers({ surveyAnswers }));
}

export function* fetchSchoolPlans({ currentParams, params }) {
  const finalParams = _(currentParams)
    .mergeWith(params, (objValue, srcValue) => {
      // we need to ensure that lodash.merge doesn't merge
      // an destination array with the source one, we need
      // that the source array overrides completely the destination one.
      if (_.isArray(objValue)) {
        return srcValue;
      }
    })
    .thru((merged) => ({
      ...merged,
      // Empty filters will come like
      // {sample: ['']}, so we compact them and check emptyness.
      filters: _.omitBy(merged.filters, (v) =>
        _(v).without(null, "").isEmpty()
      ),
    }))
    .value();

  yield put(isFetchingSchoolPlansAnswers(finalParams));
  const schoolPlansAnswers = yield API.SchoolPlansAnswers.getSchoolPlansAnswers(
    finalParams
  );
  yield put(receiveSchoolPlansAnswers({ schoolPlansAnswers }));
}

export function* fetchSchoolPlansResults({ currentParams, params }) {
  const finalParams = _(currentParams)
    .mergeWith(params, (objValue, srcValue) => {
      // we need to ensure that lodash.merge doesn't merge
      // an destination array with the source one, we need
      // that the source array overrides completely the destination one.
      if (_.isArray(objValue)) {
        return srcValue;
      }
    })
    .thru((merged) => ({
      ...merged,
      // Empty filters will come like
      // {sample: ['']}, so we compact them and check emptyness.
      filters: _.omitBy(merged.filters, (v) =>
        _(v).without(null, "").isEmpty()
      ),
    }))
    .value();

  yield put(isFetchingSchoolPlansResults(finalParams));
  const schoolPlansResults = yield API.SchoolPlansResults.getSchoolPlansResults(
    finalParams
  );
  yield put(receiveSchoolPlansResults({ schoolPlansResults }));
}

export function* fetchSchools({ currentParams, params }) {
  const finalParams = _(currentParams)
    .mergeWith(params, (objValue, srcValue) => {
      // we need to ensure that lodash.merge doesn't merge
      // an destination array with the source one, we need
      // that the source array overrides completely the destination one.
      if (_.isArray(objValue)) {
        return srcValue;
      }
    })
    .thru((merged) => ({
      ...merged,
      // Empty filters will come like
      // {sample: ['']}, so we compact them and check emptyness.
      filters: _.omitBy(merged.filters, (v) =>
        _(v).without(null, "").isEmpty()
      ),
    }))
    .value();

  yield put(isFetchingSchools(finalParams));
  const listData = yield API.Schools.search(finalParams);
  yield put(receiveSchools({ listData }));
}

export function* fetchManagers({ currentParams, params }) {
  const finalParams = _(currentParams)
    .mergeWith(params, (objValue, srcValue) => {
      // we need to ensure that lodash.merge doesn't merge
      // an destination array with the source one, we need
      // that the source array overrides completely the destination one.
      if (_.isArray(objValue)) {
        return srcValue;
      }
    })
    .thru((merged) => ({
      ...merged,
      // Empty filters will come like
      // {sample: ['']}, so we compact them and check emptyness.
      filters: _.omitBy(merged.filters, (v) =>
        _(v).without(null, "").isEmpty()
      ),
    }))
    .value();

  yield put(isFetchingManagers(finalParams));
  const listData = yield API.Managers.search(finalParams);
  yield put(receiveManagers({ listData }));
}

export function* fetchRegionals({ currentParams, params }) {
  const finalParams = _(currentParams)
    .mergeWith(params, (objValue, srcValue) => {
      // we need to ensure that lodash.merge doesn't merge
      // an destination array with the source one, we need
      // that the source array overrides completely the destination one.
      if (_.isArray(objValue)) {
        return srcValue;
      }
    })
    .thru((merged) => ({
      ...merged,
      // Empty filters will come like
      // {sample: ['']}, so we compact them and check emptyness.
      filters: _.omitBy(merged.filters, (v) =>
        _(v).without(null, "").isEmpty()
      ),
    }))
    .value();

  const listData = yield API.Schools.findRegionals(finalParams);
  yield put(receiveRegionals({ listData }));
}

export function* fetchTechnicals({ currentParams, params }) {
  const finalParams = _(currentParams)
    .mergeWith(params, (objValue, srcValue) => {
      // we need to ensure that lodash.merge doesn't merge
      // an destination array with the source one, we need
      // that the source array overrides completely the destination one.
      if (_.isArray(objValue)) {
        return srcValue;
      }
    })
    .thru((merged) => ({
      ...merged,
      // Empty filters will come like
      // {sample: ['']}, so we compact them and check emptyness.
      filters: _.omitBy(merged.filters, (v) =>
        _(v).without(null, "").isEmpty()
      ),
    }))
    .value();

  yield put(isFetchingTechnicals(finalParams));
  const listData = yield API.Users.search(finalParams);
  yield put(receiveTechnicals({ listData }));
}

export function* fetchCitySchools({
  city_id,
  state_id,
  provincia_id,
  direccion_regional_id,
  type_school,
  complete,
}) {
  const schools = yield API.Schools.getByIds(
    city_id,
    state_id,
    provincia_id,
    direccion_regional_id,
    type_school,
    complete
  );
  yield put(receiveCitySchools(schools.schools));
}

export function* fetchSchool({ school_id }) {
  const school = yield API.Schools.findOne(school_id);
  yield put(receiveSchool({ school }));
}

export function* updateSchool({ schoolId, modifier, reFetchAnswers }) {
  yield API.Schools.update(schoolId, modifier);
  yield call(fetchAnswers, { ...reFetchAnswers });
}

export function* watchFetchAnswers() {
  yield* takeLatest(FETCH_ANSWERS, fetchAnswers);
}

export function* watchFetchSchoolPlans() {
  yield* takeLatest(FETCH_SCHOOL_PLANS, fetchSchoolPlans);
}

export function* watchFetchSchoolPlansResults() {
  yield* takeLatest(FETCH_SCHOOL_PLANS_RESULTS, fetchSchoolPlansResults);
}

export function* watchFetchSchools() {
  yield* takeLatest(FETCH_SCHOOLS, fetchSchools);
}

export function* watchFetchManagers() {
  yield* takeLatest(FETCH_MANAGERS, fetchManagers);
}

export function* watchFetchRegionals() {
  yield* takeLatest(FETCH_REGIONALS, fetchRegionals);
}

export function* watchFetchTechnicals() {
  yield* takeLatest(FETCH_TECHNICALS, fetchTechnicals);
}

export function* watchUpdateSchool() {
  yield* takeLatest(UPDATE_SCHOOL, updateSchool);
}

export function* watchFetchCitySchools() {
  yield* takeLatest(FETCH_CITY_SCHOOLS, fetchCitySchools);
}

export function* watchFetchSchool() {
  yield* takeLatest(FETCH_SCHOOL, fetchSchool);
}
