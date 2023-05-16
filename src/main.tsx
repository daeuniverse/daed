import '~/index.css'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { App } from '~/App'
import { i18nInit } from '~/i18n'

i18nInit().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
