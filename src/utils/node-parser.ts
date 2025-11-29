import type { z } from 'zod'
import type {
  httpSchema,
  hysteria2Schema,
  juicitySchema,
  socks5Schema,
  ssrSchema,
  ssSchema,
  trojanSchema,
  tuicSchema,
  v2raySchema,
} from '~/constants/schema'
import { Base64 } from 'js-base64'

type HTTPFormValues = z.infer<typeof httpSchema>
type Socks5FormValues = z.infer<typeof socks5Schema>
type SSFormValues = z.infer<typeof ssSchema>
type SSRFormValues = z.infer<typeof ssrSchema>
type TrojanFormValues = z.infer<typeof trojanSchema>
type TuicFormValues = z.infer<typeof tuicSchema>
type JuicityFormValues = z.infer<typeof juicitySchema>
type Hysteria2FormValues = z.infer<typeof hysteria2Schema>
type V2rayFormValues = z.infer<typeof v2raySchema>

/**
 * Parse HTTP/HTTPS protocol URL
 * Format: http://[username:password@]host:port#name
 */
export function parseHTTPUrl(url: string): (Partial<HTTPFormValues> & { protocol: 'http' | 'https' }) | null {
  try {
    const parsed = new URL(url)

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }

    return {
      protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
      host: parsed.hostname,
      port: parsed.port ? Number.parseInt(parsed.port, 10) : parsed.protocol === 'https:' ? 443 : 80,
      username: decodeURIComponent(parsed.username || ''),
      password: decodeURIComponent(parsed.password || ''),
      name: decodeURIComponent(parsed.hash.slice(1) || ''),
    }
  } catch {
    return null
  }
}

/**
 * Parse SOCKS5 protocol URL
 * Format: socks5://[username:password@]host:port#name
 */
export function parseSocks5Url(url: string): Partial<Socks5FormValues> | null {
  try {
    const parsed = new URL(url)

    if (parsed.protocol !== 'socks5:') {
      return null
    }

    return {
      host: parsed.hostname,
      port: parsed.port ? Number.parseInt(parsed.port, 10) : 1080,
      username: decodeURIComponent(parsed.username || ''),
      password: decodeURIComponent(parsed.password || ''),
      name: decodeURIComponent(parsed.hash.slice(1) || ''),
    }
  } catch {
    return null
  }
}

/**
 * Parse Shadowsocks (SS) protocol URL
 * Format: ss://BASE64(method:password)@server:port#name
 * Alternative: ss://BASE64(method:password@server:port)#name
 */
export function parseSSUrl(url: string): Partial<SSFormValues> | null {
  try {
    if (!url.startsWith('ss://')) {
      return null
    }

    const content = url.slice(5)
    const hashIndex = content.lastIndexOf('#')
    const name = hashIndex !== -1 ? decodeURIComponent(content.slice(hashIndex + 1)) : ''
    const mainPart = hashIndex !== -1 ? content.slice(0, hashIndex) : content

    // Try to find @ in the URL to determine format
    const atIndex = mainPart.lastIndexOf('@')

    let method: string
    let password: string
    let server: string
    let port: number
    let plugin = ''
    let pluginOpts: Record<string, string> = {}

    if (atIndex !== -1) {
      // Format: BASE64(method:password)@server:port/?plugin=...
      const userInfoBase64 = mainPart.slice(0, atIndex)
      const hostPart = mainPart.slice(atIndex + 1)

      // Parse host:port/?plugin=...
      const queryIndex = hostPart.indexOf('?')
      const hostPortPart = queryIndex !== -1 ? hostPart.slice(0, queryIndex) : hostPart

      if (queryIndex !== -1) {
        const queryString = hostPart.slice(queryIndex + 1)
        const params = new URLSearchParams(queryString)
        const pluginStr = params.get('plugin')

        if (pluginStr) {
          const pluginParts = pluginStr.split(';')
          plugin = pluginParts[0] || ''
          pluginOpts = pluginParts.slice(1).reduce(
            (acc, part) => {
              const [key, value] = part.split('=')

              if (key) {
                acc[key] = value || ''
              }

              return acc
            },
            {} as Record<string, string>,
          )
        }
      }

      // Remove trailing slash if present
      const cleanHostPort = hostPortPart.replace(/\/$/, '')
      const colonIndex = cleanHostPort.lastIndexOf(':')

      if (colonIndex === -1) {
        return null
      }

      server = cleanHostPort.slice(0, colonIndex)
      port = Number.parseInt(cleanHostPort.slice(colonIndex + 1), 10)

      // Decode userinfo
      const userInfo = Base64.decode(userInfoBase64)
      const colonUserIndex = userInfo.indexOf(':')

      if (colonUserIndex === -1) {
        return null
      }

      method = userInfo.slice(0, colonUserIndex)
      password = userInfo.slice(colonUserIndex + 1)
    } else {
      // Format: BASE64(method:password@server:port)
      const decoded = Base64.decode(mainPart)
      const atDecodedIndex = decoded.lastIndexOf('@')

      if (atDecodedIndex === -1) {
        return null
      }

      const userInfo = decoded.slice(0, atDecodedIndex)
      const hostPort = decoded.slice(atDecodedIndex + 1)

      const colonUserIndex = userInfo.indexOf(':')

      if (colonUserIndex === -1) {
        return null
      }

      method = userInfo.slice(0, colonUserIndex)
      password = userInfo.slice(colonUserIndex + 1)

      const colonIndex = hostPort.lastIndexOf(':')

      if (colonIndex === -1) {
        return null
      }

      server = hostPort.slice(0, colonIndex)
      port = Number.parseInt(hostPort.slice(colonIndex + 1), 10)
    }

    const result: Partial<SSFormValues> = {
      method: method as SSFormValues['method'],
      password,
      server,
      port,
      name,
      plugin: plugin as SSFormValues['plugin'],
    }

    // Parse plugin options
    if (plugin === 'v2ray-plugin') {
      result.tls = pluginOpts.tls ? 'tls' : ''
      result.mode = pluginOpts.mode || 'websocket'
      result.host = pluginOpts.host || ''
      result.path = pluginOpts.path || ''
      result.impl = (pluginOpts.impl || '') as SSFormValues['impl']
    } else if (plugin === 'simple-obfs') {
      result.obfs = (pluginOpts.obfs || 'http') as SSFormValues['obfs']
      result.host = pluginOpts['obfs-host'] || ''
      result.path = pluginOpts['obfs-path'] || ''
      result.impl = (pluginOpts.impl || '') as SSFormValues['impl']
    }

    return result
  } catch {
    return null
  }
}

