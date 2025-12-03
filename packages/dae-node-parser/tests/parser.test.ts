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
