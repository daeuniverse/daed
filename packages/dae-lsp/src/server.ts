/**
 * DAE Language Server
 *
 * A Language Server Protocol implementation for the DAE configuration language.
 * Built with Node.js and vscode-languageserver.
 */

import type {
  CompletionItem,
  Definition,
  Diagnostic,
  DocumentFormattingParams,
  Hover,
  InitializeParams,
  InitializeResult,
  ReferenceParams,
  RenameParams,
  SemanticTokensLegend,
  SemanticTokensParams,
  TextDocumentPositionParams,
  WorkspaceEdit,
} from 'vscode-languageserver/node'
import type { DaeCompletionItem } from './core/completions'

import type { Position as DaePosition, Symbol as DaeSymbol, ParseResult } from './core/mod'

import { TextDocument } from 'vscode-languageserver-textdocument'

import {
  CompletionItemKind,
  createConnection,
  DiagnosticSeverity,
  InsertTextFormat,
  Location,
  MarkupKind,
  Position,
  ProposedFeatures,
  Range,
  SemanticTokensBuilder,
  TextDocuments,
  TextDocumentSyncKind,
  TextEdit,
} from 'vscode-languageserver/node'

import { DAE_COMPLETION_ITEMS, PROPERTY_VALUES } from './core/completions'
import { FUNCTION_DOCS, OUTBOUND_DOCS, PARAM_DOCS, PREFIX_DOCS, SECTION_DOCS } from './core/docs'
import { formatDocument } from './core/formatter'
import {
  findAllReferences,
  findReferenceAtPosition,
  findSymbolAtPosition,
  findSymbolByName,
  OUTBOUNDS,
  parseDocument,
  RULE_FUNCTIONS,
  SECTION_NAMES,
} from './core/mod'

// Create a connection for the server using stdio
const connection = createConnection(ProposedFeatures.all)

// Create a document manager
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument)

// Cache for parsed documents
const parseCache = new Map<string, { version: number; result: ParseResult }>()

// Semantic tokens legend
const tokenTypes = [
  'namespace',
  'type',
  'class',
  'enum',
  'function',
  'variable',
  'keyword',
  'comment',
  'string',
  'number',
  'operator',
]
const tokenModifiers = ['declaration', 'definition', 'readonly', 'static']
const semanticTokensLegend: SemanticTokensLegend = {
  tokenTypes,
  tokenModifiers,
}

/**
 * Get parsed result for a document (with caching)
 */
function getParsedDocument(document: TextDocument): ParseResult {
  const cached = parseCache.get(document.uri)
  if (cached && cached.version === document.version) {
    return cached.result
  }

  const result = parseDocument(document.getText())
  parseCache.set(document.uri, {
    version: document.version,
    result,
  })

  return result
}

/**
 * Convert completion item kind from string to LSP enum
 */
function getCompletionItemKind(kind: DaeCompletionItem['kind']): CompletionItemKind {
  switch (kind) {
    case 'keyword':
      return CompletionItemKind.Keyword
    case 'function':
      return CompletionItemKind.Function
    case 'constant':
      return CompletionItemKind.Constant
    case 'type':
      return CompletionItemKind.TypeParameter
    case 'variable':
      return CompletionItemKind.Variable
    case 'snippet':
      return CompletionItemKind.Snippet
    case 'property':
      return CompletionItemKind.Property
    default:
      return CompletionItemKind.Text
  }
}

/**
 * Convert DAE position to LSP position
 */
function toLspPosition(pos: DaePosition): Position {
  return Position.create(pos.line, pos.character)
}

/**
 * Convert DAE range to LSP range
 */
function toLspRange(range: { start: DaePosition; end: DaePosition }): Range {
  return Range.create(toLspPosition(range.start), toLspPosition(range.end))
}

connection.onInitialize((_params: InitializeParams): InitializeResult => {
  connection.console.log('DAE Language Server initializing...')

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        triggerCharacters: ['.', ':', '('],
        resolveProvider: true,
      },
      hoverProvider: true,
      definitionProvider: true,
      referencesProvider: true,
      renameProvider: {
        prepareProvider: true,
      },
      documentFormattingProvider: true,
      semanticTokensProvider: {
        legend: semanticTokensLegend,
        full: true,
      },
    },
  }
})

