import '~/styles/index.css'

import { ThemeProvider } from '@daed/components'
import { i18nInit } from '@daed/i18n'
import { SnackbarProvider } from 'notistack'
import ReactDOM from 'react-dom/client'

import { App } from '~/App'

import { appStateAtom } from './store'

i18nInit()
  .then(() => {
    const preventContextMenu = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('contextmenu', preventContextMenu)
  })
  .then(() => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <ThemeProvider colorMode={appStateAtom.get().darkMode ? 'dark' : 'light'}>
        <SnackbarProvider
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'bottom',
          }}
          autoHideDuration={3000}
        >
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    )
  })
