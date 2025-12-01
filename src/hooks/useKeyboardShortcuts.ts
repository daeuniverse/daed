import { useCallback, useEffect, useRef } from 'react'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description?: string
  disabled?: boolean
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
}

function isInputElement(element: EventTarget | null): boolean {
  if (!element || !(element instanceof HTMLElement)) return false
  const tagName = element.tagName.toLowerCase()
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || element.isContentEditable
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) {
  const shortcutsRef = useRef(shortcuts)

  // Update ref in useEffect to avoid accessing during render
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Skip if disabled
      if (!enabled) return

      // Skip if target is an input element (unless it's a global shortcut like Escape)
      if (isInputElement(event.target) && event.key !== 'Escape') return

      for (const shortcut of shortcutsRef.current) {
        if (shortcut.disabled) continue

        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !(event.ctrlKey || event.metaKey)
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatch = shortcut.alt ? event.altKey : !event.altKey

        // For shortcuts that need Ctrl/Cmd, accept either
        if (shortcut.ctrl || shortcut.meta) {
          const modifierMatch = event.ctrlKey || event.metaKey
          if (keyMatch && modifierMatch && shiftMatch && altMatch) {
            event.preventDefault()
            shortcut.action()
            return
          }
        } else if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault()
          shortcut.action()
          return
        }
      }
    },
    [enabled],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// Helper to format shortcut keys for display
export function formatShortcutKey(shortcut: KeyboardShortcut): string {
  const parts: string[] = []
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

  if (shortcut.ctrl || shortcut.meta) {
    parts.push(isMac ? '⌘' : 'Ctrl')
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt')
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift')
  }

  // Format the key
  let key = shortcut.key
  if (key === ' ') {
    key = 'Space'
  } else if (key.length === 1) {
    key = key.toUpperCase()
  }

  parts.push(key)

  return parts.join(isMac ? '' : '+')
}
