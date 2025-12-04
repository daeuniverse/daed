import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus } from 'lucide-react'
import { useCallback } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { Button } from '~/components/ui/button'
import { Dialog, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import {
  ScrollableDialogBody,
  ScrollableDialogContent,
  ScrollableDialogHeader,
} from '~/components/ui/scrollable-dialog'
import { useSetValue } from '~/hooks/useSetValue'

const schema = z.object({
  resources: z
    .array(
      z.object({
        link: z.string().min(1, 'Link is required'),
        tag: z.string().min(1, 'Tag is required'),
      }),
    )
    .min(1, 'At least one resource is required'),
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  resources: [{ link: '', tag: '' }],
}

export function ImportResourceFormModal({
  title,
  opened,
  onClose,
  handleSubmit: onSubmitProp,
}: {
  title: string
  opened: boolean
  onClose: () => void
  handleSubmit: (values: FormValues) => Promise<void>
}) {
  const { t } = useTranslation()

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'resources',
  })

  const resources = useWatch({ control, name: 'resources' })

  // Reset form when modal closes (with delay for animation)
  const handleClose = useCallback(() => {
    onClose()
    setTimeout(() => {
      reset(defaultValues)
    }, 200)
  }, [onClose, reset])

  const onSubmit = async (data: FormValues) => {
    await onSubmitProp(data)
    handleClose()
  }

  return (
    <Dialog open={opened} onOpenChange={handleClose}>
      <ScrollableDialogContent size="lg">
        <ScrollableDialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </ScrollableDialogHeader>
        <ScrollableDialogBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              {fields.map((field, i) => (
                <div key={field.id} className="flex gap-2.5">
                  <Input
                    wrapperClassName="flex-1"
                    withAsterisk
                    label={t('link')}
                    value={resources[i]?.link || ''}
                    onChange={(e) => setValue(`resources.${i}.link`, e.target.value)}
                    error={errors.resources?.[i]?.link?.message}
                  />
                  <Input
                    wrapperClassName="w-24"
                    withAsterisk
                    label={t('tag')}
                    value={resources[i]?.tag || ''}
                    onChange={(e) => setValue(`resources.${i}.tag`, e.target.value)}
                    error={errors.resources?.[i]?.tag?.message}
                  />

                  <div className="flex flex-col">
                    {/* Spacer for label height */}
                    <div className="h-[22px]" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-9 w-9 shrink-0"
                      onClick={() => remove(i)}
                      disabled={fields.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-5">
              <Button
                type="button"
                variant="default"
                size="icon"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => append({ link: '', tag: '' })}
              >
                <Plus className="h-4 w-4" />
              </Button>

              <FormActions reset={() => reset(defaultValues)} isDirty={isDirty} errors={errors} />
            </div>
          </form>
        </ScrollableDialogBody>
      </ScrollableDialogContent>
    </Dialog>
  )
}
