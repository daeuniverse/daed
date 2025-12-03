import type { EditorProps } from '@monaco-editor/react'
import type { languages } from 'monaco-editor'

// Completion item definition for routingA language
export interface RoutingACompletionItem {
  label: string
  kind: 'keyword' | 'function' | 'constant' | 'type' | 'variable' | 'snippet'
  detail?: string
  documentation?: string
  insertText: string
  insertTextRules?: 'InsertAsSnippet'
}

// Shiki theme names (applied via shikiToMonaco)
export const EDITOR_THEME_DARK = 'vitesse-dark'
export const EDITOR_THEME_LIGHT = 'vitesse-light'

// Fallback themes before Shiki loads
export const EDITOR_THEME_DARK_FALLBACK = 'vs-dark'
export const EDITOR_THEME_LIGHT_FALLBACK = 'vs'

export const EDITOR_OPTIONS: EditorProps['options'] = {
  fontSize: 14,
  fontWeight: 'bold',
  fontFamily: 'Source Code Pro',
  'semanticHighlighting.enabled': true,
  lineHeight: 1.6,
  minimap: {
    enabled: false,
  },
  scrollBeyondLastLine: false,
  renderWhitespace: 'selection',
  cursorBlinking: 'solid',
  formatOnPaste: true,
  insertSpaces: true,
  tabSize: 2,
  lineNumbers: 'off',
  padding: {
    top: 8,
    bottom: 8,
  },
}

