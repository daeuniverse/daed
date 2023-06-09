import { Modal, Stack, TextInput, Textarea } from '@mantine/core'
import { UseFormReturnType, useForm, zodResolver } from '@mantine/form'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from './FormActions'

const schema = z.object({
  name: z.string().nonempty(),
  text: z.string().nonempty(),
})

export type PlainTextgFormModalRef = {
  form: UseFormReturnType<z.infer<typeof schema>>
  editingID: string
  setEditingID: (id: string) => void
  initOrigins: (origins: z.infer<typeof schema>) => void
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
      handleSubmit: (values: z.infer<typeof schema>) => Promise<void>
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [editingID, setEditingID] = useState()
    const [origins, setOrigins] = useState<z.infer<typeof schema>>()
    const form = useForm<z.infer<typeof schema>>({
      validate: zodResolver(schema),
      initialValues: {
        name: '',
        text: '',
      },
    })

    const initOrigins = (origins: z.infer<typeof schema>) => {
      form.setValues(origins)
      setOrigins(origins)
    }

    useImperativeHandle(ref, () => ({
      form,
      editingID,
      setEditingID,
      initOrigins,
    }))

    return (
      <Modal title={title} opened={opened} onClose={onClose}>
        <form
          onSubmit={form.onSubmit((values) =>
            handleSubmit(values).then(() => {
              onClose()
              form.reset()
            })
          )}
        >
          <Stack>
            <TextInput label={t('name')} withAsterisk {...form.getInputProps('name')} disabled={!!editingID} />

            <Textarea minRows={10} autosize {...form.getInputProps('text')} />

            <FormActions
              reset={() => {
                if (editingID && origins) {
                  form.setValues(origins)
                } else {
                  form.reset()
                }
              }}
            />
          </Stack>
        </form>
      </Modal>
    )
  }
)
