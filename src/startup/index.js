import store from '~/core/store';
import {
  loginWithToken,
} from '~/actions/accounts';

store.dispatch(loginWithToken());
