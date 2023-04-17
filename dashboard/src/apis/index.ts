import { graphql } from '@daed/schemas/gql'
import { GlobalInput, ImportArgument, Policy, PolicyParam } from '@daed/schemas/gql/graphql'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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

export const useSetJsonStorageMutation = () => {
  const gqlClient = useQGLQueryClient()

  return useMutation({
    mutationFn: (object: Record<string, string>) => {
      const paths = Object.keys(object)
      const values = paths.map((path) => object[path])

      return gqlClient.request(
        graphql(`
          mutation SetJsonStorage($paths: [String!]!, $values: [String!]!) {
            setJsonStorage(paths: $paths, values: $values)
          }
        `),
        {
          paths,
          values,
        }
      )
    },
  })
}

export const useCreateConfigMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, global }: { name?: string; global?: GlobalInput }) => {
      return gqlClient.request(
        graphql(`
          mutation CreateConfig($name: String, $global: globalInput) {
            createConfig(name: $name, global: $global) {
              id
            }
          }
        `),
        {
          name,
          global,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG })
    },
  })
}

export const useCreateRoutingMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, routing }: { name?: string; routing?: string }) => {
      return gqlClient.request(
        graphql(`
          mutation CreateRouting($name: String, $routing: String) {
            createRouting(name: $name, routing: $routing) {
              id
            }
          }
        `),
        {
          name,
          routing,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ROUTING })
    },
  })
}

export const useCreateDNSMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, dns }: { name?: string; dns?: string }) => {
      return gqlClient.request(
        graphql(`
          mutation CreateDNS($name: String, $dns: String) {
            createDns(name: $name, dns: $dns) {
              id
            }
          }
        `),
        {
          name,
          dns,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_DNS })
    },
  })
}

export const useCreateGroupMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, policy, policyParams }: { name: string; policy: Policy; policyParams: PolicyParam[] }) => {
      return gqlClient.request(
        graphql(`
          mutation CreateGroup($name: String!, $policy: Policy!, $policyParams: [PolicyParam!]) {
            createGroup(name: $name, policy: $policy, policyParams: $policyParams) {
              id
            }
          }
        `),
        {
          name,
          policy,
          policyParams,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
    },
  })
}

export const useImportNodesMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ImportArgument[]) => {
      return gqlClient.request(
        graphql(`
          mutation ImportNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {
            importNodes(rollbackError: $rollbackError, args: $args) {
              link
              error
            }
          }
        `),
        {
          rollbackError: true,
          args: data,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_NODE })
    },
  })
}

export const useImportSubscriptionsMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ImportArgument[]) =>
      Promise.all(
        data.map((subscription) =>
          gqlClient.request(
            graphql(`
              mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {
                importSubscription(rollbackError: $rollbackError, arg: $arg) {
                  link
                }
              }
            `),
            {
              rollbackError: true,
              arg: subscription,
            }
          )
        )
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_SUBSCRIPTION })
    },
  })
}
