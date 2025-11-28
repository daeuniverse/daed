import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from './FormActions.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog.tsx'
import { Input } from './ui/input.tsx'

const schema = z.object({
  link: z.string().min(1),
  tag: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

export interface EditSubscriptionFormModalProps {
  opened: boolean
  onClose: () => void
  subscription?: {
    id: string
    link: string
    tag: string
  }
  onSubmit: (values: FormValues & { id: string }) => Promise<void>
}

export const EditSubscriptionFormModal = ({
  opened,
  onClose,
  subscription,
  onSubmit,
}: EditSubscriptionFormModalProps) => {
  const { t } = useTranslation()

  const [formData, setFormData] = useState<FormValues>({
    link: '',
    tag: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setFormData({ link: '', tag: '' })
    setErrors({})
  }

  const initializeForm = () => {
    if (subscription) {
      setFormData({
        link: subscription.link,
        tag: subscription.tag,
      })
      setErrors({})
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      initializeForm()
    } else {
      onClose()
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = schema.safeParse(formData)

    if (!result.success) {
      const newErrors: Record<string, string> = {}

      result.error.issues.forEach((err) => {
        newErrors[err.path[0] as string] = err.message
      })
      setErrors(newErrors)

      return
    }

    if (subscription) {
      await onSubmit({ ...formData, id: subscription.id })
      onClose()
      resetForm()
    }
  }

  return (
    <Dialog open={opened} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editSubscription')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <Input
            label={t('link')}
            withAsterisk
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            error={errors.link}
          />
          <Input
            label={t('tag')}
            withAsterisk
            value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            error={errors.tag}
          />
          <FormActions reset={resetForm} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
