import '~/index.css'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import ReactDOM from 'react-dom/client'

import { App } from '~/App'
import { i18nInit } from '~/i18n'

dayjs.extend(duration)

i18nInit().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
})