// Completion items for routingA language autocomplete
// Monaco snippet syntax uses ${1:placeholder} which triggers no-template-curly-in-string
/* eslint-disable no-template-curly-in-string */
export const ROUTINGA_COMPLETION_ITEMS: RoutingACompletionItem[] = [
  // Rule functions (matching conditions)
  {
    label: 'dip',
    kind: 'function',
    detail: 'Destination IP',
    documentation: 'Match destination IP address',
    insertText: 'dip(${1:ip})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'dport',
    kind: 'function',
    detail: 'Destination Port',
    documentation: 'Match destination port',
    insertText: 'dport(${1:port})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'sip',
    kind: 'function',
    detail: 'Source IP',
    documentation: 'Match source IP address',
    insertText: 'sip(${1:ip})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'sport',
    kind: 'function',
    detail: 'Source Port',
    documentation: 'Match source port',
    insertText: 'sport(${1:port})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'ipversion',
    kind: 'function',
    detail: 'IP Version',
    documentation: 'Match IP version (4 or 6)',
    insertText: 'ipversion(${1|4,6|})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'l4proto',
    kind: 'function',
    detail: 'L4 Protocol',
    documentation: 'Match Layer 4 protocol (tcp/udp)',
    insertText: 'l4proto(${1|tcp,udp|})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'mac',
    kind: 'function',
    detail: 'MAC Address',
    documentation: 'Match MAC address',
    insertText: 'mac(${1:mac})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'pname',
    kind: 'function',
    detail: 'Process Name',
    documentation: 'Match process name',
    insertText: 'pname(${1:name})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'qname',
    kind: 'function',
    detail: 'Query Name',
    documentation: 'Match DNS query name',
    insertText: 'qname(${1:domain})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'domain',
    kind: 'function',
    detail: 'Domain',
    documentation: 'Match domain (suffix match)',
    insertText: 'domain(${1:domain})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'ip',
    kind: 'function',
    detail: 'IP',
    documentation: 'Match IP address',
    insertText: 'ip(${1:ip})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'source',
    kind: 'function',
    detail: 'Source',
    documentation: 'Match source address',
    insertText: 'source(${1:source})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'port',
    kind: 'function',
    detail: 'Port',
    documentation: 'Match port',
    insertText: 'port(${1:port})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'sourcePort',
    kind: 'function',
    detail: 'Source Port',
    documentation: 'Match source port',
    insertText: 'sourcePort(${1:port})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'inboundTag',
    kind: 'function',
    detail: 'Inbound Tag',
    documentation: 'Match inbound tag',
    insertText: 'inboundTag(${1:tag})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'network',
    kind: 'function',
    detail: 'Network',
    documentation: 'Match network type',
    insertText: 'network(${1:network})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'protocol',
    kind: 'function',
    detail: 'Protocol',
    documentation: 'Match protocol',
    insertText: 'protocol(${1:protocol})',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'user',
    kind: 'function',
    detail: 'User',
    documentation: 'Match user',
    insertText: 'user(${1:user})',
    insertTextRules: 'InsertAsSnippet',
  },

  // Domain matching types
  {
    label: 'full',
    kind: 'type',
    detail: 'Full Match',
    documentation: 'Full domain match',
    insertText: 'full:${1:domain}',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'contains',
    kind: 'type',
    detail: 'Contains',
    documentation: 'Domain contains keyword',
    insertText: 'contains:${1:keyword}',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'regexp',
    kind: 'type',
    detail: 'Regular Expression',
    documentation: 'Match using regular expression',
    insertText: 'regexp:${1:pattern}',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'geosite',
    kind: 'type',
    detail: 'Geosite',
    documentation: 'Match using geosite database',
    insertText: 'geosite:${1:tag}',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'geoip',
    kind: 'type',
    detail: 'Geoip',
    documentation: 'Match using geoip database',
    insertText: 'geoip:${1:tag}',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'ext',
    kind: 'type',
    detail: 'External File',
    documentation: 'Match using external file',
    insertText: 'ext:"${1:file.dat}:${2:tag}"',
    insertTextRules: 'InsertAsSnippet',
  },

  // Built-in outbounds
  { label: 'proxy', kind: 'constant', detail: 'Proxy', documentation: 'Use proxy outbound', insertText: 'proxy' },
  { label: 'block', kind: 'constant', detail: 'Block', documentation: 'Block the connection', insertText: 'block' },
  { label: 'direct', kind: 'constant', detail: 'Direct', documentation: 'Direct connection', insertText: 'direct' },
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
    insertTextRules: 'InsertAsSnippet',
  },

  // dae-specific keywords
  {
    label: 'fallback',
    kind: 'keyword',
    detail: 'Fallback',
    documentation: 'Fallback outbound',
    insertText: 'fallback: ${1:outbound}',
    insertTextRules: 'InsertAsSnippet',
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
  { label: 'upstream', kind: 'keyword', detail: 'Upstream', documentation: 'Upstream server', insertText: 'upstream' },
  { label: 'tcp', kind: 'keyword', detail: 'TCP', documentation: 'TCP protocol', insertText: 'tcp' },
  { label: 'udp', kind: 'keyword', detail: 'UDP', documentation: 'UDP protocol', insertText: 'udp' },

  // Snippets for common patterns
  {
    label: 'rule-domain',
    kind: 'snippet',
    detail: 'Domain Rule',
    documentation: 'Create a domain matching rule',
    insertText: 'domain(${1:domain}) -> ${2|proxy,direct,block|}',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'rule-ip',
    kind: 'snippet',
    detail: 'IP Rule',
    documentation: 'Create an IP matching rule',
    insertText: 'dip(${1:ip}) -> ${2|proxy,direct,block|}',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'rule-geosite',
    kind: 'snippet',
    detail: 'Geosite Rule',
    documentation: 'Create a geosite matching rule',
    insertText: 'domain(geosite:${1:cn}) -> ${2|direct,proxy,block|}',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'rule-geoip',
    kind: 'snippet',
    detail: 'Geoip Rule',
    documentation: 'Create a geoip matching rule',
    insertText: 'dip(geoip:${1:cn}) -> ${2|direct,proxy,block|}',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'rule-process',
    kind: 'snippet',
    detail: 'Process Rule',
    documentation: 'Create a process matching rule',
    insertText: 'pname(${1:process}) -> ${2|proxy,direct,block|}',
    insertTextRules: 'InsertAsSnippet',
  },
  {
    label: 'rule-port',
    kind: 'snippet',
    detail: 'Port Rule',
    documentation: 'Create a port matching rule',
    insertText: 'dport(${1:port}) -> ${2|proxy,direct,block|}',
    insertTextRules: 'InsertAsSnippet',
  },
]
/* eslint-enable no-template-curly-in-string */

