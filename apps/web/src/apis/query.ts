import type { GQLClientInterface } from '~/contexts'
import { useQuery } from '@tanstack/react-query'

import {
  QUERY_KEY_CONFIG,
  QUERY_KEY_DNS,
  QUERY_KEY_GENERAL,
  QUERY_KEY_GROUP,
  QUERY_KEY_NODE_LATENCY,
  QUERY_KEY_NODE,
  QUERY_KEY_ROUTING,
  QUERY_KEY_STORAGE,
  QUERY_KEY_SUBSCRIPTION,
  QUERY_KEY_TRAFFIC,
  QUERY_KEY_USER,
} from '~/constants'
import { useGQLQueryClient } from '~/contexts'
import { graphql } from '~/schemas/gql'
import type { NodeLatencyProbeResult } from './mutation'

export function getModeRequest(gqlClient: GQLClientInterface) {
  return async () => {
    const { jsonStorage } = await gqlClient.request(
      graphql(`
        query Mode($paths: [String!]) {
          jsonStorage(paths: $paths)
        }
      `),
      {
        paths: ['mode'],
      },
    )

    return jsonStorage[0]
  }
}

export function getDefaultsRequest(gqlClient: GQLClientInterface) {
  return async () => {
    const data = await gqlClient.request(
      graphql(`
        query Defaults($paths: [String!]) {
          jsonStorage(paths: $paths)
        }
      `),
      {
        paths: ['defaultConfigID', 'defaultRoutingID', 'defaultDNSID', 'defaultGroupID'],
      },
    )

    const [defaultConfigID, defaultRoutingID, defaultDNSID, defaultGroupID] = data.jsonStorage

    return {
      defaultConfigID,
      defaultRoutingID,
      defaultDNSID,
      defaultGroupID,
    }
  }
}

export function getInterfacesRequest(gqlClient: GQLClientInterface) {
  return () =>
    gqlClient.request(
      graphql(`
        query Interfaces($up: Boolean) {
          general {
            interfaces(up: $up) {
              name
              ifindex
              ip
              flag {
                default {
                  gateway
                }
              }
            }
          }
        }
      `),
      {
        up: true,
      },
    )
}

export function useDefaultsQuery() {
  const gqlClient = useGQLQueryClient()

  const { data } = useQuery({
    queryKey: QUERY_KEY_STORAGE,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query JsonStorage($paths: [String!]) {
            jsonStorage(paths: $paths)
          }
        `),
        {
          paths: ['defaultConfigID', 'defaultRoutingID', 'defaultDNSID', 'defaultGroupID'],
        },
      ),
  })

  if (!data) {
    return
  }

  const [defaultConfigID, defaultRoutingID, defaultDNSID, defaultGroupID] = data.jsonStorage

  return {
    defaultConfigID,
    defaultRoutingID,
    defaultDNSID,
    defaultGroupID,
  }
}

export function useGeneralQuery() {
  const gqlClient = useGQLQueryClient()

  return useQuery({
    queryKey: QUERY_KEY_GENERAL,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query General($up: Boolean) {
            general {
              dae {
                running
                modified
                version
              }
              interfaces(up: $up) {
                name
                ifindex
                ip
                flag {
                  default {
                    gateway
                  }
                }
              }
            }
          }
        `),
        {
          up: true,
        },
      ),
  })
}

export interface TrafficOverviewQueryData {
  updatedAt: string
  uploadRate: number
  downloadRate: number
  uploadTotal: string
  downloadTotal: string
  activeConnections: number
  udpSessions: number
  samples: Array<{
    timestamp: string
    uploadRate: number
    downloadRate: number
  }>
}

export function useTrafficOverviewQuery(windowSec: number, maxPoints: number) {
  const gqlClient = useGQLQueryClient()
  const refetchInterval = Math.max(500, Math.min(5_000, Math.round(windowSec / 60) * 500))

  return useQuery({
    queryKey: [...QUERY_KEY_TRAFFIC, windowSec, maxPoints],
    queryFn: async () => {
      const data = await gqlClient.request<
        { general: { runtimeOverview: TrafficOverviewQueryData } },
        { windowSec: number; maxPoints: number }
      >(
        `
          query TrafficOverview($windowSec: Int!, $maxPoints: Int!) {
            general {
              runtimeOverview(windowSec: $windowSec, maxPoints: $maxPoints) {
                updatedAt
                uploadRate
                downloadRate
                uploadTotal
                downloadTotal
                activeConnections
                udpSessions
                samples {
                  timestamp
                  uploadRate
                  downloadRate
                }
              }
            }
          }
        `,
        {
          windowSec,
          maxPoints,
        },
      )

      return data.general.runtimeOverview
    },
    placeholderData: (previousData) => previousData,
    refetchInterval,
  })
}

