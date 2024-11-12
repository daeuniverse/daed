import { useQuery } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'

import {
  QUERY_KEY_CONFIG,
  QUERY_KEY_DNS,
  QUERY_KEY_GENERAL,
  QUERY_KEY_GROUP,
  QUERY_KEY_NODE,
  QUERY_KEY_ROUTING,
  QUERY_KEY_STORAGE,
  QUERY_KEY_SUBSCRIPTION,
  QUERY_KEY_USER,
} from '~/constants'
import { useGQLQueryClient } from '~/contexts'
import { graphql } from '~/schemas/gql'

export const getModeRequest = (gqlClient: GraphQLClient) => {
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

export const getDefaultsRequest = (gqlClient: GraphQLClient) => {
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

export const getInterfacesRequest = (gqlClient: GraphQLClient) => {
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

export const useDefaultsQuery = () => {
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

export const useGeneralQuery = () => {
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

export const useNodesQuery = () => {
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

export const useSubscriptionsQuery = () => {
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

export const useConfigsQuery = () => {
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

export const useGroupsQuery = () => {
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
                id
                updatedAt
                tag
                link
                status
                info

                nodes {
                  edges {
                    id
                    link
                    name
                    address
                    protocol
                    tag
                    subscriptionID
                  }
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

export const useRoutingsQuery = () => {
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

export const useDNSsQuery = () => {
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

export const useUserQuery = () => {
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
