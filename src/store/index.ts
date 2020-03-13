///<reference types="webpack-env" />

import { compose, createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

import { createRootReducer } from './reducers';
import { AppState } from './state';

import {
  saveThisVisitorInfoState,
  isVisitorInfoStateNotEmpty,
} from './visitor-info-state';

import { initialVisitorInfoState } from '../reducers/visitor-info';

export const history = createBrowserHistory();

export const configureStore = () => {
  // немножко персистента

  const preloadedState: Partial<AppState> = {
    visitorInfo: initialVisitorInfoState,
  };

  // loadVisitorInfoStateInto(preloadedState.visitorInfo!);

  const store = createStore(
    createRootReducer(history),
    preloadedState,
    compose(applyMiddleware(thunk, routerMiddleware(history))),
  );

  store.subscribe(() => {
    const visitorInfo = (store.getState() as any)[
      'visitorInfo'
    ] as AppState['visitorInfo']; // бля // TODO: типизировать стейт нормально

    if (isVisitorInfoStateNotEmpty(visitorInfo)) {
      saveThisVisitorInfoState(visitorInfo);
    }
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
