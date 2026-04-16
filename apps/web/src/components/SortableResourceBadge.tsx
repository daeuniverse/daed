import type { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd'
import { Draggable } from '@hello-pangea/dnd'
import { GripVertical, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { SimpleTooltip } from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'
import { getInstantDropStyle } from '~/utils'

export function SortableResourceBadge({
  id,
  index,
  name,
  protocol,
  address,
  onRemove,
  children,
}: {
  id: string
  index: number
  name: string
  protocol?: string | null
  address?: string | null
  onRemove?: () => void
  children?: React.ReactNode
}) {
  const card = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={getInstantDropStyle(provided, snapshot)}
      className={cn(
        'group relative flex min-h-11 items-center gap-2 overflow-hidden rounded-lg border bg-card px-3.5 py-2.5 select-none',
        'transition-[shadow,border-color,opacity,background-color] duration-200',
        'hover:shadow-sm hover:border-primary/30 hover:bg-accent/50',
        snapshot.isDragging && 'opacity-90 z-10 shadow-lg ring-2 ring-primary/20',
      )}
    >
      {/* Drag handle */}
      <div
        className="flex shrink-0 cursor-grab items-center justify-center rounded-md p-1.5 touch-none active:cursor-grabbing"
        {...provided.dragHandleProps}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/70" />
      </div>

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
