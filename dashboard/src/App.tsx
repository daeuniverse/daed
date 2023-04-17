import { useColorMode } from '@daed/components'
import { createGraphiQLFetcher } from '@graphiql/toolkit'
import { useStore } from '@nanostores/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GraphiQL } from 'graphiql'
import { GraphQLClient } from 'graphql-request'
import { useSnackbar } from 'notistack'
import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

import { Setup } from '~/Setup'
import { MODE } from '~/constants'
import { GQLQueryClientProvider } from '~/contexts'
import { Home } from '~/layouts/Home'
import { Config } from '~/pages/Config'
import { DNS } from '~/pages/DNS'
import { Node, NodeGroup, NodeList } from '~/pages/Node'
import { Routing } from '~/pages/Routing'
import { appStateAtom, endpointURLAtom, modeAtom, tokenAtom } from '~/store'

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const endpointURL = useStore(endpointURLAtom)
  const token = useStore(tokenAtom)
  const { enqueueSnackbar } = useSnackbar()

  const onError = useCallback(
    (err: unknown) => {
      enqueueSnackbar((err as Error).message, {
        variant: 'error',
      })
    },
    [enqueueSnackbar]
  )

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            onError,
          },
          mutations: {
            onError,
          },
        },
      }),
    [onError]
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

const Main = () => {
  const endpointURL = useStore(endpointURLAtom)
  const mode = useStore(modeAtom)

  const { colorMode } = useColorMode()

  useEffect(() => {
    appStateAtom.setKey('darkMode', colorMode === 'dark')
  }, [colorMode])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Fragment>
        <Route path="/" element={<Home />}>
          {mode === MODE.advanced && (
            <Fragment>
              <Route path="node" element={<Node />}>
                <Route index element={<NodeList />} />
                <Route path="group" element={<NodeGroup />} />
              </Route>
              <Route path="config" element={<Config />} />
              <Route path="routing" element={<Routing />} />
              <Route path="dns" element={<DNS />} />
            </Fragment>
          )}
        </Route>

        <Route
          path="/graphql"
          element={
            <GraphiQL
              fetcher={createGraphiQLFetcher({
                url: endpointURL,
              })}
            />
          }
        />
      </Fragment>
    )
  )

  return (
    <Fragment>
      <RouterProvider router={router} />
      <ReactQueryDevtools position="bottom-right" />
    </Fragment>
  )
}

export const App = () => {
  return (
    <QueryProvider>
      <Setup>
        <Main />
      </Setup>
    </QueryProvider>
  )
}
