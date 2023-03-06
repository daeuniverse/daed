import { TFunction } from "i18next";

export const CONFIGS_PER_ROW = 4;
export const GROUPS_PER_ROW = 4;
export const QUERY_KEY_CONFIG = ["config"];
export const QUERY_KEY_GROUP = ["group"];

export const DEFAULT_ENDPOINT_URL = "http://127.0.0.1:2023/graphql";
export const DEFAULT_TCP_CHECK_URL = "http://keep-alv.google.com/generate_204";
export const DEFAULT_UDP_CHECK_DNS = "1.1.1.1";

export const GET_LOG_LEVEL_STEPS = (t: TFunction) => [
  [t("error"), "error"],
  [t("warn"), "warn"],
  [t("info"), "info"],
  [t("debug"), "debug"],
  [t("trace"), "trace"],
];
