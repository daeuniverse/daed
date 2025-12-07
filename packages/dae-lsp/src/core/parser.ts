/**
 * Parser for dae language
 *
 * Parses dae configuration files and builds an AST with symbol information
 * for use by LSP features like go-to-definition, find-references, etc.
 *
 * This module is platform-agnostic and doesn't depend on VS Code APIs.
 */

// AST Node Types
export interface Position {
  line: number
  character: number
}

export interface Range {
  start: Position
  end: Position
}

export interface Symbol {
  name: string
  kind: 'section' | 'group' | 'subscription' | 'node' | 'upstream' | 'parameter'
  range: Range
  nameRange: Range
  children?: Symbol[]
}

export interface Reference {
  name: string
  range: Range
  kind: 'group' | 'subscription' | 'node' | 'upstream'
}

export interface DiagnosticInfo {
  message: string
  range: Range
  severity: 'error' | 'warning' | 'info'
}

export interface ParseResult {
  symbols: Symbol[]
  references: Reference[]
  diagnostics: DiagnosticInfo[]
}

// Known section names
export const SECTION_NAMES = ['global', 'subscription', 'node', 'dns', 'group', 'routing']
export const SUBSECTION_NAMES = ['upstream', 'routing', 'request', 'response', 'fixed_domain_ttl']

// Known keywords for validation
export const GLOBAL_PARAMS = [
  'tproxy_port',
  'tproxy_port_protect',
  'pprof_port',
  'so_mark_from_dae',
  'log_level',
  'disable_waiting_network',
  'enable_local_tcp_fast_redirect',
  'lan_interface',
  'wan_interface',
  'auto_config_kernel_parameter',
  'auto_config_firewall_rule',
  'tcp_check_url',
  'tcp_check_http_method',
  'udp_check_dns',
  'check_interval',
  'check_tolerance',
  'dial_mode',
  'allow_insecure',
  'sniffing_timeout',
  'tls_implementation',
  'utls_imitate',
  'tls_fragment',
  'tls_fragment_length',
  'tls_fragment_interval',
  'mptcp',
  'bandwidth_max_tx',
  'bandwidth_max_rx',
  'fallback_resolver',
  'ipversion_prefer',
  'bind',
]

export const RULE_FUNCTIONS = [
  'domain',
  'ip',
  'source',
  'port',
  'sourcePort',
  'inboundTag',
  'network',
  'protocol',
  'user',
  'dip',
  'dport',
  'sip',
  'sport',
  'ipversion',
  'l4proto',
  'mac',
  'pname',
  'qname',
  'qtype',
  'upstream',
  'subtag',
  'name',
  'tag',
  'dscp',
  'must',
]

export const OUTBOUNDS = ['proxy', 'direct', 'block', 'must_direct', 'must_proxy', 'accept']

/**
 * Parse document text and build AST
 */
