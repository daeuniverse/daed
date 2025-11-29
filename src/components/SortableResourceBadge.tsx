import type { DraggableResourceType } from '~/constants'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { X } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
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

  const badge = (
    <Badge
      ref={setNodeRef}
      style={style}
      className={cn(
        'pr-1 flex items-center gap-1 touch-none select-none',
        isDragging ? 'opacity-50 z-10 cursor-grabbing' : 'cursor-grab',
      )}
      {...listeners}
      {...attributes}
    >
      <span className="truncate max-w-[150px]">{name}</span>
      {onRemove && (
        <Button
          variant="ghost"
          size="xs"
          className="h-4 w-4 p-0 rounded-full hover:bg-primary-foreground/20"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Badge>
  )

  if (children) {
    return <SimpleTooltip label={<span className="text-xs">{children}</span>}>{badge}</SimpleTooltip>
  }

  return badge
}
