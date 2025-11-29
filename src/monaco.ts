import type { Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import themeGithubRaw from 'monaco-themes/themes/GitHub.json?raw'
// Import theme JSON files using Vite's raw import
import themeGithubLightRaw from 'monaco-themes/themes/GitHub Light.json?raw'

import { EDITOR_LANGUAGE_ROUTINGA } from '~/constants/editor'

const themeGithub: editor.IStandaloneThemeData = JSON.parse(themeGithubRaw)
const themeGithubLight: editor.IStandaloneThemeData = JSON.parse(themeGithubLightRaw)

// Configure Monaco workers for Vite
globalThis.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new JsonWorker()
    }

    if (label === 'html') {
      return new HtmlWorker()
    }

    if (label === 'typescript' || label === 'javascript') {
      return new TsWorker()
    }

    return new EditorWorker()
  },
}

// Configure loader to use local monaco-editor package
loader.config({ monaco })

// Handler for beforeMount prop in Editor component
export function handleEditorBeforeMount(monacoInstance: Monaco) {
  // Register custom routingA language
  monacoInstance.languages.register({ id: 'routingA', extensions: ['dae'] })
  monacoInstance.languages.setMonarchTokensProvider('routingA', EDITOR_LANGUAGE_ROUTINGA)

  // Register custom themes
  monacoInstance.editor.defineTheme('github', themeGithub)
  monacoInstance.editor.defineTheme('githubLight', themeGithubLight)
}
