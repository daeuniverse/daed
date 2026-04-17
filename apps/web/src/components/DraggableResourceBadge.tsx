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
  meta,
  onRemove,
  children,
}: {
  id: string
  index: number
  name: string
  meta?: React.ReactNode
  onRemove?: () => void
  children?: React.ReactNode
}) {
  const card = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={getInstantDropStyle(provided, snapshot)}
      className={cn(
        'group relative flex min-h-10 items-center gap-2 rounded-lg border bg-card px-3 py-2 select-none',
        'transition-[shadow,border-color,opacity] duration-150',
        'hover:shadow-sm hover:border-primary/30',
        snapshot.isDragging && 'opacity-90 z-10 shadow-md',
      )}
    >
      {/* Drag handle */}
      <div
        className="flex shrink-0 cursor-grab items-center justify-center rounded-md p-1.5 touch-none active:cursor-grabbing"
        {...provided.dragHandleProps}
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
      </div>

      {/* Name */}
      <span className="text-xs font-medium truncate flex-1">{name}</span>

      {meta && <span className="shrink-0 text-[10px] font-medium text-primary">{meta}</span>}

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
