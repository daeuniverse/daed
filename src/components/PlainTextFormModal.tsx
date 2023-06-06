import { Modal, Stack, TextInput, Textarea } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from './FormActions'

const schema = z.object({
  name: z.string().nonempty(),
  text: z.string().nonempty(),
})

export const PlainTextFormModal = ({
  title,
  opened,
  onClose,
  handleSubmit,
}: {
  title: string
  opened: boolean
  onClose: () => void
  handleSubmit: (values: z.infer<typeof schema>) => Promise<void>
}) => {
  const { t } = useTranslation()
  const form = useForm<z.infer<typeof schema>>({
    validate: zodResolver(schema),
    initialValues: {
      name: '',
      text: '',
    },
  })

  return (
    <Modal title={title} opened={opened} onClose={onClose}>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values).then(() => form.reset()))}>
        <Stack>
          <TextInput label={t('name')} withAsterisk {...form.getInputProps('name')} />

          <Textarea minRows={10} autosize {...form.getInputProps('text')} />

          <FormActions reset={form.reset} />
        </Stack>
      </form>
    </Modal>
  )
}
