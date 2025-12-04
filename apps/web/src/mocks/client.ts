/**
 * Mock GraphQL Client
 * Intercepts GraphQL requests and returns mock data in mock mode
 */

import type { RequestDocument, Variables } from 'graphql-request'
import {
  isMockMode,
  MOCK_DEFAULT_IDS,
  mockConfigs,
  mockDNSs,
  mockGeneral,
  mockGroups,
  mockJsonStorage,
  mockNodes,
  mockRoutings,
  mockSubscriptions,
  mockUser,
} from './data'

// Extract operation name from GraphQL query
function getOperationName(document: RequestDocument): string {
  if (typeof document === 'string') {
    const match = document.match(/(?:query|mutation)\s+(\w+)/)
    return match?.[1] ?? ''
  }

  // Handle TypedDocumentNode objects
  if (typeof document === 'object' && document !== null) {
    const doc = document as { definitions?: Array<{ name?: { value?: string } }> }
    const operationDef = doc.definitions?.[0]
    return operationDef?.name?.value ?? ''
  }

  return ''
}

// Mock response handlers mapped by operation name
const mockHandlers: Record<string, (variables?: Variables) => unknown> = {
  // Queries
  General: () => mockGeneral,
  Configs: () => mockConfigs,
  Nodes: () => mockNodes,
  Subscriptions: () => mockSubscriptions,
  Groups: () => mockGroups,
  Routings: () => mockRoutings,
  DNSs: () => mockDNSs,
  User: () => mockUser,
  JsonStorage: () => mockJsonStorage,
  Defaults: () => mockJsonStorage,
  Mode: () => ({ jsonStorage: ['rule'] }),
  Interfaces: () => ({
    general: {
      interfaces: mockGeneral.general.interfaces,
    },
  }),

  // Mutations - return success responses
  CreateConfig: () => ({ createConfig: { id: `config-${Date.now()}` } }),
  UpdateConfig: () => ({ updateConfig: { id: 'config-1' } }),
  RemoveConfig: () => ({ removeConfig: true }),
  SelectConfig: () => ({ selectConfig: true }),
  RenameConfig: () => ({ renameConfig: true }),

  CreateRouting: () => ({ createRouting: { id: `routing-${Date.now()}` } }),
  UpdateRouting: () => ({ updateRouting: { id: 'routing-1' } }),
  RemoveRouting: () => ({ removeRouting: true }),
  SelectRouting: () => ({ selectRouting: true }),
  RenameRouting: () => ({ renameRouting: true }),

  CreateDNS: () => ({ createDns: { id: `dns-${Date.now()}` } }),
  UpdateDNS: () => ({ updateDns: { id: 'dns-1' } }),
  RemoveDNS: () => ({ removeDns: true }),
  SelectDNS: () => ({ selectDns: true }),
  RenameDNS: () => ({ renameDns: true }),

  CreateGroup: () => ({ createGroup: { id: `group-${Date.now()}` } }),
  RemoveGroup: () => ({ removeGroup: true }),
  RenameGroup: () => ({ renameGroup: true }),
  GroupSetPolicy: () => ({ groupSetPolicy: true }),
  GroupAddNodes: () => ({ groupAddNodes: true }),
  GroupDelNodes: () => ({ groupDelNodes: true }),
  GroupAddSubscriptions: () => ({ groupAddSubscriptions: true }),
  GroupDelSubscriptions: () => ({ groupDelSubscriptions: true }),

  ImportNodes: () => ({
    importNodes: [{ link: 'vmess://xxx', error: null, node: { id: `node-${Date.now()}` } }],
  }),
  RemoveNodes: () => ({ removeNodes: true }),
  UpdateNode: () => ({
    updateNode: { id: 'node-1', name: 'Updated Node', tag: 'updated', link: 'vmess://xxx' },
  }),

  ImportSubscription: () => ({
    importSubscription: {
      link: 'https://example.com/sub',
      sub: { id: `sub-${Date.now()}` },
      nodeImportResult: [{ node: { id: `node-${Date.now()}` } }],
    },
  }),
  UpdateSubscription: () => ({ updateSubscription: { id: 'sub-1' } }),
  RemoveSubscriptions: () => ({ removeSubscriptions: true }),

  Run: () => ({ run: true }),
  SetJsonStorage: () => ({ setJsonStorage: true }),
  SetMode: () => ({ setJsonStorage: true }),

  UpdateAvatar: () => ({ updateAvatar: true }),
  UpdateName: () => ({ updateName: true }),
  UpdatePassword: () => ({ updatePassword: 'mock-token' }),
}

/**
 * Mock GraphQL Client class that mimics graphql-request's GraphQLClient
 */
export class MockGraphQLClient {
  url: string
  requestConfig: Record<string, unknown> = {}

  constructor(
    endpoint: string,
    _options?: { headers?: Record<string, string>; responseMiddleware?: (response: unknown) => void },
  ) {
    // Mock client stores endpoint for compatibility
    this.url = endpoint
  }

  // Mock rawRequest to match GraphQLClient interface
  async rawRequest<T>(): Promise<{ data: T; extensions?: unknown; headers: Headers; status: number }> {
    throw new Error('rawRequest not implemented in mock client')
  }

  // Mock batchRequests to match GraphQLClient interface
  async batchRequests(): Promise<unknown[]> {
    throw new Error('batchRequests not implemented in mock client')
  }

  // Mock setEndpoint to match GraphQLClient interface
  setEndpoint(value: string): this {
    this.url = value
    return this
  }

  // Mock setHeader to match GraphQLClient interface
  setHeader(_key: string, _value: string): this {
    return this
  }

  // Mock setHeaders to match GraphQLClient interface
  setHeaders(_headers: Record<string, string>): this {
    return this
  }

  async request<T>(document: RequestDocument, variables?: Variables): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const operationName = getOperationName(document)
    const handler = mockHandlers[operationName]

    if (handler) {
      return handler(variables) as T
    }

    // Default response for unknown operations
    console.warn(`[Mock] Unknown operation: ${operationName}`)
    return { message: 'OK' } as T
  }
}

/**
 * Create a GraphQL client - returns mock client in mock mode
 */
export function createGraphQLClient(
  endpoint: string,
  options?: { headers?: Record<string, string>; responseMiddleware?: (response: unknown) => void },
) {
  if (isMockMode()) {
    return new MockGraphQLClient(endpoint, options)
  }

  // Import real GraphQLClient only when not in mock mode
  // This is handled by the caller (contexts/index.tsx)
  throw new Error('createGraphQLClient should only be called in mock mode')
}

// Export for use in detecting mock mode
export { isMockMode, MOCK_DEFAULT_IDS }
