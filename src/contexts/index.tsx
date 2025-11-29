import type { ClientError } from 'graphql-request'
import { useStore } from '@nanostores/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { createContext, use, useMemo } from 'react'

import { notifications } from '~/components/ui/use-toast'
import { endpointURLAtom, tokenAtom } from '~/store'

export const GQLClientContext = createContext<GraphQLClient>(null as unknown as GraphQLClient)

export function GQLQueryClientProvider({ client, children }: { client: GraphQLClient, children: React.ReactNode }) {
  return <GQLClientContext value={client}>{children}</GQLClientContext>
}

export const useGQLQueryClient = () => use(GQLClientContext)

type ColorScheme = 'dark' | 'light'

interface ColorSchemeContextValue {
  colorScheme: ColorScheme
  toggleColorScheme: (value?: ColorScheme) => void
}

export const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  colorScheme: 'light',
  toggleColorScheme: () => {},
})

export const useColorScheme = () => use(ColorSchemeContext)

interface QueryProviderProps {
  children: React.ReactNode
  toggleColorScheme: (value?: ColorScheme) => void
  colorScheme: ColorScheme
}

export function QueryProvider({ children, toggleColorScheme, colorScheme }: QueryProviderProps) {
  const endpointURL = useStore(endpointURLAtom)
  const token = useStore(tokenAtom)

  const queryClient = useMemo(() => new QueryClient(), [])

  const gqlClient = useMemo(
    () =>
      new GraphQLClient(endpointURL, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        responseMiddleware: (response) => {
          const error = (response as ClientError).response?.errors?.[0]

          if (error) {
            notifications.show({
              color: 'red',
              message: error.message,
            })

            if (error.message === 'access denied') {
              tokenAtom.set('')
            }
          }
        },
      }),
    [endpointURL, token],
  )

  return (
    <ColorSchemeContext value={{ colorScheme, toggleColorScheme }}>
      <QueryClientProvider client={queryClient}>
        <GQLQueryClientProvider client={gqlClient}>{children}</GQLQueryClientProvider>
      </QueryClientProvider>
    </ColorSchemeContext>
  )
}
