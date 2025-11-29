import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useRenameConfigMutation, useRenameDNSMutation, useRenameGroupMutation, useRenameRoutingMutation } from '~/apis'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { RuleType } from '~/constants'
import { useSetValue } from '~/hooks/useSetValue'

import { FormActions } from './FormActions'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  id?: string
  type?: RuleType
  oldName?: string
}

export interface RenameFormModalRef {
  props: Props
  setProps: (props: Props) => void
}

export function RenameFormModal({
  ref,
  opened,
  onClose,
}: {
  ref?: React.Ref<RenameFormModalRef>
  opened: boolean
  onClose: () => void
}) {
  const { t } = useTranslation()

  const [props, setProps] = useState<Props>({})
  const { type, id } = props

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
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

  const ruleName = useMemo(() => {
    if (type === RuleType.config) {
      return t('config')
    }

    if (type === RuleType.dns) {
      return t('dns')
    }

    if (type === RuleType.routing) {
      return t('routing')
    }

    return ''
  }, [type, t])

  useImperativeHandle(ref, () => ({
    props,
    setProps,
  }))

  // Reset form when modal closes
  useEffect(() => {
    if (!opened) {
      reset({ name: '' })
    }
  }, [opened, reset])

  const renameConfigMutation = useRenameConfigMutation()
  const renameDNSMutation = useRenameDNSMutation()
  const renameRoutingMutation = useRenameRoutingMutation()
  const renameGroupMutation = useRenameGroupMutation()

  const onSubmit = (data: FormValues) => {
    const { name } = data

    if (!type || !id) {
      return
    }

    if (type === RuleType.config) {
      renameConfigMutation.mutate({ id, name })
    }

    if (type === RuleType.dns) {
      renameDNSMutation.mutate({ id, name })
    }

    if (type === RuleType.routing) {
      renameRoutingMutation.mutate({ id, name })
    }

    if (type === RuleType.group) {
      renameGroupMutation.mutate({ id, name })
    }

    onClose()
  }

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('actions.rename')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <h4 className="font-semibold">{ruleName}</h4>

            <div className="grid grid-cols-2 gap-4">
              <Input disabled value={props.oldName} />

              <Input
                value={formValues.name}
                onChange={(e) => setValue('name', e.target.value)}
                error={errors.name?.message}
              />
            </div>

            <FormActions reset={() => reset({ name: '' })} isDirty={isDirty} errors={errors} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
