import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useImperativeHandle, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useCreateGroupMutation, useGroupSetPolicyMutation } from '~/apis'
import { FormActions } from '~/components/FormActions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Select } from '~/components/ui/select'
import { DEFAULT_GROUP_POLICY } from '~/constants'
import { useSetValue } from '~/hooks/useSetValue'
import { Policy } from '~/schemas/gql/graphql'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  policy: z.nativeEnum(Policy),
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  name: '',
  policy: DEFAULT_GROUP_POLICY,
}

export interface GroupFormModalRef {
  form: {
    setValues: (values: FormValues) => void
    reset: () => void
  }
  setEditingID: (id: string) => void
  initOrigins: (origins: FormValues) => void
}

export function GroupFormModal({
  ref,
  opened,
  onClose,
}: {
  ref?: React.Ref<GroupFormModalRef>
  opened: boolean
  onClose: () => void
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
    watch,
    setValue: setValueOriginal,
    reset,
    formState: { errors, isDirty },
  } = form

  const setValue = useSetValue(setValueOriginal)
  const formValues = watch()

  const initOrigins = (origins: FormValues) => {
    reset(origins)
    setOrigins(origins)
  }

  const resetForm = () => {
    reset(defaultValues)
  }

  useImperativeHandle(ref, () => ({
    form: {
      setValues: (values: FormValues) => reset(values),
      reset: resetForm,
    },
    setEditingID,
    initOrigins,
  }))

  // Reset form when modal closes
  useEffect(() => {
    if (!opened) {
      resetForm()
      setEditingID(undefined)
      setOrigins(undefined)
    }
  }, [opened])

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

  const onSubmit = async (data: FormValues) => {
    const policyParams = data.policy === Policy.Fixed ? [{ key: '', val: '0' }] : []

    if (editingID) {
      await groupSetPolicyMutation.mutateAsync({
        id: editingID,
        policy: data.policy,
        policyParams,
      })
    } else {
      await createGroupMutation.mutateAsync({
        name: data.name,
        policy: data.policy,
        policyParams,
      })
    }

    onClose()
    resetForm()
  }

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('group')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              withAsterisk
              label={t('name')}
              value={formValues.name}
              onChange={(e) => setValue('name', e.target.value)}
              error={errors.name?.message}
              disabled={!!editingID}
            />

            <Select
              label={t('policy')}
              data={policyData}
              value={formValues.policy}
              onChange={(value) => setValue('policy', value as Policy)}
            />

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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
