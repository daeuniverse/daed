import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useState } from 'react'

import { Toaster } from '~/components/ui/toaster'
import { TooltipProvider } from '~/components/ui/tooltip'
import { QueryProvider } from '~/contexts'
import { Router } from '~/Router'
import { appStateAtom, colorSchemeAtom } from '~/store'

type ColorScheme = 'dark' | 'light'

const useColorScheme = (): ColorScheme => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    return 'light'
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setColorScheme(e.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return colorScheme
}

export const App = () => {
  const appState = useStore(appStateAtom)
  const preferredColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme)

  const toggleColorScheme = useCallback(
    (value?: ColorScheme) => {
      const toScheme = value || (colorScheme === 'dark' ? 'light' : 'dark')
      setColorScheme(toScheme)
      appStateAtom.setKey('preferredColorScheme', toScheme)
    },
    [colorScheme],
  )

  useEffect(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')
    const onDarkModeChange = (e: MediaQueryListEvent) => toggleColorScheme(e.matches ? 'dark' : 'light')

    darkModePreference.addEventListener('change', onDarkModeChange)

    return () => darkModePreference.removeEventListener('change', onDarkModeChange)
  }, [toggleColorScheme])

  useEffect(() => {
    setColorScheme(appState.preferredColorScheme || preferredColorScheme)
  }, [setColorScheme, preferredColorScheme, appState.preferredColorScheme])

  useEffect(() => {
    colorSchemeAtom.set(colorScheme)
  }, [colorScheme])

  // Apply dark mode class to document
  useEffect(() => {
    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [colorScheme])

  return (
    <QueryProvider toggleColorScheme={toggleColorScheme} colorScheme={colorScheme}>
      <TooltipProvider>
        <div className="h-[100dvh]">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryProvider>
  )
}
