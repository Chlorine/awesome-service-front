import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as _ from 'lodash';

import {Utils} from "./utils";

import "./translations/yup-locale";
import yup_ru from './translations/yup.ru.json';
import yup_en from './translations/yup.en.json';

import common_ru from './translations/common.ru.json';
import common_en from './translations/common.en.json';

import page01_ru from './translations/01-Welcome.ru.json';
import page01_en from './translations/01-Welcome.en.json';

import page02_ru from './translations/02-ContactInfo.ru.json';
import page02_en from './translations/02-ContactInfo.en.json';

import page03_ru from './translations/03-QRCode.ru.json';
import page03_en from './translations/03-QRCode.en.json';

const resources = _.merge(
  {},
  yup_ru,
  yup_en,
  common_ru,
  common_en,
  page01_ru,
  page01_en,
  page02_ru,
  page02_en,
  page03_ru,
  page03_en,
);

let currentLang = Utils.localStorageGet('language') || 'ru';

if (currentLang !== 'ru' && currentLang !== 'en') {
  currentLang = 'ru';
}

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    resources,
    lng: currentLang,
    fallbackLng: 'ru',
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  })
  .catch(console.error);

export default i18n;
