import { ActionIcon, Flex, Group, Modal, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'

const schema = z.object({
  resources: z
    .array(
      z.object({
        id: z.string(),
        link: z.string(),
        tag: z.string().min(1),
      }),
    )
    .nonempty(),
})

export const ImportResourceFormModal = ({
  title,
  opened,
  onClose,
  handleSubmit,
}: {
  title: string
  opened: boolean
  onClose: () => void
  handleSubmit: (values: z.infer<typeof schema>) => Promise<void>
}) => {
  const { t } = useTranslation()
  const form = useForm<z.infer<typeof schema>>({
    validate: zodResolver(schema),
    initialValues: {
      resources: [
        {
          id: randomId(),
          link: '',
          tag: '',
        },
      ],
    },
  })

  return (
    <Modal title={title} opened={opened} onClose={onClose}>
      <form
        onSubmit={form.onSubmit((values) =>
          handleSubmit(values).then(() => {
            onClose()
            form.reset()
          }),
        )}
      >
        <Flex gap={20} direction="column">
          {form.values.resources.map(({ id }, i) => (
            <Flex key={id} gap={10}>
              <Flex w="100%" align="start" gap={10}>
                <TextInput
                  sx={{ flex: 1 }}
                  withAsterisk
                  label={t('link')}
                  {...form.getInputProps(`resources.${i}.link`)}
                />
                <TextInput w="6rem" withAsterisk label={t('tag')} {...form.getInputProps(`resources.${i}.tag`)} />
              </Flex>

              <ActionIcon
                variant="filled"
                color="red"
                size="sm"
                mt={32}
                onClick={() => {
                  form.removeListItem('resources', i)
                }}
              >
                <IconMinus />
              </ActionIcon>
            </Flex>
          ))}
        </Flex>

        <Group position="apart" mt={20}>
          <ActionIcon
            variant="filled"
            color="green"
            onClick={() => {
              form.insertListItem('resources', {
                id: randomId(),
                link: '',
                tag: '',
              })
            }}
          >
            <IconPlus />
          </ActionIcon>

          <FormActions reset={form.reset} />
        </Group>
      </form>
    </Modal>
  )
}
