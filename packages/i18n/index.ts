import i18n from "i18next";
import detectLanguage from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import zhHans from "./locales/zh-Hans.json";

export const defaultNS = "translation";

export const resources = {
  en: { [defaultNS]: en },
  "zh-Hans": { [defaultNS]: zhHans },
};

const i18nInit = () =>
  i18n
    .use(detectLanguage)
    .use(initReactI18next)
    .init({
      fallbackLng: {
        "zh-CN": ["zh-Hans"],
      },
      defaultNS,
      resources,
    });

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      translation: (typeof resources)["zh-Hans"][typeof defaultNS];
    };
  }
}

export { i18n, i18nInit };
