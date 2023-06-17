import { TFunction } from 'i18next'
import { z } from 'zod'

import { GlobalInput, Policy } from '~/schemas/gql/graphql'

export const DEFAULT_ENDPOINT_URL = `${location.protocol}//${location.hostname}:2023/graphql`

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
export const DEFAULT_TPROXY_PORT = 12345
export const DEFAULT_TPROXY_PORT_PROTECT = true
export const DEFAULT_ALLOW_INSECURE = true
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

export const GET_LOG_LEVEL_STEPS = (t: TFunction) => [
  [t('error'), LogLevel.error],
  [t('warn'), LogLevel.warn],
  [t('info'), LogLevel.info],
  [t('debug'), LogLevel.debug],
  [t('trace'), LogLevel.trace],
]

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
  googledns: 'udp://8.8.8.8:53'
}
routing {
  request {
    qname(geosite:cn) -> alidns
    fallback: googledns
  }
}
`.trim()

export enum DraggableResourceType {
  node = 'node',
  subscription = 'subscription',
  subscription_node = 'subscription_node',
}

export enum RuleType {
  config = 'config',
  dns = 'dns',
  routing = 'routing',
  group = 'group',
}

export const v2raySchema = z.object({
  ps: z.string().default(''),
  add: z.string().url().nonempty().or(z.string().ip().nonempty()),
  port: z.number().min(0).max(65535).positive(),
  id: z.string().uuid().nonempty(),
  aid: z.number().min(0).max(65535).default(0),
  net: z.enum(['tcp', 'kcp', 'ws', 'h2', 'grpc']).default('tcp'),
  type: z.enum(['none', 'http', 'srtp', 'utp', 'wechat-video', 'dtls', 'wireguard']).default('none'),
  host: z.string().url().default(''),
  path: z.string().default(''),
  tls: z.enum(['none', 'tls']).default('none'),
  flow: z
    .enum(['none', 'xtls-rprx-origin', 'xtls-rprx-origin-udp443', 'xtls-rprx-vision', 'xtls-rprx-vision-udp443'])
    .default('none'),
  alpn: z.enum(['http/1.1', 'h2']),
  scy: z.enum(['auto', 'aes-128-gcm', 'chacha20-poly1305', 'none', 'zero']).default('auto'),
  v: z.literal(''),
  allowInsecure: z.boolean().default(false),
})

export const ssSchema = z.object({
  method: z
    .enum(['aes-128-gcm', 'aes-256-gcm', 'chacha20-poly1305', 'chacha20-ietf-poly1305', 'plain', 'none'])
    .default('aes-128-gcm'),
  plugin: z.enum(['', 'simple-obfs', 'v2ray-plugin']).default(''),
  obfs: z.enum(['http', 'tls']).default('http'),
  tls: z.enum(['', 'tls']).default(''),
  path: z.string().default('/'),
  mode: z.string().default('websocket'),
  host: z.string().url().default(''),
  password: z.string().nonempty(),
  server: z.string().url().nonempty().or(z.string().ip().nonempty()),
  port: z.number().min(0).max(65535),
  name: z.string().default(''),
  impl: z.enum(['', 'chained', 'transport']).default(''),
})

export const ssrSchema = z.object({
  method: z
    .enum([
      'aes-128-cfb',
      'aes-192-cfb',
      'aes-256-cfb',
      'aes-128-ctr',
      'aes-192-ctr',
      'aes-256-ctr',
      'aes-128-ofb',
      'aes-192-ofb',
      'aes-256-ofb',
      'des-cfb',
      'bf-cfb',
      'cast5-cfb',
      'rc4-md5',
      'chacha20-ietf',
      'salsa20',
      'camellia-128-cfb',
      'camellia-192-cfb',
      'camellia-256-cfb',
      'idea-cfb',
      'rc2-cfb',
      'seed-cfb',
      'none',
    ])
    .default('aes-128-cfb'),
  password: z.string().nonempty(),
  server: z.string().url().nonempty().or(z.string().ip().nonempty()),
  port: z.number().min(0).max(65535).positive(),
  name: z.string().default(''),
  proto: z
    .enum([
      'origin',
      'verify_sha1',
      'auth_sha1_v4',
      'auth_aes128_md5',
      'auth_aes128_sha1',
      'auth_chain_a',
      'auth_chain_b',
    ])
    .default('origin'),
  protoParam: z.string().default(''),
  obfs: z.enum(['plain', 'http_simple', 'http_post', 'random_head', 'tls1.2_ticket_auth']).default('plain'),
  obfsParam: z.string().default(''),
})

export const trojanSchema = z.object({
  name: z.string().default(''),
  server: z.string().url().nonempty().or(z.string().ip().nonempty()),
  peer: z.string().url().default(''),
  host: z.string().url().default(''),
  path: z.string().default(''),
  allowInsecure: z.boolean().default(false),
  port: z.number().min(0).max(65535),
  password: z.string().nonempty(),
  method: z.enum(['origin', 'shadowsocks']).default('origin'),
  ssCipher: z
    .enum(['aes-128-gcm', 'aes-256-gcm', 'chacha20-poly1305', 'chacha20-ietf-poly1305'])
    .default('aes-128-gcm'),
  ssPassword: z.string(),
  obfs: z.enum(['none', 'websocket']).default('none'),
})

export const httpSchema = z.object({
  username: z.string().default(''),
  password: z.string().default(''),
  host: z.string().nonempty(),
  port: z.number().min(0).max(65535),
  protocol: z.enum(['http', 'https']).default('http'),
  name: z.string().default(''),
})

export const socks5Schema = z.object({
  username: z.string().default(''),
  password: z.string().default(''),
  host: z.string().nonempty(),
  port: z.number().min(0).max(65535),
  protocol: z.literal('socks5'),
  name: z.string().default(''),
})
