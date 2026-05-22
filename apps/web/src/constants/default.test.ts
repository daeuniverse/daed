import type { GlobalInput } from '~/schemas/gql/graphql'

beforeAll(() => {
  vi.stubGlobal('location', {
    protocol: 'http:',
    hostname: 'localhost',
  })
})

afterAll(() => {
  vi.unstubAllGlobals()
})

it('uses DEFAULT_BOOTSTRAP_RESOLVER in default global config', async () => {
  const { DEFAULT_CONFIG_WITH_LAN_INTERFACEs, DEFAULT_BOOTSTRAP_RESOLVER } = await import('./default')

  expect(DEFAULT_CONFIG_WITH_LAN_INTERFACEs([]).bootstrapResolver).toBe(DEFAULT_BOOTSTRAP_RESOLVER)
})

it('keeps bootstrapResolver as string in mock config globals', async () => {
  const { mockConfigs } = await import('~/mocks/data')

  for (const config of mockConfigs.configs) {
    expect(typeof config.global.bootstrapResolver).toBe('string')
  }
})

it('allows bootstrapResolver in typed GlobalInput payloads', () => {
  const payload: GlobalInput = {
    bootstrapResolver: 'https://8.8.8.8/dns-query',
  }

  expect(payload.bootstrapResolver).toBe('https://8.8.8.8/dns-query')
})
