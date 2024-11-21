import { combineReducers } from 'redux';

import HomeFilesReducer from './Reducers/HomeFiles/HomeFilesReducer';
import { Actions } from '../Utils/Constants';


const allReducers = combineReducers({
    HomeFilesReducer
});

const rootReducer = (state, action) => {
  if (action.type === Actions.RESET_APP) {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }
  return allReducers(state, action);
}

export default rootReducer;
