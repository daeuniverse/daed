import type { DraggableResourceType } from '~/constants'
import { useDraggable } from '@dnd-kit/core'
import { GripVertical, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'

export function DraggableResourceCard({
  id,
  nodeID,
  subscriptionID,
  type,
  name,
  leftSection,
  onRemove,
  actions,
  children,
}: {
  id: string
  nodeID?: string
  subscriptionID?: string
  type: DraggableResourceType
  name: React.ReactNode
  leftSection?: React.ReactNode
  onRemove: () => void
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { type, nodeID, subscriptionID },
  })
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <div
        ref={setNodeRef}
        className={cn(
          'group relative bg-card rounded-xl border transition-all duration-200',
          'hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5',
          'cursor-grab active:cursor-grabbing touch-none select-none',
          isDragging && 'opacity-50 shadow-lg scale-[1.02] z-50',
        )}
        {...listeners}
        {...attributes}
      >
        {/* Drag handle indicator */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="p-3 pl-7">
          {/* Header with protocol badge and name */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {leftSection && (
                <Badge variant="secondary" className="shrink-0 text-xs font-medium px-2 py-0.5">
                  {leftSection}
                </Badge>
              )}
              <h4 className="font-semibold text-sm truncate">{name}</h4>
            </div>

            {/* Actions - visible on hover */}
            <div
              className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {actions}
              <Button
                variant="ghost"
                size="xs"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('actions.remove')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t('confirmModal.removeConfirmDescription')}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t('confirmModal.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onRemove()
                setConfirmOpen(false)
              }}
            >
              {t('confirmModal.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
