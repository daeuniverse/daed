import { z } from 'zod'

export const v2raySchema = z.object({
  ps: z.string(),
  add: z.string().nonempty(),
  port: z.number().min(0).max(65535),
  id: z.string().nonempty(),
  aid: z.number().min(0).max(65535),
  net: z.enum(['tcp', 'kcp', 'ws', 'h2', 'grpc']),
  type: z.enum(['none', 'http', 'srtp', 'utp', 'wechat-video', 'dtls', 'wireguard']),
  host: z.string(),
  path: z.string(),
  tls: z.enum(['none', 'tls']),
  flow: z.enum(['none', 'xtls-rprx-origin', 'xtls-rprx-origin-udp443', 'xtls-rprx-vision', 'xtls-rprx-vision-udp443']),
  alpn: z.string(),
  scy: z.enum(['auto', 'aes-128-gcm', 'chacha20-poly1305', 'none', 'zero']),
  v: z.literal(''),
  allowInsecure: z.boolean(),
  sni: z.string(),
})

export const ssSchema = z.object({
  method: z.enum(['aes-128-gcm', 'aes-256-gcm', 'chacha20-poly1305', 'chacha20-ietf-poly1305', 'plain', 'none']),
  plugin: z.enum(['', 'simple-obfs', 'v2ray-plugin']),
  obfs: z.enum(['http', 'tls']),
  tls: z.enum(['', 'tls']),
  path: z.string(),
  mode: z.string(),
  host: z.string(),
  password: z.string().nonempty(),
  server: z.string().nonempty(),
  port: z.number().min(0).max(65535),
  name: z.string(),
  impl: z.enum(['', 'chained', 'transport']),
})

export const ssrSchema = z.object({
  method: z.enum([
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
  ]),
  password: z.string().nonempty(),
  server: z.string().nonempty(),
  port: z.number().min(0).max(65535).positive(),
  name: z.string(),
  proto: z.enum([
    'origin',
    'verify_sha1',
    'auth_sha1_v4',
    'auth_aes128_md5',
    'auth_aes128_sha1',
    'auth_chain_a',
    'auth_chain_b',
  ]),
  protoParam: z.string(),
  obfs: z.enum(['plain', 'http_simple', 'http_post', 'random_head', 'tls1.2_ticket_auth']),
  obfsParam: z.string(),
})

export const trojanSchema = z.object({
  name: z.string(),
  server: z.string().nonempty(),
  peer: z.string(),
  host: z.string(),
  path: z.string(),
  allowInsecure: z.boolean(),
  port: z.number().min(0).max(65535),
  password: z.string().nonempty(),
  method: z.enum(['origin', 'shadowsocks']),
  ssCipher: z.enum(['aes-128-gcm', 'aes-256-gcm', 'chacha20-poly1305', 'chacha20-ietf-poly1305']),
  ssPassword: z.string(),
  obfs: z.enum(['none', 'websocket']),
})

export const tuicSchema = z.object({
  name: z.string(),
  server: z.string().nonempty(),
  port: z.number().min(0).max(65535),
  uuid: z.string().nonempty(),
  password: z.string().nonempty(),
  allowInsecure: z.boolean(),
  disable_sni: z.boolean(),
  sni: z.string(),
  congestion_control: z.string(),
  alpn: z.string(),
  udp_relay_mode: z.string(),
})

export const juicitySchema = z.object({
  name: z.string(),
  server: z.string().nonempty(),
  port: z.number().min(0).max(65535),
  uuid: z.string().nonempty(),
  password: z.string().nonempty(),
  allowInsecure: z.boolean(),
  pinned_certchain_sha256: z.string(),
  sni: z.string(),
  congestion_control: z.string(),
})

export const hysteria2Schema = z.object({
  name: z.string(),
  server: z.string().nonempty(),
  port: z.number().min(0).max(65535),
  auth: z.string(),
  obfs: z.string(),
  obfsPassword: z.string(),
  sni: z.string(),
  allowInsecure: z.boolean(),
  pinSHA256: z.string(),
})

export const httpSchema = z.object({
  username: z.string(),
  password: z.string(),
  host: z.string().nonempty(),
  port: z.number().min(0).max(65535),
  name: z.string(),
})

export const socks5Schema = z.object({
  username: z.string(),
  password: z.string(),
  host: z.string().nonempty(),
  port: z.number().min(0).max(65535),
  name: z.string(),
})
