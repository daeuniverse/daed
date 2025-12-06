/**
 * RoutingA language formatter
 *
 * Platform-agnostic formatting functionality for the DAE configuration language.
 * Handles proper indentation, whitespace normalization, and code structure.
 */

export interface FormatOptions {
  tabSize: number
  insertSpaces: boolean
}

interface ParsedLine {
  content: string
  comment: string
  isBlank: boolean
  isBlockStart: boolean
  isBlockEnd: boolean
}

/**
 * Format RoutingA code
 */
export function formatDocument(text: string, options: FormatOptions): string {
  const { tabSize = 2, insertSpaces = true } = options
  const indent = insertSpaces ? ' '.repeat(tabSize) : '\t'

  const lines = text.split('\n')
  const parsedLines = lines.map((line) => parseLine(line))

  // Calculate proper indentation levels
  let currentIndent = 0
  const formattedLines: string[] = []

  for (const parsed of parsedLines) {
    // Skip consecutive blank lines (keep only one)
    if (parsed.isBlank) {
      const prevLine = formattedLines[formattedLines.length - 1]

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
    // Only add space before comment if there's content before it
    const commentPart = parsed.comment ? (formattedContent ? ` ${parsed.comment}` : parsed.comment) : ''
    formattedLines.push(`${indentStr}${formattedContent}${commentPart}`)

    // Increase indent after opening brace (if not also closing on same line)
    if (parsed.isBlockStart && !parsed.isBlockEnd) {
      currentIndent++
    }
  }

  // Remove trailing blank lines but ensure file ends with newline
  while (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] === '') {
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

  // Normalize spaces around operators
  let formatted = content

  // Normalize arrow operator spacing: ensure space before and after ->
  formatted = formatted.replace(/\s*->\s*/g, ' -> ')

  // Normalize && operator spacing
  formatted = formatted.replace(/\s*&&\s*/g, ' && ')

  // Normalize ! operator (no space after for unary)
  formatted = formatted.replace(/!\s+/g, '!')

  // Normalize comma spacing (space after, not before)
  formatted = formatted.replace(/\s*,\s*/g, ', ')

  // Normalize colon spacing in declarations (e.g., fallback: proxy)
  // But preserve colons in type prefixes like geosite:cn, geoip:private
  formatted = formatted.replace(/(\w+):\s+(\w+)/g, (_match, key: string, value: string) => {
    // Check if this is a type prefix (followed by value, not a block)
    const typeKeywords = ['geosite', 'geoip', 'full', 'contains', 'regexp', 'ext', 'keyword', 'regex']

    if (typeKeywords.includes(key.toLowerCase())) {
      return `${key}:${value}`
    }

    // For declarations like "fallback: proxy", keep space
    return `${key}: ${value}`
  })

  // Normalize parentheses spacing (no space inside)
  formatted = formatted.replace(/\(\s+/g, '(')
  formatted = formatted.replace(/\s+\)/g, ')')

  // Normalize brace spacing
  formatted = formatted.replace(/\{\s+/g, '{ ')
  formatted = formatted.replace(/\s+\}/g, ' }')

  // Collapse multiple spaces
  formatted = formatted.replace(/\s{2,}/g, ' ')

  // Trim any leading/trailing whitespace
  formatted = formatted.trim()

  return formatted
}
