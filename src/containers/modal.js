import {
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '~/actions/modal';

function mapStateToProps({ modal }){
  return Object.assign({}, modal);
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
