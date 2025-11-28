import { Editor } from '@monaco-editor/react'
import { useStore } from '@nanostores/react'
import { X } from 'lucide-react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { EDITOR_OPTIONS, EDITOR_THEME_DARK, EDITOR_THEME_LIGHT } from '~/constants'
import { handleEditorBeforeMount } from '~/monaco'
import { colorSchemeAtom } from '~/store'

import { FormActions } from './FormActions'

const schema = z.object({
  name: z.string().min(1),
  text: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

export type PlainTextgFormModalRef = {
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

export const PlainTextFormModal = forwardRef(
  (
    {
      title,
      opened,
      onClose,
      handleSubmit,
    }: {
      title: string
      opened: boolean
      onClose: () => void
      handleSubmit: (values: FormValues) => Promise<void>
    },
    ref,
  ) => {
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
        <DialogContent className="max-w-none w-screen h-screen max-h-screen rounded-none flex flex-col">
          <DialogHeader className="shrink-0 flex-row items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onClose()}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              <Input
                label={t('name')}
                withAsterisk
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                disabled={!!editingID}
              />

              <div className="flex-1 flex flex-col gap-1 min-h-0">
                <div className="flex-1 rounded overflow-hidden border min-h-[400px]">
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

              <FormActions
                reset={() => {
                  if (editingID && origins) {
                    setFormData(origins)
                  } else {
                    resetForm()
                  }
                }}
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  },
)
