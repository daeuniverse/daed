import type { DragEndEvent } from '@dnd-kit/core'
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Minus, Plus } from 'lucide-react'
import { useCallback, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'

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

interface SortableInputItemProps {
  id: string
  value: string
  placeholder?: string
  error?: string
  onChange: (value: string) => void
  onRemove: () => void
  removeLabel: string
  dragLabel: string
}

function SortableInputItem({
  id,
  value,
  placeholder,
  error,
  onChange,
  onRemove,
  removeLabel,
  dragLabel,
}: SortableInputItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col gap-1">
      <div className={cn('flex items-center gap-2 rounded-lg transition-all', isDragging && 'opacity-50 z-10')}>
        <div
          className="flex items-center justify-center h-8 w-6 cursor-grab active:cursor-grabbing touch-none shrink-0"
          aria-label={dragLabel}
          {...listeners}
          {...attributes}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground/50" />
        </div>

        <div className="min-w-0 flex-1">
          <Input
            value={value}
            placeholder={placeholder}
            className={cn(error && 'border-destructive')}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>

        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onRemove}
          aria-label={removeLabel}
        >
          <Minus className="h-3 w-3" />
        </Button>
      </div>
      {error && <p className="text-xs text-destructive pl-8">{error}</p>}
    </div>
  )
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
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  )

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = currentIds.indexOf(String(active.id))
      const newIndex = currentIds.indexOf(String(over.id))

      if (oldIndex !== -1 && newIndex !== -1) {
        // Reorder both values and IDs together
        const newValues = arrayMove(values, oldIndex, newIndex)
        const newItemIds = arrayMove(currentIds, oldIndex, newIndex)
        setItemIds(newItemIds)
        onChange(newValues)
      }
    }
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={currentIds} strategy={verticalListSortingStrategy}>
          {values.map((value, index) => (
            <SortableInputItem
              key={currentIds[index]}
              id={currentIds[index]}
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
              dragLabel={t('a11y.dragToReorder')}
            />
          ))}
        </SortableContext>
      </DndContext>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
