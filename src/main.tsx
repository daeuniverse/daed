import '~/index.css'

import { loader } from '@monaco-editor/react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { editor } from 'monaco-editor'
import ReactDOM from 'react-dom/client'

import { App } from '~/App'
import { EDITOR_LANGUAGE_ROUTINGA } from '~/constants/editor'
import { i18nInit } from '~/i18n'

dayjs.extend(duration)

const loadMonaco = async () => {
  const monacoInstance = await loader.init()

  monacoInstance.languages.register({ id: 'routingA', extensions: ['dae'] })
  monacoInstance.languages.setMonarchTokensProvider('routingA', EDITOR_LANGUAGE_ROUTINGA)

  const themeGithub = await import('monaco-themes/themes/GitHub.json')
  const themeGithubLight = await import('monaco-themes/themes/GitHub Light.json')
  monacoInstance.editor.defineTheme('github', themeGithub as editor.IStandaloneThemeData)
  monacoInstance.editor.defineTheme('githubLight', themeGithubLight as editor.IStandaloneThemeData)
}

Promise.all([i18nInit(), loadMonaco()]).then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
})
