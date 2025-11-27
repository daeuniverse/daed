import { useDraggable } from '@dnd-kit/core'
import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { DraggableResourceType } from '~/constants'
import { cn } from '~/lib/utils'

export const DraggableResourceCard = ({
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
}) => {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, data: { type, nodeID, subscriptionID } })
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <Card ref={setNodeRef} padding="sm" withBorder shadow="sm" className={cn(isDragging && 'opacity-50')}>
        <div className="border-b pb-2 mb-2">
          <div className="flex items-center justify-between gap-2">
            {leftSection}

            <Badge size="lg" className="flex-1 cursor-grab" {...listeners} {...attributes}>
              <span className="truncate">{name}</span>
            </Badge>

            <div className="flex items-center gap-2">
              {actions}

              <Button
                variant="ghost"
                size="xs"
                className="text-destructive hover:text-destructive"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div>{children}</div>
      </Card>

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
