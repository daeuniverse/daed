import { QueryClient } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { createContext, useContext } from 'react'

export const GQLClientContext = createContext<GraphQLClient>(null as unknown as GraphQLClient)

export const GQLQueryClientProvider = ({ client, children }: { client: GraphQLClient; children: React.ReactNode }) => {
  return (
    <GQLClientContext.Provider value={client}>
      <GQLClientContext.Consumer>{() => children}</GQLClientContext.Consumer>
    </GQLClientContext.Provider>
  )
}

export const useQGLQueryClient = () => useContext(GQLClientContext)

type SetupContextProps = {
  gqlClient: GraphQLClient
  queryClient: QueryClient
}

export const SetupContext = createContext(null as unknown as SetupContextProps)
export const useSetupContext = () => useContext(SetupContext)