connection.onInitialized(() => {
  connection.console.log('DAE Language Server initialized')
})

// Completion handler
connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
  const document = documents.get(params.textDocument.uri)
  if (!document) {
    return DAE_COMPLETION_ITEMS.map((item) => ({
      label: item.label,
      kind: getCompletionItemKind(item.kind),
      detail: item.detail,
      documentation: {
        kind: MarkupKind.Markdown,
        value: item.documentation || '',
      },
      insertText: item.insertText,
      insertTextFormat: item.isSnippet ? InsertTextFormat.Snippet : InsertTextFormat.PlainText,
    }))
  }

  const text = document.getText()
  const lines = text.split('\n')
  const line = lines[params.position.line] || ''
  const linePrefix = line.substring(0, params.position.character)
  const parseResult = getParsedDocument(document)

  // Helper function to collect all symbols recursively
  function collectAllSymbols(symbols: ParseResult['symbols'], kinds: string[]): ParseResult['symbols'] {
    const result: ParseResult['symbols'] = []
    function collect(syms: ParseResult['symbols']) {
      for (const sym of syms) {
        if (kinds.includes(sym.kind)) {
          result.push(sym)
        }
        if (sym.children) {
          collect(sym.children)
        }
      }
    }
    collect(symbols)
    return result
  }

  // Check if we're inside a filter function like name(), subtag() in group section
  // Matches: "filter: name(" or "filter: subtag(" or just "name(" etc.
  const filterFuncMatch = linePrefix.match(/(?:filter\s*:\s*)?(name|subtag)\s*\(\s*(['"]?)(\w*)$/)
  if (filterFuncMatch) {
    const quote = filterFuncMatch[2]
    const partial = filterFuncMatch[3].toLowerCase()

    // Get all node and subscription symbols (recursively)
    const symbols = collectAllSymbols(parseResult.symbols, ['node', 'subscription'])

    return symbols
      .filter((s) => s.name.toLowerCase().includes(partial))
      .map((symbol, index) => ({
        label: symbol.name,
        kind: symbol.kind === 'node' ? CompletionItemKind.Variable : CompletionItemKind.Module,
        detail: symbol.kind,
        documentation: {
          kind: MarkupKind.Markdown,
          value: `**${symbol.kind}**: \`${symbol.name}\`\n\nDefined at line ${symbol.nameRange.start.line + 1}`,
        },
        sortText: String(index).padStart(2, '0'),
        // If quote was started, don't add another
        insertText: quote ? symbol.name : symbol.name,
        insertTextFormat: InsertTextFormat.PlainText,
      }))
  }

  // Check if we're after a property name followed by colon (e.g., "tproxy_port_protect: ")
  const propertyMatch = linePrefix.match(/^\s*(\w+)\s*:\s*$/)
  if (propertyMatch) {
    const propertyName = propertyMatch[1]
    const propertyDef = PROPERTY_VALUES[propertyName]

    if (propertyDef) {
      return propertyDef.values.map((value, index) => ({
        label: value,
        kind: propertyDef.type === 'boolean' ? CompletionItemKind.Value : CompletionItemKind.EnumMember,
        detail: `${propertyName} value`,
        sortText: String(index).padStart(2, '0'),
        insertText: value,
        insertTextFormat: InsertTextFormat.PlainText,
      }))
    }
  }

  // Check if we're typing a value after colon (e.g., "tproxy_port_protect: tr")
  const partialValueMatch = linePrefix.match(/^\s*(\w+)\s*:\s*(\w+)$/)
  if (partialValueMatch) {
    const propertyName = partialValueMatch[1]
    const partialValue = partialValueMatch[2].toLowerCase()
    const propertyDef = PROPERTY_VALUES[propertyName]

    if (propertyDef) {
      return propertyDef.values
        .filter((v) => v.toLowerCase().startsWith(partialValue))
        .map((value, index) => ({
          label: value,
          kind: propertyDef.type === 'boolean' ? CompletionItemKind.Value : CompletionItemKind.EnumMember,
          detail: `${propertyName} value`,
          sortText: String(index).padStart(2, '0'),
          insertText: value,
          insertTextFormat: InsertTextFormat.PlainText,
        }))
    }
  }

  // Default: return all completion items
  return DAE_COMPLETION_ITEMS.map((item) => {
    const completionItem: CompletionItem = {
      label: item.label,
      kind: getCompletionItemKind(item.kind),
      detail: item.detail,
      documentation: {
        kind: MarkupKind.Markdown,
        value: item.documentation || '',
      },
      insertText: item.insertText,
      insertTextFormat: item.isSnippet ? InsertTextFormat.Snippet : InsertTextFormat.PlainText,
    }
    return completionItem
  })
})

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  return item
})

