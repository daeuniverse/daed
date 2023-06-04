import { ActionIcon, Button, Flex, Group, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useImportNodesMutation, useNodesQuery, useRemoveNodesMutation } from '~/apis'
import { ExpandedTableRow } from '~/components/ExpandedTableRow'
import { Table } from '~/components/Table'

const schema = z.object({
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

export const NodePage = () => {
  const { t } = useTranslation()
  const { isLoading, data } = useNodesQuery()
  const removeNodesMutation = useRemoveNodesMutation()
  const importNodesMutation = useImportNodesMutation()
  const form = useForm<z.infer<typeof schema>>({
    validate: zodResolver(schema),
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
    <Table
      fetching={isLoading}
      columns={[
        {
          title: 'id',
          accessor: 'id',
        },
        {
          title: t('protocol'),
          accessor: 'protocol',
        },
        {
          title: t('name'),
          accessor: 'name',
        },
        {
          title: t('tag'),
          accessor: 'tag',
        },
      ]}
      records={data?.nodes.edges || []}
      rowExpansion={{
        content: ({ record }) => (
          <ExpandedTableRow
            data={[
              {
                name: t('address'),
                value: record.address,
              },

              {
                name: t('link'),
                value: record.link,
              },
            ]}
          />
        ),
      }}
      createModalTitle={t('node')}
      createModalContent={(close) => (
        <form
          onSubmit={form.onSubmit(async (values) => {
            await importNodesMutation.mutateAsync(values.nodes.map(({ link, tag }) => ({ link, tag })))
            close()
            form.reset()
          })}
        >
          <Flex gap={20} direction="column">
            {form.values.nodes.map(({ id }, i) => (
              <Flex key={id} gap={10}>
                <Flex w="100%" align="start" gap={10}>
                  <TextInput
                    className="flex-1"
                    withAsterisk
                    label={t('link')}
                    {...form.getInputProps(`nodes.${i}.link`)}
                  />
                  <TextInput w="6rem" withAsterisk label={t('tag')} {...form.getInputProps(`nodes.${i}.tag`)} />
                </Flex>

                <ActionIcon
                  variant="filled"
                  color="red"
                  mt={30}
                  onClick={() => {
                    form.removeListItem('nodes', i)
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
                form.insertListItem('nodes', {
                  id: randomId(),
                  link: '',
                  tag: '',
                })
              }}
            >
              <IconPlus />
            </ActionIcon>

            <Group spacing="xs">
              <Button type="reset" color="red">
                {t('actions.reset')}
              </Button>

              <Button type="submit">{t('actions.submit')}</Button>
            </Group>
          </Group>
        </form>
      )}
      onRemove={async (records) => {
        await removeNodesMutation.mutateAsync(records.map(({ id }) => id))
      }}
    />
  )
}
