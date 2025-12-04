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

// Helper to check if Ctrl or Cmd modifier is pressed (cross-platform)
function hasCtrlOrCmdModifier(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey
}

// Helper to detect Mac platform
function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false
  // Use userAgentData if available, fallback to userAgent
  if ('userAgentData' in navigator && navigator.userAgentData) {
    return (navigator.userAgentData as { platform: string }).platform === 'macOS'
  }
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
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
        const altMatch = shortcut.alt ? event.altKey : !event.altKey

        // For shift key: if shortcut.shift is explicitly set, require shift to be pressed
        // If shortcut.shift is not set, we need to be smarter:
        // - For special characters like '?', '!', '@', etc., shift is naturally required
        // - For regular letters/numbers, shift should NOT be pressed
        const isSpecialCharKey = /^[?!@#$%^&*()_+{}|:"<>~]$/.test(shortcut.key)
        const shiftMatch = shortcut.shift ? event.shiftKey : isSpecialCharKey ? true : !event.shiftKey

        // For shortcuts that need Ctrl/Cmd, accept either modifier (cross-platform support)
        if (shortcut.ctrl || shortcut.meta) {
          if (keyMatch && hasCtrlOrCmdModifier(event) && shiftMatch && altMatch) {
            event.preventDefault()
            shortcut.action()
            return
          }
        } else {
          // For shortcuts without Ctrl/Cmd, ensure neither is pressed
          const noCtrlOrCmd = !hasCtrlOrCmdModifier(event)
          if (keyMatch && noCtrlOrCmd && shiftMatch && altMatch) {
            event.preventDefault()
            shortcut.action()
            return
          }
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
  const isMac = isMacPlatform()

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
