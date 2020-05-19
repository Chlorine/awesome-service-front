import { History } from 'history';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { authReducer } from '../reducers/auth';
import { visitorInfoReducer } from '../reducers/visitor-info';
import { eventInfoReducer } from '../reducers/event-info';

export const createRootReducer = (history: History<any>) => {
  return combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    visitorInfo: visitorInfoReducer,
    eventInfo: eventInfoReducer,
  });
};
