import {
  createStore,
  applyMiddleware,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import rootSaga from '../sagas';
import reducer from './reducer.js';
import createLogger from 'redux-logger';

const sagaMiddleware = createSagaMiddleware();
const logger = createLogger();
const middlewares = [
  thunkMiddleware,
  sagaMiddleware,
  // logger,
];

const store = createStore(
  reducer,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(...middlewares)
);

sagaMiddleware.run(rootSaga);

export default store;
