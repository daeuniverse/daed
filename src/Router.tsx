import { createGraphiQLFetcher } from '@graphiql/toolkit'
import { useStore } from '@nanostores/react'
import { GraphiQL } from 'graphiql'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'

import { ExperimentPage, MainLayout, OrchestratePage, SetupPage } from '~/pages'
import { endpointURLAtom } from '~/store'

export function Router() {
  const endpointURL = useStore(endpointURLAtom)
  const RouterType = import.meta.env.DEV ? BrowserRouter : HashRouter

  return (
    <RouterType>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<OrchestratePage />} />
          <Route path="experiment" element={<ExperimentPage />} />
        </Route>

        <Route path="/setup" element={<SetupPage />} />

        {endpointURL && (
          <Route
            path="/graphiql"
            element={(
              <GraphiQL
                fetcher={createGraphiQLFetcher({
                  url: endpointURL,
                })}
              />
            )}
          />
        )}
      </Routes>
    </RouterType>
  )
}