// Hover handler
connection.onHover((params: TextDocumentPositionParams): Hover | null => {
  const document = documents.get(params.textDocument.uri)
  if (!document) return null

  const parseResult = getParsedDocument(document)
  const position = params.position

  // Get word at position
  const text = document.getText()
  const lines = text.split('\n')
  const line = lines[position.line]
  if (!line) return null

  // Find word boundaries (include + for values like domain+, domain++)
  let start = position.character
  let end = position.character
  while (start > 0 && /[\w+\-]/.test(line[start - 1])) start--
  while (end < line.length && /[\w+\-]/.test(line[end])) end++
  const word = line.substring(start, end)

  if (!word) return null

  const wordRange = Range.create(position.line, start, position.line, end)

  // Check if we're on a property value (e.g., dial_mode: domain++)
  const propertyValueMatch = line.match(/^\s*(\w+)\s*:\s*(\S.*)$/)
  if (propertyValueMatch) {
    const propertyName = propertyValueMatch[1]
    const valueStart = line.indexOf(propertyValueMatch[2])
    // Check if cursor is on the value part
    if (position.character >= valueStart) {
      const propertyDef = PROPERTY_VALUES[propertyName]
      if (propertyDef && propertyDef.values.includes(word)) {
        // This is a known property value, show property-specific docs
        const defaultDoc = `Value \`${word}\` for **${propertyName}**`
        return {
          contents: {
            kind: MarkupKind.Markdown,
            value: PARAM_DOCS[propertyName] ? `**${word}**\n\n${PARAM_DOCS[propertyName]}` : defaultDoc,
          },
          range: wordRange,
        }
      }
    }
  }

  // Check section docs
  if (SECTION_DOCS[word]) {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: SECTION_DOCS[word],
      },
      range: wordRange,
    }
  }

  // Check parameter docs
  if (PARAM_DOCS[word]) {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: `**${word}**\n\n${PARAM_DOCS[word]}`,
      },
      range: wordRange,
    }
  }

  // Check function docs - but only if followed by ( to avoid matching property values
  const afterWord = line.substring(end).trim()
  if (RULE_FUNCTIONS.includes(word) && afterWord.startsWith('(')) {
    const doc = FUNCTION_DOCS[word] || `Rule function: ${word}`
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: `**${word}()**\n\n${doc}`,
      },
      range: wordRange,
    }
  }

  // Check outbound docs
  if (OUTBOUND_DOCS[word]) {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: `**${word}**\n\n${OUTBOUND_DOCS[word]}`,
      },
      range: wordRange,
    }
  }

  // Check symbol definition
  const daePosition: DaePosition = { line: position.line, character: position.character }
  const symbol = findSymbolAtPosition(parseResult.symbols, daePosition)
  if (symbol) {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: `**${symbol.kind}**: \`${symbol.name}\``,
      },
      range: wordRange,
    }
  }

  // Check reference
  const reference = findReferenceAtPosition(parseResult.references, daePosition)
  if (reference) {
    const refSymbol = findSymbolByName(parseResult.symbols, reference.name)
    if (refSymbol) {
      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: `**${refSymbol.kind}**: \`${refSymbol.name}\`\n\nDefined at line ${refSymbol.nameRange.start.line + 1}`,
        },
        range: wordRange,
      }
    } else {
      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: `Reference to ${reference.kind}: \`${reference.name}\``,
        },
        range: wordRange,
      }
    }
  }

  // Check prefix docs
  const prefixMatch = line.match(/(geosite|geoip|full|contains|keyword|regexp|regex|ext):(\w+)/)
  if (prefixMatch) {
    const prefix = prefixMatch[1]
    if (word === prefix || word === prefixMatch[2]) {
      const doc = PREFIX_DOCS[prefix] || ''
      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: `**${prefix}:${prefixMatch[2]}**\n\n${doc}`,
        },
        range: wordRange,
      }
    }
  }

  return null
})

