import { ColorScheme, ColorSchemeProvider, createEmotionCache, MantineProvider } from '@mantine/core'
import { useColorScheme } from '@mantine/hooks'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useState } from 'react'

import { QueryProvider } from '~/contexts'
import { Router } from '~/Router'
import { appStateAtom } from '~/store'

const emotionCache = createEmotionCache({ key: 'mantine' })

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
    [colorScheme]
  )

  useEffect(() => {
    setColorScheme(appState.preferredColorScheme || preferredColorScheme)
  }, [setColorScheme, preferredColorScheme, appState.preferredColorScheme])

  return (
    <QueryProvider>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          theme={{
            colorScheme,
            fontFamily: 'Fira Sans, sans-serif',
            fontFamilyMonospace: 'Source Code Pro, Monaco, Courier, monospace',
            components: {
              Button: {
                defaultProps: {
                  uppercase: true,
                },
              },
              Modal: {
                defaultProps: {
                  centered: true,
                },
              },
            },
          }}
          emotionCache={emotionCache}
          withGlobalStyles
          withNormalizeCSS
        >
          <ModalsProvider>
            <main className="h-screen">
              <Notifications limit={5} />
              <Router />
            </main>
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryProvider>
  )
}
