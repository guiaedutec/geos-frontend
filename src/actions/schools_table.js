export const HIGHLIGHT_SELECTED_COLUMN = 'schools_table/HIGHLIGHT_SELECTED_COLUMN';
export const TOGGLE_TABLE_MENU_STICKYNESS = 'schools_table/TOGGLE_TABLE_MENU_STICKYNESS';
export const INCREASE_PAGINATION_START = 'schools_table/INCREASE_PAGINATION_START';
export const DECREASE_PAGINATION_START = 'schools_table/DECREASE_PAGINATION_START';

export function highlightSelectedColumn(column){
  return {
    type: HIGHLIGHT_SELECTED_COLUMN,
    column,
  };
}

export function toggleTableMenuStickness(activate){
  return {
    type: TOGGLE_TABLE_MENU_STICKYNESS,
    activate,
  };
}

export function increasePaginationStart(){
  return {
    type: INCREASE_PAGINATION_START,
  };
}

export function decreasePaginationStart(){
  return {
    type: DECREASE_PAGINATION_START,
  };
}