export function useNodeLatenciesQuery(refetchIntervalMs: number) {
  const gqlClient = useGQLQueryClient()
  const safeInterval = Math.max(1_000, refetchIntervalMs)

  return useQuery({
    queryKey: QUERY_KEY_NODE_LATENCY,
    queryFn: async () => {
      const data = await gqlClient.request<{ nodeLatencies: NodeLatencyProbeResult[] }>(
        `
          query NodeLatencies {
            nodeLatencies {
              id
              latencyMs
              alive
              testedAt
              message
            }
          }
        `,
      )

      return data.nodeLatencies
    },
    placeholderData: (previousData) => previousData,
    refetchInterval: safeInterval,
    refetchIntervalInBackground: true,
  })
}

export function useNodesQuery() {
  const gqlClient = useGQLQueryClient()

  return useQuery({
    queryKey: QUERY_KEY_NODE,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Nodes {
            nodes {
              edges {
                id
                name
                link
                address
                protocol
                tag
              }
            }
          }
        `),
      ),
  })
}

export function useSubscriptionsQuery() {
  const gqlClient = useGQLQueryClient()

  return useQuery({
    queryKey: QUERY_KEY_SUBSCRIPTION,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Subscriptions {
            subscriptions {
              id
              tag
              status
              link
              info
              updatedAt
              cronExp
              cronEnable
              nodes {
                edges {
                  id
                  name
                  protocol
                  link
                }
              }
            }
          }
        `),
      ),
  })
}

export function useConfigsQuery() {
  const gqlClient = useGQLQueryClient()

  return useQuery({
    queryKey: QUERY_KEY_CONFIG,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Configs {
            configs {
              id
              name
              selected
              global {
                logLevel
                tproxyPort
                allowInsecure
                checkInterval
                checkTolerance
                lanInterface
                wanInterface
                udpCheckDns
                tcpCheckUrl
                fallbackResolver
                dialMode
                tcpCheckHttpMethod
                disableWaitingNetwork
                autoConfigKernelParameter
                sniffingTimeout
                tlsImplementation
                utlsImitate
                tproxyPortProtect
                soMarkFromDae
                pprofPort
                enableLocalTcpFastRedirect
                mptcp
                bandwidthMaxTx
                bandwidthMaxRx
              }
            }
          }
        `),
      ),
  })
}

export function useGroupsQuery() {
  const gqlClient = useGQLQueryClient()

  return useQuery({
    queryKey: QUERY_KEY_GROUP,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Groups {
            groups {
              id
              name
              nodes {
                id
                link
                name
                address
                protocol
                tag
                subscriptionID
              }
              subscriptions {
                nameFilterRegex
                matchedCount
                subscription {
                  id
                  updatedAt
                  tag
                  link
                  status
                  info
                }
                matchedNodes {
                  id
                  link
                  name
                  address
                  protocol
                  tag
                  subscriptionID
                }
              }
              policy
              policyParams {
                key
                val
              }
            }
          }
        `),
      ),
  })
}

export function useRoutingsQuery() {
  const gqlClient = useGQLQueryClient()

  return useQuery({
    queryKey: QUERY_KEY_ROUTING,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Routings {
            routings {
              id
              name
              selected
              routing {
                string
              }
            }
          }
        `),
      ),
  })
}

export function useDNSsQuery() {
  const gqlClient = useGQLQueryClient()

  return useQuery({
    queryKey: QUERY_KEY_DNS,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query DNSs {
            dnss {
              id
              name
              dns {
                string

                routing {
                  request {
                    string
                  }
                  response {
                    string
                  }
                }
              }
              selected
            }
          }
        `),
      ),
  })
}

export function useUserQuery() {
  const gqlClient = useGQLQueryClient()

  return useQuery({
    queryKey: QUERY_KEY_USER,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query User {
            user {
              username
              name
              avatar
            }
          }
        `),
      ),
  })
}