/**
 * Parse ShadowsocksR (SSR) protocol URL
 * Format: ssr://BASE64(server:port:proto:method:obfs:BASE64(password)/?remarks=BASE64(remarks)&...)
 */
export function parseSSRUrl(url: string): Partial<SSRFormValues> | null {
  try {
    if (!url.startsWith('ssr://')) {
      return null
    }

    const decoded = Base64.decode(url.slice(6))
    const mainQuerySplit = decoded.split('/?')
    const mainPart = mainQuerySplit[0]
    const queryPart = mainQuerySplit[1] || ''

    // Parse main part: server:port:proto:method:obfs:password_base64
    const parts = mainPart.split(':')

    if (parts.length < 6) {
      return null
    }

    // Server might contain ':' in IPv6
    const password = Base64.decode(parts[parts.length - 1])
    const obfs = parts[parts.length - 2]
    const method = parts[parts.length - 3]
    const proto = parts[parts.length - 4]
    const port = Number.parseInt(parts[parts.length - 5], 10)
    const server = parts.slice(0, parts.length - 5).join(':')

    // Parse query parameters
    const params = new URLSearchParams(queryPart)
    const name = params.get('remarks') ? Base64.decode(params.get('remarks')!) : ''
    const protoParam = params.get('protoparam') ? Base64.decode(params.get('protoparam')!) : ''
    const obfsParam = params.get('obfsparam') ? Base64.decode(params.get('obfsparam')!) : ''

    return {
      server,
      port,
      proto: proto as SSRFormValues['proto'],
      method: method as SSRFormValues['method'],
      obfs: obfs as SSRFormValues['obfs'],
      password,
      name,
      protoParam,
      obfsParam,
    }
  } catch {
    return null
  }
}

/**
 * Parse Trojan/Trojan-Go protocol URL
 * Format: trojan://password@server:port?sni=...&allowInsecure=...#name
 */
