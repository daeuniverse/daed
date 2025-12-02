import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'
import { SimpleTooltip } from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'

export function Section({
  title,
  icon,
  bordered,
  iconPlus,
  onCreate,
  actions,
  highlight,
  children,
}: {
  title: string
  icon?: React.ReactNode
  bordered?: boolean
  iconPlus?: React.ReactNode
  onCreate: () => void
  actions?: React.ReactNode
  highlight?: boolean
  children: React.ReactNode
}) {
  const { t } = useTranslation()

  return (
    <div
      data-testid="section"
      className={cn(
        'flex flex-col gap-2',
        bordered && 'border rounded-sm p-2 shadow-md transition-colors',
        highlight && 'bg-primary/20',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="text-lg font-semibold text-primary">{title}</h4>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <SimpleTooltip label={t('actions.add')}>
            <Button variant="ghost" size="icon" onClick={onCreate}>
              {iconPlus || <Plus className="h-4 w-4" />}
            </Button>
          </SimpleTooltip>
        </div>
      </div>

      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}
