import { Plus } from 'lucide-react'

import { Button } from '~/components/ui/button'
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
          <Button variant="ghost" size="icon" onClick={onCreate}>
            {iconPlus || <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}
