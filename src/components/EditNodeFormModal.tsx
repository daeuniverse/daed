import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from './FormActions.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog.tsx'
import { Input } from './ui/input.tsx'

import { useUpdateNodeMutation } from '../apis/index.ts'

const schema = z.object({
  link: z.string().min(1),
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

export const EditNodeFormModal = ({ opened, onClose, node }: EditNodeFormModalProps) => {
  const { t } = useTranslation()
  const updateNodeMutation = useUpdateNodeMutation()

  const [formData, setFormData] = useState<FormValues>({
    link: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setFormData({ link: '' })
    setErrors({})
  }

  const initializeForm = () => {
    if (node) {
      setFormData({
        link: node.link,
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

    if (node) {
      await updateNodeMutation.mutateAsync({
        id: node.id,
        newLink: formData.link,
      })
      onClose()
      resetForm()
    }
  }

  return (
    <Dialog open={opened} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editNode')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <Input
            label={t('link')}
            withAsterisk
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            error={errors.link}
          />
          <Input label={t('tag')} value={node?.tag || ''} disabled />
          <Input label={t('name')} value={node?.name || ''} disabled />
          <FormActions reset={resetForm} loading={updateNodeMutation.isPending} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
