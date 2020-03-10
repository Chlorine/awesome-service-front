import { LocaleObject } from 'yup';

declare type SupportedLanguage = 'ru' | 'en';
declare type YupLocales = {[id in SupportedLanguage]: LocaleObject};

/* eslint-disable no-template-curly-in-string */

export const yupLocales: YupLocales = {
  ru: {
    mixed: {
      required: 'Обязательное поле',
      notType: 'Значение должно иметь тип ${type}',
    },
    string: {
      max: 'Макс. количество символов: ${max}',
      min: 'Мин. количество символов: ${min}',
      email: 'Укажите корректный email-адрес',
      matches: 'Недопустимое значение',
    },
    number: {
      min: 'Значение должно быть больше или равно ${min}',
      max: 'Значение должно быть меньше или равно ${max}',
      integer: 'Значение должно быть целым числом (integer)',
    },
  },
  en: {
    mixed: {
      required: 'Field is required'
    },
    string: {
      email: 'Invalid email',
      matches: 'Invalid value'
    }
  }
};