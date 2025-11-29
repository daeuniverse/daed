import { Editor } from '@monaco-editor/react'
import { useStore } from '@nanostores/react'
import { useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Dialog, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import {
  ScrollableDialogBody,
  ScrollableDialogContent,
  ScrollableDialogHeader,
} from '~/components/ui/scrollable-dialog'
import { EDITOR_OPTIONS, EDITOR_THEME_DARK, EDITOR_THEME_LIGHT } from '~/constants'
import { handleEditorBeforeMount } from '~/monaco'
import { colorSchemeAtom } from '~/store'

import { FormActions } from './FormActions'

const schema = z.object({
  name: z.string().min(1),
  text: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

export interface PlainTextgFormModalRef {
  form: {
    setValues: (values: FormValues) => void
    setFieldValue: (field: string, value: string) => void
    reset: () => void
    values: FormValues
    errors: Record<string, string>
  }
  editingID: string
  setEditingID: (id: string) => void
  initOrigins: (origins: FormValues) => void
}

export function PlainTextFormModal({ ref, title, opened, onClose, handleSubmit }) {
  const { t } = useTranslation()
  const colorScheme = useStore(colorSchemeAtom)
  const [editingID, setEditingID] = useState<string>()
  const [origins, setOrigins] = useState<FormValues>()
  const [formData, setFormData] = useState<FormValues>({
    name: '',
    text: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const initOrigins = (origins: FormValues) => {
    setFormData(origins)
    setOrigins(origins)
  }

  const resetForm = () => {
    setFormData({ name: '', text: '' })
    setErrors({})
  }

  useImperativeHandle(ref, () => ({
    form: {
      setValues: setFormData,
      setFieldValue: (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value })),
      reset: resetForm,
      values: formData,
      errors,
    },
    editingID,
    setEditingID,
    initOrigins,
  }))

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

    await handleSubmit(formData)
    onClose()
    resetForm()
  }

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <ScrollableDialogContent size="full" className="h-[calc(100vh-2rem)] sm:h-[90vh]">
        <ScrollableDialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </ScrollableDialogHeader>

        <ScrollableDialogBody className="flex flex-col gap-4 overflow-hidden">
          <Input
            label={t('name')}
            withAsterisk
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            disabled={!!editingID}
            className="shrink-0"
          />

          <div className="flex-1 flex flex-col gap-1 min-h-0 overflow-hidden">
            <div className="flex-1 rounded overflow-hidden border min-h-[200px]">
              <Editor
                height="100%"
                theme={colorScheme === 'dark' ? EDITOR_THEME_DARK : EDITOR_THEME_LIGHT}
                options={EDITOR_OPTIONS}
                language="routingA"
                value={formData.text}
                onChange={(value) => setFormData({ ...formData, text: value || '' })}
                beforeMount={handleEditorBeforeMount}
              />
            </div>

            {errors.text && <p className="text-xs text-destructive">{errors.text}</p>}
          </div>

          <form onSubmit={handleFormSubmit} className="shrink-0">
            <FormActions
              reset={() => {
                if (editingID && origins) {
                  setFormData(origins)
                } else {
                  resetForm()
                }
              }}
            />
          </form>
        </ScrollableDialogBody>
      </ScrollableDialogContent>
    </Dialog>
  )
}
