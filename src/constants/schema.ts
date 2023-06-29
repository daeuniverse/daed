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
