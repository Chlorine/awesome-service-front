import { History } from 'history';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { authReducer } from '../reducers/auth';

export const createRootReducer = (history: History<any>) => {
  return combineReducers({
    router: connectRouter(history),
    auth: authReducer,
  });
};
