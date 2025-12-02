import type { MODE } from '~/constants'

import type { GlobalInput, ImportArgument, Policy, PolicyParam } from '~/schemas/gql/graphql'
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
import { useGQLQueryClient } from '~/contexts'
import { graphql } from '~/schemas/gql'

export function useSetJsonStorageMutation() {
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
        },
      )
    },
  })
}

export function useSetModeMutation() {
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
        },
      )
    },
  })
}

export function useCreateConfigMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG })
    },
  })
}

export function useUpdateConfigMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useRemoveConfigMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG })
    },
  })
}

export function useSelectConfigMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useRenameConfigMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG })
    },
  })
}

export function useCreateRoutingMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ROUTING })
    },
  })
}

export function useUpdateRoutingMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ROUTING })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useRemoveRoutingMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ROUTING })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useSelectRoutingMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ROUTING })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useRenameRoutingMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ROUTING })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useCreateDNSMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_DNS })
    },
  })
}

export function useUpdateDNSMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_DNS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useRemoveDNSMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_DNS })
    },
  })
}

export function useSelectDNSMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_DNS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useRenameDNSMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_DNS })
    },
  })
}

export function useCreateGroupMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
    },
  })
}

export function useRemoveGroupMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
    },
  })
}

export function useGroupSetPolicyMutation() {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, policy, policyParams }: { id: string; policy: Policy; policyParams: PolicyParam[] }) => {
      return gqlClient.request(
        graphql(`
          mutation GroupSetPolicy($id: ID!, $policy: Policy!, $policyParams: [PolicyParam!]) {
            groupSetPolicy(id: $id, policy: $policy, policyParams: $policyParams)
          }
        `),
        {
          id,
          policy,
          policyParams,
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useRenameGroupMutation() {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => {
      return gqlClient.request(
        graphql(`
          mutation RenameGroup($id: ID!, $name: String!) {
            renameGroup(id: $id, name: $name)
          }
        `),
        {
          id,
          name,
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useGroupAddNodesMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useGroupDelNodesMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useGroupAddSubscriptionsMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useGroupDelSubscriptionsMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useImportNodesMutation() {
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
          rollbackError: false,
          args: data,
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_NODE })
    },
  })
}

export function useRemoveNodesMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_NODE })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CONFIG })
    },
  })
}

export function useUpdateNodeMutation() {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, newLink }: { id: string; newLink: string }) => {
      return gqlClient.request(
        graphql(`
          mutation UpdateNode($id: ID!, $newLink: String!) {
            updateNode(id: $id, newLink: $newLink) {
              id
              name
              tag
              link
            }
          }
        `),
        {
          id,
          newLink,
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_NODE })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
    },
  })
}

export function useImportSubscriptionsMutation() {
  const gqlClient = useGQLQueryClient()
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
              rollbackError: false,
              arg: subscription,
            },
          ),
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_SUBSCRIPTION })
    },
  })
}

export function useUpdateSubscriptionsMutation() {
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
            },
          ),
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_SUBSCRIPTION })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useRemoveSubscriptionsMutation() {
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
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_SUBSCRIPTION })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useRunMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GENERAL })
    },
  })
}

export function useUpdateAvatarMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_USER })
    },
  })
}

export function useUpdateNameMutation() {
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
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_USER })
    },
  })
}

export function useUpdatePasswordMutation() {
  const gqlClient = useGQLQueryClient()

  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      // Use raw GraphQL string instead of graphql template tag
      const query = `
        mutation UpdatePassword($currentPassword: String!, $newPassword: String!) {
          updatePassword(currentPassword: $currentPassword, newPassword: $newPassword)
        }
      `

      return gqlClient.request(query, {
        currentPassword,
        newPassword,
      })
    },
    onSuccess: (data) => {
      // The mutation returns a new token, which should be handled by the app
      // to update the authentication state
      return data
    },
  })
}

export function useUpdateUsernameMutation() {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (username: string) => {
      return gqlClient.request(
        graphql(`
          mutation UpdateUsername($username: String!) {
            updateUsername(username: $username)
          }
        `),
        {
          username,
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_USER })
    },
  })
}

export function useTagNodeMutation() {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, tag }: { id: string; tag: string }) => {
      return gqlClient.request(
        graphql(`
          mutation TagNode($id: ID!, $tag: String!) {
            tagNode(id: $id, tag: $tag)
          }
        `),
        {
          id,
          tag,
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_NODE })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
    },
  })
}

export function useTagSubscriptionMutation() {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, tag }: { id: string; tag: string }) => {
      return gqlClient.request(
        graphql(`
          mutation TagSubscription($id: ID!, $tag: String!) {
            tagSubscription(id: $id, tag: $tag)
          }
        `),
        {
          id,
          tag,
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_SUBSCRIPTION })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
    },
  })
}

export function useUpdateSubscriptionLinkMutation() {
  const gqlClient = useGQLQueryClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, link }: { id: string; link: string }) => {
      return gqlClient.request(
        graphql(`
          mutation UpdateSubscriptionLink($id: ID!, $link: String!) {
            updateSubscriptionLink(id: $id, link: $link) {
              id
              link
              tag
            }
          }
        `),
        {
          id,
          link,
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_SUBSCRIPTION })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_GROUP })
    },
  })
}