// Definition handler
connection.onDefinition((params: TextDocumentPositionParams): Definition | null => {
  const document = documents.get(params.textDocument.uri)
  if (!document) return null

  const parseResult = getParsedDocument(document)
  const daePosition: DaePosition = { line: params.position.line, character: params.position.character }

  // Check if on a reference
  const reference = findReferenceAtPosition(parseResult.references, daePosition)
  if (reference) {
    // Map reference kind to symbol kind
    const kindMap: Record<string, string> = {
      group: 'group',
      subscription: 'subscription',
      node: 'node',
      upstream: 'upstream',
    }

    const symbol = findSymbolByName(
      parseResult.symbols,
      reference.name,
      kindMap[reference.kind] as 'group' | 'subscription' | 'node' | 'upstream',
    )
    if (symbol) {
      return Location.create(params.textDocument.uri, toLspRange(symbol.nameRange))
    }
  }

  // Check if on a symbol
  const symbol = findSymbolAtPosition(parseResult.symbols, daePosition)
  if (symbol) {
    return Location.create(params.textDocument.uri, toLspRange(symbol.nameRange))
  }

  // Check for word-based navigation (for cases not captured by parser)
  const text = document.getText()
  const lines = text.split('\n')
  const line = lines[params.position.line]
  if (!line) return null

  // Find word boundaries
  let start = params.position.character
  let end = params.position.character
  while (start > 0 && /[\w-]/.test(line[start - 1])) start--
  while (end < line.length && /[\w-]/.test(line[end])) end++
  const word = line.substring(start, end)

  if (!word) return null

  // Check if this is after an arrow (routing rule outbound)
  if (line.includes('->')) {
    const sym = findSymbolByName(parseResult.symbols, word, 'group')
    if (sym) {
      return Location.create(params.textDocument.uri, toLspRange(sym.nameRange))
    }
  }

  // Check if this is after fallback:
  if (line.includes('fallback:')) {
    // In DNS routing, fallback can be an upstream reference
    const sym =
      findSymbolByName(parseResult.symbols, word, 'upstream') || findSymbolByName(parseResult.symbols, word, 'group')
    if (sym) {
      return Location.create(params.textDocument.uri, toLspRange(sym.nameRange))
    }
  }

  // Check if this is a DNS upstream reference (after -> in dns routing)
  const arrowMatch = line.match(/->\s*(\w+)/)
  if (arrowMatch && word === arrowMatch[1]) {
    // Try upstream first (for DNS routing), then group (for traffic routing)
    const sym =
      findSymbolByName(parseResult.symbols, word, 'upstream') || findSymbolByName(parseResult.symbols, word, 'group')
    if (sym) {
      return Location.create(params.textDocument.uri, toLspRange(sym.nameRange))
    }
  }

  // Check if this is inside upstream() function call
  const upstreamFuncMatch = line.match(/upstream\(([\w,\s]+)\)/)
  if (upstreamFuncMatch) {
    const args = upstreamFuncMatch[1].split(',').map((a) => a.trim())
    if (args.includes(word)) {
      const sym = findSymbolByName(parseResult.symbols, word, 'upstream')
      if (sym) {
        return Location.create(params.textDocument.uri, toLspRange(sym.nameRange))
      }
    }
  }

  return null
})

// References handler
connection.onReferences((params: ReferenceParams): Location[] => {
  const document = documents.get(params.textDocument.uri)
  if (!document) return []

  const parseResult = getParsedDocument(document)
  const daePosition: DaePosition = { line: params.position.line, character: params.position.character }
  const locations: Location[] = []

  // Find symbol at position
  let name: string | null = null

  const symbol = findSymbolAtPosition(parseResult.symbols, daePosition)
  if (symbol) {
    name = symbol.name

    // Include the definition itself if requested
    if (params.context.includeDeclaration) {
      locations.push(Location.create(params.textDocument.uri, toLspRange(symbol.nameRange)))
    }
  } else {
    const reference = findReferenceAtPosition(parseResult.references, daePosition)
    if (reference) {
      name = reference.name

      // Find definition
      const refSymbol = findSymbolByName(parseResult.symbols, name)
      if (refSymbol && params.context.includeDeclaration) {
        locations.push(Location.create(params.textDocument.uri, toLspRange(refSymbol.nameRange)))
      }
    }
  }

  if (name) {
    // Find all references
    const refs = findAllReferences(parseResult.references, name)
    for (const ref of refs) {
      locations.push(Location.create(params.textDocument.uri, toLspRange(ref.range)))
    }
  }

  return locations
})

