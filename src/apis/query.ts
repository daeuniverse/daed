import { useQuery } from '@tanstack/react-query'
import request from 'graphql-request'

import {
  QUERY_KEY_CONFIG,
  QUERY_KEY_DNS,
  QUERY_KEY_GENERAL,
  QUERY_KEY_GROUP,
  QUERY_KEY_NODE,
  QUERY_KEY_ROUTING,
  QUERY_KEY_SUBSCRIPTION,
} from '~/constants'
import { useQGLQueryClient } from '~/contexts'
import { graphql } from '~/schemas/gql'

export const getJsonStorageRequest = (endpointURL: string, token: string) => {
  return (paths: string[]) =>
    request(
      endpointURL,
      graphql(`
        query JsonStorage($paths: [String!]) {
          jsonStorage(paths: $paths)
        }
      `),
      {
        paths,
      },
      {
        authorization: `Bearer ${token}`,
      }
    )
}

export const getInterfacesRequest = (endpointURL: string, token: string) => {
  return () =>
    request(
      endpointURL,
      graphql(`
        query Interfaces($up: Boolean) {
          general {
            interfaces(up: $up) {
              name
              ifindex
            }
          }
        }
      `),
      {
        up: true,
      },
      {
        authorization: `Bearer ${token}`,
      }
    )
}

export const useGeneralQuery = () => {
  const gqlClient = useQGLQueryClient()

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
              }
              interfaces(up: $up) {
                name
                ifindex
              }
            }
          }
        `),
        {
          up: true,
        }
      ),
  })
}

export const useNodesQuery = () => {
  const gqlClient = useQGLQueryClient()

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
        `)
      ),
  })
}

export const useSubscriptionsQuery = () => {
  const gqlClient = useQGLQueryClient()

  return useQuery({
    queryKey: QUERY_KEY_SUBSCRIPTION,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Subscriptions {
            subscriptions {
              id
              status
              link
              info
            }
          }
        `)
      ),
  })
}

export const useConfigsQuery = () => {
  const gqlClient = useQGLQueryClient()

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
              }
            }
          }
        `)
      ),
  })
}

export const useGroupsQuery = () => {
  const gqlClient = useQGLQueryClient()

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
        `)
      ),
  })
}

export const useRoutingsQuery = () => {
  const gqlClient = useQGLQueryClient()

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
        `)
      ),
  })
}

export const useDNSsQuery = () => {
  const gqlClient = useQGLQueryClient()

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
        `)
      ),
  })
}
