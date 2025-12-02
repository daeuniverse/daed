import type { ThemeDefinition, ThemeId } from '~/constants'
import { useStore } from '@nanostores/react'
import { Check, Monitor, Moon, Palette, Sun } from 'lucide-react'
import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { themes } from '~/constants'
import { useColorScheme } from '~/contexts'
import { useMediaQuery } from '~/hooks'
import { cn } from '~/lib/utils'
import { appStateAtom } from '~/store'

interface ThemePreviewCardProps {
  theme: ThemeDefinition
  isDark: boolean
  isSelected: boolean
  onClick: () => void
}

function ThemePreviewCard({ theme, isDark, isSelected, onClick }: ThemePreviewCardProps) {
  const colors = isDark ? theme.dark : theme.light

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col gap-2 rounded-lg border-2 p-3 transition-all hover:scale-[1.02]',
        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50',
      )}
      style={{
        backgroundColor: colors.background,
      }}
    >
      {isSelected && (
        <div
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.primary }}
        >
          <Check className="h-3 w-3" style={{ color: colors.primaryForeground }} />
        </div>
      )}

      {/* Theme name */}
      <span className="text-xs font-medium" style={{ color: colors.foreground }}>
        {theme.name}
      </span>

      {/* Color preview */}
      <div className="flex gap-1">
        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: colors.primary }} />
        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: colors.secondary }} />
        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: colors.accent }} />
        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: colors.muted }} />
      </div>

      {/* UI preview */}
      <div className="flex flex-col gap-1.5 rounded-md p-2" style={{ backgroundColor: colors.card }}>
        {/* Header preview */}
        <div className="flex items-center justify-between">
          <div className="h-2 w-12 rounded" style={{ backgroundColor: colors.primary }} />
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.mutedForeground }} />
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.mutedForeground }} />
          </div>
        </div>

        {/* Content preview */}
        <div className="flex gap-1.5">
          <div className="h-6 w-6 rounded" style={{ backgroundColor: colors.accent }} />
          <div className="flex flex-1 flex-col gap-1">
            <div className="h-1.5 w-full rounded" style={{ backgroundColor: colors.foreground, opacity: 0.7 }} />
            <div className="h-1.5 w-2/3 rounded" style={{ backgroundColor: colors.mutedForeground }} />
          </div>
        </div>

        {/* Button preview */}
        <div className="flex gap-1">
          <div className="h-3 flex-1 rounded" style={{ backgroundColor: colors.primary }} />
          <div className="h-3 flex-1 rounded" style={{ backgroundColor: colors.secondary }} />
        </div>
      </div>
    </button>
  )
}

interface ThemeModeToggleProps {
  className?: string
}

function ThemeModeToggle({ className }: ThemeModeToggleProps) {
  const { t } = useTranslation()
  const { themeMode, setThemeMode } = useColorScheme()

  const modes = [
    { value: 'system' as const, icon: Monitor, label: t('theme.system') },
    { value: 'light' as const, icon: Sun, label: t('theme.light') },
    { value: 'dark' as const, icon: Moon, label: t('theme.dark') },
  ]

  return (
    <div className={cn('flex items-center gap-1 rounded-lg bg-muted p-1', className)}>
      {modes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setThemeMode(value)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            themeMode === value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}

interface ThemePickerProps {
  variant?: 'icon' | 'button'
}

export function ThemePicker({ variant = 'icon' }: ThemePickerProps) {
  const { t } = useTranslation()
  const appState = useStore(appStateAtom)
  const { colorScheme } = useColorScheme()
  const [open, setOpen] = useState(false)
  const matchSmallScreen = useMediaQuery('(max-width: 640px)')

  const currentThemeId = appState.colorTheme || 'amber'
  const isDark = colorScheme === 'dark'

  const setColorTheme = useCallback((themeId: ThemeId) => {
    appStateAtom.setKey('colorTheme', themeId)
  }, [])

  const currentTheme = themes.find((t) => t.id === currentThemeId) || themes[0]
  const currentColors = isDark ? currentTheme.dark : currentTheme.light

  const content = (
    <div className="flex flex-col gap-4">
      {/* Theme mode toggle */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">{t('theme.mode')}</span>
        <ThemeModeToggle />
      </div>

      {/* Color themes */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">{t('theme.color')}</span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {themes.map((theme) => (
            <ThemePreviewCard
              key={theme.id}
              theme={theme}
              isDark={isDark}
              isSelected={theme.id === currentThemeId}
              onClick={() => setColorTheme(theme.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )

  // Button variant for mobile menu - shows full width button with text
  if (variant === 'button') {
    return (
      <Fragment>
        <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2" onClick={() => setOpen(true)}>
          <Palette className="h-4 w-4" style={{ color: currentColors.primary }} />
          <span className="text-sm">{t('theme.title')}</span>
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>{t('theme.title')}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto overflow-x-hidden">{content}</div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="w-full">
                  {t('actions.cancel')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Fragment>
    )
  }

  // Use dialog on small screens, popover on larger screens
  if (matchSmallScreen) {
    return (
      <Fragment>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setOpen(true)}
          style={{
            color: currentColors.primary,
          }}
        >
          <Palette className="h-5 w-5" />
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>{t('theme.title')}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto overflow-x-hidden">{content}</div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="w-full">
                  {t('actions.cancel')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Fragment>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          style={{
            color: currentColors.primary,
          }}
        >
          <Palette className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[480px] p-4">
        <div className="mb-3 text-sm font-medium">{t('theme.title')}</div>
        {content}
      </PopoverContent>
    </Popover>
  )
}

// Export for use in mobile menu
export { ThemeModeToggle }
