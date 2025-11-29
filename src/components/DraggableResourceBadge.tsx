import type { DraggableResourceType } from '~/constants'
import { useDraggable } from '@dnd-kit/core'

import { X } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { SimpleTooltip } from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'

export function DraggableResourceBadge({
  id,
  name,
  type,
  nodeID,
  groupID,
  subscriptionID,
  onRemove,
  dragDisabled,
  children,
}: {
  id: string
  name: string
  type: DraggableResourceType
  nodeID?: string
  groupID?: string
  subscriptionID?: string
  onRemove?: () => void
  dragDisabled?: boolean
  children?: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: {
      type,
      nodeID,
      groupID,
      subscriptionID,
    },
    disabled: dragDisabled,
  })

  const badge = (
    <Badge
      ref={setNodeRef}
      className={cn('pr-1 flex items-center gap-1', isDragging ? 'opacity-50 z-10 cursor-grabbing' : 'cursor-grab')}
    >
      <span {...listeners} {...attributes} className="truncate max-w-[150px]">
        {name}
      </span>
      {onRemove && (
        <Button
          variant="ghost"
          size="xs"
          className="h-4 w-4 p-0 rounded-full hover:bg-primary-foreground/20"
          onClick={onRemove}
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
