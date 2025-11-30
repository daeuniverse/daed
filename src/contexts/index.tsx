import type { ClientError } from 'graphql-request'
import { useStore } from '@nanostores/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { createContext, use, useMemo } from 'react'
import { toast } from 'sonner'

import { isMockMode, MockGraphQLClient } from '~/mocks'
import { endpointURLAtom, tokenAtom } from '~/store'

// Use a union type to support both real and mock clients
type GQLClient = GraphQLClient | MockGraphQLClient

export const GQLClientContext = createContext<GQLClient>(null as unknown as GQLClient)

export function GQLQueryClientProvider({ client, children }: { client: GQLClient; children: React.ReactNode }) {
  return <GQLClientContext value={client}>{children}</GQLClientContext>
}

export const useGQLQueryClient = () => use(GQLClientContext)

type ColorScheme = 'dark' | 'light'
type ThemeMode = 'system' | 'light' | 'dark'

interface ColorSchemeContextValue {
  colorScheme: ColorScheme
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
}

export const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  colorScheme: 'light',
  themeMode: 'system',
  setThemeMode: () => {},
})

export const useColorScheme = () => use(ColorSchemeContext)

interface QueryProviderProps {
  children: React.ReactNode
  colorScheme: ColorScheme
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
}

export function QueryProvider({ children, colorScheme, themeMode, setThemeMode }: QueryProviderProps) {
  const endpointURL = useStore(endpointURLAtom)
  const token = useStore(tokenAtom)

  const queryClient = useMemo(() => new QueryClient(), [])

  const gqlClient = useMemo<GQLClient>(() => {
    // Use mock client in mock mode
    if (isMockMode()) {
      return new MockGraphQLClient('mock://localhost')
    }

    return new GraphQLClient(endpointURL, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      responseMiddleware: (response) => {
        const error = (response as ClientError).response?.errors?.[0]

        if (error) {
          toast.error(error.message)

          if (error.message === 'access denied') {
            tokenAtom.set('')
          }
        }
      },
    })
  }, [endpointURL, token])

  const colorSchemeContextValue = useMemo(
    () => ({ colorScheme, themeMode, setThemeMode }),
    [colorScheme, themeMode, setThemeMode],
  )

  return (
    <ColorSchemeContext value={colorSchemeContextValue}>
      <QueryClientProvider client={queryClient}>
        <GQLQueryClientProvider client={gqlClient}>{children}</GQLQueryClientProvider>
      </QueryClientProvider>
    </ColorSchemeContext>
  )
}
