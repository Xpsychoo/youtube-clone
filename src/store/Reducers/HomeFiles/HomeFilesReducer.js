import { Actions } from "../../../Utils/Constants";

const initialState = {
  selectedCategory: 'New',
  isSidebar: true, // docked sidebar: full width vs. mini rail
  isDrawerOpen: false, // overlay sidebar on the watch page and small screens
};


const HomeFilesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload.selectedCategory,
      };
    case Actions.TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebar: !state.isSidebar,
      };
    case Actions.SET_DRAWER:
      return {
        ...state,
        isDrawerOpen: action.payload.isDrawerOpen,
      };
    default:
      return state;
  }
};

export default HomeFilesReducer;
