import type { EditorProps } from '@monaco-editor/react'
import type { languages } from 'monaco-editor'

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
