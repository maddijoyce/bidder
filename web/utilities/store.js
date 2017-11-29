import { createStore, applyMiddleware, combineReducers } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';

import fieldsReducer from '../components/field/reducer';
import modalReducer from '../components/modal/reducer';

export default function createAppStore({ history }) {
  const rootReducer = combineReducers({
    routing: routerReducer,
    fields: fieldsReducer,
    modal: modalReducer,
  });

  const store = createStore(
    rootReducer,
    {},
    applyMiddleware(
      // logger,
      thunk,
      routerMiddleware(history),
    )
  );

  return store;
}
