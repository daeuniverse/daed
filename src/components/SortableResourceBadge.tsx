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
        'group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-card',
        'transition-all duration-150 touch-none select-none',
        'hover:shadow-sm hover:border-primary/30',
        isDragging ? 'opacity-50 z-10 cursor-grabbing shadow-md' : 'cursor-grab',
      )}
      {...listeners}
      {...attributes}
    >
      {/* Drag handle */}
      <GripVertical className="h-3 w-3 text-muted-foreground/50 shrink-0" />

      {/* Name */}
      <span className="text-xs font-medium truncate flex-1">{name}</span>

      {/* Remove button */}
      {onRemove && (
        <Button
          variant="ghost"
          size="xs"
          className="h-4 w-4 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
