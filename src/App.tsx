import {
  Box,
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
import { useCallback, useEffect, useState } from 'react'

import { QueryProvider } from '~/contexts'
import { Router } from '~/Router'
import { appStateAtom, colorSchemeAtom } from '~/store'

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
    [colorScheme],
  )

  useEffect(() => {
    setColorScheme(appState.preferredColorScheme || preferredColorScheme)
  }, [setColorScheme, preferredColorScheme, appState.preferredColorScheme])

  useEffect(() => {
    colorSchemeAtom.set(colorScheme)
  }, [colorScheme])

  const themeObject: MantineThemeOverride = {
    colorScheme,
    fontFamily: 'Fira Sans, Monaco, Consolas, sans-serif',
    fontFamilyMonospace: 'Source Code Pro, Monaco, Consolas, monospace',
    primaryColor: 'violet',
    cursorType: 'pointer',
    components: {
      Stack: { defaultProps: { spacing: 'sm' } },
      Group: { defaultProps: { spacing: 'sm' } },
      Button: { defaultProps: { uppercase: true } },
      ActionIcon: { defaultProps: { size: 'sm' } },
      Modal: {
        defaultProps: {
          size: 'lg',
          radius: 'md',
          centered: true,
          scrollAreaComponent: ScrollArea.Autosize,
        },
      },
      ModalHeader: {
        defaultProps: (theme) => ({
          bg: colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4],
        }),
      },
      ModalTitle: {
        defaultProps: {
          color: 'white',
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
      Select: {
        defaultProps: {
          withinPortal: true,
          size: 'xs',
        },
      },
      MultiSelect: { defaultProps: { size: 'xs' } },
      Switch: { defaultProps: { size: 'xs' } },
      Checkbox: { defaultProps: { size: 'xs' } },
      Radio: { defaultProps: { size: 'xs' } },
      RadioGroup: { defaultProps: { size: 'xs' } },
      TextInput: { defaultProps: { size: 'xs' } },
      NumberInput: { defaultProps: { size: 'xs' } },
    },
  }

  return (
    <QueryProvider>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={themeObject} emotionCache={emotionCache} withGlobalStyles withNormalizeCSS>
          <ModalsProvider>
            <Box sx={{ height: '100dvh' }}>
              <Notifications limit={5} />
              <Router />
            </Box>
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryProvider>
  )
}
