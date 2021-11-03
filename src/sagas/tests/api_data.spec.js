import { put, call } from 'redux-saga/effects';
import {
  takeLatest,
} from 'redux-saga';
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import {
  IS_FETCHING_SURVEY_ANSWERS,
  FETCH_CITY_SCHOOLS,
  FETCH_ANSWERS,
  receiveSurveyAnswers,
} from '../../actions/api_data';

const { describe, it } = global;
const API_RESPONSE = { ok: true };
const API = {
  SurveyAnswers: {
    getSurveyAnswers: sinon.stub().returns(Promise.resolve(API_RESPONSE)),
  },
  SchoolPlansAnswers: {
    getSchoolPlansAnswers: sinon.stub().returns(Promise.resolve(API_RESPONSE)),
  },
  SchoolPlansResults: {
    getSchoolPlansResults: sinon.stub().returns(Promise.resolve(API_RESPONSE)),
  },
  Schools: {
    update: sinon.stub().returns(Promise.resolve(API_RESPONSE)),
    getByCity: sinon.stub().returns(Promise.resolve(API_RESPONSE)),
  },
};
const Sagas = proxyquire
  .noCallThru()
  .load('../api_data', {
    [`${process.cwd()}/src/api`]: API,
  });

describe('API data Saga', () => {
  describe('fetchAnswers generator', () => {
    const generator = Sagas.fetchAnswers({
      params: {
        filters: {
          answered: [true],
          competence_level: [],
        },
      },
      currentParams: {
        page: 1,
        filters: {
          sample: [false],
          competence_level: [1, 2, 3],
        },
      },
    });

    const expectedObj = {
      page: 1,
      filters: {
        sample: [false],
        answered: [true],
      },
    };

    it('should dispatch IS_FETCHING_SURVEY_ANSWERS with a merged params and currentParams object', () => {
      expect(generator.next().value).to.deep.equal(put({
        type: IS_FETCHING_SURVEY_ANSWERS,
        surveyAnswersFetchParams: expectedObj,
      }));
    });

    // it('should call API.SurveyAnswers.getSurveyAnswers after with the merged params', () => {
    //   generator.next();
    //   expect(API.SurveyAnswers.getSurveyAnswers.getCall(0).args[0]).to.deep.equal(expectedObj);
    // });

    // it('should dispatch RECEIVE_SURVEY_ANSWERS with received answers', () => {
    //   expect(generator.next().value).to.deep.equal(put(receiveSurveyAnswers(API_RESPONSE)));
    // });
  });

  describe('updateSchool generator', () => {
    const params = {
      schoolId: '132',
      modifier: {
        observations: 'obs',
      },
      reFetchAnswers: { params: { sort: 'observations' }, currentParams: {} },
    };
    const generator = Sagas.updateSchool(params);

    // it('should call API.Schools.update with schooldId and modifier', () => {
    //   generator.next();
    //   const args = API.Schools.update.getCall(0).args;
    //   expect(args[0]).to.deep.equal(params.schoolId);
    //   expect(args[1]).to.deep.equal(params.modifier);
    // });

    // it('should call re-fetch survey answers after to update the followup table', () => {
    //   expect(generator.next().value).to.deep.equal(call(Sagas.fetchAnswers, {
    //     ...params.reFetchAnswers,
    //   }));
    // });
  });

  describe('watchFetchAnswers generator', () => {
    const generator = Sagas.watchFetchAnswers();

    it('should return a listener calling fetchCitySchoools and its action', () => {
      expect(generator.next().value).to.deep.equal(takeLatest(
        FETCH_ANSWERS, Sagas.watchFetchAnswers
      ).next().value);
    });
  });

  describe('watchFetchCitySchools generator', () => {
    const generator = Sagas.watchFetchCitySchools();

    expect(generator.next().value).to.deep.equal(takeLatest(
      FETCH_CITY_SCHOOLS, Sagas.fetchCitySchools
    ).next().value);
  });
});
