/**
 * Hover provider for dae language
 *
 * Shows documentation when hovering over keywords, functions, and symbols
 */

import type { DocumentParser } from './parser'
import * as vscode from 'vscode'
import { findReferenceAtPosition, findSymbolAtPosition, findSymbolByName, RULE_FUNCTIONS } from './parser'

// Documentation for sections
const SECTION_DOCS: Record<string, string> = {
  global: `**Global Section**

Global configuration options for dae.

Contains settings like:
- **Software options**: \`tproxy_port\`, \`log_level\`, \`pprof_port\`, \`so_mark_from_dae\`
- **Interface options**: \`lan_interface\`, \`wan_interface\`, \`auto_config_kernel_parameter\`, \`auto_config_firewall_rule\`
- **Node connectivity check**: \`tcp_check_url\`, \`tcp_check_http_method\`, \`udp_check_dns\`, \`check_interval\`, \`check_tolerance\`
- **Connecting options**: \`dial_mode\`, \`allow_insecure\`, \`sniffing_timeout\`
- **TLS options**: \`tls_implementation\`, \`utls_imitate\`, \`tls_fragment\`, \`tls_fragment_length\`, \`tls_fragment_interval\`
- **Advanced options**: \`mptcp\`, \`bandwidth_max_tx\`, \`bandwidth_max_rx\`, \`fallback_resolver\``,

  subscription: `**Subscription Section**

Subscriptions defined here will be resolved as nodes and merged as a part of the global node pool.
Support to give the subscription a tag, and filter nodes from a given subscription in the group section.

**URL Schemes:**
- \`https://\` - Standard HTTPS subscription
- \`http://\` - HTTP subscription
- \`file://\` - Local file (relative to /etc/dae/)
- \`https-file://\` - Persist subscription that saves to local file as fallback

Example:
\`\`\`dae
subscription {
  my_sub: 'https://example.com/sub'
  persist_sub: 'https-file://example.com/sub'
  'file://relative/path/to/mysub.sub'
}
\`\`\``,

  node: `**Node Section**

Nodes defined here will be merged as a part of the global node pool.

**Supported protocols:** socks5, http, https, ss, ssr, vmess, vless, trojan, tuic, juicity, hysteria2, hysteria

Full support list: https://github.com/daeuniverse/dae/blob/main/docs/en/proxy-protocols.md

Example:
\`\`\`dae
node {
  'socks5://localhost:1080'
  mynode: 'ss://...'
  node1: 'vmess://...'
  chains: 'tuic://... -> vmess://...'  # Node chaining
  hysteria2: 'hysteria2://password@server:port/?sni=domain'
}
\`\`\``,

  dns: `**DNS Section**

Configure DNS resolution and routing.

See: https://github.com/daeuniverse/dae/blob/main/docs/en/configuration/dns.md

Contains:
- \`ipversion_prefer\`: Prefer IPv4 (4) or IPv6 (6) responses
- \`fixed_domain_ttl\`: Set fixed TTL for specific domains
- \`bind\`: Local DNS listening address
- \`upstream\`: Define DNS upstreams (tcp/udp/tcp+udp/h3/http3/quic/https/tls)
- \`routing\`: DNS routing rules with \`request\` and \`response\` sections`,

  group: `**Group Section (Outbound)**

Define proxy groups for load balancing.

**Options:**
- \`filter\`: Filter nodes by subscription tag (\`subtag\`) or name pattern (\`name\`)
- \`policy\`: Load balancing policy
- Can override global check settings: \`tcp_check_url\`, \`tcp_check_http_method\`, \`udp_check_dns\`, \`check_interval\`, \`check_tolerance\`

**Policy options:**
- \`random\`: Randomly select a node
- \`fixed(n)\`: Select node at index n
- \`min\`: Select node with minimum last latency
- \`min_moving_avg\`: Select node with minimum moving average latency
- \`min_avg10\`: Select node with minimum average of last 10 latencies`,

  routing: `**Routing Section**

Define traffic routing rules.

See: https://github.com/daeuniverse/dae/blob/main/docs/en/configuration/routing.md

**Format:** \`condition -> outbound\`

**Built-in outbounds:**
- \`direct\`: Connect directly without proxy
- \`proxy\`: Use default proxy group
- \`block\`: Block the connection
- \`must_direct\`: Force direct (cannot be overridden)
- \`must_proxy\`: Force proxy (cannot be overridden)

**Common conditions:** \`domain()\`, \`dip()\`, \`dport()\`, \`l4proto()\`, \`pname()\`, etc.`,
}

