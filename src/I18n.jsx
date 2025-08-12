/**
 * frontend/src/contexts/I18N.jsx
 */

// npm i i18next @formatjs/intl-pluralrules i18next-http-backend i18next-browser-languagedetector react-i18next

import i18n from 'i18next'
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/ru';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const loadPath = `locales/{{lng}}/{{ns}}.json`
const options = {
  debug: false,
  fallbackLng: ["en"],
  backend: { loadPath }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) 
  .init(options)
  
export default i18n