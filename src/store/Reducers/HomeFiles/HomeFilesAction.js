/* eslint-disable no-undef */

import { Actions } from "../../../Utils/Constants";

export function setSelectedVideoAction(selectedVideo) {
  return (dispatch) => {
    dispatch({
      type: Actions.SET_SELECTED_VIDEO,
      payload: { selectedVideo },
    });
  };
}
export function setSelectedCategory(selectedCategory) {
  return (dispatch) => {
    dispatch({
      type: Actions.SET_SELECTED_CATEGORY,
      payload: { selectedCategory },
    });
  };
}

export function setSearchresults(searchresults) {
  return (dispatch) => {
    dispatch({
      type: Actions.SET_SEARCH_RESULTS,
      payload: { searchresults },
    });
  };
}
export function toggleSidebarAction(isSidebar) {
  return (dispatch) => {
    dispatch({
      type: Actions.TOGGLE_SIDEBAR,
      payload: { isSidebar },
    });
  };
}

