/* eslint-disable no-template-curly-in-string */
import * as vscode from 'vscode'

/**
 * Completion item definition for dae language
 */
interface DaeCompletionItem {
  label: string
  kind: 'keyword' | 'function' | 'constant' | 'type' | 'variable' | 'snippet' | 'property'
  detail?: string
  documentation?: string
  insertText: string
  isSnippet?: boolean
}

/**
 * Completion items for dae language autocomplete
 */
const DAE_COMPLETION_ITEMS: DaeCompletionItem[] = [
  // Section blocks
  {
    label: 'global',
    kind: 'keyword',
    detail: 'Global Section',
    documentation: 'Global configuration section',
    insertText: 'global {\n\t${0}\n}',
    isSnippet: true,
  },
  {
    label: 'subscription',
    kind: 'keyword',
    detail: 'Subscription Section',
    documentation: 'Define proxy subscriptions',
    insertText: 'subscription {\n\t${0}\n}',
    isSnippet: true,
  },
  {
    label: 'node',
    kind: 'keyword',
    detail: 'Node Section',
    documentation: 'Define proxy nodes',
    insertText: 'node {\n\t${0}\n}',
    isSnippet: true,
  },
  {
    label: 'dns',
    kind: 'keyword',
    detail: 'DNS Section',
    documentation: 'DNS configuration section',
    insertText: 'dns {\n\t${0}\n}',
    isSnippet: true,
  },
  {
    label: 'group',
    kind: 'keyword',
    detail: 'Group Section',
    documentation: 'Proxy group configuration',
    insertText: 'group {\n\t${0}\n}',
    isSnippet: true,
  },
  {
    label: 'routing',
    kind: 'keyword',
    detail: 'Routing Section',
    documentation: 'Routing rules configuration',
    insertText: 'routing {\n\t${0}\n}',
    isSnippet: true,
  },

  // Global section options
  {
    label: 'tproxy_port',
    kind: 'property',
    detail: 'TProxy Port',
    documentation: 'Transparent proxy listening port',
    insertText: 'tproxy_port: ${1:12345}',
    isSnippet: true,
  },
  {
    label: 'log_level',
    kind: 'property',
    detail: 'Log Level',
    documentation: 'Logging level: trace, debug, info, warn, error',
    insertText: 'log_level: ${1|info,debug,warn,error,trace|}',
    isSnippet: true,
  },
  {
    label: 'tcp_check_url',
    kind: 'property',
    detail: 'TCP Check URL',
    documentation: 'URL for TCP health check',
    insertText: "tcp_check_url: '${1:http://cp.cloudflare.com}'",
    isSnippet: true,
  },
  {
    label: 'udp_check_dns',
    kind: 'property',
    detail: 'UDP Check DNS',
    documentation: 'DNS server for UDP health check',
    insertText: "udp_check_dns: '${1:dns.google:53}'",
    isSnippet: true,
  },
  {
    label: 'check_interval',
    kind: 'property',
    detail: 'Check Interval',
    documentation: 'Interval between health checks',
    insertText: 'check_interval: ${1:30s}',
    isSnippet: true,
  },
  {
    label: 'check_tolerance',
    kind: 'property',
    detail: 'Check Tolerance',
    documentation: 'Tolerance for latency fluctuations',
    insertText: 'check_tolerance: ${1:50ms}',
    isSnippet: true,
  },
  {
    label: 'dial_mode',
    kind: 'property',
    detail: 'Dial Mode',
    documentation: 'Dialing mode: ip, domain, domain+, domain++',
    insertText: 'dial_mode: ${1|domain,ip,domain+,domain++|}',
    isSnippet: true,
  },
  {
    label: 'wan_interface',
    kind: 'property',
    detail: 'WAN Interface',
    documentation: 'WAN interface name',
    insertText: 'wan_interface: ${1:auto}',
    isSnippet: true,
  },
  {
    label: 'lan_interface',
    kind: 'property',
    detail: 'LAN Interface',
    documentation: 'LAN interface names',
    insertText: 'lan_interface: ${1:docker0}',
    isSnippet: true,
  },
  {
    label: 'auto_config_kernel_parameter',
    kind: 'property',
    detail: 'Auto Config Kernel',
    documentation: 'Auto configure kernel parameters',
    insertText: 'auto_config_kernel_parameter: ${1|true,false|}',
    isSnippet: true,
  },
  {
    label: 'auto_config_firewall_rule',
    kind: 'property',
    detail: 'Auto Config Firewall',
    documentation: 'Auto configure firewall rules',
    insertText: 'auto_config_firewall_rule: ${1|true,false|}',
    isSnippet: true,
  },
  {
    label: 'sniffing_timeout',
    kind: 'property',
    detail: 'Sniffing Timeout',
    documentation: 'Timeout for protocol sniffing',
    insertText: 'sniffing_timeout: ${1:100ms}',
    isSnippet: true,
  },
  {
    label: 'tls_implementation',
    kind: 'property',
    detail: 'TLS Implementation',
    documentation: 'TLS implementation to use',
    insertText: 'tls_implementation: ${1|tls,utls|}',
    isSnippet: true,
  },
  {
    label: 'utls_imitate',
    kind: 'property',
    detail: 'uTLS Imitate',
    documentation: 'Browser fingerprint to imitate',
    insertText: 'utls_imitate: ${1|chrome,firefox,safari|}',
    isSnippet: true,
  },

  // Group section options
  {
    label: 'filter',
    kind: 'property',
    detail: 'Filter',
    documentation: 'Filter nodes in group',
    insertText: 'filter: ${1:subtag(my_sub)}',
    isSnippet: true,
  },
  {
    label: 'policy',
    kind: 'property',
    detail: 'Policy',
    documentation: 'Load balancing policy',
    insertText: 'policy: ${1|min_moving_avg,min,min_avg10,random,fixed(0)|}',
    isSnippet: true,
  },

  // Policy functions
  {
    label: 'min_moving_avg',
    kind: 'function',
    detail: 'Min Moving Average',
    documentation: 'Select node with minimum moving average latency',
    insertText: 'min_moving_avg',
  },
  {
    label: 'min',
    kind: 'function',
    detail: 'Min Latency',
    documentation: 'Select node with minimum latency',
    insertText: 'min',
  },
  {
    label: 'min_avg10',
    kind: 'function',
    detail: 'Min Average 10',
    documentation: 'Select node with minimum average of last 10 checks',
    insertText: 'min_avg10',
  },
  {
    label: 'random',
    kind: 'function',
    detail: 'Random',
    documentation: 'Randomly select a node',
    insertText: 'random',
  },
  {
    label: 'fixed',
    kind: 'function',
    detail: 'Fixed Index',
    documentation: 'Select node at fixed index',
    insertText: 'fixed(${1:0})',
    isSnippet: true,
  },

  // Filter functions
  {
    label: 'subtag',
    kind: 'function',
    detail: 'Subscription Tag',
    documentation: 'Filter nodes by subscription tag',
    insertText: 'subtag(${1:tag})',
    isSnippet: true,
  },
  {
    label: 'name',
    kind: 'function',
    detail: 'Name Filter',
    documentation: 'Filter nodes by name pattern',
    insertText: "name(${1|keyword,regex|}: '${2:pattern}')",
    isSnippet: true,
  },

  // Rule functions (matching conditions)
  {
    label: 'dip',
    kind: 'function',
    detail: 'Destination IP',
    documentation: 'Match destination IP address',
    insertText: 'dip(${1:ip})',
    isSnippet: true,
  },
  {
    label: 'dport',
    kind: 'function',
    detail: 'Destination Port',
    documentation: 'Match destination port',
    insertText: 'dport(${1:port})',
    isSnippet: true,
  },
  {
    label: 'sip',
    kind: 'function',
    detail: 'Source IP',
    documentation: 'Match source IP address',
    insertText: 'sip(${1:ip})',
    isSnippet: true,
  },
  {
    label: 'sport',
    kind: 'function',
    detail: 'Source Port',
    documentation: 'Match source port',
    insertText: 'sport(${1:port})',
    isSnippet: true,
  },
  {
    label: 'ipversion',
    kind: 'function',
    detail: 'IP Version',
    documentation: 'Match IP version (4 or 6)',
    insertText: 'ipversion(${1|4,6|})',
    isSnippet: true,
  },
  {
    label: 'l4proto',
    kind: 'function',
    detail: 'L4 Protocol',
    documentation: 'Match Layer 4 protocol (tcp/udp)',
    insertText: 'l4proto(${1|tcp,udp|})',
    isSnippet: true,
  },
  {
    label: 'mac',
    kind: 'function',
    detail: 'MAC Address',
    documentation: 'Match MAC address',
    insertText: 'mac(${1:mac})',
    isSnippet: true,
  },
  {
    label: 'pname',
    kind: 'function',
    detail: 'Process Name',
    documentation: 'Match process name',
    insertText: 'pname(${1:name})',
    isSnippet: true,
  },
  {
    label: 'qname',
    kind: 'function',
    detail: 'Query Name',
    documentation: 'Match DNS query name',
    insertText: 'qname(${1:domain})',
    isSnippet: true,
  },
  {
    label: 'domain',
    kind: 'function',
    detail: 'Domain',
    documentation: 'Match domain (suffix match)',
    insertText: 'domain(${1:domain})',
    isSnippet: true,
  },
  {
    label: 'ip',
    kind: 'function',
    detail: 'IP',
    documentation: 'Match IP address',
    insertText: 'ip(${1:ip})',
    isSnippet: true,
  },
  {
    label: 'source',
    kind: 'function',
    detail: 'Source',
    documentation: 'Match source address',
    insertText: 'source(${1:source})',
    isSnippet: true,
  },
  {
    label: 'port',
    kind: 'function',
    detail: 'Port',
    documentation: 'Match port',
    insertText: 'port(${1:port})',
    isSnippet: true,
  },
  {
    label: 'sourcePort',
    kind: 'function',
    detail: 'Source Port',
    documentation: 'Match source port',
    insertText: 'sourcePort(${1:port})',
    isSnippet: true,
  },
  {
    label: 'inboundTag',
    kind: 'function',
    detail: 'Inbound Tag',
    documentation: 'Match inbound tag',
    insertText: 'inboundTag(${1:tag})',
    isSnippet: true,
  },
  {
    label: 'network',
    kind: 'function',
    detail: 'Network',
    documentation: 'Match network type',
    insertText: 'network(${1:network})',
    isSnippet: true,
  },
  {
    label: 'protocol',
    kind: 'function',
    detail: 'Protocol',
    documentation: 'Match protocol',
    insertText: 'protocol(${1:protocol})',
    isSnippet: true,
  },
  {
    label: 'user',
    kind: 'function',
    detail: 'User',
    documentation: 'Match user',
    insertText: 'user(${1:user})',
    isSnippet: true,
  },

  // Domain matching types
  {
    label: 'full',
    kind: 'type',
    detail: 'Full Match',
    documentation: 'Full domain match',
    insertText: 'full:${1:domain}',
    isSnippet: true,
  },
  {
    label: 'contains',
    kind: 'type',
    detail: 'Contains',
    documentation: 'Domain contains keyword',
    insertText: 'contains:${1:keyword}',
    isSnippet: true,
  },
  {
    label: 'regexp',
    kind: 'type',
    detail: 'Regular Expression',
    documentation: 'Match using regular expression',
    insertText: 'regexp:${1:pattern}',
    isSnippet: true,
  },
  {
    label: 'geosite',
    kind: 'type',
    detail: 'Geosite',
    documentation: 'Match using geosite database',
    insertText: 'geosite:${1:tag}',
    isSnippet: true,
  },
  {
    label: 'geoip',
    kind: 'type',
    detail: 'Geoip',
    documentation: 'Match using geoip database',
    insertText: 'geoip:${1:tag}',
    isSnippet: true,
  },
  {
    label: 'ext',
    kind: 'type',
    detail: 'External File',
    documentation: 'Match using external file',
    insertText: 'ext:"${1:file.dat}:${2:tag}"',
    isSnippet: true,
  },

  // Built-in outbounds
  {
    label: 'proxy',
    kind: 'constant',
    detail: 'Proxy',
    documentation: 'Use proxy outbound',
    insertText: 'proxy',
  },
  {
    label: 'block',
    kind: 'constant',
    detail: 'Block',
    documentation: 'Block the connection',
    insertText: 'block',
  },
  {
    label: 'direct',
    kind: 'constant',
    detail: 'Direct',
    documentation: 'Direct connection',
    insertText: 'direct',
  },
  {
    label: 'must_direct',
    kind: 'constant',
    detail: 'Must Direct',
    documentation: 'Force direct connection',
    insertText: 'must_direct',
  },
  {
    label: 'must_proxy',
    kind: 'constant',
    detail: 'Must Proxy',
    documentation: 'Force proxy connection',
    insertText: 'must_proxy',
  },

  // Declaration keywords
  {
    label: 'routing',
    kind: 'keyword',
    detail: 'Routing Block',
    documentation: 'Define routing rules block',
    insertText: 'routing {\n\t${0}\n}',
    isSnippet: true,
  },

  // dae-specific keywords
  {
    label: 'fallback',
    kind: 'keyword',
    detail: 'Fallback',
    documentation: 'Fallback outbound',
    insertText: 'fallback: ${1:outbound}',
    isSnippet: true,
  },
  {
    label: 'must_rules',
    kind: 'keyword',
    detail: 'Must Rules',
    documentation: 'Mandatory rules that cannot be overridden',
    insertText: 'must_rules',
  },
  {
    label: 'request',
    kind: 'keyword',
    detail: 'Request',
    documentation: 'Request routing rules',
    insertText: 'request',
  },
  {
    label: 'response',
    kind: 'keyword',
    detail: 'Response',
    documentation: 'Response routing rules',
    insertText: 'response',
  },
  {
    label: 'upstream',
    kind: 'keyword',
    detail: 'Upstream',
    documentation: 'Upstream server',
    insertText: 'upstream',
  },
  {
    label: 'tcp',
    kind: 'keyword',
    detail: 'TCP',
    documentation: 'TCP protocol',
    insertText: 'tcp',
  },
  {
    label: 'udp',
    kind: 'keyword',
    detail: 'UDP',
    documentation: 'UDP protocol',
    insertText: 'udp',
  },

  // Snippets for common patterns
  {
    label: 'rule-domain',
    kind: 'snippet',
    detail: 'Domain Rule',
    documentation: 'Create a domain matching rule',
    insertText: 'domain(${1:domain}) -> ${2|proxy,direct,block|}',
    isSnippet: true,
  },
  {
    label: 'rule-ip',
    kind: 'snippet',
    detail: 'IP Rule',
    documentation: 'Create an IP matching rule',
    insertText: 'dip(${1:ip}) -> ${2|proxy,direct,block|}',
    isSnippet: true,
  },
  {
    label: 'rule-geosite',
    kind: 'snippet',
    detail: 'Geosite Rule',
    documentation: 'Create a geosite matching rule',
    insertText: 'domain(geosite:${1:cn}) -> ${2|direct,proxy,block|}',
    isSnippet: true,
  },
  {
    label: 'rule-geoip',
    kind: 'snippet',
    detail: 'Geoip Rule',
    documentation: 'Create a geoip matching rule',
    insertText: 'dip(geoip:${1:cn}) -> ${2|direct,proxy,block|}',
    isSnippet: true,
  },
  {
    label: 'rule-process',
    kind: 'snippet',
    detail: 'Process Rule',
    documentation: 'Create a process matching rule',
    insertText: 'pname(${1:process}) -> ${2|proxy,direct,block|}',
    isSnippet: true,
  },
  {
    label: 'rule-port',
    kind: 'snippet',
    detail: 'Port Rule',
    documentation: 'Create a port matching rule',
    insertText: 'dport(${1:port}) -> ${2|proxy,direct,block|}',
    isSnippet: true,
  },
]