export function parseTrojanUrl(url: string): Partial<TrojanFormValues> | null {
  try {
    const isTrojanGo = url.startsWith('trojan-go://')
    const isTrojan = url.startsWith('trojan://')

    if (!isTrojan && !isTrojanGo) {
      return null
    }

    const parsed = new URL(url)
    const params = parsed.searchParams

    const result: Partial<TrojanFormValues> = {
      password: decodeURIComponent(parsed.username),
      server: parsed.hostname,
      port: parsed.port ? Number.parseInt(parsed.port, 10) : 443,
      name: decodeURIComponent(parsed.hash.slice(1) || ''),
      peer: params.get('sni') || params.get('peer') || '',
      allowInsecure: params.get('allowInsecure') === '1' || params.get('allowInsecure') === 'true',
    }

    // Trojan-Go specific fields
    if (isTrojanGo) {
      const type = params.get('type') || 'original'
      result.obfs = type === 'ws' ? 'websocket' : 'none'

      if (result.obfs === 'websocket') {
        result.host = params.get('host') || ''
        result.path = params.get('path') || '/'
      }

      const encryption = params.get('encryption')

      if (encryption && encryption.startsWith('ss;')) {
        const encParts = encryption.split(';')
        result.method = 'shadowsocks'
        result.ssCipher = (encParts[1] || 'aes-128-gcm') as TrojanFormValues['ssCipher']
        result.ssPassword = encParts[2] || ''
      } else {
        result.method = 'origin'
      }
    } else {
      result.method = 'origin'
      result.obfs = 'none'
    }

    return result
  } catch {
    return null
  }
}

/**
 * Parse TUIC protocol URL
 * Format: tuic://uuid:password@server:port?...#name
 */
export function parseTuicUrl(url: string): Partial<TuicFormValues> | null {
  try {
    if (!url.startsWith('tuic://')) {
      return null
    }

    const parsed = new URL(url)
    const params = parsed.searchParams

    return {
      uuid: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      server: parsed.hostname,
      port: parsed.port ? Number.parseInt(parsed.port, 10) : 443,
      name: decodeURIComponent(parsed.hash.slice(1) || ''),
      congestion_control: params.get('congestion_control') || '',
      alpn: params.get('alpn') || '',
      sni: params.get('sni') || '',
      allowInsecure: params.get('allow_insecure') === '1' || params.get('allow_insecure') === 'true',
      disable_sni: params.get('disable_sni') === '1' || params.get('disable_sni') === 'true',
      udp_relay_mode: params.get('udp_relay_mode') || '',
    }
  } catch {
    return null
  }
}

/**
 * Parse Juicity protocol URL
 * Format: juicity://uuid:password@server:port?...#name
 */
export function parseJuicityUrl(url: string): Partial<JuicityFormValues> | null {
  try {
    if (!url.startsWith('juicity://')) {
      return null
    }

    const parsed = new URL(url)
    const params = parsed.searchParams

    return {
      uuid: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      server: parsed.hostname,
      port: parsed.port ? Number.parseInt(parsed.port, 10) : 443,
      name: decodeURIComponent(parsed.hash.slice(1) || ''),
      congestion_control: params.get('congestion_control') || '',
      pinned_certchain_sha256: params.get('pinned_certchain_sha256') || '',
      sni: params.get('sni') || '',
      allowInsecure: params.get('allow_insecure') === '1' || params.get('allow_insecure') === 'true',
    }
  } catch {
    return null
  }
}

/**
 * Parse Hysteria2 protocol URL
 * Format: hysteria2://auth@hostname:port/?...
 */
export function parseHysteria2Url(url: string): Partial<Hysteria2FormValues> | null {
  try {
    if (!url.startsWith('hysteria2://') && !url.startsWith('hy2://')) {
      return null
    }

    const parsed = new URL(url)
    const params = parsed.searchParams

    return {
      auth: decodeURIComponent(parsed.username),
      server: parsed.hostname,
      port: parsed.port ? Number.parseInt(parsed.port, 10) : 443,
      name: decodeURIComponent(parsed.hash.slice(1) || ''),
      obfs: params.get('obfs') || '',
      obfsPassword: params.get('obfs-password') || params.get('obfsPassword') || '',
      sni: params.get('sni') || '',
      allowInsecure: params.get('insecure') === '1' || params.get('insecure') === 'true',
      pinSHA256: params.get('pinSHA256') || '',
    }
  } catch {
    return null
  }
}

/**
 * Parse VMess protocol URL
 * Format: vmess://BASE64(JSON)
 */
export function parseVMessUrl(url: string): (Partial<V2rayFormValues> & { protocol: 'vmess' }) | null {
  try {
    if (!url.startsWith('vmess://')) {
      return null
    }

    const decoded = Base64.decode(url.slice(8))
    const config = JSON.parse(decoded)

    return {
      protocol: 'vmess',
      ps: config.ps || '',
      add: config.add || '',
      port: Number(config.port) || 0,
      id: config.id || '',
      aid: Number(config.aid) || 0,
      net: config.net || 'tcp',
      type: config.type || 'none',
      host: config.host || '',
      path: config.path || '',
      tls: config.tls || 'none',
      sni: config.sni || '',
      alpn: config.alpn || '',
      scy: config.scy || 'auto',
      allowInsecure: config.allowInsecure === true || config.allowInsecure === 1,
      flow: config.flow || 'none',
      v: '',
    }
  } catch {
    return null
  }
}

