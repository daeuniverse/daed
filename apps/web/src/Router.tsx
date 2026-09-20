import { createGraphiQLFetcher } from '@graphiql/toolkit'
import { useStore } from '@nanostores/react'
import { GraphiQL } from 'graphiql'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'

import { MainLayout, OrchestratePage, SetupPage } from '~/pages'
import { endpointURLAtom, tokenAtom } from '~/store'

export function Router() {
  const endpointURL = useStore(endpointURLAtom)
  const token = useStore(tokenAtom)
  const RouterType = import.meta.env.DEV ? BrowserRouter : HashRouter

  return (
    <RouterType>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<OrchestratePage />} />
        </Route>

        <Route path="/setup" element={<SetupPage />} />

        {endpointURL && (
          <Route
            path="/graphiql"
            element={
              <GraphiQL
                fetcher={createGraphiQLFetcher({
                  url: endpointURL,
                  headers: { authorization: `Bearer ${token}` },
                })}
              />
            }
          />
        )}
      </Routes>
    </RouterType>
  )
}
