import { Base64 } from 'js-base64'
import URI from 'urijs'
import { ZodSchema, z } from 'zod'

import { GenerateURLParams } from '~/utils'

export enum NodeType {
  vmess,
  vless,
  shadowsocks,
  shadowsocksR,
  trojan,
  tuic,
  juicity,
  http,
  socks5,
}

export abstract class BaseNodeResolver<Schema extends ZodSchema> {
  abstract type: NodeType
  abstract schema: Schema
  abstract defaultValues: z.infer<Schema>

  abstract resolve(values: z.infer<Schema>): string

  generateURL = ({ username, password, protocol, host, port, params, hash, path }: GenerateURLParams) =>
    /**
     * 所有参数设置默认值
     * 避免方法检测到参数为null/undefine返回该值查询结果
     * 查询结果当然不是URI类型，导致链式调用失败
     */
    URI()
      .protocol(protocol || 'http')
      .username(username || '')
      .password(password || '')
      .host(host || '')
      .port(String(port) || '80')
      .path(path || '')
      .query(params || {})
      .hash(hash || '')
      .toString()
}

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

export const DEFAULT_V2RAY_FORM_VALUES: z.infer<typeof v2raySchema> = {
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

export class VmessNodeResolver extends BaseNodeResolver<typeof v2raySchema> {
  type = NodeType.vmess
  schema = v2raySchema
  defaultValues = DEFAULT_V2RAY_FORM_VALUES

  resolve(values: z.infer<typeof v2raySchema>) {
    const { net } = values
    const body: Record<string, unknown> = structuredClone(values)

    switch (net) {
      case 'kcp':
      case 'tcp':
      default:
        body.type = ''
    }

    switch (body.net) {
      case 'ws':
      case 'h2':
      case 'grpc':
      case 'kcp':
      default:
        if (body.net === 'tcp' && body.type === 'http') {
          break
        }

        body.path = ''
    }

    if (!(body.protocol === 'vless' && body.tls === 'xtls')) {
      delete body.flow
    }

    return 'vmess://' + Base64.encode(JSON.stringify(body))
  }
}

export class VlessNodeResolver extends BaseNodeResolver<typeof v2raySchema> {
  type = NodeType.vless
  schema = v2raySchema
  defaultValues = DEFAULT_V2RAY_FORM_VALUES

  resolve(values: z.infer<typeof v2raySchema>) {
    const { net, tls, path, host, type, sni, flow, allowInsecure, alpn, id, add, port, ps } = values

    const params: Record<string, unknown> = {
      type: net,
      security: tls,
      path,
      host,
      headerType: type,
      sni,
      flow,
      allowInsecure,
    }

    if (alpn !== '') params.alpn = alpn

    if (net === 'grpc') params.serviceName = path

    if (net === 'kcp') params.seed = path

    return this.generateURL({
      protocol: 'vless',
      username: id,
      host: add,
      port,
      hash: ps,
      params,
    })
  }
}

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

export const DEFAULT_SS_FORM_VALUES: z.infer<typeof ssSchema> = {
  plugin: '',
  method: 'aes-128-gcm',
  obfs: 'http',
  host: '',
  impl: '',
  mode: '',
  name: '',
  password: '',
  path: '',
  port: 0,
  server: '',
  tls: '',
}

export class ShadowsocksNodeResolver extends BaseNodeResolver<typeof ssSchema> {
  type = NodeType.shadowsocks
  schema = ssSchema
  defaultValues = DEFAULT_SS_FORM_VALUES

  resolve(values: z.infer<typeof ssSchema>) {
    /* ss://BASE64(method:password)@server:port#name */
    let link = `ss://${Base64.encode(`${values.method}:${values.password}`)}@${values.server}:${values.port}/`

    if (values.plugin) {
      const plugin: string[] = [values.plugin]

      if (values.plugin === 'v2ray-plugin') {
        if (values.tls) {
          plugin.push('tls')
        }

        if (values.mode !== 'websocket') {
          plugin.push('mode=' + values.mode)
        }

        if (values.host) {
          plugin.push('host=' + values.host)
        }

        if (values.path) {
          if (!values.path.startsWith('/')) {
            values.path = '/' + values.path
          }

          plugin.push('path=' + values.path)
        }

        if (values.impl) {
          plugin.push('impl=' + values.impl)
        }
      } else {
        plugin.push('obfs=' + values.obfs)
        plugin.push('obfs-host=' + values.host)

        if (values.obfs === 'http') {
          plugin.push('obfs-path=' + values.path)
        }

        if (values.impl) {
          plugin.push('impl=' + values.impl)
        }
      }

      link += `?plugin=${encodeURIComponent(plugin.join(';'))}`
    }

    link += values.name.length ? `#${encodeURIComponent(values.name)}` : ''

    return link
  }
}

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

export const DEFAULT_SSR_FORM_VALUES: z.infer<typeof ssrSchema> = {
  method: 'aes-128-cfb',
  proto: 'origin',
  obfs: 'plain',
  name: '',
  obfsParam: '',
  password: '',
  port: 0,
  protoParam: '',
  server: '',
}

export class ShadowsocksRNodeResolver extends BaseNodeResolver<typeof ssrSchema> {
  type = NodeType.shadowsocksR
  schema = ssrSchema
  defaultValues = DEFAULT_SSR_FORM_VALUES

  resolve = (values: z.infer<typeof ssrSchema>) =>
    /* ssr://server:port:proto:method:obfs:URLBASE64(password)/?remarks=URLBASE64(remarks)&protoparam=URLBASE64(protoparam)&obfsparam=URLBASE64(obfsparam)) */
    `ssr://${Base64.encode(
      `${values.server}:${values.port}:${values.proto}:${values.method}:${values.obfs}:${Base64.encodeURI(
        values.password,
      )}/?remarks=${Base64.encodeURI(values.name)}&protoparam=${Base64.encodeURI(
        values.protoParam,
      )}&obfsparam=${Base64.encodeURI(values.obfsParam)}`,
    )}`
}

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

export const DEFAULT_TROJAN_FORM_VALUES: z.infer<typeof trojanSchema> = {
  method: 'origin',
  obfs: 'none',
  allowInsecure: false,
  host: '',
  name: '',
  password: '',
  path: '',
  peer: '',
  port: 0,
  server: '',
  ssCipher: 'aes-128-gcm',
  ssPassword: '',
}

export class TrojanNodeResolver extends BaseNodeResolver<typeof trojanSchema> {
  type = NodeType.trojan
  schema = trojanSchema
  defaultValues = DEFAULT_TROJAN_FORM_VALUES

  resolve = (values: z.infer<typeof trojanSchema>) => {
    const query: Record<string, unknown> = {
      allowInsecure: values.allowInsecure,
    }

    if (values.peer !== '') {
      query.sni = values.peer
    }

    let protocol = 'trojan'

    if (values.method !== 'origin' || values.obfs !== 'none') {
      protocol = 'trojan-go'
      query.type = values.obfs === 'none' ? 'original' : 'ws'

      if (values.method === 'shadowsocks') {
        query.encryption = `ss;${values.ssCipher};${values.ssPassword}`
      }

      if (query.type === 'ws') {
        query.host = values.host || ''
        query.path = values.path || '/'
      }

      delete query.allowInsecure
    }

    return this.generateURL({
      protocol,
      username: values.password,
      host: values.server,
      port: values.port,
      hash: values.name,
      params: query,
    })
  }
}

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

export const DEFAULT_TUIC_FORM_VALUES: z.infer<typeof tuicSchema> = {
  name: '',
  port: 0,
  server: '',
  alpn: '',
  congestion_control: '',
  disable_sni: false,
  allowInsecure: false,
  uuid: '',
  password: '',
  udp_relay_mode: '',
  sni: '',
}

export class TuicNodeResolver extends BaseNodeResolver<typeof tuicSchema> {
  type = NodeType.tuic
  schema = tuicSchema
  defaultValues = DEFAULT_TUIC_FORM_VALUES

  resolve = (values: z.infer<typeof tuicSchema>) => {
    const query = {
      congestion_control: values.congestion_control,
      alpn: values.alpn,
      sni: values.sni,
      allow_insecure: values.allowInsecure,
      disable_sni: values.disable_sni,
      udp_relay_mode: values.udp_relay_mode,
    }

    return this.generateURL({
      protocol: 'tuic',
      username: values.uuid,
      password: values.password,
      host: values.server,
      port: values.port,
      hash: values.name,
      params: query,
    })
  }
}

export const juicitySchema = z.object({
  name: z.string(),
  server: z.string().nonempty(),
  port: z.number().min(0).max(65535),
  uuid: z.string().nonempty(),
  password: z.string().nonempty(),
  allowInsecure: z.boolean(),
  sni: z.string(),
  congestion_control: z.string(),
})

export const DEFAULT_JUICITY_FORM_VALUES: z.infer<typeof juicitySchema> = {
  name: '',
  port: 0,
  server: '',
  congestion_control: '',
  allowInsecure: false,
  uuid: '',
  password: '',
  sni: '',
}

export class JuicityNodeResolver extends BaseNodeResolver<typeof juicitySchema> {
  type = NodeType.juicity
  schema = juicitySchema
  defaultValues = DEFAULT_JUICITY_FORM_VALUES

  resolve = (values: z.infer<typeof juicitySchema>) => {
    const query = {
      congestion_control: values.congestion_control,
      sni: values.sni,
      allow_insecure: values.allowInsecure,
    }

    return this.generateURL({
      protocol: 'juicity',
      username: values.uuid,
      password: values.password,
      host: values.server,
      port: values.port,
      hash: values.name,
      params: query,
    })
  }
}

export const httpSchema = z.object({
  username: z.string(),
  password: z.string(),
  host: z.string().nonempty(),
  port: z.number().min(0).max(65535),
  name: z.string(),
})

export const DEFAULT_HTTP_FORM_VALUES: z.infer<typeof httpSchema> = {
  host: '',
  name: '',
  password: '',
  port: 0,
  username: '',
}

export class HTTPNodeResolver extends BaseNodeResolver<typeof httpSchema> {
  type = NodeType.http
  schema = httpSchema
  defaultValues = DEFAULT_HTTP_FORM_VALUES

  resolve = (values: z.infer<typeof httpSchema> & { protocol: 'http' | 'https' }) => {
    const generateURLParams: GenerateURLParams = {
      protocol: values.protocol,
      host: values.host,
      port: values.port,
      hash: values.name,
    }

    if (values.username && values.password) {
      Object.assign(generateURLParams, {
        username: values.username,
        password: values.password,
      })
    }

    return this.generateURL(generateURLParams)
  }
}

export const socks5Schema = z.object({
  username: z.string(),
  password: z.string(),
  host: z.string().nonempty(),
  port: z.number().min(0).max(65535),
  name: z.string(),
})

export const DEFAULT_SOCKS5_FORM_VALUES: z.infer<typeof socks5Schema> = {
  host: '',
  name: '',
  password: '',
  port: 0,
  username: '',
}

export class Socks5NodeResolver extends BaseNodeResolver<typeof socks5Schema> {
  type = NodeType.socks5
  schema = socks5Schema
  defaultValues = DEFAULT_SOCKS5_FORM_VALUES

  resolve = (values: z.infer<typeof socks5Schema>) => {
    const generateURLParams: GenerateURLParams = {
      protocol: 'socks5',
      host: values.host,
      port: values.port,
      hash: values.name,
    }

    if (values.username && values.password) {
      Object.assign(generateURLParams, {
        username: values.username,
        password: values.password,
      })
    }

    return this.generateURL(generateURLParams)
  }
}
