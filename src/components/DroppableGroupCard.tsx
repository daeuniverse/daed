import { useDroppable } from '@dnd-kit/core'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'

export function DroppableGroupCard({
  id,
  name,
  onRemove,
  actions,
  children,
}: {
  id: string
  name: string
  onRemove?: () => void
  actions?: React.ReactNode
  children?: React.ReactNode
}) {
  const { t } = useTranslation()
  const { isOver, setNodeRef } = useDroppable({ id })
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <Card ref={setNodeRef} withBorder shadow="sm" padding="sm" className={cn(isOver && 'opacity-50')}>
        <div className="border-b pb-2">
          <div className="flex items-center justify-between">
            <h5 className="font-semibold">{name}</h5>

            <div className="flex items-center gap-2">
              {actions}

              {onRemove && (
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {children && <div className="pt-2">{children}</div>}
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
                onRemove?.()
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
