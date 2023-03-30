import { graphql } from '@daed/schemas/gql'
import { ImportArgument } from '@daed/schemas/gql/graphql'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEY_NODE, QUERY_KEY_SUBSCRIPTION } from '~/constants'
import { useQGLQueryClient } from '~/contexts'

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
