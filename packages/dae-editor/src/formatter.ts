/**
 * RoutingA language formatter
 *
 * This module provides formatting functionality for the RoutingA DSL used in dae.
 * It handles proper indentation, whitespace normalization, and code structure.
 */

// Pre-compiled regexes (eslint e18e/prefer-static-regex)
const RE_MULTI_SPACE = /\s{2,}/g
const RE_ARROW = / ?-> ?/g
const RE_AND = / ?&& ?/g
const RE_NOT = /! /g
const RE_COMMA = / ?, ?/g
const RE_COLON_DECL = /(\w+):\s+(\w+)/g
const RE_PAREN_OPEN = /\(\s+/g
const RE_PAREN_CLOSE = /\s+\)/g
const RE_BRACE_OPEN = /\{\s+/g
const RE_BRACE_CLOSE = /\s+\}/g

export interface FormatOptions {
  tabSize?: number
  insertSpaces?: boolean
}

interface ParsedLine {
  indent: number
  content: string
  comment: string
  isBlank: boolean
  isBlockStart: boolean
  isBlockEnd: boolean
}

/**
 * Format RoutingA code
 * @param text - The raw RoutingA code
 * @param options - Formatting options
 * @returns Formatted code
 */
export function formatRoutingA(text: string, options: FormatOptions = {}): string {
  const { tabSize = 2, insertSpaces = true } = options
  const indent = insertSpaces ? ' '.repeat(tabSize) : '\t'

  const lines = text.split('\n')
  const parsedLines = lines.map((line) => parseLine(line))

  // Calculate proper indentation levels
  let currentIndent = 0
  const formattedLines: string[] = []

  for (let i = 0; i < parsedLines.length; i++) {
    const parsed = parsedLines[i]

    // Skip consecutive blank lines (keep only one)
    if (parsed.isBlank) {
      const prevLine = formattedLines.at(-1)
      if (prevLine === '' || prevLine === undefined) {
        continue
      }
      formattedLines.push('')
      continue
    }

    // Decrease indent before closing brace
    if (parsed.isBlockEnd && !parsed.isBlockStart) {
      currentIndent = Math.max(0, currentIndent - 1)
    }

    // Format the line with proper indentation
    const indentStr = indent.repeat(currentIndent)
    const formattedContent = formatLineContent(parsed.content)
    const commentPart = parsed.comment ? ` ${parsed.comment}` : ''
    formattedLines.push(`${indentStr}${formattedContent}${commentPart}`)

    // Increase indent after opening brace (if not also closing on same line)
    if (parsed.isBlockStart && !parsed.isBlockEnd) {
      currentIndent++
    }
  }

  // Remove trailing blank lines but ensure file ends with newline
  while (formattedLines.length > 0 && formattedLines.at(-1) === '') {
    formattedLines.pop()
  }

  return `${formattedLines.join('\n')}\n`
}

/**
 * Parse a single line into its components
 */
function parseLine(line: string): ParsedLine {
  const trimmed = line.trim()

  // Check for blank lines
  if (trimmed === '') {
    return {
      indent: 0,
      content: '',
      comment: '',
      isBlank: true,
      isBlockStart: false,
      isBlockEnd: false,
    }
  }

  // Extract comment if present
  let content = trimmed
  let comment = ''

  // Handle comments - find # that's not inside quotes
  const commentIndex = findCommentStart(trimmed)
  if (commentIndex !== -1) {
    content = trimmed.slice(0, commentIndex).trim()
    comment = trimmed.slice(commentIndex).trim()
  }

  // Check for block markers
  const isBlockStart = content.includes('{')
  const isBlockEnd = content.includes('}')

  return {
    indent: 0, // Will be calculated during formatting
    content,
    comment,
    isBlank: false,
    isBlockStart,
    isBlockEnd,
  }
}

/**
 * Find the start of a comment (# not inside quotes)
 */
function findCommentStart(line: string): number {
  let inSingleQuote = false
  let inDoubleQuote = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const prevChar = i > 0 ? line[i - 1] : ''

    // Handle escape sequences
    if (prevChar === '\\') {
      continue
    }

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
 * Format the content of a line (normalize spacing)
 */
function formatLineContent(content: string): string {
  if (!content) return ''

  // Collapse multiple spaces first so subsequent patterns only need to handle
  // zero-or-one space. This avoids O(n²) backtracking with \s* quantifiers
  // (polynomial ReDoS — see CodeQL js/polynomial-redos).
  let formatted = content.replace(RE_MULTI_SPACE, ' ')

  // Normalize arrow operator spacing: ensure space before and after ->
  formatted = formatted.replace(RE_ARROW, ' -> ')

  // Normalize && operator spacing
  formatted = formatted.replace(RE_AND, ' && ')

  // Normalize ! operator (no space after for unary)
  formatted = formatted.replace(RE_NOT, '!')

  // Normalize comma spacing (space after, not before)
  formatted = formatted.replace(RE_COMMA, ', ')

  // Normalize colon spacing in declarations (e.g., fallback: proxy)
  // But preserve colons in type prefixes like geosite:cn, geoip:private
  formatted = formatted.replace(RE_COLON_DECL, (_match, key, value) => {
    // Check if this is a type prefix (followed by value, not a block)
    const typeKeywords = ['geosite', 'geoip', 'full', 'contains', 'regexp', 'ext']
    if (typeKeywords.includes(key.toLowerCase())) {
      return `${key}:${value}`
    }
    // For declarations like "fallback: proxy", keep space
    return `${key}: ${value}`
  })

  // Normalize parentheses spacing (no space inside)
  formatted = formatted.replace(RE_PAREN_OPEN, '(')
  formatted = formatted.replace(RE_PAREN_CLOSE, ')')

  // Normalize brace spacing
  formatted = formatted.replace(RE_BRACE_OPEN, '{ ')
  formatted = formatted.replace(RE_BRACE_CLOSE, ' }')

  // Trim any leading/trailing whitespace
  formatted = formatted.trim()

  return formatted
}
