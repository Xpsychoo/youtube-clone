import { Actions } from "../../../Utils/Constants";

const initialState = {
  selectedVideo: null,
  selectedCategory: 'New',
  searchresults: null,
  isSidebar: false, 
};


const HomeFilesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_SELECTED_VIDEO:
      return {
        ...state,
        selectedVideo: action.payload.selectedVideo,
      };
    case Actions.SET_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload.selectedCategory,
      };
    case Actions.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchresults: action.payload.searchresults,
      };
    case Actions.TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebar: !state.isSidebar,
      };
    default:
      return state;
  }
};

export default HomeFilesReducer;
