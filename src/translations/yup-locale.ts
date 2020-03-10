import { LocaleObject, setLocale } from 'yup';

/* eslint-disable no-template-curly-in-string */

setLocale({
  mixed: {
    required: 'forms.required',
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
});