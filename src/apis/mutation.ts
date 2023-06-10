import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  MODE,
  QUERY_KEY_CONFIG,
  QUERY_KEY_DNS,
  QUERY_KEY_GENERAL,
  QUERY_KEY_GROUP,
  QUERY_KEY_NODE,
  QUERY_KEY_ROUTING,
  QUERY_KEY_SUBSCRIPTION,
  QUERY_KEY_USER,
} from '~/constants'
import { useGQLQueryClient } from '~/contexts'
import { graphql } from '~/schemas/gql'
import { GlobalInput, ImportArgument, Policy, PolicyParam } from '~/schemas/gql/graphql'

export const useSetJsonStorageMutation = () => {
  const gqlClient = useGQLQueryClient()

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

export const useSetModeMutation = () => {
  const gqlClient = useGQLQueryClient()

  return useMutation({
    mutationFn: (mode: MODE) => {
      return gqlClient.request(
        graphql(`
          mutation SetMode($paths: [String!]!, $values: [String!]!) {
            setJsonStorage(paths: $paths, values: $values)
          }
        `),
        {
          paths: ['mode'],
          values: [mode],
        }
      )
    },
  })
}

export const useCreateConfigMutation = () => {
  const gqlClient = useGQLQueryClient()
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

export const useUpdateConfigMutation = () => {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, global }: { id: string; global: GlobalInput }) => {
      return gqlClient.request(
        graphql(`
          mutation UpdateConfig($id: ID!, $global: globalInput!) {
            updateConfig(id: $id, global: $global) {
              id
            }
          }
        `),
        {
          id,
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
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
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

export const useRenameConfigMutation = () => {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => {
      return gqlClient.request(
        graphql(`
          mutation RenameConfig($id: ID!, $name: String!) {
            renameConfig(id: $id, name: $name)
          }
        `),
        {
          id,
          name,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG })
    },
  })
}

export const useCreateRoutingMutation = () => {
  const gqlClient = useGQLQueryClient()
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

export const useUpdateRoutingMutation = () => {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, routing }: { id: string; routing: string }) => {
      return gqlClient.request(
        graphql(`
          mutation UpdateRouting($id: ID!, $routing: String!) {
            updateRouting(id: $id, routing: $routing) {
              id
            }
          }
        `),
        {
          id,
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
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
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

export const useRenameRoutingMutation = () => {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => {
      return gqlClient.request(
        graphql(`
          mutation RenameRouting($id: ID!, $name: String!) {
            renameRouting(id: $id, name: $name)
          }
        `),
        {
          id,
          name,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ROUTING })
    },
  })
}

export const useCreateDNSMutation = () => {
  const gqlClient = useGQLQueryClient()
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

export const useUpdateDNSMutation = () => {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dns }: { id: string; dns: string }) => {
      return gqlClient.request(
        graphql(`
          mutation UpdateDNS($id: ID!, $dns: String!) {
            updateDns(id: $id, dns: $dns) {
              id
            }
          }
        `),
        {
          id,
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
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
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

export const useRenameDNSMutation = () => {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => {
      return gqlClient.request(
        graphql(`
          mutation RenameDNS($id: ID!, $name: String!) {
            renameDns(id: $id, name: $name)
          }
        `),
        {
          id,
          name,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_DNS })
    },
  })
}

export const useCreateGroupMutation = () => {
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ImportArgument[]) =>
      Promise.allSettled(
        data.map((subscription) =>
          gqlClient.request(
            graphql(`
              mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {
                importSubscription(rollbackError: $rollbackError, arg: $arg) {
                  link
                  sub {
                    id
                  }
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

export const useUpdateSubscriptionsMutation = () => {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(
        ids.map((id) =>
          gqlClient.request(
            graphql(`
              mutation UpdateSubscription($id: ID!) {
                updateSubscription(id: $id) {
                  id
                }
              }
            `),
            {
              id,
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
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
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
  const gqlClient = useGQLQueryClient()
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

export const useUpdateNameMutation = () => {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => {
      return gqlClient.request(
        graphql(`
          mutation UpdateName($name: String) {
            updateName(name: $name)
          }
        `),
        {
          name,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_USER })
    },
  })
}
