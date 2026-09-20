import { generateDNSConfig, parseDNSConfig } from './parser'

it.each(['request', 'response'])('round-trips a DNS URL fallback in %s routing', (direction) => {
  const config = `routing {\n  ${direction} {\n    fallback: udp://8.8.8.8:53\n  }\n}`

  expect(generateDNSConfig(parseDNSConfig(config))).toBe(config)
})
