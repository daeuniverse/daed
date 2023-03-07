import type { Resource } from "i18next";
import i18n from "i18next";
import detectLanguage from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import zhHans from "./locales/zh-Hans.json";

export const defaultNS = "translation" as const;

export const resources: Resource = {
  en: { [defaultNS]: en },
  "zh-Hans": { [defaultNS]: zhHans },
};

i18n
  .use(detectLanguage)
  .use(initReactI18next)
  .init({
    fallbackLng: {
      "zh-CN": ["zh-Hans"],
    },
    defaultNS,
    resources,
    detection: {},
  });

export default i18n;
