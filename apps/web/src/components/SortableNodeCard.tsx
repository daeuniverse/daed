import type { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd'
import { Draggable } from '@hello-pangea/dnd'
import { GripVertical, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { SimpleTooltip } from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'
import { getInstantDropStyle } from '~/utils'

export function SortableNodeCard({
  id,
  index,
  name,
  leftSection,
  onRemove,
  actions,
  children,
}: {
  id: string
  index: number
  name: React.ReactNode
  leftSection?: React.ReactNode
  onRemove: () => void
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  const { t } = useTranslation()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={getInstantDropStyle(provided, snapshot)}
            className={cn(
              'group relative bg-card rounded-xl border',
              'transition-[shadow,border-color,opacity] duration-200',
              'hover:shadow-md hover:border-primary/30',
              snapshot.isDragging && 'opacity-90 shadow-lg z-50',
            )}
          >
            {/* Drag handle */}
            <div
              className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing touch-none"
              {...provided.dragHandleProps}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            </div>

            <div className="p-3 pl-8">
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

                {/* Actions - always visible on mobile, hover on desktop */}
                <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                  {actions}
                  <SimpleTooltip label={t('actions.remove')}>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => setConfirmOpen(true)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </SimpleTooltip>
                </div>
              </div>

              {/* Content */}
              <div className="text-sm text-muted-foreground">{children}</div>
            </div>
          </div>
        )}
      </Draggable>

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
