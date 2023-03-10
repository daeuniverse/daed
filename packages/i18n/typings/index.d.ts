import { defaultNS, resources } from "..";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      translation: (typeof resources)["zh-Hans"][typeof defaultNS];
    };
  }
}
