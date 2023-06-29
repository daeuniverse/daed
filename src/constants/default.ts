import { z } from 'zod'

import { GlobalInput, Policy } from '~/schemas/gql/graphql'

import { DialMode, LogLevel, TLSImplementation, TcpCheckHttpMethod, UTLSImitate } from './misc'
import { v2raySchema } from './schema'

export const DEFAULT_ENDPOINT_URL = `${location.protocol}//${location.hostname}:2023/graphql`

export const DEFAULT_LOG_LEVEL = LogLevel.info
export const DEFAULT_TPROXY_PORT = 12345
export const DEFAULT_TPROXY_PORT_PROTECT = true
export const DEFAULT_ALLOW_INSECURE = false
export const DEFAULT_CHECK_INTERVAL_SECONDS = 30
export const DEFAULT_CHECK_TOLERANCE_MS = 0
export const DEFAULT_SNIFFING_TIMEOUT_MS = 100
export const DEFAULT_UDP_CHECK_DNS = ['dns.google.com:53', '8.8.8.8', '2001:4860:4860::8888']
export const DEFAULT_TCP_CHECK_URL = ['http://cp.cloudflare.com', '1.1.1.1', '2606:4700:4700::1111']
export const DEFAULT_DIAL_MODE = DialMode.domain
export const DEFAULT_TCP_CHECK_HTTP_METHOD = TcpCheckHttpMethod.HEAD
export const DEFAULT_DISABLE_WAITING_NETWORK = false
export const DEFAULT_AUTO_CONFIG_KERNEL_PARAMETER = true
export const DEFAULT_TLS_IMPLEMENTATION = TLSImplementation.tls
export const DEFAULT_UTLS_IMITATE = UTLSImitate.chrome_auto

export const DEFAULT_CONFIG_NAME = 'global'
export const DEFAULT_GROUP_NAME = 'proxy'

export const DEFAULT_CONFIG_WITH_INTERFACE = (interfaces?: string[]): GlobalInput => ({
  logLevel: DEFAULT_LOG_LEVEL,
  tproxyPort: DEFAULT_TPROXY_PORT,
  tproxyPortProtect: DEFAULT_TPROXY_PORT_PROTECT,
  allowInsecure: DEFAULT_ALLOW_INSECURE,
  checkInterval: `${DEFAULT_CHECK_INTERVAL_SECONDS}s`,
  checkTolerance: `${DEFAULT_CHECK_TOLERANCE_MS}ms`,
  sniffingTimeout: `${DEFAULT_SNIFFING_TIMEOUT_MS}ms`,
  lanInterface: interfaces ? interfaces : [],
  wanInterface: interfaces ? interfaces : [],
  udpCheckDns: DEFAULT_UDP_CHECK_DNS,
  tcpCheckUrl: DEFAULT_TCP_CHECK_URL,
  tcpCheckHttpMethod: DEFAULT_TCP_CHECK_HTTP_METHOD,
  dialMode: DEFAULT_DIAL_MODE,
  autoConfigKernelParameter: DEFAULT_AUTO_CONFIG_KERNEL_PARAMETER,
  tlsImplementation: DEFAULT_TLS_IMPLEMENTATION,
  utlsImitate: DEFAULT_UTLS_IMITATE,
  disableWaitingNetwork: DEFAULT_DISABLE_WAITING_NETWORK,
})

export const DEFAULT_GROUP_POLICY = Policy.MinMovingAvg

export const DEFAULT_ROUTING = `
pname(NetworkManager, systemd-resolved) -> direct
dip(geoip:private) -> direct
dip(geoip:cn) -> direct
domain(geosite:cn) -> direct
fallback: ${DEFAULT_GROUP_NAME}
`.trim()

export const DEFAULT_DNS = `
upstream {
  alidns: 'udp://223.5.5.5:53'
  googledns: 'tcp+udp://8.8.8.8:53'
}
routing {
  request {
    qname(geosite:cn) -> alidns
    fallback: googledns
  }
}
`.trim()

export const DEFAULT_V2RAY_VALUES: z.infer<typeof v2raySchema> = {
  type: 'none',
  tls: 'none',
  net: 'tcp',
  scy: 'auto',
  add: '',
  aid: 0,
  allowInsecure: false,
  alpn: '',
  flow: 'none',
  host: '',
  id: '',
  path: '',
  port: 0,
  ps: '',
  v: '',
  sni: '',
}
