import { ActionIcon, Flex, Group, Modal, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useImportNodesMutation } from '~/apis'
import { FormActions } from '~/components/FormActions'

const importNodeFormSchema = z.object({
  nodes: z
    .array(
      z.object({
        id: z.string(),
        link: z.string().url().nonempty(),
        tag: z.string().nonempty(),
      })
    )
    .min(1),
})

export const ImportNodeFormModal = ({ opened, onClose }: { opened: boolean; onClose: () => void }) => {
  const { t } = useTranslation()
  const importNodesMutation = useImportNodesMutation()
  const importNodeForm = useForm<z.infer<typeof importNodeFormSchema>>({
    validate: zodResolver(importNodeFormSchema),
    initialValues: {
      nodes: [
        {
          id: randomId(),
          link: '',
          tag: '',
        },
      ],
    },
  })

  return (
    <Modal title={t('node')} opened={opened} onClose={onClose}>
      <form
        onSubmit={importNodeForm.onSubmit(async (values) => {
          await importNodesMutation.mutateAsync(values.nodes.map(({ link, tag }) => ({ link, tag })))
          close()
          importNodeForm.reset()
        })}
      >
        <Flex gap={20} direction="column">
          {importNodeForm.values.nodes.map(({ id }, i) => (
            <Flex key={id} gap={10}>
              <Flex w="100%" align="start" gap={10}>
                <TextInput
                  className="flex-1"
                  withAsterisk
                  label={t('link')}
                  {...importNodeForm.getInputProps(`nodes.${i}.link`)}
                />
                <TextInput w="6rem" withAsterisk label={t('tag')} {...importNodeForm.getInputProps(`nodes.${i}.tag`)} />
              </Flex>

              <ActionIcon
                variant="filled"
                color="red"
                size="sm"
                mt={32}
                onClick={() => {
                  importNodeForm.removeListItem('nodes', i)
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
              importNodeForm.insertListItem('nodes', {
                id: randomId(),
                link: '',
                tag: '',
              })
            }}
          >
            <IconPlus />
          </ActionIcon>

          <FormActions reset={importNodeForm.reset} />
        </Group>
      </form>
    </Modal>
  )
}