// Documentation for global parameters
const PARAM_DOCS: Record<string, string> = {
  // Software options
  tproxy_port:
    'TProxy port to listen on. It is NOT a HTTP/SOCKS port, and is just used by eBPF program.\nIn normal case, you do not need to use it.\n\nDefault: `12345`',
  tproxy_port_protect:
    'Set it true to protect tproxy port from unsolicited traffic.\nSet it false to allow users to use self-managed iptables tproxy rules.\n\nDefault: `true`',
  pprof_port: 'Set non-zero value to enable pprof for debugging.\n\nDefault: `0`',
  so_mark_from_dae:
    'If not zero, traffic sent from dae will be set SO_MARK.\nIt is useful to avoid traffic loop with iptables tproxy rules.\n\nDefault: `0`',
  log_level: 'Log level for dae.\n\n**Values:** `error`, `warn`, `info`, `debug`, `trace`\n\nDefault: `info`',
  disable_waiting_network: 'Disable waiting for network before pulling subscriptions.\n\nDefault: `false`',
  enable_local_tcp_fast_redirect:
    'Enable fast redirect for local TCP connections.\n\n⚠️ There is a known kernel issue that breaks certain clients/proxies, such as nadoo/glider.\nUsers may enable this experimental option at their own risks.\n\nDefault: `false`',

  // Interface and kernel options
  lan_interface:
    'The LAN interface to bind. Use it if you want to proxy LAN.\nMultiple interfaces split by ",".\n\nExample: `docker0` or `br-lan,docker0`',
  wan_interface:
    'The WAN interface to bind. Use it if you want to proxy localhost.\nMultiple interfaces split by ",". Use "auto" to auto detect.\n\nDefault: `auto`',
  auto_config_kernel_parameter:
    'Automatically configure Linux kernel parameters like `ip_forward` and `send_redirects`.\n\nSee: https://github.com/daeuniverse/dae/blob/main/docs/en/user-guide/kernel-parameters.md\n\nDefault: `true`',
  auto_config_firewall_rule: 'Automatically configure firewall rules.\n\nDefault: `true`',

  // Node connectivity check
  tcp_check_url:
    'URL for TCP health check. Host of URL should have both IPv4 and IPv6 if you have double stack in local.\n\nFormat: `URL,IPv4,IPv6` (IP addresses are optional hints)\n\nConsidering traffic consumption, it is recommended to choose a site with anycast IP and less response.\n\nExample: `http://cp.cloudflare.com,1.1.1.1,2606:4700:4700::1111`',
  tcp_check_http_method:
    "The HTTP request method to `tcp_check_url`.\n\n**Values:** `HEAD`, `GET`\n\nUse 'HEAD' by default because some server implementations bypass accounting for this kind of traffic.\n\nDefault: `HEAD`",
  udp_check_dns:
    'DNS server for UDP health check. This DNS will be used to check UDP connectivity of nodes.\nAnd if dns_upstream below contains tcp, it also be used to check TCP DNS connectivity of nodes.\n\nFormat: `host:port,IPv4,IPv6`\n\nThis DNS should have both IPv4 and IPv6 if you have double stack in local.\n\nExample: `dns.google:53,8.8.8.8,2001:4860:4860::8888`',
  check_interval:
    'Interval between health checks.\n\n**Format:** Go duration (e.g., `30s`, `1m`, `500ms`)\n\nDefault: `30s`',
  check_tolerance:
    'Group will switch node only when `new_latency <= old_latency - tolerance`.\n\n**Format:** Go duration (e.g., `50ms`, `100ms`)\n\nDefault: `50ms`',

  // Connecting options
  dial_mode: `Dialing mode for proxy connections.

**Values:**
- \`ip\`: Dial proxy using the IP from DNS directly. This allows your IPv4/IPv6 to choose the optimal path respectively. Sniffing will be disabled.
- \`domain\`: Dial proxy using the domain from sniffing. This will relieve DNS pollution problem. Generally brings faster proxy response time because proxy will re-resolve the domain in remote.
- \`domain+\`: Based on domain mode but do not check the reality of sniffed domain. Useful for users whose DNS requests do not go through dae.
- \`domain++\`: Based on domain+ mode but force to re-route traffic using sniffed domain to partially recover domain based traffic split ability.

Default: \`domain\``,
  allow_insecure:
    'Allow insecure TLS certificates.\n\n⚠️ It is not recommended to turn it on unless you have to.\n\nDefault: `false`',
  sniffing_timeout:
    'Timeout to waiting for first data sending for sniffing.\nIt is always 0 if dial_mode is ip. Set it higher is useful in high latency LAN network.\n\n**Format:** Go duration (e.g., `100ms`, `200ms`)\n\nDefault: `100ms`',

  // TLS options
  tls_implementation:
    "TLS implementation to use.\n\n**Values:**\n- `tls`: Use Go's crypto/tls\n- `utls`: Use uTLS, which can imitate browser's Client Hello\n\nDefault: `tls`",
  utls_imitate: `The Client Hello ID for uTLS to imitate. This takes effect only if tls_implementation is utls.

**Values:**
- \`randomized\`, \`randomizedalpn\`, \`randomizednoalpn\`
- \`chrome_auto\`, \`chrome_58\`, \`chrome_62\`, \`chrome_70\`, \`chrome_72\`, \`chrome_83\`, \`chrome_87\`, \`chrome_96\`, \`chrome_100\`, \`chrome_102\`
- \`firefox_auto\`, \`firefox_55\`, \`firefox_56\`, \`firefox_63\`, \`firefox_65\`, \`firefox_99\`, \`firefox_102\`, \`firefox_105\`
- \`safari_auto\`, \`safari_16_0\`
- \`edge_auto\`, \`edge_85\`, \`edge_106\`
- \`ios_auto\`, \`ios_11_1\`, \`ios_12_1\`, \`ios_13\`, \`ios_14\`
- \`android_11_okhttp\`
- \`360_auto\`, \`360_7_5\`, \`360_11_0\`
- \`qq_auto\`, \`qq_11_1\`

Default: \`chrome_auto\``,
  tls_fragment:
    'TLS fragmentation support. If is true, dae will send Client Hello in fragments to bypass SNI blocking.\n\nDefault: `false`',
  tls_fragment_length:
    'TLS fragment packet length range, in bytes.\nThe length of each fragment is randomly generated from this range.\n\nFormat: `min-max` (e.g., `50-100`)\n\nDefault: `50-100`',
  tls_fragment_interval:
    'TLS fragment packet interval, in milliseconds.\nEach fragment interval is randomly generated from this range.\n\nFormat: `min-max` (e.g., `10-20`)\n\nDefault: `10-20`',

  // Advanced options
  mptcp:
    'Multipath TCP (MPTCP) support. If is true, dae will try to use MPTCP to connect all nodes,\nbut it will only take effects when the node supports MPTCP.\nIt can use for load balance and failover to multiple interfaces and IPs.\n\nDefault: `false`',
  bandwidth_max_tx:
    'Maximum upload bandwidth. Useful for some specific protocols (e.g., Hysteria2),\nwhich will perform better with bandwidth information provided.\n\n**Units:** `b`, `kb`, `mb`, `gb`, `tb`, `mbps`, `gbps` or bytes per second\n\nFormats: https://v2.hysteria.network/docs/advanced/Full-Client-Config/#bandwidth\n\nExample: `200 mbps` or `200 m` or `200 mb` or `25000000`',
  bandwidth_max_rx:
    'Maximum download bandwidth. Useful for some specific protocols (e.g., Hysteria2),\nwhich will perform better with bandwidth information provided.\n\n**Units:** `b`, `kb`, `mb`, `gb`, `tb`, `mbps`, `gbps` or bytes per second\n\nExample: `1 gbps` or `1 g` or `1 gb` or `125000000`',
  fallback_resolver:
    "Fallback DNS resolver used when DNS resolution using resolv.conf fails.\nThis ensures DNS resolution continues to work even when the system's default DNS servers are unavailable.\n\n**Format:**\n- IPv4: `ipv4:port` (e.g., `8.8.8.8:53`)\n- IPv6: `[ipv6]:port` (e.g., `[2001:4860:4860::8888]:53`)\n\nDefault: `8.8.8.8:53`",

  // DNS section parameters
  ipversion_prefer:
    'Prefer IPv4 or IPv6 responses. If set to 4 and the domain has both A and AAAA records,\ndae will only respond to type A queries and response empty answer to type AAAA queries.\n\n**Values:** `4` or `6`',
  bind: 'Bind to local address to listen for DNS queries.\n\n**Format:** `[scheme://]host:port`\n\n**Schemes:** `tcp`, `udp`, `tcp+udp` (default)\n\nExample: `127.0.0.1:5353` or `tcp+udp://127.0.0.1:5353`',

  // Group/filter parameters
  filter:
    "Filter nodes in group from the global node pool.\n\n**Functions:**\n- `subtag(tag)`: Filter by subscription tag\n- `name(keyword: 'pattern')`: Filter by name with keyword match\n- `name(regex: 'pattern')`: Filter by name with regex match\n\n**Modifiers:**\n- `[add_latency: -500ms]`: Add latency offset for failover\n\nMultiple filters indicate 'or' logic.",
  policy:
    'Load balancing policy for the group.\n\n**Values:**\n- `random`: Randomly select a node for every connection\n- `fixed(n)`: Select the node at index n\n- `min`: Select node with minimum last latency\n- `min_moving_avg`: Select node with minimum moving average latency\n- `min_avg10`: Select node with minimum average of last 10 latencies',
}

