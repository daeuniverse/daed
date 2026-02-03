import type { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd'
import { Draggable } from '@hello-pangea/dnd'
import { GripVertical, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { SimpleTooltip } from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'
import { getInstantDropStyle } from '~/utils'

export function DraggableResourceBadge({
  id,
  index,
  name,
  onRemove,
  children,
}: {
  id: string
  index: number
  name: string
  onRemove?: () => void
  children?: React.ReactNode
}) {
  const card = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getInstantDropStyle(provided, snapshot)}
      className={cn(
        'group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-card select-none',
        'transition-[shadow,border-color,opacity] duration-150',
        'hover:shadow-sm hover:border-primary/30',
        snapshot.isDragging ? 'opacity-90 z-10 cursor-grabbing shadow-md' : 'cursor-grab',
      )}
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
          className="h-4 w-4 p-0 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        const cardElement = card(provided, snapshot)
        if (children) {
          return <SimpleTooltip label={<span className="text-xs">{children}</span>}>{cardElement}</SimpleTooltip>
        }
        return cardElement
      }}
    </Draggable>
  )
}
