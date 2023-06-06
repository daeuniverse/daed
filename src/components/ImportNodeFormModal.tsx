import { ActionIcon, Flex, Group, Modal, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'

const importResourceFormSchema = z.object({
  resources: z
    .array(
      z.object({
        id: z.string(),
        link: z.string().url().nonempty(),
        tag: z.string().nonempty(),
      })
    )
    .min(1),
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
  handleSubmit: (values: z.infer<typeof importResourceFormSchema>) => Promise<void>
}) => {
  const { t } = useTranslation()
  const importResourceForm = useForm<z.infer<typeof importResourceFormSchema>>({
    validate: zodResolver(importResourceFormSchema),
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
        onSubmit={importResourceForm.onSubmit((values) =>
          handleSubmit(values).then(() => {
            importResourceForm.reset()
          })
        )}
      >
        <Flex gap={20} direction="column">
          {importResourceForm.values.resources.map(({ id }, i) => (
            <Flex key={id} gap={10}>
              <Flex w="100%" align="start" gap={10}>
                <TextInput
                  className="flex-1"
                  withAsterisk
                  label={t('link')}
                  {...importResourceForm.getInputProps(`nodes.${i}.link`)}
                />
                <TextInput
                  w="6rem"
                  withAsterisk
                  label={t('tag')}
                  {...importResourceForm.getInputProps(`nodes.${i}.tag`)}
                />
              </Flex>

              <ActionIcon
                variant="filled"
                color="red"
                size="sm"
                mt={32}
                onClick={() => {
                  importResourceForm.removeListItem('nodes', i)
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
              importResourceForm.insertListItem('nodes', {
                id: randomId(),
                link: '',
                tag: '',
              })
            }}
          >
            <IconPlus />
          </ActionIcon>

          <FormActions reset={importResourceForm.reset} />
        </Group>
      </form>
    </Modal>
  )
}