/**
 * Parse VLESS protocol URL
 * Format: vless://uuid@server:port?...#name
 */
export function parseVLessUrl(url: string): (Partial<V2rayFormValues> & { protocol: 'vless' }) | null {
  try {
    if (!url.startsWith('vless://')) {
      return null
    }

    const parsed = new URL(url)
    const params = parsed.searchParams

    return {
      protocol: 'vless',
      id: decodeURIComponent(parsed.username),
      add: parsed.hostname,
      port: parsed.port ? Number.parseInt(parsed.port, 10) : 443,
      ps: decodeURIComponent(parsed.hash.slice(1) || ''),
      net: (params.get('type') || 'tcp') as V2rayFormValues['net'],
      tls: (params.get('security') || 'none') as V2rayFormValues['tls'],
      sni: params.get('sni') || '',
      alpn: params.get('alpn') || '',
      host: params.get('host') || '',
      path: params.get('path') || params.get('serviceName') || params.get('seed') || '',
      type: (params.get('headerType') || 'none') as V2rayFormValues['type'],
      flow: (params.get('flow') || 'none') as V2rayFormValues['flow'],
      allowInsecure: params.get('allowInsecure') === '1' || params.get('allowInsecure') === 'true',
      // Defaults for vmess-only fields
      aid: 0,
      scy: 'auto',
      v: '',
    }
  } catch {
    return null
  }
}

/**
 * Parse V2Ray (VMess/VLESS) protocol URL
 */
export function parseV2rayUrl(url: string): (Partial<V2rayFormValues> & { protocol: 'vmess' | 'vless' }) | null {
  if (url.startsWith('vmess://')) {
    return parseVMessUrl(url)
  }

  if (url.startsWith('vless://')) {
    return parseVLessUrl(url)
  }

  return null
}

/**
 * Detect protocol from URL and parse accordingly
 */
export function parseNodeUrl(
  url: string,
):
  | { type: 'http'; data: ReturnType<typeof parseHTTPUrl> }
  | { type: 'socks5'; data: ReturnType<typeof parseSocks5Url> }
  | { type: 'ss'; data: ReturnType<typeof parseSSUrl> }
  | { type: 'ssr'; data: ReturnType<typeof parseSSRUrl> }
  | { type: 'trojan'; data: ReturnType<typeof parseTrojanUrl> }
  | { type: 'tuic'; data: ReturnType<typeof parseTuicUrl> }
  | { type: 'juicity'; data: ReturnType<typeof parseJuicityUrl> }
  | { type: 'hysteria2'; data: ReturnType<typeof parseHysteria2Url> }
  | { type: 'v2ray'; data: ReturnType<typeof parseV2rayUrl> }
  | null {
  const trimmedUrl = url.trim()

  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    const data = parseHTTPUrl(trimmedUrl)
    return data ? { type: 'http', data } : null
  }

  if (trimmedUrl.startsWith('socks5://')) {
    const data = parseSocks5Url(trimmedUrl)
    return data ? { type: 'socks5', data } : null
  }

  if (trimmedUrl.startsWith('ss://')) {
    const data = parseSSUrl(trimmedUrl)
    return data ? { type: 'ss', data } : null
  }

  if (trimmedUrl.startsWith('ssr://')) {
    const data = parseSSRUrl(trimmedUrl)
    return data ? { type: 'ssr', data } : null
  }

  if (trimmedUrl.startsWith('trojan://') || trimmedUrl.startsWith('trojan-go://')) {
    const data = parseTrojanUrl(trimmedUrl)
    return data ? { type: 'trojan', data } : null
  }

  if (trimmedUrl.startsWith('tuic://')) {
    const data = parseTuicUrl(trimmedUrl)
    return data ? { type: 'tuic', data } : null
  }

  if (trimmedUrl.startsWith('juicity://')) {
    const data = parseJuicityUrl(trimmedUrl)
    return data ? { type: 'juicity', data } : null
  }

  if (trimmedUrl.startsWith('hysteria2://') || trimmedUrl.startsWith('hy2://')) {
    const data = parseHysteria2Url(trimmedUrl)
    return data ? { type: 'hysteria2', data } : null
  }

  if (trimmedUrl.startsWith('vmess://') || trimmedUrl.startsWith('vless://')) {
    const data = parseV2rayUrl(trimmedUrl)
    return data ? { type: 'v2ray', data } : null
  }

  return null
}
