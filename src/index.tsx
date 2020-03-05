import React from 'react';
import ReactDOM from 'react-dom';

// import dateLocaleRU from 'date-fns/locale/ru';

import 'moment/locale/ru';
import { setLocale as Yup_setLocale } from 'yup';

import App from './App';
import * as serviceWorker from './serviceWorker';

import 'font-awesome/css/font-awesome.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css';

import './index.scss';

/* eslint-disable no-template-curly-in-string */

Yup_setLocale({
  mixed: {
    required: 'Обязательное поле',
    notType: 'Значение должно иметь тип ${type}',
  },
  string: {
    max: 'Макс. количество символов: ${max}',
    min: 'Мин. количество символов: ${min}',
    email: 'Укажите корректный email-адрес',
    matches: 'В поле содержатся недопустимые символы',
  },
  number: {
    min: 'Значение должно быть больше или равно ${min}',
    max: 'Значение должно быть меньше или равно ${max}',
    integer: 'Значение должно быть целым числом (integer)',
  },
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
