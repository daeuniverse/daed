# dae RoutingA

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/daeuniverse.dae-routinga)](https://marketplace.visualstudio.com/items?itemName=daeuniverse.dae-routinga)

Language support for [dae](https://github.com/daeuniverse/dae) configuration files.

## Features

- **Syntax Highlighting**: Full syntax highlighting for dae configuration DSL
- **IntelliSense**: Auto-completion for keywords, functions, built-in outbounds, and matching types
- **Formatting**: Code formatting with proper indentation and spacing normalization
- **Snippets**: Useful code snippets for common patterns

## Supported File Extensions

- `.dae`

## Language Features

### Syntax Highlighting

The extension provides comprehensive syntax highlighting for:

- Comments (`#`)
- Section blocks (`global`, `subscription`, `node`, `dns`, `group`, `routing`)
- Configuration options (`tproxy_port`, `log_level`, `dial_mode`, etc.)
- Rule functions (`domain`, `dip`, `dport`, `pname`, `qname`, etc.)
- Policy functions (`min_moving_avg`, `min`, `min_avg10`, `random`, `fixed`)
- Filter functions (`subtag`, `name`)
- Matching types (`geosite:`, `geoip:`, `full:`, `contains:`, `regexp:`)
- Built-in outbounds (`proxy`, `direct`, `block`, `must_direct`, `must_proxy`)
- Operators (`->`, `&&`, `!`)
- IP addresses, port ranges, and strings

### IntelliSense

Auto-completion is available for:

- All section blocks with templates
- Global configuration options
- Rule functions with parameter placeholders
- Policy and filter functions
- Matching type prefixes
- Built-in outbounds

### Formatting

Format your dae configuration with:

- Proper indentation for blocks
- Normalized spacing around operators
- Consistent comment formatting

Use `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (macOS) to format the document.

### Snippets

Available snippets:

| Prefix          | Description                   |
| --------------- | ----------------------------- |
| `global`        | Global section template       |
| `subscription`  | Subscription section template |
| `node`          | Node section template         |
| `dns`           | DNS section template          |
| `group`         | Group section template        |
| `routing`       | Routing section template      |
| `group-def`     | Group definition              |
| `fallback`      | Fallback declaration          |
| `filter-subtag` | Filter by subscription tag    |
| `filter-name`   | Filter by name pattern        |
| `policy`        | Policy declaration            |
| `rule-domain`   | Domain matching rule          |
| `rule-ip`       | IP matching rule              |
| `rule-geosite`  | Geosite matching rule         |
| `rule-geoip`    | Geoip matching rule           |
| `rule-process`  | Process matching rule         |
| `rule-port`     | Port matching rule            |
| `dae-example`   | Complete dae config example   |

## Example

```dae
global {
  tproxy_port: 12345
  log_level: info
  tcp_check_url: 'http://cp.cloudflare.com'
  dial_mode: domain
  wan_interface: auto
}

subscription {
  my_sub: 'https://example.com/subscription'
}

dns {
  upstream {
    alidns: 'udp://dns.alidns.com:53'
    googledns: 'tcp+udp://dns.google:53'
  }
  routing {
    request {
      qname(geosite:cn) -> alidns
      fallback: googledns
    }
  }
}

group {
  proxy {
    filter: subtag(my_sub)
    policy: min_moving_avg
  }
}

routing {
  dip(geoip:private) -> direct
  domain(geosite:cn) -> direct
  dip(geoip:cn) -> direct
  domain(geosite:category-ads-all) -> block
  fallback: proxy
}
```

## Related Projects

- [dae](https://github.com/daeuniverse/dae) - eBPF-based Linux high-performance transparent proxy solution
- [daed](https://github.com/daeuniverse/daed) - A modern dashboard for dae

## License

MIT
