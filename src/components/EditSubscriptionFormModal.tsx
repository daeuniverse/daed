import { Modal, TextInput, Stack } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'

const schema = z.object({
  link: z.string().min(1),
  tag: z.string().min(1),
})

export interface EditSubscriptionFormModalProps {
  opened: boolean
  onClose: () => void
  subscription?: {
    id: string
    link: string
    tag: string
  }
  onSubmit: (values: z.infer<typeof schema> & { id: string }) => Promise<void>
}

export const EditSubscriptionFormModal = ({
  opened,
  onClose,
  subscription,
  onSubmit,
}: EditSubscriptionFormModalProps) => {
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof schema>>({
    validate: zodResolver(schema),
    initialValues: {
      link: '',
      tag: '',
    },
  })

  // Update form values when subscription changes or modal opens
  useEffect(() => {
    if (subscription && opened) {
      form.setValues({
        link: subscription.link,
        tag: subscription.tag,
      })
    }
  }, [subscription, opened])

  return (
    <Modal title={t('editSubscription')} opened={opened} onClose={onClose}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (subscription) {
            await onSubmit({ ...values, id: subscription.id })
            onClose()
            form.reset()
          }
        })}
      >
        <Stack>
          <TextInput label={t('link')} withAsterisk {...form.getInputProps('link')} />
          <TextInput label={t('tag')} withAsterisk {...form.getInputProps('tag')} />
          <FormActions reset={form.reset} />
        </Stack>
      </form>
    </Modal>
  )
}
