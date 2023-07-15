/* eslint-disable import/default */

import '~/index.css'

import { loader } from '@monaco-editor/react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import * as monaco from 'monaco-editor'
import { editor } from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import ReactDOM from 'react-dom/client'

import { App } from '~/App'
import { EDITOR_LANGUAGE_ROUTINGA } from '~/constants/editor'
import { i18nInit } from '~/i18n'

dayjs.extend(duration)

const loadMonaco = async () => {
  loader.config({ monaco })

  self.MonacoEnvironment = {
    createTrustedTypesPolicy() {
      return undefined
    },

    getWorker(_, label) {
      if (label === 'json') {
        return new jsonWorker()
      }

      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker()
      }

      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker()
      }

      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker()
      }

      return new editorWorker()
    },
  }

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
