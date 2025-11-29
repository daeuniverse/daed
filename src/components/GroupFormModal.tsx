import { useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useCreateGroupMutation, useGroupSetPolicyMutation } from '~/apis'
import { FormActions } from '~/components/FormActions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Select } from '~/components/ui/select'
import { DEFAULT_GROUP_POLICY } from '~/constants'
import { Policy } from '~/schemas/gql/graphql'

const schema = z.object({
  name: z.string().min(1),
  policy: z.nativeEnum(Policy),
})

type FormValues = z.infer<typeof schema>

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
  const [formData, setFormData] = useState<FormValues>({
    name: '',
    policy: DEFAULT_GROUP_POLICY,
  })
  const [errors, setErrors] = useState<{ name?: string }>({})

  const initOrigins = (origins: FormValues) => {
    setFormData(origins)
    setOrigins(origins)
  }

  const resetForm = () => {
    setFormData({ name: '', policy: DEFAULT_GROUP_POLICY })
    setErrors({})
  }

  useImperativeHandle(ref, () => ({
    form: {
      setValues: setFormData,
      reset: resetForm,
    },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = schema.safeParse(formData)

    if (!result.success) {
      setErrors({ name: result.error.issues[0]?.message })

      return
    }

    const policyParams = formData.policy === Policy.Fixed ? [{ key: '', val: '0' }] : []

    if (editingID) {
      await groupSetPolicyMutation.mutateAsync({
        id: editingID,
        policy: formData.policy,
        policyParams,
      })
    } else {
      await createGroupMutation.mutateAsync({
        name: formData.name,
        policy: formData.policy,
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
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              withAsterisk
              label={t('name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              disabled={!!editingID}
            />

            <Select
              label={t('policy')}
              data={policyData}
              value={formData.policy}
              onChange={(value) => setFormData({ ...formData, policy: value as Policy })}
            />

            <FormActions
              reset={() => {
                if (editingID && origins) {
                  setFormData(origins)
                } else {
                  resetForm()
                }
              }}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