// Rename prepare handler
connection.onPrepareRename((params: TextDocumentPositionParams) => {
  const document = documents.get(params.textDocument.uri)
  if (!document) return null

  const parseResult = getParsedDocument(document)
  const daePosition: DaePosition = { line: params.position.line, character: params.position.character }

  const symbol = findSymbolAtPosition(parseResult.symbols, daePosition)
  if (symbol && symbol.kind !== 'section' && symbol.kind !== 'parameter') {
    return {
      range: toLspRange(symbol.nameRange),
      placeholder: symbol.name,
    }
  }

  const reference = findReferenceAtPosition(parseResult.references, daePosition)
  if (reference) {
    return {
      range: toLspRange(reference.range),
      placeholder: reference.name,
    }
  }

  return null
})

// Rename handler
connection.onRenameRequest((params: RenameParams): WorkspaceEdit | null => {
  const document = documents.get(params.textDocument.uri)
  if (!document) return null

  const parseResult = getParsedDocument(document)
  const daePosition: DaePosition = { line: params.position.line, character: params.position.character }
  const edits: TextEdit[] = []

  let name: string | null = null

  const symbol = findSymbolAtPosition(parseResult.symbols, daePosition)
  if (symbol && symbol.kind !== 'section' && symbol.kind !== 'parameter') {
    name = symbol.name
    edits.push(TextEdit.replace(toLspRange(symbol.nameRange), params.newName))
  } else {
    const reference = findReferenceAtPosition(parseResult.references, daePosition)
    if (reference) {
      name = reference.name
      const refSymbol = findSymbolByName(parseResult.symbols, name)
      if (refSymbol) {
        edits.push(TextEdit.replace(toLspRange(refSymbol.nameRange), params.newName))
      }
    }
  }

  if (name) {
    const refs = findAllReferences(parseResult.references, name)
    for (const ref of refs) {
      edits.push(TextEdit.replace(toLspRange(ref.range), params.newName))
    }
  }

  if (edits.length === 0) return null

  return {
    changes: {
      [params.textDocument.uri]: edits,
    },
  }
})

// Document formatting handler
connection.onDocumentFormatting((params: DocumentFormattingParams): TextEdit[] => {
  connection.console.log(`Formatting document: ${params.textDocument.uri}`)

  const document = documents.get(params.textDocument.uri)
  if (!document) {
    connection.console.log('Document not found')
    return []
  }

  const text = document.getText()
  connection.console.log(`Document text length: ${text.length}`)

  const formatted = formatDocument(text, {
    tabSize: params.options.tabSize,
    insertSpaces: params.options.insertSpaces,
  })

  connection.console.log(`Formatted text length: ${formatted.length}`)

  const fullRange = Range.create(0, 0, document.lineCount, 0)
  return [TextEdit.replace(fullRange, formatted)]
})

