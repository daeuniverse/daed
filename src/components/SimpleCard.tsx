import { Eye, Trash2 } from 'lucide-react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import {
  ScrollableDialogBody,
  ScrollableDialogContent,
  ScrollableDialogHeader,
} from '~/components/ui/scrollable-dialog'
import { cn } from '~/lib/utils'

export function SimpleCard({
  name,
  selected,
  onSelect,
  onRemove,
  actions,
  children,
}: {
  name: string
  selected: boolean
  onSelect?: () => void
  onRemove?: () => void
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  const { t } = useTranslation()
  const [openedDetailsModal, setOpenedDetailsModal] = useState(false)
  const [openedConfirmModal, setOpenedConfirmModal] = useState(false)

  return (
    <Fragment>
      <div className="relative">
        {selected && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-primary z-10" />
        )}
        <Card withBorder shadow="sm" padding="none">
          <div className="flex items-center justify-between border-b">
            <button
              type="button"
              className={cn('flex-1 p-3 text-left hover:bg-accent transition-colors', selected && 'bg-accent/50')}
              onClick={onSelect}
            >
              <h4 className="font-semibold">{name}</h4>
            </button>

            <div className="flex items-center gap-2 p-3">
              {actions}

              <Button variant="ghost" size="xs" onClick={() => setOpenedDetailsModal(true)}>
                <Eye className="h-4 w-4" />
              </Button>

              {!selected && onRemove && (
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setOpenedConfirmModal(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={openedDetailsModal} onOpenChange={setOpenedDetailsModal}>
        <ScrollableDialogContent size="lg">
          <ScrollableDialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </ScrollableDialogHeader>
          <ScrollableDialogBody>{children}</ScrollableDialogBody>
        </ScrollableDialogContent>
      </Dialog>

      <Dialog open={openedConfirmModal} onOpenChange={setOpenedConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('actions.remove')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t('confirmModal.removeConfirmDescription')}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenedConfirmModal(false)}>
              {t('confirmModal.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onRemove?.()
                setOpenedConfirmModal(false)
              }}
            >
              {t('confirmModal.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
