import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  QUERY_KEY_CONFIG,
  QUERY_KEY_DNS,
  QUERY_KEY_GENERAL,
  QUERY_KEY_GROUP,
  QUERY_KEY_NODE,
  QUERY_KEY_ROUTING,
  QUERY_KEY_SUBSCRIPTION,
  QUERY_KEY_USER,
} from '~/constants'
import { useQGLQueryClient } from '~/contexts'
import { graphql } from '~/schemas/gql'
import { GlobalInput, ImportArgument, Policy, PolicyParam } from '~/schemas/gql/graphql'

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

export const useRemoveConfigMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation RemoveConfig($id: ID!) {
            removeConfig(id: $id)
          }
        `),
        {
          id,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG })
    },
  })
}

export const useSelectConfigMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return gqlClient.request(
        graphql(`
          mutation SelectConfig($id: ID!) {
            selectConfig(id: $id)
          }
        `),
        {
          id,
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

export const useRemoveRoutingMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation RemoveRouting($id: ID!) {
            removeRouting(id: $id)
          }
        `),
        {
          id,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ROUTING })
    },
  })
}

export const useSelectRoutingMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return gqlClient.request(
        graphql(`
          mutation SelectRouting($id: ID!) {
            selectRouting(id: $id)
          }
        `),
        {
          id,
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

export const useRemoveDNSMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation RemoveDNS($id: ID!) {
            removeDns(id: $id)
          }
        `),
        {
          id,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_DNS })
    },
  })
}

export const useSelectDNSMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return gqlClient.request(
        graphql(`
          mutation SelectDNS($id: ID!) {
            selectDns(id: $id)
          }
        `),
        {
          id,
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

export const useRemoveGroupMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      return gqlClient.request(
        graphql(`
          mutation RemoveGroup($id: ID!) {
            removeGroup(id: $id)
          }
        `),
        {
          id,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
    },
  })
}

export const useGroupAddNodesMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, nodeIDs }: { id: string; nodeIDs: string[] }) => {
      return gqlClient.request(
        graphql(`
          mutation GroupAddNodes($id: ID!, $nodeIDs: [ID!]!) {
            groupAddNodes(id: $id, nodeIDs: $nodeIDs)
          }
        `),
        {
          id,
          nodeIDs,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
    },
  })
}

export const useGroupDelNodesMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, nodeIDs }: { id: string; nodeIDs: string[] }) => {
      return gqlClient.request(
        graphql(`
          mutation GroupDelNodes($id: ID!, $nodeIDs: [ID!]!) {
            groupDelNodes(id: $id, nodeIDs: $nodeIDs)
          }
        `),
        {
          id,
          nodeIDs,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
    },
  })
}

export const useGroupAddSubscriptionsMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, subscriptionIDs }: { id: string; subscriptionIDs: string[] }) => {
      return gqlClient.request(
        graphql(`
          mutation GroupAddSubscriptions($id: ID!, $subscriptionIDs: [ID!]!) {
            groupAddSubscriptions(id: $id, subscriptionIDs: $subscriptionIDs)
          }
        `),
        {
          id,
          subscriptionIDs,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
    },
  })
}

export const useGroupDelSubscriptionsMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, subscriptionIDs }: { id: string; subscriptionIDs: string[] }) => {
      return gqlClient.request(
        graphql(`
          mutation GroupDelSubscriptions($id: ID!, $subscriptionIDs: [ID!]!) {
            groupDelSubscriptions(id: $id, subscriptionIDs: $subscriptionIDs)
          }
        `),
        {
          id,
          subscriptionIDs,
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
              node {
                id
              }
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

export const useRemoveNodesMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => {
      return gqlClient.request(
        graphql(`
          mutation RemoveNodes($ids: [ID!]!) {
            removeNodes(ids: $ids)
          }
        `),
        {
          ids,
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
                  nodeImportResult {
                    node {
                      id
                    }
                  }
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

export const useRemoveSubscriptionsMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      gqlClient.request(
        graphql(`
          mutation RemoveSubscriptions($ids: [ID!]!) {
            removeSubscriptions(ids: $ids)
          }
        `),
        {
          ids,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_SUBSCRIPTION })
    },
  })
}

export const useRunMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dry: boolean) => {
      return gqlClient.request(
        graphql(`
          mutation Run($dry: Boolean!) {
            run(dry: $dry)
          }
        `),
        {
          dry,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export const useUpdateAvatarMutation = () => {
  const gqlClient = useQGLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (avatar: string) => {
      return gqlClient.request(
        graphql(`
          mutation UpdateAvatar($avatar: String) {
            updateAvatar(avatar: $avatar)
          }
        `),
        {
          avatar,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_USER })
    },
  })
}
