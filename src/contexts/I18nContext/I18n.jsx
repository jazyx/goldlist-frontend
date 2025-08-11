/**
 * frontend/src/contexts/I18N.jsx
 */

// npm i i18next react-i18next i18next-http-backend

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

const loadPath = `locales/{{lng}}/{{ns}}.json`
const options = {
  debug: true,
  fallbackLng: ["en"],
  interpolation: {
    escapeValue: false
  },
  backend: {
    loadPath
  }
}
i18n
  .use(Backend)
  .use(initReactI18next) 
  .init(options)
  
export default i18n