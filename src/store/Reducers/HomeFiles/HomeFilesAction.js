/* eslint-disable no-undef */

import { Actions } from "../../../Utils/Constants";

export function setSelectedCategory(selectedCategory) {
  return (dispatch) => {
    dispatch({
      type: Actions.SET_SELECTED_CATEGORY,
      payload: { selectedCategory },
    });
  };
}

export function toggleSidebarAction() {
  return (dispatch) => {
    dispatch({ type: Actions.TOGGLE_SIDEBAR });
  };
}

export function setDrawerAction(isDrawerOpen) {
  return (dispatch) => {
    dispatch({
      type: Actions.SET_DRAWER,
      payload: { isDrawerOpen },
    });
  };
}
