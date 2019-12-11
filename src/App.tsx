import React from 'react';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch, RouteProps } from 'react-router-dom';

import { configureStore, history } from './store';

import logo from './logo.svg';
import './App.scss';

// <img src={logo} className="App-logo" alt="logo" />

import serverAPI from './server-api';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Крутись против часовой!!</p>
      </header>
      <div>
        aa
        <button
          onClick={() => {
            serverAPI
              .execute('doSomething', {})
              .then(({ code }) => {
                console.log('code is: ' + code);
              })
              .catch(err => console.error(err));
          }}
        >
          Пыщь
        </button>
      </div>
    </div>
  );
};

export default App;
