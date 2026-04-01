import { describe, expect, it } from 'vitest'

import { findCommentStart, formatDocument, formatLineContent, parseLine } from '../src/formatter'

describe('findCommentStart', () => {
  it('should find # at the start of line', () => {
    expect(findCommentStart('# comment')).toBe(0)
  })

  it('should find # after content', () => {
    expect(findCommentStart('rule -> direct # inline')).toBe(15)
  })

  it('should return -1 when no comment', () => {
    expect(findCommentStart('rule -> direct')).toBe(-1)
  })

  it('should ignore # inside single quotes', () => {
    expect(findCommentStart("domain('example#test') -> direct")).toBe(-1)
  })

  it('should ignore # inside double quotes', () => {
    expect(findCommentStart('domain("example#test") -> direct')).toBe(-1)
  })

  it('should find # after closing quote', () => {
    expect(findCommentStart("domain('example') # note")).toBe(18)
  })

  it('should handle escaped quotes', () => {
    // \" does not close the string
    expect(findCommentStart('"escaped\\"still-in-string" # after')).toBe(27)
  })

  it('should return -1 for empty string', () => {
    expect(findCommentStart('')).toBe(-1)
  })
})

describe('parseLine', () => {
  it('should parse blank line', () => {
    const result = parseLine('')
    expect(result).toEqual({
      content: '',
      comment: '',
      isBlank: true,
      isBlockStart: false,
      isBlockEnd: false,
    })
  })

  it('should parse whitespace-only line as blank', () => {
    const result = parseLine('   \t  ')
    expect(result.isBlank).toBe(true)
  })

  it('should parse comment-only line', () => {
    const result = parseLine('  # this is a comment')
    expect(result.content).toBe('')
    expect(result.comment).toBe('# this is a comment')
    expect(result.isBlank).toBe(false)
  })

  it('should parse block start', () => {
    const result = parseLine('routing {')
    expect(result.content).toBe('routing {')
    expect(result.isBlockStart).toBe(true)
    expect(result.isBlockEnd).toBe(false)
  })

  it('should parse block end', () => {
    const result = parseLine('  }')
    expect(result.content).toBe('}')
    expect(result.isBlockStart).toBe(false)
    expect(result.isBlockEnd).toBe(true)
  })

  it('should parse line with both block start and end', () => {
    const result = parseLine('  group { }')
    expect(result.isBlockStart).toBe(true)
    expect(result.isBlockEnd).toBe(true)
  })

  it('should parse line with inline comment', () => {
    const result = parseLine('  fallback: proxy # the fallback')
    expect(result.content).toBe('fallback: proxy')
    expect(result.comment).toBe('# the fallback')
  })

  it('should trim content', () => {
    const result = parseLine('   dport(443)  ->  proxy   ')
    expect(result.content).toBe('dport(443)  ->  proxy')
  })
})

describe('formatLineContent', () => {
  it('should return empty string for empty input', () => {
    expect(formatLineContent('')).toBe('')
  })

  it('should collapse multiple spaces', () => {
    expect(formatLineContent('a     b')).toBe('a b')
  })

  it('should normalize arrow operator', () => {
    expect(formatLineContent('dport(443)->proxy')).toBe('dport(443) -> proxy')
    expect(formatLineContent('dport(443)  ->   proxy')).toBe('dport(443) -> proxy')
  })

  it('should normalize && operator', () => {
    expect(formatLineContent('a&&b')).toBe('a && b')
    expect(formatLineContent('a  &&  b')).toBe('a && b')
  })

  it('should normalize ! operator (no space after)', () => {
    expect(formatLineContent('! domain(x)')).toBe('!domain(x)')
  })

  it('should normalize comma spacing', () => {
    expect(formatLineContent('a,b,c')).toBe('a, b, c')
    expect(formatLineContent('a ,b , c')).toBe('a, b, c')
  })

  it('should normalize colon spacing in declarations', () => {
    expect(formatLineContent('fallback:  proxy')).toBe('fallback: proxy')
  })

  it('should preserve type-prefix colons without space', () => {
    expect(formatLineContent('geosite: cn')).toBe('geosite:cn')
    expect(formatLineContent('geoip: private')).toBe('geoip:private')
    expect(formatLineContent('full: example.com')).toBe('full:example.com')
    expect(formatLineContent('contains: test')).toBe('contains:test')
    expect(formatLineContent('regexp: pattern')).toBe('regexp:pattern')
    expect(formatLineContent('ext: file')).toBe('ext:file')
    expect(formatLineContent('keyword: match')).toBe('keyword:match')
    expect(formatLineContent('regex: pattern')).toBe('regex:pattern')
  })

  it('should normalize parentheses spacing', () => {
    expect(formatLineContent('func(  a  )')).toBe('func(a)')
  })

  it('should normalize brace spacing', () => {
    expect(formatLineContent('group {  items  }')).toBe('group { items }')
  })
})

