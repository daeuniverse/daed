import { describe, expect, it } from 'vitest'

import {
  findAllReferences,
  findReferenceAtPosition,
  findSymbolAtPosition,
  findSymbolByName,
  getPositionContext,
  OUTBOUNDS,
  parseDocument,
  RULE_FUNCTIONS,
  SECTION_NAMES,
} from '../src/core/parser'

// ---------------------------------------------------------------------------
// parseDocument — symbols
// ---------------------------------------------------------------------------
describe('parseDocument — symbols', () => {
  it('should parse top-level sections', () => {
    const { symbols } = parseDocument(`global {
  tproxy_port: 12345
}

routing {
  dport(443) -> proxy
}`)
    expect(symbols).toHaveLength(2)
    expect(symbols[0].name).toBe('global')
    expect(symbols[0].kind).toBe('section')
    expect(symbols[1].name).toBe('routing')
    expect(symbols[1].kind).toBe('section')
  })

  it('should parse subscription definitions', () => {
    const { symbols } = parseDocument(`subscription {
  mysub: 'https://example.com/sub'
}`)
    expect(symbols[0].children).toHaveLength(1)
    expect(symbols[0].children![0].name).toBe('mysub')
    expect(symbols[0].children![0].kind).toBe('subscription')
  })

  it('should parse node definitions', () => {
    const { symbols } = parseDocument(`node {
  mynode: 'ss://...'
}`)
    expect(symbols[0].children).toHaveLength(1)
    expect(symbols[0].children![0].name).toBe('mynode')
    expect(symbols[0].children![0].kind).toBe('node')
  })

  it('should parse upstream definitions in dns', () => {
    const { symbols } = parseDocument(`dns {
  upstream {
    alidns: 'udp://223.5.5.5:53'
    googledns: 'tcp+udp://8.8.8.8:53'
  }
}`)
    const dns = symbols[0]
    expect(dns.name).toBe('dns')
    const upstream = dns.children![0]
    expect(upstream.name).toBe('upstream')
    expect(upstream.children).toHaveLength(2)
    expect(upstream.children![0].name).toBe('alidns')
    expect(upstream.children![0].kind).toBe('upstream')
  })

  it('should parse group definitions', () => {
    const { symbols } = parseDocument(`group {
  mygroup {
    filter: subtag(mysub)
  }
}`)
    const group = symbols[0]
    expect(group.children).toHaveLength(1)
    expect(group.children![0].name).toBe('mygroup')
    expect(group.children![0].kind).toBe('group')
  })

  it('should skip empty lines and comments', () => {
    const { symbols } = parseDocument(`# header comment

global {
  # inner comment
  tproxy_port: 12345
}`)
    expect(symbols).toHaveLength(1)
    expect(symbols[0].name).toBe('global')
  })
})

// ---------------------------------------------------------------------------
// parseDocument — references
// ---------------------------------------------------------------------------
describe('parseDocument — references', () => {
  it('should detect subtag references', () => {
    const { references } = parseDocument(`routing {
  dport(443) && subtag(mysub) -> proxy
}`)
    const subtagRefs = references.filter((r) => r.kind === 'subscription')
    expect(subtagRefs).toHaveLength(1)
    expect(subtagRefs[0].name).toBe('mysub')
  })

  it('should detect name() node references', () => {
    const { references } = parseDocument(`routing {
  name(mynode) -> proxy
}`)
    const nodeRefs = references.filter((r) => r.kind === 'node')
    expect(nodeRefs).toHaveLength(1)
    expect(nodeRefs[0].name).toBe('mynode')
  })

  it('should detect group references in outbound position', () => {
    const { references } = parseDocument(`routing {
  dport(443) -> mygroup
}`)
    const groupRefs = references.filter((r) => r.kind === 'group')
    expect(groupRefs).toHaveLength(1)
    expect(groupRefs[0].name).toBe('mygroup')
  })

  it('should not create references for built-in outbounds', () => {
    const input = OUTBOUNDS.map((o) => `  dport(443) -> ${o}`).join('\n')
    const { references } = parseDocument(`routing {\n${input}\n}`)
    // No group references since all are built-in
    const groupRefs = references.filter((r) => r.kind === 'group')
    expect(groupRefs).toHaveLength(0)
  })

  it('should detect upstream references in fallback (dns context)', () => {
    const { references } = parseDocument(`dns {
  upstream {
    alidns: 'udp://223.5.5.5:53'
  }
  routing {
    request {
      fallback: alidns
    }
  }
}`)
    const upstreamRefs = references.filter((r) => r.kind === 'upstream')
    expect(upstreamRefs.some((r) => r.name === 'alidns')).toBe(true)
  })

  it('should detect upstream function references in dns routing', () => {
    const { references } = parseDocument(`dns {
  upstream {
    alidns: 'udp://223.5.5.5:53'
  }
  routing {
    response {
      upstream(alidns) -> accept
    }
  }
}`)
    const upstreamRefs = references.filter((r) => r.kind === 'upstream')
    expect(upstreamRefs.some((r) => r.name === 'alidns')).toBe(true)
  })

  it('should detect multiple subtag args', () => {
    const { references } = parseDocument(`routing {
  subtag(sub1, sub2) -> proxy
}`)
    const subRefs = references.filter((r) => r.kind === 'subscription')
    expect(subRefs).toHaveLength(2)
    expect(subRefs[0].name).toBe('sub1')
    expect(subRefs[1].name).toBe('sub2')
  })
})