export function parseDocument(text: string): ParseResult {
  const lines = text.split('\n')
  const symbols: Symbol[] = []
  const references: Reference[] = []
  const diagnostics: DiagnosticInfo[] = []

  const symbolStack: Symbol[] = []
  let currentSection: string | null = null
  let hasUpstreamSection = false // Track if document has upstream section (DNS config)

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum]
    const trimmed = line.trim()

    // Skip empty lines and comments
    if (trimmed === '' || trimmed.startsWith('#')) {
      continue
    }

    // Remove inline comments for parsing
    const commentIndex = findCommentStart(trimmed)
    const content = commentIndex !== -1 ? trimmed.slice(0, commentIndex).trim() : trimmed

    if (!content) continue

    // Check for section/block start
    const blockMatch = content.match(/^(\w[\w-]*)(\s*\{)?$/)
    if (blockMatch) {
      const name = blockMatch[1]
      const hasOpenBrace = !!blockMatch[2]
      const nameStart = line.indexOf(name)

      const symbol: Symbol = {
        name,
        kind: getSectionKind(name, symbolStack),
        range: {
          start: { line: lineNum, character: 0 },
          end: { line: lineNum, character: line.length },
        },
        nameRange: {
          start: { line: lineNum, character: nameStart },
          end: { line: lineNum, character: nameStart + name.length },
        },
        children: [],
      }

      // Only set currentSection for top-level sections (when stack is empty)
      if (SECTION_NAMES.includes(name) && symbolStack.length === 0) {
        currentSection = name
      }

      // Track if document has upstream section (indicates DNS config)
      if (name === 'upstream') {
        hasUpstreamSection = true
      }

      if (hasOpenBrace) {
        symbolStack.push(symbol)
      }

      if (symbolStack.length > 1) {
        const parent = symbolStack[symbolStack.length - 2]
        parent.children?.push(symbol)
      } else if (hasOpenBrace) {
        symbols.push(symbol)
      }

      continue
    }

    // Check for fallback: outbound (must be before general key:value check)
    const fallbackMatch = content.match(/^fallback:\s*(\w+)$/)
    if (fallbackMatch) {
      const outbound = fallbackMatch[1]
      const outboundStart = line.lastIndexOf(outbound)

      if (!OUTBOUNDS.includes(outbound)) {
        // If document has upstream section or is in dns section, references are to upstreams
        const isDnsContext = currentSection === 'dns' || hasUpstreamSection
        const refKind = isDnsContext ? 'upstream' : 'group'
        references.push({
          name: outbound,
          kind: refKind,
          range: {
            start: { line: lineNum, character: outboundStart },
            end: { line: lineNum, character: outboundStart + outbound.length },
          },
        })
      }
      continue
    }

    // Check for named definition: name: 'value' or name: value
    const colonIdx = content.indexOf(':')
    if (colonIdx !== -1 && symbolStack.length > 0) {
      const keyPart = content.substring(0, colonIdx)
      const keyMatch = keyPart.match(/^(\w[\w-]*)$/)
      if (keyMatch) {
        const name = keyMatch[1]
        const value = content.substring(colonIdx + 1).trim()
        const nameStart = line.indexOf(name)
        const parent = symbolStack[symbolStack.length - 1]

        // Determine the kind based on parent section
        let kind: Symbol['kind'] = 'parameter'
        if (parent.name === 'subscription') {
          kind = 'subscription'
        } else if (parent.name === 'node') {
          kind = 'node'
        } else if (parent.name === 'upstream') {
          kind = 'upstream'
        }

        if (kind !== 'parameter') {
          const symbol: Symbol = {
            name,
            kind,
            range: {
              start: { line: lineNum, character: 0 },
              end: { line: lineNum, character: line.length },
            },
            nameRange: {
              start: { line: lineNum, character: nameStart },
              end: { line: lineNum, character: nameStart + name.length },
            },
          }
          parent.children?.push(symbol)
        }

        // Check for references in the value
        parseReferences(value, lineNum, line.indexOf(value), references, currentSection)
        continue
      }
    }

    // Check for routing rules: condition -> outbound
    const arrowIndex = content.indexOf('->')
    if (arrowIndex !== -1) {
      const beforeArrow = content.substring(0, arrowIndex).trimEnd()
      const afterArrow = content.substring(arrowIndex + 2).trim()
      const outboundMatch = afterArrow.match(/^(\w+)$/)
      if (beforeArrow && outboundMatch) {
        const condition = beforeArrow
        const outbound = outboundMatch[1]
        const outboundStart = line.lastIndexOf(outbound)

        // Check if outbound is a known constant or a group reference
        if (!OUTBOUNDS.includes(outbound)) {
          // If document has upstream section or is in dns section, references are to upstreams
          const isDnsContext = currentSection === 'dns' || hasUpstreamSection
          const refKind = isDnsContext ? 'upstream' : 'group'
          references.push({
            name: outbound,
            kind: refKind,
            range: {
              start: { line: lineNum, character: outboundStart },
              end: { line: lineNum, character: outboundStart + outbound.length },
            },
          })
        }

        // Parse references in condition
        parseReferences(condition, lineNum, line.indexOf(condition), references, currentSection)
        continue
      }
    }

    // Check for closing brace
    if (content === '}') {
      if (symbolStack.length > 0) {
        const symbol = symbolStack.pop()!
        symbol.range.end = { line: lineNum, character: line.length }
        // Only clear currentSection when closing a top-level section (stack becomes empty)
        if (SECTION_NAMES.includes(symbol.name) && symbolStack.length === 0) {
          currentSection = null
        }
      }
      continue
    }

    // Anonymous string values in subscription/node sections
    if (content.startsWith("'") || content.startsWith('"')) {
      continue
    }
  }

  // Validate references
  const definedSymbols = collectDefinedSymbols(symbols)
  for (const ref of references) {
    const defined = definedSymbols.get(ref.name)
    if (!defined) {
      // Skip if it's a built-in outbound
      if (OUTBOUNDS.includes(ref.name)) {
        continue
      }
      // Skip group references - groups are defined in web UI, not in config text
      // This applies to routing rules like "domain(...) -> mygroup"
      if (ref.kind === 'group') {
        continue
      }
      diagnostics.push({
        message: `Undefined ${ref.kind}: '${ref.name}'`,
        range: ref.range,
        severity: 'warning',
      })
    }
  }

  return { symbols, references, diagnostics }
}

