import { Modal, SimpleGrid, Stack, TextInput, Title } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useRenameConfigMutation, useRenameDNSMutation, useRenameGroupMutation, useRenameRoutingMutation } from '~/apis'
import { RuleType } from '~/constants'

import { FormActions } from './FormActions'

const schema = z.object({
  name: z.string().nonempty(),
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
    ref
  ) => {
    const { t } = useTranslation()

    const [props, setProps] = useState<Props>({})
    const { type, id } = props

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
    }, [type, t])

    useImperativeHandle(ref, () => ({
      props,
      setProps,
    }))

    const form = useForm<z.infer<typeof schema>>({
      validate: zodResolver(schema),
      initialValues: {
        name: '',
      },
    })

    const renameConfigMutation = useRenameConfigMutation()
    const renameDNSMutation = useRenameDNSMutation()
    const renameRoutingMutation = useRenameRoutingMutation()
    const renameGroupMutation = useRenameGroupMutation()

    return (
      <Modal title={t('actions.rename')} opened={opened} onClose={onClose}>
        <form
          onSubmit={form.onSubmit((values) => {
            const { name } = values

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
          })}
        >
          <Stack>
            <Title order={4}>{ruleName}</Title>

            <SimpleGrid cols={2}>
              <TextInput disabled value={props.oldName} />

              <TextInput {...form.getInputProps('name')} />
            </SimpleGrid>

            <FormActions reset={form.reset} />
          </Stack>
        </form>
      </Modal>
    )
  }
)
