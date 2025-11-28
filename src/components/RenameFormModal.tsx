import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useRenameConfigMutation, useRenameDNSMutation, useRenameGroupMutation, useRenameRoutingMutation } from '~/apis'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { RuleType } from '~/constants'

import { FormActions } from './FormActions'

const schema = z.object({
  name: z.string().min(1),
})

type Props = {
  id?: string
  type?: RuleType
  oldName?: string
}

export type RenameFormModalRef = {
  props: Props
  setProps: (props: Props) => void
}

export const RenameFormModal = forwardRef(
  (
    {
      opened,
      onClose,
    }: {
      opened: boolean
      onClose: () => void
    },
    ref,
  ) => {
    const { t } = useTranslation()

    const [props, setProps] = useState<Props>({})
    const { type, id } = props
    const [formData, setFormData] = useState({ name: '' })
    const [formErrors, setFormErrors] = useState<{ name?: string }>({})

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

    const renameConfigMutation = useRenameConfigMutation()
    const renameDNSMutation = useRenameDNSMutation()
    const renameRoutingMutation = useRenameRoutingMutation()
    const renameGroupMutation = useRenameGroupMutation()

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      const result = schema.safeParse(formData)

      if (!result.success) {
        setFormErrors({ name: result.error.issues[0]?.message })

        return
      }

      const { name } = formData

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
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <h4 className="font-semibold">{ruleName}</h4>

              <div className="grid grid-cols-2 gap-4">
                <Input disabled value={props.oldName} />

                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  error={formErrors.name}
                />
              </div>

              <FormActions reset={() => setFormData({ name: '' })} />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  },
)