/**
 * Map completion item kind from string to VS Code enum
 */
function getCompletionItemKind(kind: DaeCompletionItem['kind']): vscode.CompletionItemKind {
  switch (kind) {
    case 'keyword':
      return vscode.CompletionItemKind.Keyword
    case 'function':
      return vscode.CompletionItemKind.Function
    case 'constant':
      return vscode.CompletionItemKind.Constant
    case 'type':
      return vscode.CompletionItemKind.TypeParameter
    case 'variable':
      return vscode.CompletionItemKind.Variable
    case 'snippet':
      return vscode.CompletionItemKind.Snippet
    case 'property':
      return vscode.CompletionItemKind.Property
    default:
      return vscode.CompletionItemKind.Text
  }
}

/**
 * Completion provider for dae language
 */
export class DaeCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    _document: vscode.TextDocument,
    _position: vscode.Position,
    _token: vscode.CancellationToken,
    _context: vscode.CompletionContext,
  ): vscode.ProviderResult<vscode.CompletionItem[]> {
    return DAE_COMPLETION_ITEMS.map((item) => {
      const completionItem = new vscode.CompletionItem(item.label, getCompletionItemKind(item.kind))

      completionItem.detail = item.detail
      completionItem.documentation = new vscode.MarkdownString(item.documentation)

      if (item.isSnippet) {
        completionItem.insertText = new vscode.SnippetString(item.insertText)
      } else {
        completionItem.insertText = item.insertText
      }

      return completionItem
    })
  }
}
