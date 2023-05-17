import { createGraphiQLFetcher } from '@graphiql/toolkit'
import { useStore } from '@nanostores/react'
import { GraphiQL } from 'graphiql'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import {
  ConfigPage,
  DNSPage,
  GroupPage,
  HomePage,
  MainLayout,
  NodePage,
  RoutingPage,
  SetupPage,
  SubscriptionPage,
  TestPage,
} from '~/pages'
import { endpointURLAtom } from '~/store'

export const Router = () => {
  const endpointURL = useStore(endpointURLAtom)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="node" element={<NodePage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="dns" element={<DNSPage />} />
          <Route path="routing" element={<RoutingPage />} />
          <Route path="group" element={<GroupPage />} />
          <Route path="config" element={<ConfigPage />} />
          <Route path="test" element={<TestPage />} />
        </Route>

        <Route path="/setup" element={<SetupPage />} />

        {endpointURL && (
          <Route
            path="/graphiql"
            element={
              <GraphiQL
                fetcher={createGraphiQLFetcher({
                  url: endpointURL,
                })}
              />
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  )
}
