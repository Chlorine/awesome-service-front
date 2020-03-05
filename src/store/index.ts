///<reference types="webpack-env" />

import { compose, createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

import { createRootReducer } from './reducers';
import { AppState } from './state';
import { MinimalVisitorInfo } from '../common-interfaces/common-front';
import { LocalStorageHelper } from '../utils';
import { emptyMinimalVisitorInfo } from '../reducers/visitor-info';

export const history = createBrowserHistory();

declare type LSParamName = keyof MinimalVisitorInfo | 'shareContacts' | 'email' | 'phone';
const ls = new LocalStorageHelper<LSParamName>('tsVisitorReg');

export const configureStore = () => {

  // немножко персистента

  const preloadedState: Partial<AppState> = {
    visitorInfo: {
      baseInfo: emptyMinimalVisitorInfo,
      wantsToShareContacts: !!ls.get('shareContacts'),
      email: ls.get('email') || '',
      phone: ls.get('phone') || '',
    },
  };

  const { baseInfo } = preloadedState.visitorInfo!;

  Object.keys(baseInfo).forEach(key => {
    let fieldName = key as keyof MinimalVisitorInfo;
    baseInfo![fieldName] = ls.get(fieldName) || '';
  });

  const store = createStore(
    createRootReducer(history),
    preloadedState,
    compose(applyMiddleware(thunk, routerMiddleware(history))),
  );

  store.subscribe(() => {
    const visitorInfo = (store.getState() as any)[
      'visitorInfo'
    ] as AppState['visitorInfo']; // бля // TODO: типизировать стейт нормально

    const { baseInfo, wantsToShareContacts, email, phone } = visitorInfo;

    ls.set('firstName', baseInfo.firstName)
      .set('middleName', baseInfo.middleName)
      .set('lastName', baseInfo.lastName)
      .set('companyName', baseInfo.companyName)
      .set('position', baseInfo.position)
      .set('shareContacts', wantsToShareContacts)
      .set('email', email)
      .set('phone', phone);
  });

  // Hot reloading
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createRootReducer(history));
    });
  }

  return store;
};
