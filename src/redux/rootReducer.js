import { combineReducers } from "redux";

import visibilityReducer from "./reducers/visibilityReducer.js";
import resultsAndTimerReducer from "./reducers/resultsAndTimerReducer.js";
import displayReducer from "./reducers/displayReducer.js";
import authReducer from "./reducers/authReducer.js";
// import store from "./store.js";
// import actionTypes from "./actionTypes";

//object with reducers, totalState - arbitrary
export default combineReducers({
  visibilityState: visibilityReducer,
  resultsAndTimerState: resultsAndTimerReducer,
  displayState: displayReducer,
  authState: authReducer,
});
