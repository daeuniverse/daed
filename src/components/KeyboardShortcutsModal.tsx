import { useTranslation } from 'react-i18next'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Kbd, KbdGroup } from '~/components/ui/kbd'
import { Separator } from '~/components/ui/separator'

export interface ShortcutItem {
  keys: string[]
  descriptionKey: string
}

export interface ShortcutGroup {
  titleKey: string
  items: ShortcutItem[]
}

const shortcutGroups: ShortcutGroup[] = [
  {
    titleKey: 'shortcuts.categories.general',
    items: [
      { keys: ['?'], descriptionKey: 'shortcuts.help' },
      { keys: ['Ctrl/⌘', 'K'], descriptionKey: 'shortcuts.commandPalette' },
    ],
  },
  {
    titleKey: 'shortcuts.categories.appearance',
    items: [
      { keys: ['Ctrl/⌘', 'D'], descriptionKey: 'shortcuts.toggleTheme' },
      { keys: ['Ctrl/⌘', 'L'], descriptionKey: 'shortcuts.toggleLanguage' },
    ],
  },
  {
    titleKey: 'shortcuts.categories.actions',
    items: [
      { keys: ['Ctrl/⌘', 'S'], descriptionKey: 'shortcuts.toggleRunning' },
      { keys: ['Ctrl/⌘', 'R'], descriptionKey: 'shortcuts.reload' },
    ],
  },
]

interface KeyboardShortcutsModalProps {
  opened: boolean
  onClose: () => void
}

export function KeyboardShortcutsModal({ opened, onClose }: KeyboardShortcutsModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('shortcuts.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {shortcutGroups.map((group, groupIndex) => (
            <div key={group.titleKey}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t(group.titleKey)}</h3>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div key={item.descriptionKey} className="flex items-center justify-between">
                    <span className="text-sm">{t(item.descriptionKey)}</span>
                    <KbdGroup>
                      {item.keys.map((key, keyIndex) => (
                        <Kbd key={keyIndex}>{key}</Kbd>
                      ))}
                    </KbdGroup>
                  </div>
                ))}
              </div>
              {groupIndex < shortcutGroups.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>

        <div className="pt-4 text-xs text-muted-foreground text-center">{t('shortcuts.tip')}</div>
      </DialogContent>
    </Dialog>
  )
}
