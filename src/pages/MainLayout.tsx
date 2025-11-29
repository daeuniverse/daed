import { useStore } from '@nanostores/react'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { HeaderWithActions } from '~/components/Header'
import { useInitialize } from '~/initialize'
import { endpointURLAtom, tokenAtom } from '~/store'

export function MainLayout() {
  const navigate = useNavigate()
  const token = useStore(tokenAtom)
  const endpointURL = useStore(endpointURLAtom)
  const initialize = useInitialize()

  useEffect(() => {
    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!endpointURL || !token) {
      navigate('/setup')
    }
  }, [endpointURL, navigate, token])

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWithActions />
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl p-4">
          <Outlet />
        </div>
      </main>
      <footer className="h-[50px] border-t flex items-center justify-center">
        <p className="text-xs text-muted-foreground font-light">
          Made with passion 🔥 by
          {' '}
          <a
            href="https://github.com/daeuniverse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @daeuniverse
          </a>
        </p>
      </footer>
    </div>
  )
}
