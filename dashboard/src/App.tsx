import { useColorMode } from '@daed/components'
import { graphql } from '@daed/schemas/gql'
import { createGraphiQLFetcher } from '@graphiql/toolkit'
import { Button, Stack, TextField } from '@mui/material'
import { useStore } from '@nanostores/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GraphiQL } from 'graphiql'
import { GraphQLClient, request } from 'graphql-request'
import { useSnackbar } from 'notistack'
import { Fragment, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import { DEFAULT_ENDPOINT_URL_INPUT, formatUserInputEndpointURL } from '~/constants'
import { GQLQueryClientProvider, SetupContext, useSetupContext } from '~/contexts'
import { Home } from '~/layouts/Home'
import { Config } from '~/pages/Config'
import { DNS } from '~/pages/DNS'
import { Node, NodeGroup, NodeList } from '~/pages/Node'
import { Routing } from '~/pages/Routing'
import { appStateAtom, endpointURLAtom, tokenAtom } from '~/store'

const Setup = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation()
  const endpointURL = useStore(endpointURLAtom)
  const token = useStore(tokenAtom)
  const { protocol } = new URL(location.href)
  const { register, handleSubmit } = useForm<{
    username: string
    password: string
    endpointURL: string
  }>({
    shouldUnregister: true,
  })

  const { enqueueSnackbar } = useSnackbar()
  const onError = (err: unknown) => {
    enqueueSnackbar((err as Error).message, {
      variant: 'error',
    })
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        onError,
      },
      mutations: {
        onError,
      },
    },
  })

  const gqlClient = useMemo(() => {
    const client = new GraphQLClient(endpointURL)

    if (token) {
      client.setHeader('authorization', `Bearer ${token}`)
    }

    return client
  }, [endpointURL, token])

  if (!endpointURL) {
    return (
      <Stack minHeight="100dvh" spacing={2} maxWidth={512} mx="auto" alignItems="center" justifyContent="center">
        <TextField fullWidth label={t('username')} {...register('username')} />
        <TextField fullWidth type="password" label={t('password')} {...register('password')} />

        <TextField
          fullWidth
          type="url"
          helperText={t('endpointURL')}
          InputProps={{
            startAdornment: `${protocol}//`,
            endAdornment: '/graphql',
          }}
          placeholder={DEFAULT_ENDPOINT_URL_INPUT}
          {...register('endpointURL')}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit(async (data) => {
            const formattedUserInputEndpointURL = formatUserInputEndpointURL(data.endpointURL)

            try {
              const { numberUsers } = await request(
                formattedUserInputEndpointURL,
                graphql(`
                  query NumberUsers {
                    numberUsers
                  }
                `)
              )

              if (numberUsers === 0) {
                const { createUser: createUserToken } = await request(
                  formattedUserInputEndpointURL,
                  graphql(`
                    mutation CreateUser($username: String!, $password: String!) {
                      createUser(username: $username, password: $password)
                    }
                  `),
                  {
                    username: data.username,
                    password: data.password,
                  }
                )

                tokenAtom.set(createUserToken)
              } else {
                const { token: loginToken } = await request(
                  formattedUserInputEndpointURL,
                  graphql(`
                    query Token($username: String!, $password: String!) {
                      token(username: $username, password: $password)
                    }
                  `),
                  {
                    username: data.username,
                    password: data.password,
                  }
                )

                tokenAtom.set(loginToken)
              }

              endpointURLAtom.set(formattedUserInputEndpointURL)
            } catch (e) {
              enqueueSnackbar((e as Error).message, {
                variant: 'error',
              })
            }
          })}
        >
          {t('actions.login')}
        </Button>
      </Stack>
    )
  }

  return (
    <SetupContext.Provider
      value={{
        gqlClient,
        queryClient,
      }}
    >
      <SetupContext.Consumer>{() => children}</SetupContext.Consumer>
    </SetupContext.Provider>
  )
}

const Main = () => {
  const endpointURL = useStore(endpointURLAtom)
  const { queryClient, gqlClient } = useSetupContext()
  const { colorMode } = useColorMode()

  useEffect(() => {
    appStateAtom.setKey('darkMode', colorMode === 'dark')
  }, [colorMode])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Fragment>
        <Route path="/" element={<Home />}>
          <Route path="node" element={<Node />}>
            <Route index element={<NodeList />} />
            <Route path="group" element={<NodeGroup />} />
          </Route>
          <Route path="config" element={<Config />} />
          <Route path="routing" element={<Routing />} />
          <Route path="dns" element={<DNS />} />
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
    <QueryClientProvider client={queryClient}>
      <GQLQueryClientProvider client={gqlClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools position="bottom-right" />
      </GQLQueryClientProvider>
    </QueryClientProvider>
  )
}

export const App = () => {
  return (
    <Setup>
      <Main />
    </Setup>
  )
}
