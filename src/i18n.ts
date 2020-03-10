import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as _ from 'lodash';
import {setLocale as Yup_setLocale} from "yup";

import {yupLocales} from "./translations/yup-locales";
import {Utils} from "./utils";

import common_ru from './translations/common.ru.json';
import common_en from './translations/common.en.json';

import page01_ru from './translations/01-Welcome.ru.json';
import page01_en from './translations/01-Welcome.en.json';

import page02_ru from './translations/02-ContactInfo.ru.json';
import page02_en from './translations/02-ContactInfo.en.json';

import page03_ru from './translations/03-QRCode.ru.json';
import page03_en from './translations/03-QRCode.en.json';

let resources = _.merge(
  {},
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

function updateYupLocale(lang: string) {
  if(lang === 'ru') {
    Yup_setLocale(yupLocales.ru);
  } else if (lang === 'en') {
    Yup_setLocale(yupLocales.en);
  }
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

updateYupLocale(currentLang);

i18n.on('languageChanged', (lang: string) => {
  updateYupLocale(lang);
});

export default i18n;