// Documentation for rule functions
const FUNCTION_DOCS: Record<string, string> = {
  domain:
    'Match by domain (suffix match).\n\n**Prefixes:**\n- `geosite:tag` - Match using geosite database\n- `full:domain` - Full domain match (exact)\n- `keyword:word` - Domain contains keyword\n- `regexp:pattern` - Match using regular expression\n\nExample: `domain(example.com)` or `domain(geosite:cn)`',
  dip: 'Match by destination IP address.\n\n**Prefixes:**\n- `geoip:tag` - Match using geoip database\n\nExample: `dip(geoip:cn)` or `dip(192.168.0.0/16)` or `dip(224.0.0.0/3)`',
  dport:
    'Match by destination port.\n\nSupports single port, port range, or multiple ports.\n\nExample: `dport(443)` or `dport(80-443)` or `dport(80, 443, 8080)`',
  sip: 'Match by source IP address.\n\nExample: `sip(192.168.1.0/24)`',
  sport: 'Match by source port.\n\nExample: `sport(12345)`',
  pname:
    'Match by process name.\n\nUseful for routing traffic from specific applications.\n\nExample: `pname(chrome)` or `pname(NetworkManager)`',
  qname:
    'Match DNS query name.\n\nUsed in DNS routing section.\n\n**Prefixes:** Same as domain()\n\nExample: `qname(geosite:cn)`',
  qtype: 'Match DNS query type.\n\nExample: `qtype(A)` or `qtype(AAAA)`',
  l4proto: 'Match Layer 4 protocol.\n\n**Values:** `tcp`, `udp`\n\nExample: `l4proto(tcp)` or `l4proto(udp)`',
  ipversion: 'Match IP version.\n\n**Values:** `4`, `6`\n\nExample: `ipversion(4)` or `ipversion(6)`',
  mac: 'Match by MAC address.\n\nUseful for routing traffic from specific devices on LAN.\n\nExample: `mac(00:00:00:00:00:00)`',
  subtag:
    "Filter nodes by subscription tag.\n\nUsed in group filter to select nodes from specific subscriptions.\n\n**Prefixes:**\n- `regex:'pattern'` - Match tag with regex\n\nExample: `subtag(my_sub)` or `subtag(regex: '^my_', another_sub)`",
  name: "Filter nodes by name pattern.\n\nUsed in group filter.\n\n**Prefixes:**\n- `keyword: 'pattern'` - Name contains keyword\n- `regex: 'pattern'` - Match using regex\n\nExample: `name(keyword: 'HK')` or `name(regex: 'US.*')` or `name(node1, node2)`",
  dscp: 'Match by DSCP (Differentiated Services Code Point) value.\n\nExample: `dscp(0x04)`',
  upstream: 'Match by DNS upstream (used in DNS response routing).\n\nExample: `upstream(googledns) -> accept`',
  ip: 'Match by IP address (used in DNS response routing).\n\nExample: `ip(geoip:private)`',
  must: 'Wrap a condition to make it mandatory (cannot be overridden).\n\nExample: `must(domain(example.com) -> direct)`',
  tag: 'Match by node tag.\n\nExample: `tag(my_tag)`',
}

