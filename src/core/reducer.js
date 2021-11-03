import {
  combineReducers,
} from 'redux';
import {reducer as form} from 'redux-form';

import {
  menu,
  modal,
  answersTable,
  schoolsTable,
  managersTable,
  technicalsTable,
  apiData,
  accounts,
} from '../reducers';

export default combineReducers({
  form,
  menu,
  modal,
  answersTable,
  schoolsTable,
  managersTable,
  technicalsTable,
  apiData,
  accounts,
});
