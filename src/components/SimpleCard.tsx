import { Check, Eye, Trash2, Type, X } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
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
  onRename,
  actions,
  children,
}: {
  name: string
  selected: boolean
  onSelect?: () => void
  onRemove?: () => void
  onRename?: (newName: string) => void
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  const { t } = useTranslation()
  const [openedDetailsModal, setOpenedDetailsModal] = useState(false)
  const [openedConfirmModal, setOpenedConfirmModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setEditValue(name)
  }, [name])

  const handleStartEdit = () => {
    setEditValue(name)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditValue(name)
    setIsEditing(false)
  }

  const handleSaveEdit = () => {
    const trimmedValue = editValue.trim()
    if (trimmedValue && trimmedValue !== name) {
      onRename?.(trimmedValue)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancelEdit()
    }
  }

  return (
    <Fragment>
      <Card
        withBorder
        shadow="sm"
        padding="none"
        className={cn(
          'transition-all duration-200',
          selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background border-primary',
        )}
      >
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex-1 flex items-center gap-2 p-2">
              <Input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveEdit}
                className="h-8 text-sm font-semibold"
              />
              <Button variant="ghost" size="xs" onClick={handleSaveEdit} className="shrink-0">
                <Check className="h-4 w-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={handleCancelEdit}
                onMouseDown={(e) => e.preventDefault()}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className={cn(
                'flex-1 p-3 text-left transition-colors rounded-l-xl',
                selected ? 'bg-primary/10' : 'hover:bg-accent',
              )}
              onClick={onSelect}
            >
              <div className="flex items-center gap-2">
                {selected && (
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                )}
                <h4 className={cn('font-semibold', selected && 'text-primary')}>{name}</h4>
              </div>
            </button>
          )}

          <div className="flex items-center gap-2 p-3">
            {!isEditing && onRename && (
              <Button variant="ghost" size="xs" onClick={handleStartEdit}>
                <Type className="h-4 w-4" />
              </Button>
            )}
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
