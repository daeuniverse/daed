import { faker } from '@faker-js/faker'
import { ActionIcon, Button, Flex, Group, Modal, TextInput, createStyles } from '@mantine/core'
import { Form, useForm, zodResolver } from '@mantine/form'
import { randomId, useDisclosure } from '@mantine/hooks'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const schema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      link: z.string().url(),
      tag: z.string(),
    })
  ),
})

const useStyles = createStyles(() => ({
  header: {
    '&& th': {
      textTransform: 'uppercase',
    },
  },
}))

export const TestPage = () => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const [data, setData] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.internet.userName(),
      }),
      {
        count: 100,
      }
    )
  )

  const [opened, { open, close }] = useDisclosure(false)

  const [selectedRecords, onSelectedRecordsChange] = useState<typeof data>([])

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
    <div className="p-2">
      <Group className="py-4">
        <Button onClick={open}>{t('actions.add')}</Button>

        <Button
          color="red"
          disabled={selectedRecords.length === 0}
          onClick={() => {
            onSelectedRecordsChange([])
            setData((data) => data.filter(({ id }) => selectedRecords.findIndex((record) => record.id === id) < 0))
          }}
        >
          {t('actions.remove')} ({selectedRecords.length})
        </Button>
      </Group>

      <DataTable
        classNames={classes}
        withBorder
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing="sm"
        height={768}
        columns={[
          {
            title: 'name',
            accessor: 'name',
          },
        ]}
        records={data}
        selectedRecords={selectedRecords}
        onSelectedRecordsChange={onSelectedRecordsChange}
      />

      <Modal opened={opened} onClose={close} title="Add new content" centered>
        <Form
          form={form}
          onSubmit={(values) => {
            console.log(values)
          }}
        >
          <Flex gap={4} direction="column">
            {form.values.nodes.map(({ id }, i) => (
              <Flex key={id} gap={10}>
                <Flex w="100%" align="start" gap={10}>
                  <TextInput
                    className="flex-1"
                    withAsterisk
                    label={t('link')}
                    {...form.getInputProps(`nodes.${i}.link`)}
                  />
                  <TextInput w="6rem" label={t('tag')} {...form.getInputProps(`nodes.${i}.tag`)} />
                </Flex>

                <ActionIcon
                  variant="filled"
                  color="red"
                  mt={30}
                  onClick={() => {
                    form.removeListItem('nodes', i)
                  }}
                >
                  <IconMinus size={40} />
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
              <IconPlus size={40} />
            </ActionIcon>

            <Group spacing="xs">
              <Button type="reset" color="red">
                {t('actions.reset')}
              </Button>

              <Button type="submit">{t('actions.submit')}</Button>
            </Group>
          </Group>
        </Form>
      </Modal>
    </div>
  )
}
