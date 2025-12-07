/**
 * DAE Language Server Core
 *
 * Shared logic for both Node.js and Browser LSP servers.
 * This module is platform-agnostic and can be used in any environment.
 */

import type {
  CompletionItem,
  Connection,
  Definition,
  Diagnostic,
  DocumentFormattingParams,
  Hover,
  InitializeParams,
  InitializeResult,
  ReferenceParams,
  RenameParams,
  SemanticTokensParams,
  TextDocumentPositionParams,
  TextDocuments,
  WorkspaceEdit,
} from 'vscode-languageserver'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { DaeCompletionItem } from './core/completions'
import type { Position as DaePosition, Range as DaeRange, ParseResult } from './core/mod'
import {
  CompletionItemKind,
  DiagnosticSeverity,
  InsertTextFormat,
  Location,
  MarkupKind,
  Position,
  Range,
  SemanticTokensBuilder,
  TextDocumentSyncKind,
  TextEdit,
} from 'vscode-languageserver'
import { DAE_COMPLETION_ITEMS, DNS_ROUTING_COMPLETIONS, PROPERTY_VALUES } from './core/completions'
import { FUNCTION_DOCS, OUTBOUND_DOCS, PARAM_DOCS, PREFIX_DOCS, SECTION_DOCS } from './core/docs'
import { formatDocument } from './core/formatter'
import {
  findAllReferences,
  findReferenceAtPosition,
  findSymbolAtPosition,
  findSymbolByName,
  getPositionContext,
  OUTBOUNDS,
  parseDocument,
  RULE_FUNCTIONS,
} from './core/mod'

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

export const semanticTokensLegend = {
  tokenTypes,
  tokenModifiers,
}

// Cache for parsed documents
const parseCache = new Map<string, { version: number; result: ParseResult }>()

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
 * Convert DAE range to LSP range
 */
