import { TFunction } from 'i18next'

import { GlobalInput } from '~/schemas/gql/graphql'

export const DEFAULT_ENDPOINT_URL = 'http://127.0.0.1:2023/graphql'

export enum MODE {
  simple = 'simple',
  advanced = 'advanced',
}

export const COLS_PER_ROW = 3
export const QUERY_KEY_HEALTH_CHECK = ['healthCheck']
export const QUERY_KEY_INTERFACES = ['interfaces']
export const QUERY_KEY_RUNNING = ['running']
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

export const DEFAULT_LOG_LEVEL = LogLevel.info
export const DEFAULT_TPROXY_PORT = 7890
export const DEFAULT_ALLOW_INSECURE = true
export const DEFAULT_CHECK_INTERVAL = '10s'
export const DEFAULT_CHECK_TOLERANCE = '1000ms'
export const DEFAULT_UDP_CHECK_DNS = '1.1.1.1'
export const DEFAULT_TCP_CHECK_URL = 'http://keep-alv.google.com/generate_204'
export const DEFAULT_DIAL_MODE = DialMode.domain

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
