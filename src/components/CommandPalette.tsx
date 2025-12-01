import { Keyboard, Languages, Monitor, Moon, RefreshCw, Sun, Wifi } from 'lucide-react'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '~/components/ui/command'
import { Kbd, KbdGroup } from '~/components/ui/kbd'

export interface CommandAction {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string[]
  action: () => void
  disabled?: boolean
  group: 'general' | 'appearance' | 'actions'
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actions: CommandAction[]
}

// Helper to detect Mac platform
function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false
  if ('userAgentData' in navigator && (navigator.userAgentData as { platform?: string }).platform) {
    return (navigator.userAgentData as { platform: string }).platform === 'macOS'
  }
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
}

// Format shortcut for display
function formatShortcut(keys: string[]): string[] {
  const isMac = isMacPlatform()
  return keys.map((key) => {
    if (key === 'Ctrl/⌘') {
      return isMac ? '⌘' : 'Ctrl'
    }
    return key
  })
}

export function CommandPalette({ open, onOpenChange, actions }: CommandPaletteProps) {
  const { t } = useTranslation()

  // Listen for ⌘P / Ctrl+P keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  // Group actions by category
  const groupedActions = useMemo(() => {
    const groups: Record<string, CommandAction[]> = {
      general: [],
      appearance: [],
      actions: [],
    }

    for (const action of actions) {
      if (groups[action.group]) {
        groups[action.group].push(action)
      }
    }

    return groups
  }, [actions])

  const handleSelect = (action: CommandAction) => {
    if (!action.disabled) {
      action.action()
      onOpenChange(false)
    }
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('shortcuts.commandPalette')}
      description={t('shortcuts.tip')}
    >
      <CommandInput placeholder={`${t('shortcuts.commandPalette')}...`} />
      <CommandList>
        <CommandEmpty>{t('empty')}</CommandEmpty>

        {groupedActions.general.length > 0 && (
          <CommandGroup heading={t('shortcuts.categories.general')}>
            {groupedActions.general.map((action) => (
              <CommandItem key={action.id} onSelect={() => handleSelect(action)} disabled={action.disabled}>
                {action.icon}
                <span>{action.label}</span>
                {action.shortcut && (
                  <CommandShortcut>
                    <KbdGroup>
                      {formatShortcut(action.shortcut).map((key, index) => (
                        <Kbd key={index}>{key}</Kbd>
                      ))}
                    </KbdGroup>
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groupedActions.appearance.length > 0 && (
          <CommandGroup heading={t('shortcuts.categories.appearance')}>
            {groupedActions.appearance.map((action) => (
              <CommandItem key={action.id} onSelect={() => handleSelect(action)} disabled={action.disabled}>
                {action.icon}
                <span>{action.label}</span>
                {action.shortcut && (
                  <CommandShortcut>
                    <KbdGroup>
                      {formatShortcut(action.shortcut).map((key, index) => (
                        <Kbd key={index}>{key}</Kbd>
                      ))}
                    </KbdGroup>
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groupedActions.actions.length > 0 && (
          <CommandGroup heading={t('shortcuts.categories.actions')}>
            {groupedActions.actions.map((action) => (
              <CommandItem key={action.id} onSelect={() => handleSelect(action)} disabled={action.disabled}>
                {action.icon}
                <span>{action.label}</span>
                {action.shortcut && (
                  <CommandShortcut>
                    <KbdGroup>
                      {formatShortcut(action.shortcut).map((key, index) => (
                        <Kbd key={index}>{key}</Kbd>
                      ))}
                    </KbdGroup>
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}

// Export default actions factory for use in Header
export function useCommandPaletteActions({
  cycleThemeMode,
  toggleLanguage,
  toggleRunning,
  reloadConfig,
  openShortcutsModal,
  themeMode,
  isModified,
}: {
  cycleThemeMode: () => void
  toggleLanguage: () => void
  toggleRunning: () => void
  reloadConfig: () => void
  openShortcutsModal: () => void
  themeMode: 'system' | 'light' | 'dark'
  isModified: boolean
}): CommandAction[] {
  const { t } = useTranslation()

  const getThemeIcon = useCallback(() => {
    switch (themeMode) {
      case 'system':
        return <Monitor className="h-4 w-4" />
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
    }
  }, [themeMode])

  return useMemo(
    () =>
      [
        // General
        {
          id: 'help',
          label: t('shortcuts.help'),
          icon: <Keyboard className="h-4 w-4" />,
          shortcut: ['?'],
          action: openShortcutsModal,
          group: 'general',
        },
        // Appearance
        {
          id: 'toggle-theme',
          label: t('shortcuts.toggleTheme'),
          icon: getThemeIcon(),
          shortcut: ['Ctrl/⌘', 'D'],
          action: cycleThemeMode,
          group: 'appearance',
        },
        {
          id: 'toggle-language',
          label: t('shortcuts.toggleLanguage'),
          icon: <Languages className="h-4 w-4" />,
          shortcut: ['Ctrl/⌘', 'L'],
          action: toggleLanguage,
          group: 'appearance',
        },
        // Actions
        {
          id: 'toggle-running',
          label: t('shortcuts.toggleRunning'),
          icon: <Wifi className="h-4 w-4" />,
          shortcut: ['Ctrl/⌘', 'S'],
          action: toggleRunning,
          group: 'actions',
        },
        {
          id: 'reload-config',
          label: t('shortcuts.reload'),
          icon: <RefreshCw className="h-4 w-4" />,
          shortcut: ['Ctrl/⌘', 'R'],
          action: reloadConfig,
          disabled: !isModified,
          group: 'actions',
        },
      ] as CommandAction[],
    [t, cycleThemeMode, toggleLanguage, toggleRunning, reloadConfig, openShortcutsModal, getThemeIcon, isModified],
  )
}
