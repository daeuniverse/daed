// Constants
export {
  EDITOR_LANGUAGE_ROUTINGA,
  EDITOR_OPTIONS,
  EDITOR_THEME_DARK,
  EDITOR_THEME_DARK_FALLBACK,
  EDITOR_THEME_LIGHT,
  EDITOR_THEME_LIGHT_FALLBACK,
  ROUTINGA_COMPLETION_ITEMS,
} from './constants'
export type { RoutingACompletionItem } from './constants'

// Formatter
export { formatRoutingA } from './formatter'

export type { FormatOptions } from './formatter'
// LSP Client
export { MonacoLspClient } from './lsp-client'

export type {
  CompletionItem,
  ConfigContext,
  Diagnostic,
  Hover,
  Location,
  Position,
  Range,
  TextEdit,
} from './lsp-client'
export { CompletionItemKind, DiagnosticSeverity, InsertTextFormat } from './lsp-client'
// Monaco utilities
export {
  applyShikiThemes,
  getAllCompletionItems,
  GITHUB_THEMES,
  handleEditorBeforeMount,
  initShikiHighlighter,
  isShikiReady,
  registerRoutingALanguage,
  setDynamicCompletionItems,
  SHIKI_THEMES,
} from './monaco'
