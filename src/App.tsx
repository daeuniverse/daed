import {
  ColorScheme,
  ColorSchemeProvider,
  createEmotionCache,
  MantineProvider,
  MantineThemeOverride,
  ScrollArea,
} from '@mantine/core'
import { useColorScheme } from '@mantine/hooks'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

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

  const themeObject: MantineThemeOverride = useMemo(
    () => ({
      colorScheme,
      fontFamily: 'Fira Sans, Monaco, Consolas, sans-serif',
      fontFamilyMonospace: 'Source Code Pro, Monaco, Consolas, monospace',
      primaryColor: 'violet',
      components: {
        Button: {
          defaultProps: {
            uppercase: true,
          },
        },
        Select: {
          defaultProps: {
            withinPortal: true,
          },
        },
        Modal: {
          defaultProps: {
            size: 'lg',
            centered: true,
            scrollAreaComponent: ScrollArea.Autosize,
          },
        },
        Drawer: {
          defaultProps: {
            size: 'lg',
            scrollAreaComponent: ScrollArea.Autosize,
          },
        },
        Menu: {
          styles: {
            label: {
              textTransform: 'uppercase',
            },
          },
        },
      },
    }),
    [colorScheme]
  )

  return (
    <QueryProvider>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={themeObject} emotionCache={emotionCache} withGlobalStyles withNormalizeCSS>
          <ModalsProvider>
            <div className="h-screen min-w-[1024px]">
              <Notifications limit={5} />
              <Router />
            </div>
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryProvider>
  )
}
