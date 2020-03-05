import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch, RouteProps } from 'react-router-dom';

import { configureStore, history } from './store';

// eslint-disable-next-line
// import serverAPI from './server-api';

import MainView from './components/MainView';
import NotFound from './components/NotFound';

import Page01_Welcome from './components/registration/01-Welcome';
import Page02_ContactInfo from './components/registration/02-ContactInfo';
import Page03_QRCode from './components/registration/03-QRCode';

import { SimpleCentered } from './components/common';

const store = configureStore();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MainView>
          <SimpleCentered>
            <Switch>
              <Route
                path="/"
                exact
                component={() => <Redirect to={'/welcome'} />}
              />
              <Route path="/welcome" component={Page01_Welcome} />
              <Route path="/contact-info" component={Page02_ContactInfo} />
              <Route path="/get-qr" component={Page03_QRCode} />

              <Route component={NotFound} />
            </Switch>
          </SimpleCentered>
        </MainView>
      </ConnectedRouter>
    </Provider>
  );
};

export default App;

// eslint-disable-next-line
const PrivateRoute: React.FC<RouteProps> = ({
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      ///////////////////////
      // console.log(props.location);
      //////////////////
      // @ts-ignore
      if (store.getState().auth.user) {
        // @ts-ignore
        return <Component {...props} />;
      }

      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      );
    }}
  />
);
