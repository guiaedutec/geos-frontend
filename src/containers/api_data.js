import {
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/api_data';

function mapStateToProps({ apiData }){
  return Object.assign({}, { apiData });
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
