import { ActionIcon, Flex, Group, Input, Modal, Select, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useCreateGroupMutation } from '~/apis'
import { FormActions } from '~/components/FormActions'
import { Policy } from '~/schemas/gql/graphql'

const createGroupFormSchema = z.object({
  name: z.string().nonempty(),
  policy: z.nativeEnum(Policy),
  policyParams: z.array(z.string()),
})

export const CreateGroupFormModal = ({ opened, onClose }: { opened: boolean; onClose: () => void }) => {
  const { t } = useTranslation()
  const createGroupMutation = useCreateGroupMutation()
  const createGroupForm = useForm<z.infer<typeof createGroupFormSchema>>({
    validate: zodResolver(createGroupFormSchema),
    initialValues: {
      name: '',
      policy: Policy.Min,
      policyParams: [],
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

          {createGroupForm.values.policy === Policy.Fixed && (
            <Stack>
              <Group position="apart">
                <Input.Label>{t('policyParams')}</Input.Label>

                <ActionIcon
                  variant="filled"
                  color="green"
                  size="sm"
                  onClick={() => {
                    createGroupForm.insertListItem('policyParams', '')
                  }}
                >
                  <IconPlus />
                </ActionIcon>
              </Group>

              {createGroupForm.values.policyParams.map((_, i) => (
                <Flex key={i} gap={10}>
                  <TextInput className="flex-1" {...createGroupForm.getInputProps(`policyParams.${i}`)} />

                  <ActionIcon
                    variant="filled"
                    color="red"
                    size="sm"
                    mt={8}
                    onClick={() => {
                      createGroupForm.removeListItem('policyParams', i)
                    }}
                  >
                    <IconMinus />
                  </ActionIcon>
                </Flex>
              ))}
            </Stack>
          )}

          <FormActions reset={createGroupForm.reset} />
        </Stack>
      </form>
    </Modal>
  )
}