// Semantic tokens handler
connection.languages.semanticTokens.on((params: SemanticTokensParams) => {
  const document = documents.get(params.textDocument.uri)
  if (!document) return { data: [] }

  const parseResult = getParsedDocument(document)
  const text = document.getText()
  const lines = text.split('\n')
  const builder = new SemanticTokensBuilder()

  interface TokenInfo {
    line: number
    char: number
    length: number
    tokenType: number
    tokenModifiers: number
  }

  const tokens: TokenInfo[] = []

  // Helper to find comment start
  function findCommentIndex(line: string): number {
    let inSingleQuote = false
    let inDoubleQuote = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const prevChar = i > 0 ? line[i - 1] : ''
      if (prevChar === '\\') continue
      if (char === "'" && !inDoubleQuote) inSingleQuote = !inSingleQuote
      else if (char === '"' && !inSingleQuote) inDoubleQuote = !inDoubleQuote
      else if (char === '#' && !inSingleQuote && !inDoubleQuote) return i
    }
    return -1
  }

  // Process each line for semantic tokens
  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum]
    const trimmed = line.trim()
    if (trimmed === '') continue

    // Handle comments
    const commentIndex = findCommentIndex(line)
    if (commentIndex === 0) {
      tokens.push({
        line: lineNum,
        char: line.indexOf('#'),
        length: line.length - line.indexOf('#'),
        tokenType: tokenTypes.indexOf('comment'),
        tokenModifiers: 0,
      })
      continue
    }

    const contentEnd = commentIndex !== -1 ? commentIndex : line.length
    const content = line.substring(0, contentEnd)

    // Check for section/block start
    const sectionMatch = content.match(/^\s*(\w+)\s*\{/)
    if (sectionMatch) {
      const name = sectionMatch[1]
      const start = content.indexOf(name)
      if (SECTION_NAMES.includes(name)) {
        tokens.push({
          line: lineNum,
          char: start,
          length: name.length,
          tokenType: tokenTypes.indexOf('namespace'),
          tokenModifiers: 0,
        })
      } else {
        tokens.push({
          line: lineNum,
          char: start,
          length: name.length,
          tokenType: tokenTypes.indexOf('class'),
          tokenModifiers: 1, // declaration
        })
      }
    }

    // Check for key: value pairs
    const colonIndex = content.indexOf(':')
    if (colonIndex !== -1) {
      const keyPart = content.substring(0, colonIndex).trim()
      const kvKeyMatch = keyPart.match(/^(\w[\w-]*)$/)
      if (kvKeyMatch) {
        const key = kvKeyMatch[1]
        const value = content.substring(colonIndex + 1).trim()
        const keyStart = content.indexOf(key)

        // Determine token type based on key
        if (['fallback', 'policy', 'filter'].includes(key)) {
          tokens.push({
            line: lineNum,
            char: keyStart,
            length: key.length,
            tokenType: tokenTypes.indexOf('keyword'),
            tokenModifiers: 0,
          })
        } else {
          tokens.push({
            line: lineNum,
            char: keyStart,
            length: key.length,
            tokenType: tokenTypes.indexOf('variable'),
            tokenModifiers: 0,
          })
        }

        // Parse value for functions and references
        const valueStart =
          colonIndex +
          1 +
          (content.substring(colonIndex + 1).length - content.substring(colonIndex + 1).trimStart().length)
        parseValueTokens(value, lineNum, valueStart, tokens)
      }
    }

    // Check for routing rules: condition -> outbound
    const arrowIdx = content.indexOf('->')
    if (arrowIdx !== -1) {
      const beforeArrow = content.substring(0, arrowIdx).trimEnd()
      const afterArrow = content.substring(arrowIdx + 2).trim()
      const outboundMatch = afterArrow.match(/^(\w+)$/)
      if (beforeArrow && outboundMatch) {
        const indent = content.match(/^(\s*)/)?.[1] || ''
        const condition = beforeArrow.trim()
        const outbound = outboundMatch[1]
        const outboundStart = content.lastIndexOf(outbound)

        // Parse condition for functions
        parseConditionTokens(condition, lineNum, indent.length, tokens)

        // Arrow operator
        tokens.push({
          line: lineNum,
          char: content.indexOf('->'),
          length: 2,
          tokenType: tokenTypes.indexOf('operator'),
          tokenModifiers: 0,
        })

        // Outbound
        if (OUTBOUNDS.includes(outbound)) {
          tokens.push({
            line: lineNum,
            char: outboundStart,
            length: outbound.length,
            tokenType: tokenTypes.indexOf('keyword'),
            tokenModifiers: 0,
          })
        } else {
          tokens.push({
            line: lineNum,
            char: outboundStart,
            length: outbound.length,
            tokenType: tokenTypes.indexOf('variable'),
            tokenModifiers: 0,
          })
        }
      }
    }

    // Add comment token if there's an inline comment
    if (commentIndex !== -1) {
      tokens.push({
        line: lineNum,
        char: commentIndex,
        length: line.length - commentIndex,
        tokenType: tokenTypes.indexOf('comment'),
        tokenModifiers: 0,
      })
    }
  }

  // Parse value part for tokens
  function parseValueTokens(value: string, lineNum: number, offset: number, tokens: TokenInfo[]): void {
    // Look for function calls
    const funcRegex = new RegExp(`\\b(${RULE_FUNCTIONS.join('|')})\\s*\\(`, 'g')
    let match = funcRegex.exec(value)
    while (match !== null) {
      tokens.push({
        line: lineNum,
        char: offset + match.index,
        length: match[1].length,
        tokenType: tokenTypes.indexOf('function'),
        tokenModifiers: 0,
      })
      match = funcRegex.exec(value)
    }

    // Look for type prefixes
    const typeRegex = /(geosite|geoip|full|contains|keyword|regexp|regex|ext):/g
    match = typeRegex.exec(value)
    while (match !== null) {
      tokens.push({
        line: lineNum,
        char: offset + match.index,
        length: match[1].length,
        tokenType: tokenTypes.indexOf('type'),
        tokenModifiers: 0,
      })
      match = typeRegex.exec(value)
    }
  }

  // Parse condition part of routing rules for tokens
  function parseConditionTokens(condition: string, lineNum: number, offset: number, tokens: TokenInfo[]): void {
    // Look for function calls
    const funcRegex = new RegExp(`\\b(${RULE_FUNCTIONS.join('|')})\\s*\\(`, 'g')
    let match = funcRegex.exec(condition)
    while (match !== null) {
      tokens.push({
        line: lineNum,
        char: offset + match.index,
        length: match[1].length,
        tokenType: tokenTypes.indexOf('function'),
        tokenModifiers: 0,
      })
      match = funcRegex.exec(condition)
    }

    // Look for type prefixes
    const typeRegex = /(geosite|geoip|full|contains|keyword|regexp|regex|ext):/g
    match = typeRegex.exec(condition)
    while (match !== null) {
      tokens.push({
        line: lineNum,
        char: offset + match.index,
        length: match[1].length,
        tokenType: tokenTypes.indexOf('type'),
        tokenModifiers: 0,
      })
      match = typeRegex.exec(condition)
    }

    // Look for logical operators
    const andRegex = /&&/g
    match = andRegex.exec(condition)
    while (match !== null) {
      tokens.push({
        line: lineNum,
        char: offset + match.index,
        length: 2,
        tokenType: tokenTypes.indexOf('operator'),
        tokenModifiers: 0,
      })
      match = andRegex.exec(condition)
    }

    // Look for NOT operator
    const notRegex = /!/g
    match = notRegex.exec(condition)
    while (match !== null) {
      tokens.push({
        line: lineNum,
        char: offset + match.index,
        length: 1,
        tokenType: tokenTypes.indexOf('operator'),
        tokenModifiers: 0,
      })
      match = notRegex.exec(condition)
    }
  }

  // Add symbol tokens from parse result (for definitions)
  function processSymbols(symbols: DaeSymbol[]) {
    for (const symbol of symbols) {
      if (symbol.children) {
        processSymbols(symbol.children)
      }
    }
  }
  processSymbols(parseResult.symbols)

  // Sort tokens and build the result
  tokens.sort((a, b) => {
    if (a.line !== b.line) return a.line - b.line
    return a.char - b.char
  })

  for (const token of tokens) {
    builder.push(token.line, token.char, token.length, token.tokenType, token.tokenModifiers)
  }

  return builder.build()
})

