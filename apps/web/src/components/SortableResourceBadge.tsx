import type { DraggableResourceType } from '~/constants'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { GripVertical, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { SimpleTooltip } from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'

export function SortableResourceBadge({
  id,
  name,
  type,
  nodeID,
  groupID,
  subscriptionID,
  protocol,
  address,
  onRemove,
  disabled,
  children,
}: {
  id: string
  name: string
  type: DraggableResourceType
  nodeID?: string
  groupID?: string
  subscriptionID?: string
  protocol?: string | null
  address?: string | null
  onRemove?: () => void
  disabled?: boolean
  children?: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      type,
      nodeID,
      groupID,
      subscriptionID,
    },
    disabled,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const card = (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex items-center gap-2 px-3 py-2 rounded-lg border bg-card',
        'transition-all duration-200 touch-none select-none',
        'hover:shadow-sm hover:border-primary/30 hover:bg-accent/50',
        isDragging ? 'opacity-50 z-10 cursor-grabbing shadow-lg ring-2 ring-primary/20' : 'cursor-grab',
      )}
      {...listeners}
      {...attributes}
    >
      {/* Drag handle */}
      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground/70 transition-colors" />

      {/* Protocol badge */}
      {protocol && (
        <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded bg-primary/10 text-primary">
          {protocol}
        </span>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium truncate block">{name}</span>
        {address && <span className="text-[10px] text-muted-foreground truncate block mt-0.5">{address}</span>}
      </div>

      {/* Remove button */}
      {onRemove && (
        <Button
          variant="ghost"
          size="xs"
          className="h-5 w-5 p-0 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )

  if (children) {
    return <SimpleTooltip label={<span className="text-xs">{children}</span>}>{card}</SimpleTooltip>
  }

  return card
}
