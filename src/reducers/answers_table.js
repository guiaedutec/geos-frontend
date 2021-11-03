import {
  HIGHLIGHT_SELECTED_COLUMN,
  TOGGLE_TABLE_MENU_STICKYNESS,
  INCREASE_PAGINATION_START,
  DECREASE_PAGINATION_START,
} from '~/actions/answers_table';

export default function(state = {
  highlightedColumn: '',
  isTableMenuSticky: false,
  paginationStart: 0,
}, action){
  switch(action.type){
    case HIGHLIGHT_SELECTED_COLUMN:
      return {
        ...state,
        highlightedColumn: action.column,
      };

    case TOGGLE_TABLE_MENU_STICKYNESS:
      return {
        ...state,
        isTableMenuSticky: action.activate,
      };

    case INCREASE_PAGINATION_START:
      return {
        ...state,
        paginationStart: state.paginationStart + 1,
      };

    case DECREASE_PAGINATION_START:
      return {
        ...state,
        paginationStart: state.paginationStart - 1,
      };

    default:
      return Object.assign({}, state);
  }
}
