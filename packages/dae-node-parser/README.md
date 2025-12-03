# @daeuniverse/dae-node-parser

Node protocol URL parser and generator for dae proxy protocols.

## Installation

```bash
# Using npm with GitHub Packages
npm install @daeuniverse/dae-node-parser --registry=https://npm.pkg.github.com

# Using pnpm
pnpm add @daeuniverse/dae-node-parser --registry=https://npm.pkg.github.com
```

## Setup for GitHub Packages

Create or update `.npmrc` in your project root:

```
@daeuniverse:registry=https://npm.pkg.github.com
```

## Usage

### Parsing URLs

```typescript
import { parseNodeUrl, parseTrojanUrl, parseVMessUrl } from '@daeuniverse/dae-node-parser'

// Auto-detect protocol
const result = parseNodeUrl('vmess://...')
if (result) {
  console.log(result.type) // 'v2ray'
  console.log(result.data) // parsed config
}

// Parse specific protocol
const vmess = parseVMessUrl('vmess://...')
const trojan = parseTrojanUrl('trojan://...')
```

### Generating URLs

```typescript
import { generateHysteria2URL, generateURL } from '@daeuniverse/dae-node-parser'

const url = generateURL({
  protocol: 'http',
  host: 'example.com',
  port: 8080,
  username: 'user',
  password: 'pass',
  hash: 'my-proxy',
})

const hy2Url = generateHysteria2URL({
  protocol: 'hysteria2',
  auth: 'password',
  host: 'example.com',
  port: 443,
  params: {
    sni: 'example.com',
    insecure: false,
  },
})
```

## Supported Protocols

### Parsers

- `parseHTTPUrl` - HTTP/HTTPS proxy
- `parseSocks5Url` - SOCKS5 proxy
- `parseSSUrl` - Shadowsocks
- `parseSSRUrl` - ShadowsocksR
- `parseTrojanUrl` - Trojan/Trojan-Go
- `parseTuicUrl` - TUIC
- `parseJuicityUrl` - Juicity
- `parseHysteria2Url` - Hysteria2
- `parseVMessUrl` - VMess
- `parseVLessUrl` - VLESS
- `parseV2rayUrl` - VMess/VLESS (auto-detect)
- `parseNodeUrl` - Universal parser (auto-detect all protocols)

### Generators

- `generateURL` - Generate standard proxy URL
- `generateHysteria2URL` - Generate Hysteria2 URL with proper encoding

## Types

```typescript
import type {
  HTTPConfig,
  Hysteria2Config,
  JuicityConfig,
  ParseResult,
  ProxyProtocol,
  Socks5Config,
  SSConfig,
  SSRConfig,
  TrojanConfig,
  TuicConfig,
  V2rayConfig,
} from '@daeuniverse/dae-node-parser'
```

## License

MIT
