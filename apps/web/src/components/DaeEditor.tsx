import type { Monaco } from '@monaco-editor/react'
import type * as monacoEditor from 'monaco-editor'
import { Editor } from '@monaco-editor/react'
import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EDITOR_OPTIONS, EDITOR_THEME_DARK, EDITOR_THEME_LIGHT } from '~/constants'
import {
  applyShikiThemes,
  getLspClient,
  handleEditorBeforeMount,
  initLsp,
  isShikiReady,
  syncModelWithLsp,
} from '~/monaco'

import { colorSchemeAtom } from '~/store'

/**
 * Config type for the editor - used to filter completions appropriately
 */
export type DaeConfigType = 'routing' | 'dns'

export interface DaeEditorProps {
  /** The config text content */
  value: string
  /** Callback when content changes */
  onChange: (value: string) => void
  /** Type of config being edited - affects completion filtering */
  configType?: DaeConfigType
  /** CSS height - defaults to 100% */
  height?: string | number
  /** Whether the editor is disabled */
  disabled?: boolean
}

/**
 * DAE config editor component with LSP support
 *
 * Wraps Monaco editor with:
 * - Shiki syntax highlighting
 * - DAE LSP for completions, hover, diagnostics
 * - Context-aware completion filtering based on configType
 */
export function DaeEditor({ value, onChange, configType = 'routing', height = '100%', disabled }: DaeEditorProps) {
  const colorScheme = useStore(colorSchemeAtom)
  const [, forceUpdate] = useState({})
  const monacoRef = useRef<Monaco | null>(null)
  const lspSyncRef = useRef<{ dispose: () => void } | null>(null)
  const modelRef = useRef<monacoEditor.editor.ITextModel | null>(null)

  // Cleanup LSP sync on unmount
  useEffect(() => {
    return () => {
      lspSyncRef.current?.dispose()
      lspSyncRef.current = null
    }
  }, [])

  // Update config type context for LSP
  useEffect(() => {
    const lspClient = getLspClient()
    if (lspClient) {
      lspClient.setConfigContext(configType)
    }
  }, [configType])

  const handleEditorDidMount = useCallback(
    async (
      editor: Parameters<typeof Editor>[0]['onMount'] extends ((e: infer E, ...args: unknown[]) => void) | undefined
        ? E
        : never,
      monacoInstance: Monaco,
    ) => {
      monacoRef.current = monacoInstance

      // Apply Shiki themes if not ready
      if (!isShikiReady()) {
        await applyShikiThemes(monacoInstance)
        forceUpdate({})
      }

      // Initialize LSP client
      await initLsp(monacoInstance)

      // Set config context for completion filtering
      const lspClient = getLspClient()
      if (lspClient) {
        lspClient.setConfigContext(configType)
      }

      // Sync document with LSP
      const model = editor.getModel()
      if (model) {
        modelRef.current = model
        lspSyncRef.current?.dispose()
        lspSyncRef.current = syncModelWithLsp(model)
      }
    },
    [configType],
  )

  const theme = isShikiReady()
    ? colorScheme === 'dark'
      ? EDITOR_THEME_DARK
      : EDITOR_THEME_LIGHT
    : colorScheme === 'dark'
      ? 'vs-dark'
      : 'vs'

  return (
    <Editor
      height={height}
      theme={theme}
      options={{
        ...EDITOR_OPTIONS,
        readOnly: disabled,
      }}
      language={configType === 'dns' ? 'dnsA' : 'routingA'}
      value={value}
      onChange={(v) => onChange(v || '')}
      beforeMount={handleEditorBeforeMount}
      onMount={handleEditorDidMount}
    />
  )
}
