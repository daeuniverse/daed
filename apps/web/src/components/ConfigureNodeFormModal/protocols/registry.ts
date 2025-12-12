import type { ProtocolConfig, ProtocolRegistry } from './types'

import {
  anytlsProtocol,
  hysteria2Protocol,
  juicityProtocol,
  ssProtocol,
  ssrProtocol,
  trojanProtocol,
  tuicProtocol,
  v2rayProtocol,
} from './complex'
import { httpProtocol, socks5Protocol } from './simple'

/**
 * Creates a protocol registry with all supported protocols
 */
function createProtocolRegistry(): ProtocolRegistry {
  const protocols: ProtocolConfig[] = []
  const protocolMap = new Map<string, ProtocolConfig>()

  const registry: ProtocolRegistry = {
    protocols,

    getProtocol(id: string) {
      return protocolMap.get(id)
    },

    register(config: ProtocolConfig) {
      // Avoid duplicates
      if (protocolMap.has(config.id)) {
        console.warn(`Protocol "${config.id}" is already registered, skipping.`)
        return
      }

      protocols.push(config)
      protocolMap.set(config.id, config)
    },
  }

  return registry
}

// Create the global protocol registry
export const protocolRegistry = createProtocolRegistry()

// Register all built-in protocols in order
// Type casting through unknown to handle generic variance
protocolRegistry.register(v2rayProtocol as unknown as ProtocolConfig)
protocolRegistry.register(ssProtocol as unknown as ProtocolConfig)
protocolRegistry.register(ssrProtocol as unknown as ProtocolConfig)
protocolRegistry.register(trojanProtocol as unknown as ProtocolConfig)
protocolRegistry.register(juicityProtocol as unknown as ProtocolConfig)
protocolRegistry.register(hysteria2Protocol as unknown as ProtocolConfig)
protocolRegistry.register(anytlsProtocol as unknown as ProtocolConfig)
protocolRegistry.register(tuicProtocol as unknown as ProtocolConfig)
protocolRegistry.register(httpProtocol as unknown as ProtocolConfig)
protocolRegistry.register(socks5Protocol as unknown as ProtocolConfig)

/**
 * Get all registered protocols
 */
export function getProtocols(): ProtocolConfig[] {
  return protocolRegistry.protocols
}

/**
 * Get a specific protocol by ID
 */
export function getProtocol(id: string): ProtocolConfig | undefined {
  return protocolRegistry.getProtocol(id)
}

/**
 * Register a new protocol
 * This can be used to add custom protocols at runtime
 */
export function registerProtocol(config: ProtocolConfig): void {
  protocolRegistry.register(config)
}
