import { describe, expect, it } from 'vitest'

import { generateAnytlsURL, generateHysteria2URL } from '../src/generator'

describe.each([
  { protocol: 'hysteria2', generate: generateHysteria2URL },
  { protocol: 'anytls', generate: generateAnytlsURL },
])('$protocol node names', ({ protocol, generate }) => {
  it.each(['my-node', 'node / #1'])('preserves the encoded fragment for %s', (hash) => {
    const params = { protocol, auth: 'secret', host: 'example.com', port: 443, params: {}, hash }

    expect(new URL(generate(params)).hash).toBe(`#${encodeURIComponent(hash)}`)
  })
})
