import { Modal, Select, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useCreateGroupMutation } from '~/apis'
import { FormActions } from '~/components/FormActions'
import { Policy } from '~/schemas/gql/graphql'

const createGroupFormSchema = z.object({
  name: z.string().nonempty(),
  policy: z.nativeEnum(Policy),
})

export const CreateGroupFormModal = ({ opened, onClose }: { opened: boolean; onClose: () => void }) => {
  const { t } = useTranslation()
  const createGroupMutation = useCreateGroupMutation()
  const createGroupForm = useForm<z.infer<typeof createGroupFormSchema>>({
    validate: zodResolver(createGroupFormSchema),
    initialValues: {
      name: '',
      policy: Policy.Min,
    },
  })

  return (
    <Modal title={t('group')} opened={opened} onClose={onClose}>
      <form
        onSubmit={createGroupForm.onSubmit(async (values) => {
          await createGroupMutation.mutateAsync({
            name: values.name,
            policy: values.policy,
            policyParams: [],
          })
          close()
          createGroupForm.reset()
        })}
      >
        <Stack>
          <TextInput withAsterisk label={t('name')} {...createGroupForm.getInputProps('name')} />

          <Select
            label={t('policy')}
            dropdownPosition="bottom"
            data={Object.values(Policy).map((policy) => ({
              label: policy,
              value: policy,
            }))}
            {...createGroupForm.getInputProps('policy')}
          />

          <FormActions reset={createGroupForm.reset} />
        </Stack>
      </form>
    </Modal>
  )
}
