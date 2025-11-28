import { useStore } from '@nanostores/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClientError, GraphQLClient } from 'graphql-request'
import { createContext, useContext, useMemo } from 'react'

import { notifications } from '~/components/ui/use-toast'
import { endpointURLAtom, tokenAtom } from '~/store'

export const GQLClientContext = createContext<GraphQLClient>(null as unknown as GraphQLClient)

export const GQLQueryClientProvider = ({ client, children }: { client: GraphQLClient; children: React.ReactNode }) => {
  return <GQLClientContext.Provider value={client}>{children}</GQLClientContext.Provider>
}

export const useGQLQueryClient = () => useContext(GQLClientContext)

type ColorScheme = 'dark' | 'light'

interface ColorSchemeContextValue {
  colorScheme: ColorScheme
  toggleColorScheme: (value?: ColorScheme) => void
}

export const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  colorScheme: 'light',
  toggleColorScheme: () => {},
})

export const useColorScheme = () => useContext(ColorSchemeContext)

interface QueryProviderProps {
  children: React.ReactNode
  toggleColorScheme: (value?: ColorScheme) => void
  colorScheme: ColorScheme
}

export const QueryProvider = ({ children, toggleColorScheme, colorScheme }: QueryProviderProps) => {
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
    <ColorSchemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      <QueryClientProvider client={queryClient}>
        <GQLQueryClientProvider client={gqlClient}>{children}</GQLQueryClientProvider>
      </QueryClientProvider>
    </ColorSchemeContext.Provider>
  )
}
