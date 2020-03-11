import { setLocale } from 'yup';

/* eslint-disable no-template-curly-in-string */

setLocale({
  mixed: {
    required: 'formErrors.required',
    notType: 'Значение должно иметь тип ${type}',
  },
  string: {
    // max: 'Макс. количество символов: ${max}',
    max: 'formErrors.stringTooLong',
    // min: 'Мин. количество символов: ${min}',
    min: 'formErrors.stringTooShort', // TODO: допилить
    email: 'formErrors.email',
    matches: 'formErrors.matches',
  },
  number: {
    min: 'Значение должно быть больше или равно ${min}',
    max: 'Значение должно быть меньше или равно ${max}',
    integer: 'Значение должно быть целым числом (integer)',
  },
});