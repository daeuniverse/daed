import {
  createTheme,
  CssBaseline,
  PaletteOptions,
  ThemeProvider as MUIThemeProvider,
  useMediaQuery,
} from '@mui/material'
import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react'

type ColorModeContextValue<T = PaletteOptions['mode']> = {
  colorMode: T
  setColorMode: Dispatch<SetStateAction<T>>
  toggleColorMode: () => void
}
export const ColorModeContext = createContext<ColorModeContextValue>(null as unknown as ColorModeContextValue)
export const useColorMode = () => useContext(ColorModeContext)

export const useTheme = (mode: PaletteOptions['mode']) =>
  useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  )

export const ThemeProvider = ({
  colorMode: defaultColorMode,
  children,
}: {
  colorMode?: PaletteOptions['mode']
  children: React.ReactElement
}) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [colorMode, setColorMode] = useState(defaultColorMode ? defaultColorMode : prefersDarkMode ? 'dark' : undefined)
  const theme = useTheme(colorMode)

  return (
    <ColorModeContext.Provider
      value={{
        colorMode,
        setColorMode,
        toggleColorMode: () => {
          setColorMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
        },
      }}
    >
      <ColorModeContext.Consumer>
        {() => (
          <MUIThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </MUIThemeProvider>
        )}
      </ColorModeContext.Consumer>
    </ColorModeContext.Provider>
  )
}
