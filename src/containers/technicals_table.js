import {
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '~/actions/technicals_table';

function mapStateToProps({ technicalsTable }){
  return Object.assign({}, technicalsTable);
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