export const EDITOR_LANGUAGE_ROUTINGA: languages.IMonarchLanguage = {
  // set defaultToken as `invalid` to turn on debug mode
  // defaultToken: 'invalid',
  ignoreCase: false,

  // Rule functions (matching conditions)
  ruleFunctions: [
    'domain',
    'ip',
    'source',
    'port',
    'sourcePort',
    'inboundTag',
    'network',
    'protocol',
    'user',
    // dae-specific
    'dip',
    'dport',
    'sip',
    'sport',
    'ipversion',
    'l4proto',
    'mac',
    'pname',
    'qname',
  ],

  // Domain matching types
  domainTypes: ['domain', 'full', 'contains', 'regexp', 'geosite'],

  // IP matching types
  ipTypes: ['geoip'],

  // Declaration keywords
  declarations: ['inbound', 'outbound', 'default'],

  // Outbound/inbound types
  connectionTypes: ['http', 'socks', 'freedom'],

  // Built-in outbounds
  builtinOutbounds: ['proxy', 'block', 'direct', 'must_direct', 'must_proxy'],

  // Connection parameters
  parameters: ['address', 'port', 'user', 'pass', 'sniffing', 'domainStrategy', 'redirect', 'userLevel'],

  // dae-specific keywords
  daeKeywords: ['fallback', 'must_rules', 'request', 'response', 'routing', 'upstream', 'tcp', 'udp'],

  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  symbols: /[->=&!:,]+/,

  operators: ['&&', '!', '->'],

  tokenizer: {
    root: [
      // Comments
      { include: '@whitespace' },

      // Declaration: inbound:name=type(...) or outbound:name=type(...)
      [/(inbound|outbound)(:)(\w+)(=)/, ['keyword', 'delimiter', 'variable', 'operator']],

      // Default declaration: default:
      [/(default)(:)/, ['keyword', 'delimiter']],

      // External file reference: ext:"file.dat:tag"
      [/(ext)(:)/, ['keyword.special', 'delimiter']],

      // Geosite/geoip prefix
      [/(geosite|geoip)(:)/, ['keyword.special', 'delimiter']],

      // Rule functions and identifiers (including process names like NetworkManager)
      [
        /[a-zA-Z][\w-]*/, // eslint-disable-line regexp/use-ignore-case
        {
          cases: {
            '@ruleFunctions': 'keyword',
            '@domainTypes': 'type',
            '@ipTypes': 'type',
            '@declarations': 'keyword',
            '@connectionTypes': 'type.identifier',
            '@builtinOutbounds': 'constant',
            '@parameters': 'variable.parameter',
            '@daeKeywords': 'keyword',
            '@default': 'identifier',
          },
        },
      ],

      // IP addresses (IPv4)
      [/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/\d{1,2})?/, 'number.ip'],

      // IPv6 addresses (simplified pattern)
      [/[\da-fA-F:]+::[\da-fA-F:]+/, 'number.ip'], // eslint-disable-line regexp/use-ignore-case
      [/[\da-fA-F]+:[\da-fA-F:]+/, 'number.ip'], // eslint-disable-line regexp/use-ignore-case

      // Port ranges
      [/\d+-\d+/, 'number.range'],

      // Numbers
      [/\d+/, 'number'],

      // Brackets
      [/[{}()]/, '@brackets'],

      // Arrow operator
      [/->/, 'operator.arrow'],

      // Symbols and operators
      [/@symbols/, { cases: { '@operators': 'operator', '@default': 'delimiter' } }],

      // Delimiters
      [/[,:]/, 'delimiter'],

      // Strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/'([^'\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string_double'],
      [/'/, 'string', '@string_single'],
    ],

    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],

    string_single: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop'],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/#.*$/, 'comment'],
    ],
  },
}
