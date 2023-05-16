import { useQuery } from '@tanstack/react-query'
import request from 'graphql-request'

import { QUERY_KEY_NODE } from '~/constants'
import { useQGLQueryClient } from '~/contexts'
import { graphql } from '~/schemas/gql'

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
              }
            }
          }
        `)
      ),
  })
}

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
