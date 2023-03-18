import { TFunction } from "i18next";

export const formatUserInputEndpointURL = (input?: string) => {
  const { protocol } = new URL(location.href);

  return `${protocol}//${input}/graphql`;
};

export const DEFAULT_ENDPOINT_URL_INPUT = "127.0.0.1:2023";
export const DEFAULT_ENDPOINT_URL = formatUserInputEndpointURL(DEFAULT_ENDPOINT_URL_INPUT);

export enum MODE {
  simple = "simple",
  advanced = "advanced",
}
export const COLS_PER_ROW = 3;
export const QUERY_KEY_HEALTH_CHECK = ["healthCheck"];
export const QUERY_KEY_INTERFACES = ["interfaces"];
export const QUERY_KEY_RUNNING = ["running"];
export const QUERY_KEY_NODE = ["node"];
export const QUERY_KEY_SUBSCRIPTION = ["subscription"];
export const QUERY_KEY_CONFIG = ["config"];
export const QUERY_KEY_ROUTING = ["routing"];
export const QUERY_KEY_DNS = ["dns"];
export const QUERY_KEY_GROUP = ["group"];

export const DEFAULT_TCP_CHECK_URL = "http://keep-alv.google.com/generate_204";
export const DEFAULT_UDP_CHECK_DNS = "1.1.1.1";

export const GET_LOG_LEVEL_STEPS = (t: TFunction) => [
  [t("error"), "error"],
  [t("warn"), "warn"],
  [t("info"), "info"],
  [t("debug"), "debug"],
  [t("trace"), "trace"],
];
