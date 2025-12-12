import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'
import { Dialog, DialogTitle } from '~/components/ui/dialog'
import {
  ScrollableDialogBody,
  ScrollableDialogContent,
  ScrollableDialogFooter,
  ScrollableDialogHeader,
} from '~/components/ui/scrollable-dialog'

import { DNSForm } from './DNSForm'

export interface DNSFormModalProps {
  opened: boolean
  onClose: () => void
  title?: string
  initialValues?: {
    name: string
    text: string
  }
  handleSubmit: (values: { name: string; text: string }) => Promise<void>
}

export function DNSFormModal({ opened, onClose, title, initialValues, handleSubmit }: DNSFormModalProps) {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)

  const getValuesRef = useRef<(() => { name: string; text: string }) | null>(null)

  const onSubmit = async () => {
    if (!getValuesRef.current) return

    const values = getValuesRef.current()
    setSubmitting(true)
    try {
      await handleSubmit(values)
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <ScrollableDialogContent size="lg">
        <ScrollableDialogHeader>
          <DialogTitle>{title || t('dns')}</DialogTitle>
        </ScrollableDialogHeader>

        <ScrollableDialogBody>
          <DNSForm
            key={`${initialValues?.name ?? 'new'}::${initialValues?.text ?? ''}`}
            initialName={initialValues?.name}
            initialConfig={initialValues?.text}
            bindGetValues={(fn) => {
              getValuesRef.current = fn
            }}
          />
        </ScrollableDialogBody>

        <ScrollableDialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            {t('actions.cancel')}
          </Button>
          <Button onClick={onSubmit} loading={submitting}>
            {t('actions.confirm')}
          </Button>
        </ScrollableDialogFooter>
      </ScrollableDialogContent>
    </Dialog>
  )
}
