import { Modal, TextInput, Stack } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useUpdateNodeMutation } from '~/apis'
import { FormActions } from '~/components/FormActions'

const schema = z.object({
  link: z.string().min(1),
})

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

  const form = useForm<z.infer<typeof schema>>({
    validate: zodResolver(schema),
    initialValues: {
      link: '',
    },
  })

  // Update form values when node changes or modal opens
  useEffect(() => {
    if (node && opened) {
      form.setValues({
        link: node.link,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, opened])

  return (
    <Modal title={t('editNode')} opened={opened} onClose={onClose}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (node) {
            await updateNodeMutation.mutateAsync({
              id: node.id,
              newLink: values.link,
            })
            onClose()
            form.reset()
          }
        })}
      >
        <Stack>
          <TextInput label={t('link')} withAsterisk {...form.getInputProps('link')} />
          <TextInput label={t('tag')} value={node?.tag || ''} disabled />
          <TextInput label={t('name')} value={node?.name || ''} disabled />
          <FormActions reset={form.reset} loading={updateNodeMutation.isLoading} />
        </Stack>
      </form>
    </Modal>
  )
}
