import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      webAppTitle: 'Регистрация',
      ticketSoft: 'Тикет Софт',
      welcome: {
        title: 'Добро пожаловать!',
        subTitle: 'Введите данные для печати бейджа',
      },
    },
  },
  en: {
    translation: {
      webAppTitle: 'Registration',
      ticketSoft: 'Ticket Soft',
      welcome: {
        title: 'Welcome!',
        subTitle: 'Please fill in badge printing form',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  })
  .catch(console.error);

export default i18n;