// Documentation for outbounds
const OUTBOUND_DOCS: Record<string, string> = {
  direct: 'Connect directly without proxy.\n\nTraffic will bypass all proxies and connect to the destination directly.',
  proxy: 'Use proxy (default group).\n\nTraffic will be sent through the configured proxy group.',
  block: 'Block the connection.\n\nThe connection will be rejected/dropped.',
  must_direct:
    'Force direct connection (cannot be overridden).\n\nThis cannot be overridden by subsequent routing rules.',
  must_proxy:
    'Force proxy connection (cannot be overridden).\n\nThis cannot be overridden by subsequent routing rules.',
  accept:
    'Accept the DNS response (used in DNS routing).\n\nUsed in DNS response routing to accept the current DNS response.',
}

export class DaeHoverProvider implements vscode.HoverProvider {
  constructor(private parser: DocumentParser) {}

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    const parseResult = this.parser.parse(document)
    const line = document.lineAt(position.line)
    const wordRange = document.getWordRangeAtPosition(position, /[\w-]+/)

    if (!wordRange) return null

    const word = document.getText(wordRange)

    // Check if hovering over a section name
    if (SECTION_DOCS[word]) {
      return new vscode.Hover(new vscode.MarkdownString(SECTION_DOCS[word]), wordRange)
    }