describe('formatDocument', () => {
  it('should format empty document', () => {
    expect(formatDocument('')).toBe('\n')
  })

  it('should add trailing newline', () => {
    expect(formatDocument('routing {')).toBe('routing {\n')
  })

  it('should indent block content', () => {
    const input = `routing {
dport(443) -> proxy
}`
    const expected = `routing {
  dport(443) -> proxy
}\n`
    expect(formatDocument(input)).toBe(expected)
  })

  it('should handle nested blocks', () => {
    const input = `dns {
upstream {
alidns: 'udp://223.5.5.5:53'
}
}`
    const expected = `dns {
  upstream {
    alidns: 'udp://223.5.5.5:53'
  }
}\n`
    expect(formatDocument(input)).toBe(expected)
  })

  it('should collapse consecutive blank lines', () => {
    const input = `routing {


dport(443) -> proxy



dport(80) -> direct

}`
    const result = formatDocument(input)
    // Should not have consecutive blank lines
    expect(result).not.toContain('\n\n\n')
  })

  it('should remove trailing blank lines', () => {
    const input = `routing {
}


`
    const result = formatDocument(input)
    expect(result).toBe('routing {\n}\n')
  })

  it('should use tab indentation when insertSpaces is false', () => {
    const input = `routing {
dport(443) -> proxy
}`
    const result = formatDocument(input, { insertSpaces: false })
    expect(result).toBe('routing {\n\tdport(443) -> proxy\n}\n')
  })

  it('should respect custom tabSize', () => {
    const input = `routing {
dport(443) -> proxy
}`
    const result = formatDocument(input, { tabSize: 4 })
    expect(result).toBe('routing {\n    dport(443) -> proxy\n}\n')
  })

  it('should handle comment-only lines at correct indent', () => {
    const input = `routing {
# This is a comment
dport(443) -> proxy
}`
    const expected = `routing {
  # This is a comment
  dport(443) -> proxy
}\n`
    expect(formatDocument(input)).toBe(expected)
  })

  it('should handle inline comments', () => {
    const input = `routing {
dport(443) -> proxy # HTTPS traffic
}`
    const expected = `routing {
  dport(443) -> proxy # HTTPS traffic
}\n`
    expect(formatDocument(input)).toBe(expected)
  })

  it('should format a complete DAE config', () => {
    const input = `global {
tproxy_port:  12345
log_level:  warn
}

routing {
pname(NetworkManager)->direct
dport(443)&&!pname(curl)->proxy
fallback:  direct
}`
    const result = formatDocument(input)
    expect(result).toContain('  tproxy_port: 12345')
    expect(result).toContain('  log_level: warn')
    expect(result).toContain('  pname(NetworkManager) -> direct')
    expect(result).toContain('  dport(443) && !pname(curl) -> proxy')
    expect(result).toContain('  fallback: direct')
  })

  it('should not indent closing brace that also opens a new block', () => {
    // A line with both } and { should close then open
    const input = `dns {
upstream {
dns1: 'udp://1.1.1.1:53'
}
routing {
request {
dport(53) -> dns1
}
}
}`
    const result = formatDocument(input)
    const lines = result.split('\n')
    // Verify structure is properly indented
    expect(lines[0]).toBe('dns {')
    expect(lines[1]).toBe('  upstream {')
    expect(lines[2]).toBe("    dns1: 'udp://1.1.1.1:53'")
    expect(lines[3]).toBe('  }')
    expect(lines[4]).toBe('  routing {')
    expect(lines[5]).toBe('    request {')
    expect(lines[6]).toBe('      dport(53) -> dns1')
    expect(lines[7]).toBe('    }')
    expect(lines[8]).toBe('  }')
    expect(lines[9]).toBe('}')
  })
})