// ---------------------------------------------------------------------------
// parseDocument — diagnostics
// ---------------------------------------------------------------------------
describe('parseDocument — diagnostics', () => {
  it('should warn about undefined upstream in dns context', () => {
    const { diagnostics } = parseDocument(`dns {
  upstream {
    alidns: 'udp://223.5.5.5:53'
  }
  routing {
    request {
      fallback: nonexistent
    }
  }
}`)
    expect(diagnostics.some((d) => d.message.includes('nonexistent'))).toBe(true)
  })

  it('should not warn about group references (groups defined externally)', () => {
    const { diagnostics } = parseDocument(`routing {
  dport(443) -> some_group
}`)
    // group refs are skipped during validation
    expect(diagnostics).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// parseDocument — indexOf bug regression tests
// ---------------------------------------------------------------------------
describe('parseDocument — indexOf argument positioning (regression)', () => {
  it('should correctly position subtag arg when prefix contains the arg name', () => {
    // subtag(subtag) — the arg "subtag" appears in the prefix "subtag("
    // The old indexOf-based code would find position 0 instead of position 7
    const { references } = parseDocument(`routing {
  subtag(subtag) -> proxy
}`)
    const ref = references.find((r) => r.kind === 'subscription' && r.name === 'subtag')
    expect(ref).toBeDefined()
    // "subtag(subtag)" — arg starts at column of second "subtag" (inside parens)
    // The line is "  subtag(subtag) -> proxy", arg "subtag" inside parens starts at col 9
    const line = '  subtag(subtag) -> proxy'
    const argCol = line.indexOf('subtag(') + 'subtag('.length
    expect(ref!.range.start.character).toBe(argCol)
  })

  it('should correctly position name arg when prefix contains the arg name', () => {
    // name(name) — similar regression
    const { references } = parseDocument(`routing {
  name(name) -> proxy
}`)
    const ref = references.find((r) => r.kind === 'node' && r.name === 'name')
    expect(ref).toBeDefined()
    const line = '  name(name) -> proxy'
    const argCol = line.indexOf('name(') + 'name('.length
    expect(ref!.range.start.character).toBe(argCol)
  })

  it('should correctly position upstream() arg in dns context', () => {
    const { references } = parseDocument(`dns {
  upstream {
    myupstream: 'udp://1.1.1.1:53'
  }
  routing {
    response {
      upstream(myupstream) -> accept
    }
  }
}`)
    const ref = references.find((r) => r.kind === 'upstream' && r.name === 'myupstream')
    expect(ref).toBeDefined()
    const line = '      upstream(myupstream) -> accept'
    const argCol = line.indexOf('upstream(') + 'upstream('.length
    expect(ref!.range.start.character).toBe(argCol)
  })
})

// ---------------------------------------------------------------------------
// findSymbolAtPosition / findReferenceAtPosition / findSymbolByName
// ---------------------------------------------------------------------------
describe('findSymbolAtPosition', () => {
  it('should find symbol at its name position', () => {
    const { symbols } = parseDocument(`global {
  tproxy_port: 12345
}`)
    // "global" starts at col 0
    const found = findSymbolAtPosition(symbols, { line: 0, character: 2 })
    expect(found).toBeDefined()
    expect(found!.name).toBe('global')
  })

  it('should return undefined for position outside any symbol', () => {
    const { symbols } = parseDocument(`global {
  tproxy_port: 12345
}`)
    const found = findSymbolAtPosition(symbols, { line: 10, character: 0 })
    expect(found).toBeUndefined()
  })
})

describe('findReferenceAtPosition', () => {
  it('should find reference at its position', () => {
    const { references } = parseDocument(`routing {
  dport(443) -> mygroup
}`)
    const ref = references.find((r) => r.name === 'mygroup')!
    const found = findReferenceAtPosition(references, {
      line: ref.range.start.line,
      character: ref.range.start.character + 1,
    })
    expect(found).toBeDefined()
    expect(found!.name).toBe('mygroup')
  })
})

describe('findSymbolByName', () => {
  it('should find symbol by name', () => {
    const { symbols } = parseDocument(`subscription {
  mysub: 'https://example.com/sub'
}`)
    const found = findSymbolByName(symbols, 'mysub')
    expect(found).toBeDefined()
    expect(found!.kind).toBe('subscription')
  })

  it('should filter by kind', () => {
    const { symbols } = parseDocument(`subscription {
  test: 'url1'
}
node {
  test: 'url2'
}`)
    const sub = findSymbolByName(symbols, 'test', 'subscription')
    const node = findSymbolByName(symbols, 'test', 'node')
    expect(sub).toBeDefined()
    expect(sub!.kind).toBe('subscription')
    expect(node).toBeDefined()
    expect(node!.kind).toBe('node')
  })
})

describe('findAllReferences', () => {
  it('should find all references to a name', () => {
    const { references } = parseDocument(`routing {
  subtag(mysub) -> proxy
  subtag(mysub) && dport(443) -> direct
}`)
    const refs = findAllReferences(references, 'mysub')
    expect(refs).toHaveLength(2)
  })
})

// ---------------------------------------------------------------------------
// getPositionContext
// ---------------------------------------------------------------------------
describe('getPositionContext', () => {
  const doc = `global {
  tproxy_port: 12345
}

dns {
  upstream {
    alidns: 'udp://223.5.5.5:53'
  }
  routing {
    request {
      dport(53) -> alidns
    }
  }
}

routing {
  dport(443) -> proxy
}`

  it('should detect global section', () => {
    const ctx = getPositionContext(doc, { line: 1, character: 0 })
    expect(ctx.section).toBe('global')
    expect(ctx.isDnsContext).toBe(false)
    expect(ctx.isRoutingContext).toBe(false)
  })

  it('should detect dns section and context', () => {
    const ctx = getPositionContext(doc, { line: 6, character: 0 })
    expect(ctx.section).toBe('dns')
    expect(ctx.isDnsContext).toBe(true)
  })

  it('should detect routing subsection in dns', () => {
    // line 10 = "      dport(53) -> alidns" inside dns > routing > request
    const ctx = getPositionContext(doc, { line: 10, character: 0 })
    expect(ctx.section).toBe('dns')
    expect(ctx.isRoutingContext).toBe(true)
  })

  it('should detect top-level routing section', () => {
    // line 16 = "  dport(443) -> proxy" inside top-level routing
    const ctx = getPositionContext(doc, { line: 16, character: 0 })
    expect(ctx.section).toBe('routing')
    expect(ctx.isRoutingContext).toBe(true)
  })

  it('should return null section outside blocks', () => {
    const ctx = getPositionContext(doc, { line: 3, character: 0 })
    expect(ctx.section).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Constants sanity checks
// ---------------------------------------------------------------------------
describe('constants', () => {
  it('should export known section names', () => {
    expect(SECTION_NAMES).toContain('global')
    expect(SECTION_NAMES).toContain('routing')
    expect(SECTION_NAMES).toContain('dns')
  })

  it('should export known rule functions', () => {
    expect(RULE_FUNCTIONS).toContain('domain')
    expect(RULE_FUNCTIONS).toContain('subtag')
    expect(RULE_FUNCTIONS).toContain('name')
  })

  it('should export known outbounds', () => {
    expect(OUTBOUNDS).toContain('proxy')
    expect(OUTBOUNDS).toContain('direct')
    expect(OUTBOUNDS).toContain('block')
  })
})
