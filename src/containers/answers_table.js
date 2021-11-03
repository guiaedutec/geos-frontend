import {
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '~/actions/answers_table';

function mapStateToProps({ answersTable }){
  return Object.assign({}, answersTable);
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
