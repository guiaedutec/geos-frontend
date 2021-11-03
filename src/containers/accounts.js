import * as actions from '~/actions/accounts';
import {
  bindActionCreators,
} from 'redux';
import {
  connect,
} from 'react-redux';

function mapStateToProps({ accounts }){
  return Object.assign({}, { accounts });
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
