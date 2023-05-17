import { useQuery } from '@tanstack/react-query'
import request from 'graphql-request'

import {
  QUERY_KEY_CONFIG,
  QUERY_KEY_DNS,
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
        query General($up: Boolean) {
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
                tproxyPort
                logLevel
                tcpCheckUrl
                udpCheckDns
                checkInterval
                checkTolerance
                dnsUpstream
                lanInterface
                lanNatDirect
                wanInterface
                allowInsecure
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
