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

// Monaco utilities
export {
  applyShikiThemes,
  getAllCompletionItems,
  GITHUB_THEMES,
  handleEditorBeforeMount,
  initShikiHighlighter,
  isShikiReady,
  setDynamicCompletionItems,
  SHIKI_THEMES,
} from './monaco'
