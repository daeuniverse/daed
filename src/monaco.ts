import type { RoutingACompletionItem } from '@daeuniverse/dae-editor'
import type { Monaco } from '@monaco-editor/react'
import {
  applyShikiThemes as applyShikiThemesBase,
  formatRoutingA,
  GITHUB_THEMES,
  handleEditorBeforeMount as handleEditorBeforeMountBase,
  initShikiHighlighter,
  isShikiReady,
  setDynamicCompletionItems as setDynamicCompletionItemsBase,
  SHIKI_THEMES,
} from '@daeuniverse/dae-editor'
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

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

// Re-export from @daeuniverse/dae-editor
export { formatRoutingA, GITHUB_THEMES, initShikiHighlighter, isShikiReady, SHIKI_THEMES }

// Handler for beforeMount prop in Editor component
export function handleEditorBeforeMount(monacoInstance: Monaco) {
  handleEditorBeforeMountBase(monacoInstance)
}

// Apply Shiki themes to Monaco (call after editor is mounted)
export async function applyShikiThemes(monacoInstance: Monaco) {
  await applyShikiThemesBase(monacoInstance)
}

/**
 * Set dynamic completion items for routingA language
 * Use this to add user-configured groups to autocomplete suggestions
 */
export function setDynamicCompletionItems(items: RoutingACompletionItem[]): void {
  setDynamicCompletionItemsBase(items)
}

/**
 * Convert group names to routingA completion items
 * @param groupNames - Array of group names configured by user
 * @returns Completion items for group outbounds
 */
export function createGroupCompletionItems(groupNames: string[]): RoutingACompletionItem[] {
  return groupNames.map((name) => ({
    label: name,
    kind: 'variable',
    detail: 'User group outbound',
    documentation: `Route traffic to group: ${name}`,
    insertText: name,
  }))
}
