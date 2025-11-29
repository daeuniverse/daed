import type { TFunction } from 'i18next'

export enum LogLevel {
  error = 'error',
  warn = 'warn',
  info = 'info',
  debug = 'debug',
  trace = 'trace',
}

export enum DialMode {
  ip = 'ip',
  domain = 'domain',
  domainP = 'domain+',
  domainPP = 'domain++',
}

export enum TcpCheckHttpMethod {
  CONNECT = 'CONNECT',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  PUT = 'PUT',
}

export enum TLSImplementation {
  tls = 'tls',
  utls = 'utls',
}

export enum UTLSImitate {
  randomized = 'randomized',
  randomizedalpn = 'randomizedalpn',
  randomizednoalpn = 'randomizednoalpn',
  firefox_auto = 'firefox_auto',
  firefox_55 = 'firefox_55',
  firefox_56 = 'firefox_56',
  firefox_63 = 'firefox_63',
  firefox_65 = 'firefox_65',
  firefox_99 = 'firefox_99',
  firefox_102 = 'firefox_102',
  firefox_105 = 'firefox_105',
  chrome_auto = 'chrome_auto',
  chrome_58 = 'chrome_58',
  chrome_62 = 'chrome_62',
  chrome_70 = 'chrome_70',
  chrome_72 = 'chrome_72',
  chrome_83 = 'chrome_83',
  chrome_87 = 'chrome_87',
  chrome_96 = 'chrome_96',
  chrome_100 = 'chrome_100',
  chrome_102 = 'chrome_102',
  ios_auto = 'ios_auto',
  ios_11_1 = 'ios_11_1',
  ios_12_1 = 'ios_12_1',
  ios_13 = 'ios_13',
  ios_14 = 'ios_14',
  android_11_okhttp = 'android_11_okhttp',
  edge_auto = 'edge_auto',
  edge_85 = 'edge_85',
  edge_106 = 'edge_106',
  safari_auto = 'safari_auto',
  safari_16_0 = 'safari_16_0',
  utls_360_auto = '360_auto',
  utls_360_7_5 = '360_7_5',
  utls_360_11_0 = '360_11_0',
  qq_auto = 'qq_auto',
  qq_11_1 = 'qq_11_1',
}

export function GET_LOG_LEVEL_STEPS(t: TFunction) {
  return [
    [t('error'), LogLevel.error],
    [t('warn'), LogLevel.warn],
    [t('info'), LogLevel.info],
    [t('debug'), LogLevel.debug],
    [t('trace'), LogLevel.trace],
  ]
}

export enum MODE {
  simple = 'simple',
  advanced = 'advanced',
}

export const COLS_PER_ROW = 3
export const QUERY_KEY_HEALTH_CHECK = ['healthCheck']
export const QUERY_KEY_GENERAL = ['general']
export const QUERY_KEY_USER = ['user']
export const QUERY_KEY_NODE = ['node']
export const QUERY_KEY_SUBSCRIPTION = ['subscription']
export const QUERY_KEY_CONFIG = ['config']
export const QUERY_KEY_ROUTING = ['routing']
export const QUERY_KEY_DNS = ['dns']
export const QUERY_KEY_GROUP = ['group']
export const QUERY_KEY_STORAGE = ['storage']

export enum DraggableResourceType {
  node = 'node',
  subscription = 'subscription',
  subscription_node = 'subscription_node',
  groupNode = 'group_node',
  groupSubscription = 'group_subscription',
}

export interface DraggingResource {
  type: DraggableResourceType
  nodeID?: string
  groupID?: string
  subscriptionID?: string
  rect?: { width: number; height: number }
}

export enum RuleType {
  config = 'config',
  dns = 'dns',
  routing = 'routing',
  group = 'group',
}
