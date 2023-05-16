import { notifications } from '@mantine/notifications'
import { useStore } from '@nanostores/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { createContext, useContext, useMemo } from 'react'

import { endpointURLAtom, tokenAtom } from '~/store'

export const GQLClientContext = createContext<GraphQLClient>(null as unknown as GraphQLClient)

export const GQLQueryClientProvider = ({ client, children }: { client: GraphQLClient; children: React.ReactNode }) => {
  return <GQLClientContext.Provider value={client}>{children}</GQLClientContext.Provider>
}

export const useQGLQueryClient = () => useContext(GQLClientContext)

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const endpointURL = useStore(endpointURLAtom)
  const token = useStore(tokenAtom)

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError(err) {
              notifications.show({
                variant: 'error',
                message: (err as Error).message,
              })
            },
          },
        },
      }),
    []
  )

  const gqlClient = useMemo(
    () =>
      new GraphQLClient(endpointURL, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    [endpointURL, token]
  )

  return (
    <QueryClientProvider client={queryClient}>
      <GQLQueryClientProvider client={gqlClient}>{children}</GQLQueryClientProvider>
    </QueryClientProvider>
  )
}
