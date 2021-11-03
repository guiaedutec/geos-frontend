import {
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '~/actions/schools_table';

function mapStateToProps({ schoolsTable }){
  return Object.assign({}, schoolsTable);
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
