import type { DaeConfigType } from './DaeEditor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useImperativeHandle, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Dialog, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import {
  ScrollableDialogBody,
  ScrollableDialogContent,
  ScrollableDialogHeader,
} from '~/components/ui/scrollable-dialog'
import { useSetValue } from '~/hooks/useSetValue'

import { DaeEditor } from './DaeEditor'
import { FormActions } from './FormActions'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  text: z.string().min(1, 'Text is required'),
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  name: '',
  text: '',
}

export interface PlainTextFormModalRef {
  form: {
    setValues: (values: FormValues) => void
    setFieldValue: (field: string, value: string) => void
    reset: () => void
    values: FormValues
    errors: Record<string, string | undefined>
  }
  editingID: string
  setEditingID: (id: string) => void
  initOrigins: (origins: FormValues) => void
}

export function PlainTextFormModal({
  ref,
  title,
  opened,
  onClose,
  handleSubmit: onSubmitProp,
  configType = 'routing',
}: {
  ref?: React.Ref<PlainTextFormModalRef>
  title: string
  opened: boolean
  onClose: () => void
  handleSubmit: (values: FormValues) => Promise<void>
  /** Type of config being edited - affects completion filtering */
  configType?: DaeConfigType
}) {
  const { t } = useTranslation()
  const [editingID, setEditingID] = useState<string>()
  const [origins, setOrigins] = useState<FormValues>()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  })

  const {
    handleSubmit,
    control,
    setValue: setValueOriginal,
    reset,
    formState: { errors, isDirty },
  } = form

  const setValue = useSetValue(setValueOriginal)
  const formValues = useWatch({ control })

  const initOrigins = useCallback(
    (origins: FormValues) => {
      reset(origins)
      setOrigins(origins)
    },
    [reset],
  )

  const resetForm = useCallback(() => {
    reset(defaultValues)
  }, [reset])

  useImperativeHandle(ref, () => ({
    form: {
      setValues: (values: FormValues) => reset(values),
      setFieldValue: (field: string, value: string) => setValue(field as keyof FormValues, value),
      reset: resetForm,
      values: formValues as FormValues,
      errors: {
        name: errors.name?.message,
        text: errors.text?.message,
      },
    },
    editingID: editingID || '',
    setEditingID,
    initOrigins,
  }))

  const handleClose = useCallback(() => {
    onClose()
    // Delay reset until after dialog close animation completes
    setTimeout(() => {
      resetForm()
      setEditingID(undefined)
      setOrigins(undefined)
    }, 200)
  }, [onClose, resetForm])

  const onSubmit = async (data: FormValues) => {
    await onSubmitProp(data)
    handleClose()
  }

  return (
    <Dialog open={opened} onOpenChange={handleClose}>
      <ScrollableDialogContent size="full" className="h-[calc(100vh-2rem)] sm:h-[90vh]">
        <ScrollableDialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </ScrollableDialogHeader>

        <ScrollableDialogBody className="flex flex-col gap-4 overflow-hidden">
          <Input
            label={t('name')}
            withAsterisk
            value={formValues.name}
            onChange={(e) => setValue('name', e.target.value)}
            error={errors.name?.message}
            disabled={!!editingID}
            className="shrink-0"
          />

          <div className="flex-1 flex flex-col gap-1 min-h-0">
            <div className="flex-1 rounded border min-h-[200px] relative">
              <DaeEditor
                value={formValues.text || ''}
                onChange={(value) => setValue('text', value)}
                configType={configType}
                height="100%"
              />
            </div>

            {errors.text && <p className="text-xs text-destructive">{errors.text.message}</p>}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="shrink-0">
            <FormActions
              reset={() => {
                if (editingID && origins) {
                  reset(origins)
                } else {
                  resetForm()
                }
              }}
              isDirty={isDirty}
              errors={errors}
            />
          </form>
        </ScrollableDialogBody>
      </ScrollableDialogContent>
    </Dialog>
  )
}
