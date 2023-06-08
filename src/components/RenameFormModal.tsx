import { Modal, SimpleGrid, Stack, TextInput, Title } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

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

export type RenameModalRef = {
  props: Props
  setProps: (props: Props) => void
}

export const RenameModal = forwardRef(
  (
    {
      opened,
      onClose,
      handleSubmit,
    }: {
      opened: boolean
      onClose: () => void
      handleSubmit: (
        type: RuleType | undefined,
        id: string | undefined
      ) => (values: z.infer<typeof schema>) => Promise<void>
    },
    ref
  ) => {
    const { t } = useTranslation()

    const [props, setProps] = useState<Props>({})

    const ruleName = useMemo(() => {
      if (props.type === RuleType.config) {
        return t('config')
      }

      if (props.type === RuleType.dns) {
        return t('dns')
      }

      if (props.type === RuleType.routing) {
        return t('routing')
      }
    }, [props.type])

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

    return (
      <Modal title={t('actions.rename')} opened={opened} onClose={onClose}>
        <form onSubmit={form.onSubmit((values) => handleSubmit(props.type, props.id)(values).then(onClose))}>
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
