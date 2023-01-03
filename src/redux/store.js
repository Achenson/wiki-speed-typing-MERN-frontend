// import { createStore } from "redux";
// import { createStore, applyMiddleware, compose } from "redux";
import { createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";

import rootReducer from "./rootReducer.js";

const initialState = {};

const middleware = [thunk];

/* eslint-disable no-underscore-dangle */
const store = createStore(
  rootReducer,
  initialState,
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

  // compose(
    applyMiddleware(...middleware),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // )

);
/* eslint-enable */

export default store;