    // Check if hovering over a parameter
    if (PARAM_DOCS[word]) {
      const md = new vscode.MarkdownString()
      md.appendMarkdown(`**${word}**\n\n`)
      md.appendMarkdown(PARAM_DOCS[word])
      return new vscode.Hover(md, wordRange)
    }

    // Check if hovering over a function
    if (RULE_FUNCTIONS.includes(word)) {
      const doc = FUNCTION_DOCS[word] || `Rule function: ${word}`
      const md = new vscode.MarkdownString()
      md.appendMarkdown(`**${word}()**\n\n`)
      md.appendMarkdown(doc)
      return new vscode.Hover(md, wordRange)
    }

    // Check if hovering over an outbound constant
    if (OUTBOUND_DOCS[word]) {
      const md = new vscode.MarkdownString()
      md.appendMarkdown(`**${word}**\n\n`)
      md.appendMarkdown(OUTBOUND_DOCS[word])
      return new vscode.Hover(md, wordRange)
    }

    // Check if hovering over a symbol definition
    const symbol = findSymbolAtPosition(parseResult.symbols, position)
    if (symbol) {
      const md = new vscode.MarkdownString()
      md.appendMarkdown(`**${symbol.kind}**: \`${symbol.name}\``)
      return new vscode.Hover(md, wordRange)
    }

    // Check if hovering over a reference
    const reference = findReferenceAtPosition(parseResult.references, position)
    if (reference) {
      const md = new vscode.MarkdownString()
      const refSymbol = findSymbolByName(parseResult.symbols, reference.name)
      if (refSymbol) {
        md.appendMarkdown(`**${refSymbol.kind}**: \`${refSymbol.name}\`\n\n`)
        md.appendMarkdown(`Defined at line ${refSymbol.nameRange.start.line + 1}`)
      } else {
        md.appendMarkdown(`Reference to ${reference.kind}: \`${reference.name}\``)
      }
      return new vscode.Hover(md, wordRange)
    }

    // Check for type prefixes (geosite:, geoip:, etc.)
    const lineText = line.text
    const colonMatch = lineText.match(/(geosite|geoip|full|contains|regexp|ext):(\w+)/)
    if (colonMatch) {
      const prefix = colonMatch[1]
      const prefixDocs: Record<string, string> = {
        geosite: 'Match using geosite database',
        geoip: 'Match using geoip database',
        full: 'Full domain match (exact)',
        contains: 'Domain contains keyword',
        regexp: 'Match using regular expression',
        ext: 'Match using external data file',
      }
      if (word === prefix || word === colonMatch[2]) {
        const md = new vscode.MarkdownString()
        md.appendMarkdown(`**${prefix}:${colonMatch[2]}**\n\n`)
        md.appendMarkdown(prefixDocs[prefix] || '')
        return new vscode.Hover(md, wordRange)
      }
    }

    return null
  }
}
