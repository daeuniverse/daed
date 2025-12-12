import type { DNSConfig, RoutingRule, Upstream } from './types'

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5)

function extractBlock(source: string, blockName: string) {
  const startRegex = new RegExp(`${blockName}\\s*{`, 'm')
  const match = source.match(startRegex)
  if (!match || match.index == null) {
    return
  }

  const startIndex = match.index + match[0].length
  let depth = 1
  let i = startIndex
  for (; i < source.length; i++) {
    const ch = source[i]
    if (ch === '{') depth++
    else if (ch === '}') depth--
    if (depth === 0) break
  }

  if (depth !== 0) return

  return {
    inner: source.slice(startIndex, i).trim(),
    full: source.slice(match.index, i + 1),
  }
}

export function parseDNSConfig(config: string): DNSConfig {
  const upstreams: Upstream[] = []
  const requestRules: RoutingRule[] = []
  const responseRules: RoutingRule[] = []

  // Clean up content
  let content = config.trim()
  let others = content

  // Try to remove outer "dns { ... }" block if it exists
  // Simple check: starts with "dns" and has braces
  const dnsBlockRegex = /^dns\s*\{([\s\S]*?)\}$/
  const dnsMatch = content.match(dnsBlockRegex)
  if (dnsMatch) {
    content = dnsMatch[1].trim()
    others = content
  }

  // 1. Extract Upstream block (brace-matched to allow nested/complex content)
  const upstreamBlock = extractBlock(content, 'upstream')

  if (upstreamBlock) {
    const upstreamContent = upstreamBlock.inner
    const lines = upstreamContent.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      // name: 'link' | name: "link" | name: link
      // Allow upstream names with -, ., _
      const match = trimmed.match(/^([\w.-]+):\s*(?:'([^']+)'|"([^"]+)"|([^#\s]+))/)
      if (match) {
        const link = match[2] || match[3] || match[4]
        if (link) {
          upstreams.push({
            id: generateId(),
            name: match[1],
            link,
          })
        }
      }
    }
    // Remove upstream block from others
    others = others.replace(upstreamBlock.full, '')
  }

  // 2. Extract Routing block (brace-matched)
  const routingBlock = extractBlock(content, 'routing')

  if (routingBlock) {
    const routingContent = routingBlock.inner
    const requestBlock = extractBlock(routingContent, 'request')
    const responseBlock = extractBlock(routingContent, 'response')

    if (requestBlock) {
      const requestContent = requestBlock.inner
      const lines = requestContent.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue

        // fallback: upstream
        if (trimmed.startsWith('fallback:')) {
          const target = trimmed.split(':')[1].trim()
          requestRules.push({
            id: generateId(),
            matcher: 'fallback',
            target,
          })
          continue
        }

        // matcher -> target
        const arrowParts = trimmed.split('->')
        if (arrowParts.length === 2) {
          requestRules.push({
            id: generateId(),
            matcher: arrowParts[0].trim(),
            target: arrowParts[1].trim(),
          })
        }
      }
    }

    if (responseBlock) {
      const responseContent = responseBlock.inner
      const lines = responseContent.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue

        // fallback: upstream
        if (trimmed.startsWith('fallback:')) {
          const target = trimmed.split(':')[1].trim()
          responseRules.push({
            id: generateId(),
            matcher: 'fallback',
            target,
          })
          continue
        }

        // matcher -> target
        const arrowParts = trimmed.split('->')
        if (arrowParts.length === 2) {
          responseRules.push({
            id: generateId(),
            matcher: arrowParts[0].trim(),
            target: arrowParts[1].trim(),
          })
        }
      }
    }

    // Remove routing block from others
    others = others.replace(routingBlock.full, '')
  }

  return { upstreams, requestRules, responseRules, others: others.trim() }
}

export function generateDNSConfig(config: DNSConfig): string {
  let result = ''

  // Others (global settings/comments)
  if (config.others) {
    result += `${config.others.trim()}\n\n`
  }

  // Upstreams
  if (config.upstreams.length > 0) {
    result += 'upstream {\n'
    for (const u of config.upstreams) {
      result += `  ${u.name}: '${u.link}'\n`
    }
    result += '}\n\n'
  }

  // Routing
  if (config.requestRules.length > 0 || config.responseRules.length > 0) {
    result += 'routing {\n'

    if (config.requestRules.length > 0) {
      result += '  request {\n'
      for (const r of config.requestRules) {
        if (r.matcher === 'fallback') {
          result += `    fallback: ${r.target}\n`
        } else {
          result += `    ${r.matcher} -> ${r.target}\n`
        }
      }
      result += '  }\n'
    }

    if (config.responseRules.length > 0) {
      result += '  response {\n'
      for (const r of config.responseRules) {
        if (r.matcher === 'fallback') {
          result += `    fallback: ${r.target}\n`
        } else {
          result += `    ${r.matcher} -> ${r.target}\n`
        }
      }
      result += '  }\n'
    }

    result += '}\n'
  }

  return result.trimEnd()
}
