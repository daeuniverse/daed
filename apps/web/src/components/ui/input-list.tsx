import type { DraggableProvided, DraggableStateSnapshot, DropResult } from '@hello-pangea/dnd'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { GripVertical, Minus, Plus } from 'lucide-react'
import { useCallback, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'
import { getInstantDropStyle } from '~/utils'

interface InputListProps {
  label: string
  description?: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  withAsterisk?: boolean
  error?: string
  errors?: (string | undefined)[]
}

// Render the draggable item content (shared between normal and clone)
/* eslint-disable react-hooks/refs -- provided object from @hello-pangea/dnd is not a React ref */
function DraggableItemContent({
  provided,
  snapshot,
  value,
  placeholder,
  error,
  onChange,
  onRemove,
  removeLabel,
}: {
  provided: DraggableProvided
  snapshot: DraggableStateSnapshot
  value: string
  placeholder?: string
  error?: string
  onChange?: (value: string) => void
  onRemove?: () => void
  removeLabel?: string
}) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={getInstantDropStyle(provided, snapshot)}
      className="flex flex-col gap-1"
    >
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-lg border bg-card',
          'transition-[shadow,border-color,opacity] duration-200',
          'hover:border-primary/30',
          snapshot.isDragging && 'opacity-95 shadow-lg border-primary/50 z-[9999]',
        )}
      >
        <div
          className="flex items-center justify-center h-6 w-5 cursor-grab active:cursor-grabbing touch-none shrink-0"
          {...provided.dragHandleProps}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors" />
        </div>

        <div className="min-w-0 flex-1">
          <Input
            value={value}
            placeholder={placeholder}
            className={cn('h-8', error && 'border-destructive')}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            readOnly={!onChange}
          />
        </div>

        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={onRemove}
            aria-label={removeLabel}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-destructive pl-8">{error}</p>}
    </div>
  )
}
/* eslint-enable react-hooks/refs */

// Helper function to reorder array
function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// Portal wrapper for dragging items (fixes position:fixed issues in modals with transforms)
function PortalAwareItem({
  snapshot,
  children,
}: {
  provided: DraggableProvided
  snapshot: DraggableStateSnapshot
  children: React.ReactNode
}) {
  if (snapshot.isDragging) {
    return createPortal(children, document.body)
  }
  return <>{children}</>
}

export function InputList({
  label,
  description,
  values,
  onChange,
  placeholder,
  withAsterisk = true,
  error,
  errors,
}: InputListProps) {
  const { t } = useTranslation()
  const baseId = useId()

  // Track stable IDs for each item
  const [idCounter, setIdCounter] = useState(values.length)
  const [itemIds, setItemIds] = useState<string[]>(() => values.map((_, i) => `${baseId}-${i}`))

  // Ensure itemIds matches values length
  const getItemIds = useCallback(() => {
    if (itemIds.length === values.length) {
      return itemIds
    }
    // This is a fallback - normally add/remove handlers maintain sync
    return values.map((_, i) => itemIds[i] || `${baseId}-${i}`)
  }, [itemIds, values, baseId])

  const currentIds = getItemIds()

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const sourceIndex = result.source.index
    const destIndex = result.destination.index

    if (sourceIndex === destIndex) {
      return
    }

    // Reorder both values and IDs together
    const newValues = reorder(values, sourceIndex, destIndex)
    const newItemIds = reorder(currentIds, sourceIndex, destIndex)
    setItemIds(newItemIds)
    onChange(newValues)
  }

  const handleRemove = (index: number) => {
    const newValues = values.filter((_, idx) => idx !== index)
    const newItemIds = currentIds.filter((_, idx) => idx !== index)
    setItemIds(newItemIds)
    onChange(newValues)
  }

  const handleAdd = () => {
    const newId = `${baseId}-${idCounter}`
    setIdCounter(idCounter + 1)
    setItemIds([...currentIds, newId])
    onChange([...values, ''])
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className={cn('text-sm font-medium', error && 'text-destructive')}>
          {label} {withAsterisk && <span className="text-destructive">*</span>}
        </Label>
        <Button
          type="button"
          variant="default"
          size="icon"
          className="h-5 w-5 bg-green-600 hover:bg-green-700"
          onClick={handleAdd}
          aria-label={t('a11y.addItem')}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="input-list">
          {(droppableProvided, droppableSnapshot) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className={cn(
                'flex flex-col gap-2 min-h-[40px] rounded-lg p-1 -m-1',
                droppableSnapshot.isDraggingOver && 'bg-primary/5',
              )}
            >
              {values.map((value, index) => (
                <Draggable key={currentIds[index]} draggableId={currentIds[index]} index={index}>
                  {(provided, snapshot) => (
                    <PortalAwareItem provided={provided} snapshot={snapshot}>
                      <DraggableItemContent
                        provided={provided}
                        snapshot={snapshot}
                        value={value}
                        placeholder={placeholder}
                        error={errors?.[index]}
                        onChange={(newValue) => {
                          const newValues = [...values]
                          newValues[index] = newValue
                          onChange(newValues)
                        }}
                        onRemove={() => handleRemove(index)}
                        removeLabel={t('a11y.removeItem')}
                      />
                    </PortalAwareItem>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
