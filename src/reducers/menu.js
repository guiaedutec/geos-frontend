import {
  TOGGLE_MOBILE_MENU,
} from '~/actions/menu';

export default (state = { menu: { isActive: false }}, action) => {
  switch(action.type){
    case TOGGLE_MOBILE_MENU:
      return {
        ...state,
        menu: { isActive: !state.menu.isActive },
      };
    default:
      return Object.assign({}, state);
  }
};
