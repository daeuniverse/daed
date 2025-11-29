import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from './FormActions.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog.tsx'
import { Input } from './ui/input.tsx'

const schema = z.object({
  link: z.string().min(1, 'Link is required'),
  tag: z.string().min(1, 'Tag is required'),
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

export function EditSubscriptionFormModal({ opened, onClose, subscription, onSubmit }: EditSubscriptionFormModalProps) {
  const { t } = useTranslation()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { link: '', tag: '' },
  })

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form

  const formValues = watch()

  // Initialize form when modal opens with subscription data
  useEffect(() => {
    if (opened && subscription) {
      reset({ link: subscription.link, tag: subscription.tag })
    }
  }, [opened, subscription, reset])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset({ link: '', tag: '' })
      onClose()
    }
  }

  const handleFormSubmit = async (data: FormValues) => {
    if (subscription) {
      await onSubmit({ ...data, id: subscription.id })
      onClose()
      reset({ link: '', tag: '' })
    }
  }

  return (
    <Dialog open={opened} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editSubscription')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <Input
            label={t('link')}
            withAsterisk
            value={formValues.link}
            onChange={(e) => setValue('link', e.target.value)}
            error={errors.link?.message}
          />
          <Input
            label={t('tag')}
            withAsterisk
            value={formValues.tag}
            onChange={(e) => setValue('tag', e.target.value)}
            error={errors.tag?.message}
          />
          <FormActions reset={() => reset({ link: '', tag: '' })} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
