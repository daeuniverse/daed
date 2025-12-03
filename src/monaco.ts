import type { Monaco } from '@monaco-editor/react'
import { loader } from '@monaco-editor/react'
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { createHighlighter } from 'shiki'

import { EDITOR_LANGUAGE_ROUTINGA, ROUTINGA_COMPLETION_ITEMS } from '~/constants/editor'

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

// Shiki highlighter instance
let shikiHighlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null

// Track if Shiki themes have been applied to Monaco globally
let shikiThemesApplied = false

// Check if Shiki themes are ready
export function isShikiReady() {
  return shikiThemesApplied
}

// Initialize Shiki highlighter
export async function initShikiHighlighter() {
  if (shikiHighlighter) return shikiHighlighter

  shikiHighlighter = await createHighlighter({
    themes: ['vitesse-dark', 'vitesse-light', 'github-dark', 'github-light'],
    langs: ['json', 'javascript', 'typescript', 'html', 'css', 'yaml', 'markdown', 'shell'],
  })

  return shikiHighlighter
}

// Handler for beforeMount prop in Editor component
export function handleEditorBeforeMount(monacoInstance: Monaco) {
  // Register custom routingA language
  monacoInstance.languages.register({ id: 'routingA', extensions: ['dae'] })
  monacoInstance.languages.setMonarchTokensProvider('routingA', EDITOR_LANGUAGE_ROUTINGA)

  // Register completion provider for routingA language
  monacoInstance.languages.registerCompletionItemProvider('routingA', {
    provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      // Map completion item kinds from string to Monaco enum
      const kindMap: Record<string, monaco.languages.CompletionItemKind> = {
        keyword: monacoInstance.languages.CompletionItemKind.Keyword,
        function: monacoInstance.languages.CompletionItemKind.Function,
        constant: monacoInstance.languages.CompletionItemKind.Constant,
        type: monacoInstance.languages.CompletionItemKind.TypeParameter,
        variable: monacoInstance.languages.CompletionItemKind.Variable,
        snippet: monacoInstance.languages.CompletionItemKind.Snippet,
      }

      const suggestions = ROUTINGA_COMPLETION_ITEMS.map((item) => ({
        label: item.label,
        kind: kindMap[item.kind] ?? monacoInstance.languages.CompletionItemKind.Text,
        detail: item.detail,
        documentation: item.documentation,
        insertText: item.insertText,
        insertTextRules: item.insertTextRules
          ? monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet
          : undefined,
        range,
      }))

      return { suggestions }
    },
  })
}

// Apply Shiki themes to Monaco (call after editor is mounted)
export async function applyShikiThemes(monacoInstance: Monaco) {
  // Only apply once globally
  if (shikiThemesApplied) return

  const highlighter = await initShikiHighlighter()

  // Register Shiki themes with Monaco
  shikiToMonaco(highlighter, monacoInstance)
  shikiThemesApplied = true
}

// Theme names for use in components
export const SHIKI_THEMES = {
  dark: 'vitesse-dark',
  light: 'vitesse-light',
} as const

export const GITHUB_THEMES = {
  dark: 'github-dark',
  light: 'github-light',
} as const
