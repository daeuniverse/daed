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

function parseURL(u: string) {
  let url = u
  let protocol = ''
  let fakeProto = false

  if (url.indexOf('://') === -1) {
    url = 'http://' + url
  } else {
    protocol = url.substring(0, url.indexOf('://'))

    switch (protocol) {
      case 'http':
      case 'https':
      case 'ws':
      case 'wss':
        break
      default:
        url = 'http' + url.substring(url.indexOf('://'))
        fakeProto = true
    }
  }

  const a = document.createElement('a')
  a.href = url

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r: Record<string, any> = {
    source: u,
    username: a.username,
    password: a.password,
    protocol: fakeProto ? protocol : a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port ? parseInt(a.port) : protocol === 'https' || protocol === 'wss' ? 443 : 80,
    query: a.search,
    params: (function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ret: Record<string, any> = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length

      let i = 0

      let s

      for (; i < len; i++) {
        if (!seg[i]) {
          continue
        }

        s = seg[i].split('=')
        ret[s[0]] = decodeURIComponent(s[1])
      }

      return ret
    })(),
    file: (a.pathname.match(/\/([^/?#]+)$/i) || [null, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || [null, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/'),
  }
  a.remove()

  return r
}

abstract class BaseNodeResolver<Schema extends ZodSchema> {
  abstract type: NodeType
  abstract schema: Schema
  abstract defaultValues: z.infer<Schema>

  abstract generate(values: z.infer<Schema>): string
  abstract resolve(url: string): z.infer<Schema>

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

  generate(values: z.infer<typeof v2raySchema>) {
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

  resolve(url: string) {
    const values = JSON.parse(Base64.decode(url.substring(url.indexOf('://') + 3)))

    values.ps = decodeURIComponent(values.ps)
    values.tls = values.tls || 'none'
    values.type = values.type || 'none'
    values.scy = values.scy || 'auto'

    return values
  }
}

export class VlessNodeResolver extends BaseNodeResolver<typeof v2raySchema> {
  type = NodeType.vless
  schema = v2raySchema
  defaultValues = DEFAULT_V2RAY_FORM_VALUES

  generate(values: z.infer<typeof v2raySchema>) {
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

  resolve(url: string) {
    const u = parseURL(url)

    const o: z.infer<typeof v2raySchema> = {
      ps: decodeURIComponent(u.hash),
      add: u.host,
      port: u.port,
      id: decodeURIComponent(u.username),
      net: u.params.type || 'tcp',
      type: u.params.headerType || 'none',
      host: u.params.host || u.params.sni || '',
      path: u.params.path || u.params.serviceName || '',
      alpn: u.params.alpn || '',
      flow: u.params.flow || 'none',
      sni: u.params.sni || '',
      tls: u.params.security || 'none',
      allowInsecure: u.params.allowInsecure || false,
      aid: 0,
      scy: 'none',
      v: '',
    }

    if (o.alpn !== '') {
      o.alpn = decodeURIComponent(o.alpn)
    }

    if (o.net === 'kcp') {
      o.path = u.params.seed
    }

    return o
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

  generate(values: z.infer<typeof ssSchema>) {
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

  resolve(url: string) {
    const u = parseURL(url)

    let mp

    if (!u.password) {
      try {
        u.username = Base64.decode(decodeURIComponent(u.username))
        mp = u.username.split(':')

        if (mp.length > 2) {
          mp[1] = mp.slice(1).join(':')
          mp = mp.slice(0, 2)
        }
      } catch (e) {
        //pass
      }
    } else {
      mp = [u.username, u.password]
    }

    u.hash = decodeURIComponent(u.hash)

    const obj: z.infer<typeof ssSchema> = {
      method: mp[0],
      password: mp[1],
      server: u.host,
      port: u.port,
      name: u.hash,
      obfs: 'http',
      plugin: '',
      impl: '',
      path: '',
      tls: '',
      mode: '',
      host: '',
    }

    if (u.params.plugin) {
      u.params.plugin = decodeURIComponent(u.params.plugin)

      const arr = u.params.plugin.split(';')

      const plugin = arr[0]

      switch (plugin) {
        case 'obfs-local':
        case 'simpleobfs':
          obj.plugin = 'simple-obfs'
          break
        case 'v2ray-plugin':
          obj.tls = ''
          obj.mode = 'websocket'
          break
      }

      for (let i = 1; i < arr.length; i++) {
        //"obfs-local;obfs=tls;obfs-host=4cb6a43103.wns.windows.com"
        const a = arr[i].split('=')

        switch (a[0]) {
          case 'obfs':
            obj.obfs = a[1]
            break
          case 'host':
          case 'obfs-host':
            obj.host = a[1]
            break
          case 'path':
          case 'obfs-path':
            obj.path = a[1]
            break
          case 'mode':
            obj.mode = a[1]
            break
          case 'tls':
            obj.tls = 'tls'
            break
          case 'impl':
            obj.impl = a[1]
        }
      }
    }

    return obj
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

  generate = (values: z.infer<typeof ssrSchema>) =>
    /* ssr://server:port:proto:method:obfs:URLBASE64(password)/?remarks=URLBASE64(remarks)&protoparam=URLBASE64(protoparam)&obfsparam=URLBASE64(obfsparam)) */
    `ssr://${Base64.encode(
      `${values.server}:${values.port}:${values.proto}:${values.method}:${values.obfs}:${Base64.encodeURI(
        values.password,
      )}/?remarks=${Base64.encodeURI(values.name)}&protoparam=${Base64.encodeURI(
        values.protoParam,
      )}&obfsparam=${Base64.encodeURI(values.obfsParam)}`,
    )}`

  resolve(url: string) {
    url = Base64.decode(url.substring(6))

    const arr = url.split('/?')
    const query = arr[1].split('&')

    const m: Record<string, unknown> = {}

    for (const param of query) {
      const pair = param.split('=', 2)
      const key = pair[0]
      const val = Base64.decode(pair[1])

      m[key] = val
    }

    let pre = arr[0].split(':')

    if (pre.length > 6) {
      //如果长度多于6，说明host中包含字符:，重新合并前几个分组到host去
      pre[pre.length - 6] = pre.slice(0, pre.length - 5).join(':')
      pre = pre.slice(pre.length - 6)
    }

    pre[5] = Base64.decode(pre[5])

    return {
      method: pre[3],
      password: pre[5],
      server: pre[0],
      port: pre[1],
      name: m['remarks'],
      proto: pre[2],
      protoParam: m['protoparam'],
      obfs: pre[4],
      obfsParam: m['obfsparam'],
    } as unknown as z.infer<typeof ssrSchema>
  }
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

  generate = (values: z.infer<typeof trojanSchema>) => {
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

  resolve(url: string) {
    const u = parseURL(url)

    const o: Record<string, unknown> = {
      password: decodeURIComponent(u.username),
      server: u.host,
      port: u.port,
      name: decodeURIComponent(u.hash),
      peer: u.params.peer || u.params.sni || '',
      allowInsecure: u.params.allowInsecure === true || u.params.allowInsecure === '1',
      method: 'origin',
      obfs: 'none',
      ssCipher: 'aes-128-gcm',
    }

    if (url.toLowerCase().startsWith('' + '')) {
      console.log(u.params.encryption)

      if (u.params.encryption?.startsWith('ss;')) {
        o.method = 'shadowsocks'
        const fields = u.params.encryption.split(';')
        o.ssCipher = fields[1]
        o.ssPassword = fields[2]
      }

      const obfsMap = {
        original: 'none',
        '': 'none',
        ws: 'websocket',
      }

      o.obfs = obfsMap[(u.params.type as keyof typeof obfsMap) || '']

      if (o.obfs === 'ws') {
        o.obfs = 'websocket'
      }

      if (o.obfs === 'websocket') {
        o.host = u.params.host || ''
        o.path = u.params.path || '/'
      }
    }

    return o as unknown as z.infer<typeof trojanSchema>
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

  generate = (values: z.infer<typeof tuicSchema>) =>
    this.generateURL({
      protocol: 'tuic',
      username: values.uuid,
      password: values.password,
      host: values.server,
      port: values.port,
      hash: values.name,
      params: {
        congestion_control: values.congestion_control,
        alpn: values.alpn,
        sni: values.sni,
        allow_insecure: values.allowInsecure,
        disable_sni: values.disable_sni,
        udp_relay_mode: values.udp_relay_mode,
      },
    })

  resolve(_url: string) {
    return {} as z.infer<typeof tuicSchema>
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

  generate = (values: z.infer<typeof juicitySchema>) =>
    this.generateURL({
      protocol: 'juicity',
      username: values.uuid,
      password: values.password,
      host: values.server,
      port: values.port,
      hash: values.name,
      params: {
        congestion_control: values.congestion_control,
        sni: values.sni,
        allow_insecure: values.allowInsecure,
      },
    })

  resolve(_url: string) {
    return {} as z.infer<typeof juicitySchema>
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

  generate = (values: z.infer<typeof httpSchema> & { protocol: 'http' | 'https' }) => {
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

  resolve(_url: string) {
    return {} as z.infer<typeof httpSchema>
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

  generate = (values: z.infer<typeof socks5Schema>) => {
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

  resolve(_url: string) {
    return {} as z.infer<typeof socks5Schema>
  }
}
