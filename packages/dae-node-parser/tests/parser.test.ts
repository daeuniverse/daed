import { describe, expect, it } from 'vitest'

import {
  parseHTTPUrl,
  parseHysteria2Url,
  parseNodeUrl,
  parseSocks5Url,
  parseSSUrl,
  parseTrojanUrl,
  parseV2rayUrl,
} from '../src/parser'

describe('parseHTTPUrl', () => {
  it('should parse basic HTTP URL', () => {
    const result = parseHTTPUrl('http://example.com:8080#my-proxy')
    expect(result).toEqual({
      protocol: 'http',
      host: 'example.com',
      port: 8080,
      username: '',
      password: '',
      name: 'my-proxy',
    })
  })

  it('should parse HTTPS URL with auth', () => {
    const result = parseHTTPUrl('https://user:pass@example.com:443#proxy')
    expect(result).toEqual({
      protocol: 'https',
      host: 'example.com',
      port: 443,
      username: 'user',
      password: 'pass',
      name: 'proxy',
    })
  })

  it('should return null for non-HTTP URL', () => {
    expect(parseHTTPUrl('socks5://example.com')).toBeNull()
  })
})

describe('parseSocks5Url', () => {
  it('should parse basic SOCKS5 URL', () => {
    const result = parseSocks5Url('socks5://example.com:1080#my-socks')
    expect(result).toEqual({
      host: 'example.com',
      port: 1080,
      username: '',
      password: '',
      name: 'my-socks',
    })
  })
})

describe('parseSSUrl', () => {
  it('should parse SS URL with base64 encoded userinfo', () => {
    // aes-256-gcm:password encoded as YWVzLTI1Ni1nY206cGFzc3dvcmQ=
    const result = parseSSUrl('ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:8388#my-ss')
    expect(result).toMatchObject({
      method: 'aes-256-gcm',
      password: 'password',
      server: 'example.com',
      port: 8388,
      name: 'my-ss',
    })
  })
})

describe('parseTrojanUrl', () => {
  it('should parse basic Trojan URL', () => {
    const result = parseTrojanUrl('trojan://password123@example.com:443?sni=example.com#my-trojan')
    expect(result).toMatchObject({
      password: 'password123',
      server: 'example.com',
      port: 443,
      name: 'my-trojan',
      peer: 'example.com',
      method: 'origin',
      obfs: 'none',
    })
  })
})

describe('parseHysteria2Url', () => {
  it('should parse Hysteria2 URL', () => {
    const result = parseHysteria2Url('hysteria2://auth@example.com:443/?sni=example.com#my-hy2')
    expect(result).toMatchObject({
      auth: 'auth',
      server: 'example.com',
      port: 443,
      name: 'my-hy2',
      sni: 'example.com',
    })
  })

  it('should parse hy2:// prefix', () => {
    const result = parseHysteria2Url('hy2://auth@example.com:443#test')
    expect(result).toMatchObject({
      auth: 'auth',
      server: 'example.com',
      port: 443,
    })
  })

  it('should parse Hysteria2 with ports (hopping)', () => {
    const result = parseHysteria2Url('hysteria2://auth@example.com:443/?ports=10000-20000#hopping')
    expect(result).toMatchObject({
      auth: 'auth',
      server: 'example.com',
      port: 443,
      ports: '10000-20000',
    })
  })
})

