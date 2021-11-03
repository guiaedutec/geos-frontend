import {
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '~/actions/menu';

function mapStateToProps({ menu }){
  return Object.assign({}, menu);
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
