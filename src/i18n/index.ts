import i18n from 'i18next'
import detectLanguage from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import zhHans from './locales/zh-Hans.json'

export const defaultNS = 'translation'

export const resources = {
  'en': { [defaultNS]: en },
  'zh-Hans': { [defaultNS]: zhHans },
}

function i18nInit() {
  return i18n
    .use(detectLanguage)
    .use(initReactI18next)
    .init({
      fallbackLng: {
        'zh-CN': ['zh-Hans'],
      },
      defaultNS,
      resources,
    })
}

export { i18n, i18nInit }