describe('parseV2rayUrl', () => {
  it('should parse VLESS URL', () => {
    const result = parseV2rayUrl('vless://uuid-here@example.com:443?type=tcp&security=tls#my-vless')
    expect(result).toMatchObject({
      protocol: 'vless',
      id: 'uuid-here',
      add: 'example.com',
      port: 443,
      ps: 'my-vless',
      net: 'tcp',
      tls: 'tls',
    })
  })

  it('should parse VLESS URL with WebSocket', () => {
    const result = parseV2rayUrl(
      'vless://uuid@example.com:443?type=ws&security=tls&host=example.com&path=%2Fws#ws-vless',
    )
    expect(result).toMatchObject({
      protocol: 'vless',
      id: 'uuid',
      net: 'ws',
      tls: 'tls',
      host: 'example.com',
      path: '/ws',
    })
  })

  it('should parse VLESS URL with gRPC', () => {
    const result = parseV2rayUrl(
      'vless://uuid@example.com:443?type=grpc&security=tls&serviceName=myservice&mode=gun#grpc-vless',
    )
    expect(result).toMatchObject({
      protocol: 'vless',
      net: 'grpc',
      path: 'myservice',
      grpcMode: 'gun',
    })
  })

  it('should parse VLESS URL with REALITY', () => {
    const result = parseV2rayUrl(
      'vless://uuid@example.com:443?type=tcp&security=reality&pbk=publickey&sid=shortid&fp=chrome&sni=sni.example.com&flow=xtls-rprx-vision#reality-vless',
    )
    expect(result).toMatchObject({
      protocol: 'vless',
      tls: 'reality',
      pbk: 'publickey',
      sid: 'shortid',
      fp: 'chrome',
      sni: 'sni.example.com',
      flow: 'xtls-rprx-vision',
    })
  })

  it('should parse VLESS URL with mKCP and seed', () => {
    const result = parseV2rayUrl('vless://uuid@example.com:443?type=kcp&headerType=wireguard&seed=myseed#kcp-vless')
    expect(result).toMatchObject({
      protocol: 'vless',
      net: 'kcp',
      type: 'wireguard',
      path: 'myseed',
    })
  })

  it('should parse VLESS URL with HTTP/2 (http type)', () => {
    const result = parseV2rayUrl(
      'vless://uuid@example.com:443?type=http&security=tls&host=example.com&path=%2Fh2#h2-vless',
    )
    expect(result).toMatchObject({
      protocol: 'vless',
      net: 'h2', // normalized from 'http'
      tls: 'tls',
      host: 'example.com',
      path: '/h2',
    })
  })

  it('should parse legacy VMess base64 JSON format', () => {
    const vmessConfig = btoa(
      JSON.stringify({
        ps: 'test-vmess',
        add: 'example.com',
        port: 443,
        id: 'uuid-test',
        aid: 0,
        net: 'tcp',
        tls: 'tls',
        scy: 'auto',
      }),
    )
    const result = parseV2rayUrl(`vmess://${vmessConfig}`)
    expect(result).toMatchObject({
      protocol: 'vmess',
      ps: 'test-vmess',
      add: 'example.com',
      port: 443,
      id: 'uuid-test',
      net: 'tcp',
      tls: 'tls',
      scy: 'auto',
    })
  })

  it('should parse VMess standard URL format', () => {
    const result = parseV2rayUrl(
      'vmess://uuid-here@example.com:443?type=ws&security=tls&host=example.com&path=%2Fws&encryption=auto#standard-vmess',
    )
    expect(result).toMatchObject({
      protocol: 'vmess',
      id: 'uuid-here',
      add: 'example.com',
      port: 443,
      ps: 'standard-vmess',
      net: 'ws',
      tls: 'tls',
      host: 'example.com',
      path: '/ws',
      scy: 'auto',
    })
  })

  it('should parse VMess without TLS (naked)', () => {
    const result = parseV2rayUrl('vmess://uuid@example.com:31415?encryption=none#VMessTCPNaked')
    expect(result).toMatchObject({
      protocol: 'vmess',
      id: 'uuid',
      add: 'example.com',
      port: 31415,
      scy: 'none',
      tls: 'none',
    })
  })

  it('should parse VLESS with HTTPUpgrade', () => {
    const result = parseV2rayUrl(
      'vless://uuid@example.com:443?type=httpupgrade&security=tls&host=example.com&path=%2Fupgrade#httpupgrade-vless',
    )
    expect(result).toMatchObject({
      protocol: 'vless',
      net: 'httpupgrade',
      host: 'example.com',
      path: '/upgrade',
    })
  })

  it('should handle ALPN correctly', () => {
    const result = parseV2rayUrl('vless://uuid@example.com:443?type=tcp&security=tls&alpn=h2%2Chttp%2F1.1#alpn-test')
    expect(result).toMatchObject({
      alpn: 'h2,http/1.1',
    })
  })
})

describe('parseNodeUrl', () => {
  it('should auto-detect HTTP protocol', () => {
    const result = parseNodeUrl('http://example.com:8080#proxy')
    expect(result?.type).toBe('http')
  })

  it('should auto-detect SOCKS5 protocol', () => {
    const result = parseNodeUrl('socks5://example.com:1080')
    expect(result?.type).toBe('socks5')
  })

  it('should auto-detect SS protocol', () => {
    const result = parseNodeUrl('ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:8388')
    expect(result?.type).toBe('ss')
  })

  it('should auto-detect Trojan protocol', () => {
    const result = parseNodeUrl('trojan://password@example.com:443')
    expect(result?.type).toBe('trojan')
  })

  it('should auto-detect VMess protocol', () => {
    const vmessConfig = btoa(JSON.stringify({ add: 'example.com', port: 443 }))
    const result = parseNodeUrl(`vmess://${vmessConfig}`)
    expect(result?.type).toBe('v2ray')
  })

  it('should return null for unknown protocol', () => {
    expect(parseNodeUrl('unknown://example.com')).toBeNull()
  })
})
