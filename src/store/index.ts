///<reference types="webpack-env" />

import { compose, createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

import { createRootReducer } from './reducers';
import { AppState } from './state';

export const history = createBrowserHistory();

export const configureStore = (preloadedState?: AppState) => {
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    compose(applyMiddleware(thunk, routerMiddleware(history))),
  );

  // Hot reloading
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createRootReducer(history));
    });
  }

  return store;
};
