import { Modal, Select, Stack, TextInput } from '@mantine/core'
import { UseFormReturnType, useForm, zodResolver } from '@mantine/form'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useCreateGroupMutation, useGroupSetPolicyMutation } from '~/apis'
import { FormActions } from '~/components/FormActions'
import { DEFAULT_GROUP_POLICY } from '~/constants'
import { Policy } from '~/schemas/gql/graphql'

const schema = z.object({
  name: z.string().nonempty(),
  policy: z.nativeEnum(Policy),
})

export type GroupFormDrawerRef = {
  form: UseFormReturnType<z.infer<typeof schema>>
  setEditingID: (id: string) => void
  initOrigins: (origins: z.infer<typeof schema>) => void
}

export const GroupFormModal = forwardRef(({ opened, onClose }: { opened: boolean; onClose: () => void }, ref) => {
  const { t } = useTranslation()
  const [editingID, setEditingID] = useState()
  const [origins, setOrigins] = useState<z.infer<typeof schema>>()
  const form = useForm<z.infer<typeof schema>>({
    validate: zodResolver(schema),
    initialValues: {
      name: '',
      policy: DEFAULT_GROUP_POLICY,
    },
  })

  const initOrigins = (origins: z.infer<typeof schema>) => {
    form.setValues(origins)
    setOrigins(origins)
  }

  useImperativeHandle(ref, () => ({
    form,
    setEditingID,
    initOrigins,
  }))

  const createGroupMutation = useCreateGroupMutation()
  const groupSetPolicyMutation = useGroupSetPolicyMutation()

  return (
    <Modal title={t('group')} opened={opened} onClose={onClose}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (editingID) {
            await groupSetPolicyMutation.mutateAsync({
              id: editingID,
              policy: values.policy,
              policyParams: [],
            })
          } else {
            await createGroupMutation.mutateAsync({
              name: values.name,
              policy: values.policy,
              policyParams: [],
            })
          }
          onClose()
          form.reset()
        })}
      >
        <Stack>
          <TextInput withAsterisk label={t('name')} {...form.getInputProps('name')} disabled={!!editingID} />

          <Select
            label={t('policy')}
            dropdownPosition="bottom"
            data={Object.values(Policy).map((policy) => ({
              label: policy,
              value: policy,
            }))}
            {...form.getInputProps('policy')}
          />

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
})
