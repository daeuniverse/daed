import { ActionIcon, Button, Flex, Group, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { Prism } from '@mantine/prism'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useImportSubscriptionsMutation, useSubscriptionsQuery } from '~/apis'
import { Table } from '~/components/Table'

const schema = z.object({
  subscriptions: z
    .array(
      z.object({
        id: z.string(),
        link: z.string().url().nonempty(),
        tag: z.string().nonempty(),
      })
    )
    .nonempty(),
})

export const SubscriptionPage = () => {
  const { t } = useTranslation()
  const { isLoading, data } = useSubscriptionsQuery()
  const importSubscriptionsMutation = useImportSubscriptionsMutation()

  const form = useForm<z.infer<typeof schema>>({
    validate: zodResolver(schema),
    initialValues: {
      subscriptions: [
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
          title: t('link'),
          accessor: 'link',
        },
        {
          title: t('updatedAt'),
          accessor: 'updatedAt',
          render: (record) => dayjs(record.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        },
      ]}
      records={data?.subscriptions || []}
      rowExpansion={{
        content: ({ record }) => <Prism language="json">{JSON.stringify(record.nodes.edges, null, 2)}</Prism>,
      }}
      createModalTitle={t('subscription')}
      createModalContent={(close) => (
        <form
          onSubmit={form.onSubmit(async (values) => {
            await importSubscriptionsMutation.mutateAsync(values.subscriptions.map(({ link, tag }) => ({ link, tag })))
            close()
            form.reset()
          })}
        >
          <Flex gap={20} direction="column">
            {form.values.subscriptions.map(({ id }, i) => (
              <Flex key={id} gap={10}>
                <Flex w="100%" align="start" gap={10}>
                  <TextInput
                    className="flex-1"
                    withAsterisk
                    label={t('link')}
                    {...form.getInputProps(`subscriptions.${i}.link`)}
                  />
                  <TextInput w="6rem" withAsterisk label={t('tag')} {...form.getInputProps(`subscriptions.${i}.tag`)} />
                </Flex>

                <ActionIcon
                  variant="filled"
                  color="red"
                  mt={30}
                  onClick={() => {
                    form.removeListItem('subscriptions', i)
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
                form.insertListItem('subscriptions', {
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
    />
  )
}