function toLspRange(range: DaeRange): Range {
  return Range.create(
    Position.create(range.start.line, range.start.character),
    Position.create(range.end.line, range.end.character),
  )
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
 * Helper function to collect all symbols recursively
 */
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

/**
 * Validate document and send diagnostics
 */
function validateDocument(connection: Connection, document: TextDocument): void {
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

/**
 * Initialize and configure the language server
 */
export function initializeServer(connection: Connection, documents: TextDocuments<TextDocument>): void {
  // Initialize handler
  connection.onInitialize((_params: InitializeParams): InitializeResult => {
    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        completionProvider: {
          resolveProvider: true,
          triggerCharacters: ['.', ':', '(', ',', ' '],
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

    // Check if we're inside a filter function like name(), subtag() in group section
    // Use word boundary \b to avoid matching qname() which contains "name"
    const filterFuncMatch = linePrefix.match(/(?:filter\s*:\s*)?\b(name|subtag)\s*\(\s*(['"]?)(\w*)$/)
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
          insertText: quote ? symbol.name : symbol.name,
          insertTextFormat: InsertTextFormat.PlainText,
        }))
    }

    // Check if we're after a property name followed by colon
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

    // Check if we're typing a value after colon
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

    // Get position context to determine what completions to show
    const context = getPositionContext(text, { line: params.position.line, character: params.position.character })

    // Build completion items based on context
    let completionItems: DaeCompletionItem[] = [...DAE_COMPLETION_ITEMS]

    // Add DNS routing completions when in DNS context
    if (context.isDnsContext) {
      completionItems = [...DNS_ROUTING_COMPLETIONS, ...completionItems]
    }

    // Add user-defined symbols as completion items
    const userSymbolCompletions: CompletionItem[] = []

    // In DNS context, add upstream symbols (like alidns, googledns)
    if (context.isDnsContext) {
      const upstreamSymbols = collectAllSymbols(parseResult.symbols, ['upstream'])
      for (const symbol of upstreamSymbols) {
        userSymbolCompletions.push({
          label: symbol.name,
          kind: CompletionItemKind.Variable,
          detail: 'DNS upstream',
          documentation: {
            kind: MarkupKind.Markdown,
            value: `**DNS Upstream**: \`${symbol.name}\`\n\nDefined at line ${symbol.nameRange.start.line + 1}`,
          },
          insertText: symbol.name,
          insertTextFormat: InsertTextFormat.PlainText,
          sortText: `00${symbol.name}`, // Prioritize user-defined symbols
        })
      }
    }

    // In routing context, add group symbols
    if (context.isRoutingContext || context.section === 'routing') {
      const groupSymbols = collectAllSymbols(parseResult.symbols, ['group'])
      for (const symbol of groupSymbols) {
        userSymbolCompletions.push({
          label: symbol.name,
          kind: CompletionItemKind.Variable,
          detail: 'Proxy group',
          documentation: {
            kind: MarkupKind.Markdown,
            value: `**Group**: \`${symbol.name}\`\n\nDefined at line ${symbol.nameRange.start.line + 1}`,
          },
          insertText: symbol.name,
          insertTextFormat: InsertTextFormat.PlainText,
          sortText: `00${symbol.name}`,
        })
      }
    }

    // Default: return all completion items plus user-defined symbols
    const baseCompletions = completionItems.map((item) => ({
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

    return [...userSymbolCompletions, ...baseCompletions]
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

    // Check if we're on a property value
    const propertyValueMatch = line.match(/^\s*(\w+)\s*:\s*(\S.*)$/)
    if (propertyValueMatch) {
      const propertyName = propertyValueMatch[1]
      const valueStart = line.indexOf(propertyValueMatch[2])
      if (position.character >= valueStart) {
        const propertyDef = PROPERTY_VALUES[propertyName]
        if (propertyDef && propertyDef.values.includes(word)) {
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

    // Check function docs - only if followed by (
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

    const reference = findReferenceAtPosition(parseResult.references, daePosition)
    if (reference) {
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

    const symbol = findSymbolAtPosition(parseResult.symbols, daePosition)
    if (symbol) {
      return Location.create(params.textDocument.uri, toLspRange(symbol.nameRange))
    }

    return null
  })

  // References handler
  connection.onReferences((params: ReferenceParams): Location[] | null => {
    const document = documents.get(params.textDocument.uri)
    if (!document) return null

    const parseResult = getParsedDocument(document)
    const daePosition: DaePosition = { line: params.position.line, character: params.position.character }

    const symbol = findSymbolAtPosition(parseResult.symbols, daePosition)
    if (!symbol) return null

    const references = findAllReferences(parseResult.references, symbol.name)
    const locations: Location[] = references.map((ref) =>
      Location.create(params.textDocument.uri, toLspRange(ref.range)),
    )

    if (params.context.includeDeclaration) {
      locations.unshift(Location.create(params.textDocument.uri, toLspRange(symbol.nameRange)))
    }

    return locations.length > 0 ? locations : null
  })

  // Rename handlers
  connection.onPrepareRename((params: TextDocumentPositionParams) => {
    const document = documents.get(params.textDocument.uri)
    if (!document) return null

    const parseResult = getParsedDocument(document)
    const daePosition: DaePosition = { line: params.position.line, character: params.position.character }

    const symbol = findSymbolAtPosition(parseResult.symbols, daePosition)
    if (symbol) {
      return {
        range: toLspRange(symbol.nameRange),
        placeholder: symbol.name,
      }
    }

    return null
  })

  connection.onRenameRequest((params: RenameParams): WorkspaceEdit | null => {
    const document = documents.get(params.textDocument.uri)
    if (!document) return null

    const parseResult = getParsedDocument(document)
    const daePosition: DaePosition = { line: params.position.line, character: params.position.character }

    // Try to find symbol at position first
    let symbol = findSymbolAtPosition(parseResult.symbols, daePosition)
    let symbolName: string | undefined

    if (symbol) {
      symbolName = symbol.name
    } else {
      // If not on a symbol definition, check if on a reference
      const reference = findReferenceAtPosition(parseResult.references, daePosition)
      if (reference) {
        symbolName = reference.name
        // Find the original symbol definition
        symbol = findSymbolByName(parseResult.symbols, reference.name, reference.kind)
      }
    }

    if (!symbolName) return null

    const edits: TextEdit[] = []

    // Add edit for symbol definition if found
    if (symbol) {
      edits.push(TextEdit.replace(toLspRange(symbol.nameRange), params.newName))
    }

    // Add edits for all references
    const references = findAllReferences(parseResult.references, symbolName)
    for (const ref of references) {
      edits.push(TextEdit.replace(toLspRange(ref.range), params.newName))
    }

    if (edits.length === 0) return null

    return {
      changes: {
        [params.textDocument.uri]: edits,
      },
    }
  })

  // Document formatting handler
  connection.onDocumentFormatting((params: DocumentFormattingParams) => {
    const document = documents.get(params.textDocument.uri)
    if (!document) return null

    const text = document.getText()
    const formatted = formatDocument(text, {
      tabSize: params.options.tabSize,
      insertSpaces: params.options.insertSpaces,
    })

    if (formatted === text) return null

    const lastChar = document.getText().length
    const fullRange = Range.create(Position.create(0, 0), document.positionAt(lastChar))

    return [TextEdit.replace(fullRange, formatted)]
  })

  // Semantic tokens handler
  connection.languages.semanticTokens.on((params: SemanticTokensParams) => {
    const document = documents.get(params.textDocument.uri)
    if (!document) {
      return { data: [] }
    }

    // TODO: Use parseResult for symbol-based semantic tokens in future
    // getParsedDocument(document) - available for enhanced semantic tokens
    const builder = new SemanticTokensBuilder()
    const text = document.getText()
    const lines = text.split('\n')

    interface TokenInfo {
      line: number
      char: number
      length: number
      tokenType: number
      tokenModifiers: number
    }

    const tokens: TokenInfo[] = []

    // Process each line
    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum]

      // Skip empty lines
      if (!line.trim()) continue

      // Comments
      if (line.trim().startsWith('#')) {
        const startChar = line.indexOf('#')
        tokens.push({
          line: lineNum,
          char: startChar,
          length: line.length - startChar,
          tokenType: tokenTypes.indexOf('comment'),
          tokenModifiers: 0,
        })
        continue
      }

      // Section headers
      const sectionMatch = line.match(/^(\s*)(global|subscription|node|dns|group|routing)\s*\{/)
      if (sectionMatch) {
        tokens.push({
          line: lineNum,
          char: sectionMatch[1].length,
          length: sectionMatch[2].length,
          tokenType: tokenTypes.indexOf('namespace'),
          tokenModifiers: 0,
        })
        continue
      }

      // Named definitions
      const namedDefMatch = line.match(/^(\s*)(\w[\w-]*)\s*:/)
      if (namedDefMatch) {
        tokens.push({
          line: lineNum,
          char: namedDefMatch[1].length,
          length: namedDefMatch[2].length,
          tokenType: tokenTypes.indexOf('variable'),
          tokenModifiers: 1, // declaration
        })
      }

      // Keywords in routing rules
      const keywordMatch = line.match(/^\s*(fallback)\s*:/)
      if (keywordMatch) {
        const startIdx = line.indexOf(keywordMatch[1])
        tokens.push({
          line: lineNum,
          char: startIdx,
          length: keywordMatch[1].length,
          tokenType: tokenTypes.indexOf('keyword'),
          tokenModifiers: 0,
        })
      }

      // Outbound targets
      const outboundMatch = line.match(/->\s*(direct|block|must_direct|must_rules|must_group|proxy|\w+)/)
      if (outboundMatch) {
        const startIdx = line.lastIndexOf(outboundMatch[1])
        const isBuiltin = OUTBOUNDS.includes(outboundMatch[1])
        tokens.push({
          line: lineNum,
          char: startIdx,
          length: outboundMatch[1].length,
          tokenType: tokenTypes.indexOf(isBuiltin ? 'keyword' : 'variable'),
          tokenModifiers: 0,
        })
      }

      // Process routing conditions
      processRoutingConditions(line, lineNum, tokens, tokenTypes)
    }

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

  // Document change handlers
  documents.onDidChangeContent((change: { document: TextDocument }) => {
    validateDocument(connection, change.document)
  })

  documents.onDidClose((event: { document: TextDocument }) => {
    parseCache.delete(event.document.uri)
    connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] })
  })

  // Start listening
  documents.listen(connection)
  connection.listen()

  connection.console.log('DAE Language Server started')
}

/**
 * Process routing conditions for semantic tokens
 */
function processRoutingConditions(
  line: string,
  lineNum: number,
  tokens: Array<{ line: number; char: number; length: number; tokenType: number; tokenModifiers: number }>,
  tokenTypes: string[],
): void {
  // Extract condition part (before ->)
  const arrowIdx = line.indexOf('->')
  if (arrowIdx === -1) return

  const condition = line.substring(0, arrowIdx)
  const offset = 0

  // Look for function calls
  const funcRegex =
    /\b(domain|dip|dport|sip|sport|pname|qname|qtype|l4proto|ipversion|mac|dscp|upstream|ip|must|tag|name|subtag)\s*\(/g
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
