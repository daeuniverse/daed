import { Modal, Select, Stack, TextInput } from '@mantine/core'
import { UseFormReturnType, useForm, zodResolver } from '@mantine/form'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useCreateGroupMutation, useGroupSetPolicyMutation } from '~/apis'
import { FormActions } from '~/components/FormActions'
import { DEFAULT_GROUP_POLICY } from '~/constants'
import { Policy } from '~/schemas/gql/graphql'

import { SelectItemWithDescription } from './SelectItemWithDescription'

const schema = z.object({
  name: z.string().nonempty(),
  policy: z.nativeEnum(Policy),
})

export type GroupFormModalRef = {
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

  const policyData = [
    {
      label: Policy.MinMovingAvg,
      value: Policy.MinMovingAvg,
      description: t('descriptions.group.MinMovingAvg'),
    },
    {
      label: Policy.MinAvg10,
      value: Policy.MinAvg10,
      description: t('descriptions.group.MinAvg10'),
    },
    {
      label: Policy.Min,
      value: Policy.Min,
      description: t('descriptions.group.Min'),
    },
    {
      label: Policy.Random,
      value: Policy.Random,
      description: t('descriptions.group.Random'),
    },
    {
      label: Policy.Fixed,
      value: Policy.Fixed,
      description: t('descriptions.group.Fixed'),
    },
  ]

  return (
    <Modal title={t('group')} opened={opened} onClose={onClose}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          const policyParams = values.policy === Policy.Fixed ? [{ key: '', val: '0' }] : []

          if (editingID) {
            await groupSetPolicyMutation.mutateAsync({
              id: editingID,
              policy: values.policy,
              policyParams: policyParams,
            })
          } else {
            await createGroupMutation.mutateAsync({
              name: values.name,
              policy: values.policy,
              policyParams: policyParams,
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
            itemComponent={SelectItemWithDescription}
            data={policyData}
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