/**
 * Parse references in a value string
 */
function parseReferences(
  value: string,
  lineNum: number,
  startOffset: number,
  references: Reference[],
  currentSection: string | null,
): void {
  // Look for subtag(name) pattern
  const subtagRegex = /subtag\(([^)]+)\)/g
  let match = subtagRegex.exec(value)
  while (match !== null) {
    const args = match[1]
    // Parse arguments - can be comma-separated
    const argList = args.split(',').map((a) => a.trim())
    for (const arg of argList) {
      // Remove quotes if present
      const cleanArg = arg
        .replace(/^['"]|['"]$/g, '')
        .replace(/^regex:\s*/, '')
        .replace(/^\^/, '')
      if (cleanArg && !cleanArg.includes(':')) {
        const argStart = value.indexOf(arg, match.index)
        references.push({
          name: cleanArg,
          kind: 'subscription',
          range: {
            start: { line: lineNum, character: startOffset + argStart },
            end: { line: lineNum, character: startOffset + argStart + arg.length },
          },
        })
      }
    }
    match = subtagRegex.exec(value)
  }

  // Look for name(nodeName) pattern - use word boundary to avoid matching pname()
  const nameRegex = /\bname\(([^)]+)\)/g
  match = nameRegex.exec(value)
  while (match !== null) {
    const args = match[1]
    const argList = args.split(',').map((a) => a.trim())
    for (const arg of argList) {
      // Skip keyword: or regex: prefixed args
      if (arg.includes(':')) continue
      const cleanArg = arg.replace(/^['"]|['"]$/g, '')
      if (cleanArg) {
        const argStart = value.indexOf(arg, match.index)
        references.push({
          name: cleanArg,
          kind: 'node',
          range: {
            start: { line: lineNum, character: startOffset + argStart },
            end: { line: lineNum, character: startOffset + argStart + arg.length },
          },
        })
      }
    }
    match = nameRegex.exec(value)
  }

  // Look for upstream references in DNS routing
  if (currentSection === 'dns') {
    // Match -> upstreamName pattern
    const upstreamRegex = /->\s*(\w+)/g
    match = upstreamRegex.exec(value)
    while (match !== null) {
      const name = match[1]
      // Skip built-in outbounds
      if (!OUTBOUNDS.includes(name)) {
        const nameStart = value.indexOf(name, match.index)
        references.push({
          name,
          kind: 'upstream',
          range: {
            start: { line: lineNum, character: startOffset + nameStart },
            end: { line: lineNum, character: startOffset + nameStart + name.length },
          },
        })
      }
      match = upstreamRegex.exec(value)
    }

    // Match upstream(name) function pattern in DNS response routing
    const upstreamFuncRegex = /upstream\(([^)]+)\)/g
    match = upstreamFuncRegex.exec(value)
    while (match !== null) {
      const args = match[1]
      const argList = args.split(',').map((a) => a.trim())
      for (const arg of argList) {
        const cleanArg = arg.replace(/^['"]|['"]$/g, '')
        if (cleanArg && !OUTBOUNDS.includes(cleanArg)) {
          const argStart = value.indexOf(arg, match.index)
          references.push({
            name: cleanArg,
            kind: 'upstream',
            range: {
              start: { line: lineNum, character: startOffset + argStart },
              end: { line: lineNum, character: startOffset + argStart + arg.length },
            },
          })
        }
      }
      match = upstreamFuncRegex.exec(value)
    }
  }
}

/**
 * Determine the kind of a section based on its name and context
 */
function getSectionKind(name: string, stack: Symbol[]): Symbol['kind'] {
  if (SECTION_NAMES.includes(name)) {
    return 'section'
  }
  if (stack.length > 0) {
    const parent = stack[stack.length - 1]
    if (parent.name === 'group') {
      return 'group'
    }
    if (SUBSECTION_NAMES.includes(name)) {
      return 'section'
    }
  }
  return 'group'
}

/**
 * Find comment start position (# not inside quotes)
 */
function findCommentStart(line: string): number {
  let inSingleQuote = false
  let inDoubleQuote = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const prevChar = i > 0 ? line[i - 1] : ''

    if (prevChar === '\\') continue

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote
    } else if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote
    } else if (char === '#' && !inSingleQuote && !inDoubleQuote) {
      return i
    }
  }

  return -1
}

/**
 * Collect all defined symbols into a map for quick lookup
 */
function collectDefinedSymbols(symbols: Symbol[]): Map<string, Symbol> {
  const map = new Map<string, Symbol>()

  function collect(syms: Symbol[]) {
    for (const sym of syms) {
      if (sym.kind !== 'section' && sym.kind !== 'parameter') {
        map.set(sym.name, sym)
      }
      if (sym.children) {
        collect(sym.children)
      }
    }
  }

  collect(symbols)
  return map
}

