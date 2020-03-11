import React from 'react';
import ReactDOM from 'react-dom';

// import dateLocaleRU from 'date-fns/locale/ru';

import 'moment/locale/ru';

import App from './App';
import * as serviceWorker from './serviceWorker';

import './i18n';

import 'font-awesome/css/font-awesome.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css';
import 'flag-icon-css/css/flag-icon.css';

import './index.scss';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
