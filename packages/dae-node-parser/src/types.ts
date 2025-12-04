/**
 * Supported proxy protocol types
 */
export type ProxyProtocol =
  | 'http'
  | 'https'
  | 'socks5'
  | 'ss'
  | 'ssr'
  | 'trojan'
  | 'trojan-go'
  | 'tuic'
  | 'juicity'
  | 'hysteria2'
  | 'vmess'
  | 'vless'

/**
 * V2Ray schema (VMess/VLESS)
 * Based on XTLS/Xray-core share link standard proposal:
 * https://github.com/XTLS/Xray-core/discussions/716
 */
export interface V2rayConfig {
  protocol?: 'vmess' | 'vless'
  // Basic info (4.1)
  ps: string // descriptive-text
  add: string // remote-host
  port: number // remote-port
  id: string // uuid
  // Protocol fields (4.2)
  aid: number // alterId (VMess only, deprecated for AEAD)
  scy: 'auto' | 'aes-128-gcm' | 'chacha20-poly1305' | 'none' | 'zero' // encryption
  // Transport fields (4.3)
  net: 'tcp' | 'kcp' | 'ws' | 'http' | 'h2' | 'grpc' | 'httpupgrade' | 'xhttp' // type
  type: 'none' | 'http' | 'srtp' | 'utp' | 'wechat-video' | 'dtls' | 'wireguard' // headerType (mKCP/TCP)
  host: string // host (WebSocket/HTTP/2/3/HTTPUpgrade/XHTTP)
  path: string // path (WebSocket/HTTP/2/3/HTTPUpgrade/XHTTP) or serviceName (gRPC) or seed (mKCP)
  // gRPC specific
  grpcMode: 'gun' | 'multi' | 'guna' // mode
  grpcAuthority: string // authority
  // XHTTP specific
  xhttpMode: string // mode
  xhttpExtra: string // extra
  // TLS fields (4.4)
  tls: 'none' | 'tls' | 'reality' // security (removed 'xtls' as deprecated)
  fp: string // fingerprint
  sni: string // serverName
  alpn: string // alpn (comma-separated)
  ech: string // Encrypted Client Hello (echConfigList)
  // XTLS/VLESS flow
  flow: 'none' | 'xtls-rprx-vision' | 'xtls-rprx-vision-udp443'
  // Reality fields
  pbk: string // REALITY password (publicKey alias)
  sid: string // REALITY shortId
  spx: string // REALITY spiderX
  pqv: string // REALITY ML-DSA-65 public key (mldsa65Verify)
  // Other
  allowInsecure: boolean
  v: string // version (legacy)
}

/**
 * Shadowsocks (SS) schema
 */
export interface SSConfig {
  method: 'aes-128-gcm' | 'aes-256-gcm' | 'chacha20-poly1305' | 'chacha20-ietf-poly1305' | 'plain' | 'none'
  plugin: '' | 'simple-obfs' | 'v2ray-plugin'
  obfs: 'http' | 'tls'
  tls: '' | 'tls'
  path: string
  mode: string
  host: string
  password: string
  server: string
  port: number
  name: string
  impl: '' | 'chained' | 'transport'
}

/**
 * ShadowsocksR (SSR) schema
 */
export interface SSRConfig {
  method:
    | 'aes-128-cfb'
    | 'aes-192-cfb'
    | 'aes-256-cfb'
    | 'aes-128-ctr'
    | 'aes-192-ctr'
    | 'aes-256-ctr'
    | 'aes-128-ofb'
    | 'aes-192-ofb'
    | 'aes-256-ofb'
    | 'des-cfb'
    | 'bf-cfb'
    | 'cast5-cfb'
    | 'rc4-md5'
    | 'chacha20-ietf'
    | 'salsa20'
    | 'camellia-128-cfb'
    | 'camellia-192-cfb'
    | 'camellia-256-cfb'
    | 'idea-cfb'
    | 'rc2-cfb'
    | 'seed-cfb'
    | 'none'
  password: string
  server: string
  port: number
  name: string
  proto:
    | 'origin'
    | 'verify_sha1'
    | 'auth_sha1_v4'
    | 'auth_aes128_md5'
    | 'auth_aes128_sha1'
    | 'auth_chain_a'
    | 'auth_chain_b'
  protoParam: string
  obfs: 'plain' | 'http_simple' | 'http_post' | 'random_head' | 'tls1.2_ticket_auth'
  obfsParam: string
}

/**
 * Trojan/Trojan-Go schema
 */
export interface TrojanConfig {
  name: string
  server: string
  peer: string
  host: string
  path: string
  allowInsecure: boolean
  port: number
  password: string
  method: 'origin' | 'shadowsocks'
  ssCipher: 'aes-128-gcm' | 'aes-256-gcm' | 'chacha20-poly1305' | 'chacha20-ietf-poly1305'
  ssPassword: string
  obfs: 'none' | 'websocket'
}

/**
 * TUIC schema
 */
export interface TuicConfig {
  name: string
  server: string
  port: number
  uuid: string
  password: string
  allowInsecure: boolean
  disable_sni: boolean
  sni: string
  congestion_control: string
  alpn: string
  udp_relay_mode: string
}

/**
 * Juicity schema
 */
export interface JuicityConfig {
  name: string
  server: string
  port: number
  uuid: string
  password: string
  allowInsecure: boolean
  pinned_certchain_sha256: string
  sni: string
  congestion_control: string
}

/**
 * Hysteria2 schema
 */
export interface Hysteria2Config {
  name: string
  server: string
  port: number
  auth: string
  obfs: string
  obfsPassword: string
  sni: string
  allowInsecure: boolean
  pinSHA256: string
}

/**
 * HTTP/HTTPS schema
 */
export interface HTTPConfig {
  protocol?: 'http' | 'https'
  username: string
  password: string
  host: string
  port: number
  name: string
}

/**
 * SOCKS5 schema
 */
export interface Socks5Config {
  username: string
  password: string
  host: string
  port: number
  name: string
}

/**
 * URL generation parameters
 */
export interface GenerateURLParams {
  username?: string
  password?: string
  protocol: string
  host: string
  port: number
  params?: Record<string, unknown>
  hash: string
  path?: string
}

/**
 * Hysteria2 URL generation parameters
 */
export interface GenerateHysteria2URLParams {
  protocol: string
  auth: string
  host: string
  port: number
  params: Record<string, string | number | boolean>
}

/**
 * Parse result type union
 */
export type ParseResult =
  | { type: 'http'; data: Partial<HTTPConfig> & { protocol: 'http' | 'https' } }
  | { type: 'socks5'; data: Partial<Socks5Config> }
  | { type: 'ss'; data: Partial<SSConfig> }
  | { type: 'ssr'; data: Partial<SSRConfig> }
  | { type: 'trojan'; data: Partial<TrojanConfig> }
  | { type: 'tuic'; data: Partial<TuicConfig> }
  | { type: 'juicity'; data: Partial<JuicityConfig> }
  | { type: 'hysteria2'; data: Partial<Hysteria2Config> }
  | { type: 'v2ray'; data: Partial<V2rayConfig> & { protocol: 'vmess' | 'vless' } }