/**
 * Find symbol at a given position
 */
export function findSymbolAtPosition(symbols: Symbol[], position: Position): Symbol | undefined {
  function search(syms: Symbol[]): Symbol | undefined {
    for (const sym of syms) {
      if (isPositionInRange(position, sym.nameRange)) {
        return sym
      }
      if (sym.children) {
        const found = search(sym.children)
        if (found) return found
      }
    }
    return undefined
  }

  return search(symbols)
}

/**
 * Find reference at a given position
 */
export function findReferenceAtPosition(references: Reference[], position: Position): Reference | undefined {
  for (const ref of references) {
    if (isPositionInRange(position, ref.range)) {
      return ref
    }
  }
  return undefined
}

/**
 * Find symbol by name and kind
 */
export function findSymbolByName(symbols: Symbol[], name: string, kind?: Symbol['kind']): Symbol | undefined {
  function search(syms: Symbol[]): Symbol | undefined {
    for (const sym of syms) {
      if (sym.name === name && (!kind || sym.kind === kind)) {
        return sym
      }
      if (sym.children) {
        const found = search(sym.children)
        if (found) return found
      }
    }
    return undefined
  }

  return search(symbols)
}

/**
 * Find all references to a symbol
 */
export function findAllReferences(references: Reference[], name: string, kind?: Reference['kind']): Reference[] {
  return references.filter((ref) => ref.name === name && (!kind || ref.kind === kind))
}

/**
 * Check if position is within range
 */
function isPositionInRange(position: Position, range: Range): boolean {
  if (position.line < range.start.line || position.line > range.end.line) {
    return false
  }
  if (position.line === range.start.line && position.character < range.start.character) {
    return false
  }
  if (position.line === range.end.line && position.character > range.end.character) {
    return false
  }
  return true
}

/**
 * Context information for a given position in the document
 */
export interface PositionContext {
  /** Current section name (e.g., 'dns', 'routing', 'global') */
  section: string | null
  /** Current subsection name (e.g., 'upstream', 'request', 'response') */
  subsection: string | null
  /** Whether we're in a DNS context (dns section or document with upstream section) */
  isDnsContext: boolean
  /** Whether we're in a routing rules context */
  isRoutingContext: boolean
  /** Symbol stack from root to current position */
  symbolPath: string[]
}

/**
 * Get context information for a given position in the document
 */
export function getPositionContext(text: string, position: Position): PositionContext {
  const lines = text.split('\n')
  let currentSection: string | null = null
  let currentSubsection: string | null = null
  let hasUpstreamSection = false
  let braceDepth = 0
  const symbolPath: string[] = []

  for (let lineNum = 0; lineNum <= position.line && lineNum < lines.length; lineNum++) {
    const line = lines[lineNum]
    const trimmed = line.trim()

    // Skip comments and empty lines
    if (trimmed.startsWith('#') || trimmed === '') continue

    // Track braces
    const openBraces = (line.match(/\{/g) || []).length
    const closeBraces = (line.match(/\}/g) || []).length

    // Check for section start
    const sectionMatch = trimmed.match(/^(\w+)\s*\{/)
    if (sectionMatch) {
      const name = sectionMatch[1]
      if (SECTION_NAMES.includes(name) && braceDepth === 0) {
        currentSection = name
        symbolPath.push(name)
      } else if (SUBSECTION_NAMES.includes(name)) {
        currentSubsection = name
        symbolPath.push(name)
        if (name === 'upstream') {
          hasUpstreamSection = true
        }
      } else {
        symbolPath.push(name)
      }
    }

    braceDepth += openBraces - closeBraces

    // Handle closing braces - pop from symbol path
    if (closeBraces > 0) {
      for (let i = 0; i < closeBraces && symbolPath.length > 0; i++) {
        const popped = symbolPath.pop()
        if (popped && SUBSECTION_NAMES.includes(popped)) {
          currentSubsection = null
        }
        if (popped && SECTION_NAMES.includes(popped) && braceDepth === 0) {
          currentSection = null
        }
      }
    }
  }

  const isDnsContext = currentSection === 'dns' || hasUpstreamSection
  const isRoutingContext =
    currentSection === 'routing' ||
    currentSubsection === 'routing' ||
    currentSubsection === 'request' ||
    currentSubsection === 'response'

  return {
    section: currentSection,
    subsection: currentSubsection,
    isDnsContext,
    isRoutingContext,
    symbolPath,
  }
}