// Validate document and send diagnostics
function validateDocument(document: TextDocument): void {
  const parseResult = getParsedDocument(document)
  const diagnostics: Diagnostic[] = []

  for (const diag of parseResult.diagnostics) {
    const severity =
      diag.severity === 'error'
        ? DiagnosticSeverity.Error
        : diag.severity === 'warning'
          ? DiagnosticSeverity.Warning
          : DiagnosticSeverity.Information

    diagnostics.push({
      range: toLspRange(diag.range),
      message: diag.message,
      severity,
      source: 'dae',
    })
  }

  connection.sendDiagnostics({ uri: document.uri, diagnostics })
}

// Document change handlers
documents.onDidChangeContent((change: { document: TextDocument }) => {
  connection.console.log(`Document changed: ${change.document.uri}`)
  validateDocument(change.document)
})

documents.onDidOpen((event: { document: TextDocument }) => {
  connection.console.log(`Document opened: ${event.document.uri}, language: ${event.document.languageId}`)
})

documents.onDidClose((event: { document: TextDocument }) => {
  connection.console.log(`Document closed: ${event.document.uri}`)
  parseCache.delete(event.document.uri)
  connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] })
})

// Start listening
documents.listen(connection)
connection.listen()

connection.console.log('DAE Language Server started')
