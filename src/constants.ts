import { TFunction } from 'i18next'

import { GlobalInput } from '~/schemas/gql/graphql'

export const DEFAULT_ENDPOINT_URL = 'http://127.0.0.1:2023/graphql'

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

export const DEFAULT_LOG_LEVEL = LogLevel.info
export const DEFAULT_TPROXY_PORT = 7890
export const DEFAULT_ALLOW_INSECURE = true
export const DEFAULT_CHECK_INTERVAL = '10s'
export const DEFAULT_CHECK_TOLERANCE = '1000ms'
export const DEFAULT_UDP_CHECK_DNS = ['dns.google.com:53', '8.8.8.8', '2001:4860:4860:8888', '1.1.1.1']
export const DEFAULT_TCP_CHECK_URL = [
  'http://cp.cloudflare.com',
  '1.1.1.1',
  '2606:4700:4700::1111',
  'http://keep-alv.google.com/generate_204',
]
export const DEFAULT_DIAL_MODE = DialMode.domain
export const DEFAULT_TCP_CHECK_HTTP_METHOD = TcpCheckHttpMethod.CONNECT
export const DEFAULT_DISABLE_WAITING_NETWORK = false
export const DEFAULT_AUTO_CONFIG_KERNEL_PARAMETER = false
export const DEFAULT_TLS_IMPLEMENTATION = TLSImplementation.tls

export const DEFAULT_CONFIG_WITH_INTERFACE = (interfaceName?: string): GlobalInput => ({
  logLevel: DEFAULT_LOG_LEVEL,
  tproxyPort: DEFAULT_TPROXY_PORT,
  allowInsecure: DEFAULT_ALLOW_INSECURE,
  checkInterval: DEFAULT_CHECK_INTERVAL,
  checkTolerance: DEFAULT_CHECK_TOLERANCE,
  lanInterface: interfaceName ? [interfaceName] : [],
  wanInterface: interfaceName ? [interfaceName] : [],
  udpCheckDns: DEFAULT_UDP_CHECK_DNS,
  tcpCheckUrl: DEFAULT_TCP_CHECK_URL,
  dialMode: DEFAULT_DIAL_MODE,
})

export const GET_LOG_LEVEL_STEPS = (t: TFunction) => [
  [t('error'), LogLevel.error],
  [t('warn'), LogLevel.warn],
  [t('info'), LogLevel.info],
  [t('debug'), LogLevel.debug],
  [t('trace'), LogLevel.trace],
]

export const DEFAULT_ROUTING = `
  pname(NetworkManager, systemd-resolved) -> direct
  dip(geoip:private) -> direct
  dip(geoip:cn) -> direct
  domain(geosite:cn) -> direct
  fallback: default
`

export const DEFAULT_DNS = `
  upstream {
    alidns: 'udp://223.5.5.5:53'
    googledns: 'udp://8.8.8.8:53'
  }
  routing {
    request {
      qname(geosite:cn) -> alidns
      fallback: googledns
    }
  }
`

export enum ResourceType {
  node,
  subscription,
}
