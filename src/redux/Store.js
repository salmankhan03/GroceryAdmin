import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";

import { settingReducers } from "./Reducers/SettingReducers";
import { addToSideBarMenuReducer } from "./Reducers/SideBarMenuReducers";
import { categoryReducer } from "./Reducers/CategoryReducers"; 
import createSagaMiddleware from 'redux-saga';
import rootSaga from './saga/SagaRoot';

const reducer = combineReducers({
  addToSideBar: addToSideBarMenuReducer,
  setting: settingReducers,
  addTocategory:categoryReducer
});

const initialState = {
  addToSideBar: {
    sideBarAdd: JSON.parse(localStorage.getItem("_sideBarAdd"))
      ? JSON.parse(localStorage.getItem("_sideBarAdd"))
      : {},
  },

  setting: {
    settingItem: JSON.parse(localStorage.getItem("_settingItem"))
      ? JSON.parse(localStorage.getItem("_settingItem"))
      : [],
  },
  addTocategory: {
    category: JSON.parse(localStorage.getItem("_category"))
      ? JSON.parse(localStorage.getItem("_category"))
      : {},
  },
};

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    reducer,
    initialState,
    composeEnhancer(applyMiddleware(thunk, sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export default store;
