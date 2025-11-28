import { loader, Monaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { editor } from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// Import theme JSON files using Vite's raw import
import themeGithubLightRaw from 'monaco-themes/themes/GitHub Light.json?raw'
import themeGithubRaw from 'monaco-themes/themes/GitHub.json?raw'

import { EDITOR_LANGUAGE_ROUTINGA } from '~/constants/editor'

const themeGithub: editor.IStandaloneThemeData = JSON.parse(themeGithubRaw)
const themeGithubLight: editor.IStandaloneThemeData = JSON.parse(themeGithubLightRaw)

// Configure Monaco workers for Vite
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }

    if (label === 'html') {
      return new htmlWorker()
    }

    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }

    return new editorWorker()
  },
}

// Configure loader to use local monaco-editor package
loader.config({ monaco })

// Handler for beforeMount prop in Editor component
export const handleEditorBeforeMount = (monacoInstance: Monaco) => {
  // Register custom routingA language
  monacoInstance.languages.register({ id: 'routingA', extensions: ['dae'] })
  monacoInstance.languages.setMonarchTokensProvider('routingA', EDITOR_LANGUAGE_ROUTINGA)

  // Register custom themes
  monacoInstance.editor.defineTheme('github', themeGithub)
  monacoInstance.editor.defineTheme('githubLight', themeGithubLight)
}
