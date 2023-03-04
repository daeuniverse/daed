import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import zhHans from "./locales/zh-Hans.json";

export const defaultNS = "translation" as const;

export const resources = {
  en: { [defaultNS]: en },
  "zh-Hans": { [defaultNS]: zhHans },
} as const;

export default () =>
  i18n.use(initReactI18next).init({
    lng: "en",
    defaultNS,
    resources,
  });
