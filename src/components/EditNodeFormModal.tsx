import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useUpdateNodeMutation } from '../apis/index.ts'
import { FormActions } from './FormActions.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog.tsx'
import { Input } from './ui/input.tsx'

const schema = z.object({
  link: z.string().min(1, 'Link is required'),
})

type FormValues = z.infer<typeof schema>

export interface EditNodeFormModalProps {
  opened: boolean
  onClose: () => void
  node?: {
    id: string
    link: string
    tag: string
    name: string
  }
}

export function EditNodeFormModal({ opened, onClose, node }: EditNodeFormModalProps) {
  const { t } = useTranslation()
  const updateNodeMutation = useUpdateNodeMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { link: '' },
  })

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form

  const formValues = watch()

  // Initialize form when modal opens with node data
  useEffect(() => {
    if (opened && node) {
      reset({ link: node.link })
    }
  }, [opened, node, reset])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset({ link: '' })
      onClose()
    }
  }

  const onSubmit = async (data: FormValues) => {
    if (node) {
      await updateNodeMutation.mutateAsync({
        id: node.id,
        newLink: data.link,
      })
      onClose()
      reset({ link: '' })
    }
  }

  return (
    <Dialog open={opened} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editNode')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label={t('link')}
            withAsterisk
            value={formValues.link}
            onChange={(e) => setValue('link', e.target.value)}
            error={errors.link?.message}
          />
          <Input label={t('tag')} value={node?.tag || ''} disabled />
          <Input label={t('name')} value={node?.name || ''} disabled />
          <FormActions reset={() => reset({ link: '' })} loading={updateNodeMutation.isPending} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
