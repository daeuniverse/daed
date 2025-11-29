import type { ThemeMode } from '~/store'
import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useState } from 'react'

import { Toaster } from '~/components/ui/sonner'
import { TooltipProvider } from '~/components/ui/tooltip'
import { QueryProvider } from '~/contexts'
import { Router } from '~/Router'
import { appStateAtom, colorSchemeAtom } from '~/store'

type ColorScheme = 'dark' | 'light'

function useSystemColorScheme(): ColorScheme {
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

export function App() {
  const appState = useStore(appStateAtom)
  const systemColorScheme = useSystemColorScheme()
  const themeMode = appState.themeMode || 'system'

  // Derive actual colorScheme from themeMode
  const colorScheme: ColorScheme = themeMode === 'system' ? systemColorScheme : themeMode

  const setThemeMode = useCallback((mode: ThemeMode) => {
    appStateAtom.setKey('themeMode', mode)
  }, [])

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
    <QueryProvider colorScheme={colorScheme} themeMode={themeMode} setThemeMode={setThemeMode}>
      <TooltipProvider>
        <div className="h-dvh">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryProvider>
  )
}
