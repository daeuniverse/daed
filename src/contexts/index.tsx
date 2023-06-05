import { createFormContext } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useStore } from '@nanostores/react'
import { IconX } from '@tabler/icons-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { createContext, useContext, useMemo } from 'react'
import { z } from 'zod'

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
                color: 'red',
                icon: <IconX />,
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

const importNodeFormSchema = z.object({
  nodes: z
    .array(
      z.object({
        id: z.string(),
        link: z.string().url().nonempty(),
        tag: z.string().nonempty(),
      })
    )
    .min(1),
})

export const importNodeFormContext = createFormContext<z.infer<typeof importNodeFormSchema>>()
