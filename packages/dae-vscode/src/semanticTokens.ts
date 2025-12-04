/**
 * Semantic tokens provider for dae language
 *
 * Provides semantic highlighting based on parsed symbols
 */

import type { DocumentParser } from './parser'
import * as vscode from 'vscode'
import { OUTBOUNDS, RULE_FUNCTIONS, SECTION_NAMES } from './parser'

// Define semantic token types
const TOKEN_TYPES = [
  'namespace', // Section names (global, dns, routing)
  'class', // Group/subscription/node definitions
  'function', // Rule functions (dip, domain, pname)
  'type', // Type prefixes (geosite, geoip)
  'variable', // References to groups/nodes
  'keyword', // Keywords (fallback, policy, filter)
  'string', // String values
  'number', // Numeric values
  'operator', // Operators (->)
  'comment', // Comments
  'parameter', // Parameters in global section
]

// Define semantic token modifiers
const TOKEN_MODIFIERS = ['declaration', 'definition', 'readonly', 'deprecated']

export const SEMANTIC_TOKENS_LEGEND = new vscode.SemanticTokensLegend(TOKEN_TYPES, TOKEN_MODIFIERS)

interface TokenInfo {
  line: number
  char: number
  length: number
  tokenType: number
  tokenModifiers: number
}

export class DaeSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
  constructor(private parser: DocumentParser) {}

  provideDocumentSemanticTokens(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.SemanticTokens> {
    this.parser.parse(document)
    const tokens: TokenInfo[] = []
    const text = document.getText()
    const lines = text.split('\n')

    // Process each line for semantic tokens
    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum]
      const trimmed = line.trim()

      // Skip empty lines
      if (trimmed === '') continue

      // Handle comments
      const commentIndex = findCommentIndex(line)
      if (commentIndex === 0) {
        // Entire line is a comment
        tokens.push({
          line: lineNum,
          char: line.indexOf('#'),
          length: line.length - line.indexOf('#'),
          tokenType: TOKEN_TYPES.indexOf('comment'),
          tokenModifiers: 0,
        })
        continue
      }

      // Parse the non-comment part
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
            tokenType: TOKEN_TYPES.indexOf('namespace'),
            tokenModifiers: 0,
          })
        } else {
          // Group or other block definition
          tokens.push({
            line: lineNum,
            char: start,
            length: name.length,
            tokenType: TOKEN_TYPES.indexOf('class'),
            tokenModifiers: 1, // declaration
          })
        }
      }

      // Check for key: value pairs using indexOf instead of regex
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
              tokenType: TOKEN_TYPES.indexOf('keyword'),
              tokenModifiers: 0,
            })
          } else {
            tokens.push({
              line: lineNum,
              char: keyStart,
              length: key.length,
              tokenType: TOKEN_TYPES.indexOf('parameter'),
              tokenModifiers: 0,
            })
          }

          // Parse value for functions and references
          const valueStart =
            colonIndex +
            1 +
            (content.substring(colonIndex + 1).length - content.substring(colonIndex + 1).trimStart().length)
          this.parseValueTokens(value, lineNum, valueStart, tokens)
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
          const conditionStart = indent.length
          const arrowStart = content.indexOf('->')
          const outboundStart = content.lastIndexOf(outbound)

          // Parse condition for functions
          this.parseConditionTokens(condition, lineNum, conditionStart, tokens)

          // Arrow operator
          tokens.push({
            line: lineNum,
            char: arrowStart,
            length: 2,
            tokenType: TOKEN_TYPES.indexOf('operator'),
            tokenModifiers: 0,
          })

          // Outbound
          if (OUTBOUNDS.includes(outbound)) {
            tokens.push({
              line: lineNum,
              char: outboundStart,
              length: outbound.length,
              tokenType: TOKEN_TYPES.indexOf('keyword'),
              tokenModifiers: 0,
            })
          } else {
            tokens.push({
              line: lineNum,
              char: outboundStart,
              length: outbound.length,
              tokenType: TOKEN_TYPES.indexOf('variable'),
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
          tokenType: TOKEN_TYPES.indexOf('comment'),
          tokenModifiers: 0,
        })
      }
    }

    // Sort tokens and build the result
    tokens.sort((a, b) => {
      if (a.line !== b.line) return a.line - b.line
      return a.char - b.char
    })

    const builder = new vscode.SemanticTokensBuilder(SEMANTIC_TOKENS_LEGEND)
    for (const token of tokens) {
      builder.push(token.line, token.char, token.length, token.tokenType, token.tokenModifiers)
    }

    return builder.build()
  }

  /**
   * Parse value part for tokens
   */
  private parseValueTokens(value: string, lineNum: number, offset: number, tokens: TokenInfo[]): void {
    // Look for function calls
    const funcRegex = new RegExp(`\\b(${RULE_FUNCTIONS.join('|')})\\s*\\(`, 'g')
    let match = funcRegex.exec(value)
    while (match !== null) {
      tokens.push({
        line: lineNum,
        char: offset + match.index,
        length: match[1].length,
        tokenType: TOKEN_TYPES.indexOf('function'),
        tokenModifiers: 0,
      })
      match = funcRegex.exec(value)
    }

    // Look for type prefixes
    const typeRegex = /(geosite|geoip|full|contains|regexp|ext):/g
    match = typeRegex.exec(value)
    while (match !== null) {
      tokens.push({
        line: lineNum,
        char: offset + match.index,
        length: match[1].length,
        tokenType: TOKEN_TYPES.indexOf('type'),
        tokenModifiers: 0,
      })
      match = typeRegex.exec(value)
    }
  }

  /**
   * Parse condition part of routing rules for tokens
   */
  private parseConditionTokens(condition: string, lineNum: number, offset: number, tokens: TokenInfo[]): void {
    // Look for function calls
    const funcRegex = new RegExp(`\\b(${RULE_FUNCTIONS.join('|')})\\s*\\(`, 'g')
    let match = funcRegex.exec(condition)
    while (match !== null) {
      tokens.push({
        line: lineNum,
        char: offset + match.index,
        length: match[1].length,
        tokenType: TOKEN_TYPES.indexOf('function'),
        tokenModifiers: 0,
      })
      match = funcRegex.exec(condition)
    }

    // Look for type prefixes
    const typeRegex = /(geosite|geoip|full|contains|regexp|ext):/g
    match = typeRegex.exec(condition)
    while (match !== null) {
      tokens.push({
        line: lineNum,
        char: offset + match.index,
        length: match[1].length,
        tokenType: TOKEN_TYPES.indexOf('type'),
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
        tokenType: TOKEN_TYPES.indexOf('operator'),
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
        tokenType: TOKEN_TYPES.indexOf('operator'),
        tokenModifiers: 0,
      })
      match = notRegex.exec(condition)
    }
  }
}

/**
 * Find comment start index (# not inside quotes)
 */
function findCommentIndex(line: string): number {
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
