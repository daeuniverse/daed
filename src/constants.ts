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

export const DEFAULT_TCP_CHECK_URL = 'http://keep-alv.google.com/generate_204'
export const DEFAULT_UDP_CHECK_DNS = '1.1.1.1'

export const DEFAULT_CONFIG_WITH_INTERFACE = (interfaceName: string): GlobalInput => ({
  logLevel: 'info',
  tproxyPort: 7890,
  allowInsecure: true,
  checkInterval: '10s',
  checkTolerance: '1000ms',
  lanInterface: [interfaceName],
  wanInterface: [interfaceName],
  udpCheckDns: DEFAULT_UDP_CHECK_DNS,
  tcpCheckUrl: DEFAULT_TCP_CHECK_URL,
  dialMode: 'domain',
})

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

export const GET_LOG_LEVEL_STEPS = (t: TFunction) => [
  [t('error'), 'error'],
  [t('warn'), 'warn'],
  [t('info'), 'info'],
  [t('debug'), 'debug'],
  [t('trace'), 'trace'],
]
