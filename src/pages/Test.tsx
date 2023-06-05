import { DndContext, DragOverlay, UniqueIdentifier, useDraggable, useDroppable } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'
import { faker } from '@faker-js/faker'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  createStyles,
} from '@mantine/core'
import { Form, useForm, zodResolver } from '@mantine/form'
import { randomId, useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { IconMinus, IconPlus, IconTrash, IconX } from '@tabler/icons-react'
import { produce } from 'immer'
import { DataTable } from 'mantine-datatable'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Policy } from '~/schemas/gql/graphql'

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

const DroppableGroup = ({
  id,
  name,
  onRemove,
  children,
}: {
  id: string
  name: string
  onRemove: () => void
  children: React.ReactNode
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  return (
    <Card
      ref={setNodeRef}
      withBorder
      shadow="sm"
      style={{
        backgroundColor: isOver ? 'darkcyan' : undefined,
      }}
    >
      <Card.Section withBorder inheritPadding py="sm">
        <Group position="apart">
          <Badge>{name}</Badge>

          <Group>
            <ActionIcon
              onClick={() => {
                modals.openConfirmModal({
                  title: 'Remove',
                  labels: {
                    cancel: 'No',
                    confirm: "Yes, I'm sure",
                  },
                  children: 'Are you sure you want to remove this?',
                  onConfirm: onRemove,
                })
              }}
            >
              <IconTrash />
            </ActionIcon>
          </Group>
        </Group>
      </Card.Section>

      <Card.Section inheritPadding py="sm">
        {children}
      </Card.Section>
    </Card>
  )
}

const DraggableNode = ({
  id,
  name,
  onRemove,
  children,
}: {
  id: string
  name: string
  onRemove: () => void
  children: React.ReactNode
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  })

  return (
    <Card
      ref={setNodeRef}
      withBorder
      shadow="sm"
      style={{
        opacity: isDragging ? 0.5 : undefined,
      }}
    >
      <Card.Section withBorder inheritPadding py="sm">
        <Group position="apart">
          <Badge
            style={{
              cursor: 'grab',
            }}
            {...listeners}
            {...attributes}
          >
            {name}
          </Badge>

          <ActionIcon
            onClick={() => {
              modals.openConfirmModal({
                title: 'Remove',
                labels: {
                  cancel: 'No',
                  confirm: "Yes, I'm sure",
                },
                children: 'Are you sure you want to remove this node?',
                onConfirm: onRemove,
              })
            }}
          >
            <IconTrash />
          </ActionIcon>
        </Group>
      </Card.Section>

      <Card.Section inheritPadding py="sm">
        {children}
      </Card.Section>
    </Card>
  )
}

export const ExperimentPage = () => {
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

  const [fakeGroups, setFakeGroups] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        nodes: faker.helpers.multiple(
          () => ({
            id: faker.string.uuid(),
            name: faker.lorem.word(),
            tag: faker.lorem.word(),
            link: faker.internet.url(),
          }),
          {
            count: faker.number.int({ min: 5, max: 10 }),
          }
        ),
        subscriptions: [],
        policy: faker.helpers.enumValue(Policy),
        policyParams: faker.helpers.multiple(() => faker.lorem.word(), { count: faker.number.int({ min: 1, max: 3 }) }),
      }),
      {
        count: 6,
      }
    )
  )

  const [fakeNodes, setFakeNodes] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        tag: faker.lorem.word(),
        link: faker.internet.url(),
      }),
      {
        count: 20,
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

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  return (
    <div className="p-2">
      <Stack>
        <DndContext
          modifiers={[restrictToFirstScrollableAncestor]}
          onDragStart={(e) => {
            setActiveId(e.active.id)
          }}
          onDragEnd={(e) => {
            const { active, over } = e
            const activeNode = fakeNodes.find((node) => node.id === active.id)

            if (activeNode) {
              const updatedFakeGrups = produce(fakeGroups, (groups) => {
                const group = groups.find((group) => group.id === over?.id)

                if (!group?.nodes.find((node) => node.id === active.id)) {
                  group?.nodes.push(activeNode)
                }
              })

              setFakeGroups(updatedFakeGrups)
            }

            setActiveId(null)
          }}
        >
          <Stack>
            <Title>Groups</Title>

            <SimpleGrid cols={3}>
              {fakeGroups.map(({ id: groupId, name, policy, policyParams, nodes }) => (
                <DroppableGroup
                  key={groupId}
                  id={groupId}
                  name={name}
                  onRemove={() => {
                    setFakeGroups((groups) => groups.filter((group) => group.id !== groupId))
                  }}
                >
                  <Text variant="gradient">Policy: {policy}</Text>
                  <Text>Policy Params: {policyParams.join(',')}</Text>

                  <Flex py="sm" gap={10} wrap="wrap">
                    {nodes.map(({ id: nodeId, name }) => (
                      <Badge
                        key={nodeId}
                        pr={3}
                        rightSection={
                          <ActionIcon
                            color="blue"
                            size="xs"
                            radius="xl"
                            variant="transparent"
                            onClick={() => {
                              const updatedFakeGrups = produce(fakeGroups, (groups) => {
                                const group = groups.find((group) => group.id === groupId)

                                if (group) {
                                  group.nodes = group.nodes.filter((node) => node.id !== nodeId)
                                }
                              })

                              setFakeGroups(updatedFakeGrups)
                            }}
                          >
                            <IconX size={12} />
                          </ActionIcon>
                        }
                      >
                        {name}
                      </Badge>
                    ))}
                  </Flex>
                </DroppableGroup>
              ))}
            </SimpleGrid>
          </Stack>

          <Stack>
            <Title>Nodes</Title>

            <SimpleGrid cols={3}>
              {fakeNodes.map(({ id, name, tag, link }) => (
                <DraggableNode
                  key={id}
                  id={id}
                  name={name}
                  onRemove={() => {
                    setFakeNodes((nodes) => nodes.filter((node) => node.id !== id))
                  }}
                >
                  <Text variant="gradient">Tag: {tag}</Text>
                  <Text>Link: {link}</Text>
                </DraggableNode>
              ))}
            </SimpleGrid>
          </Stack>

          <DragOverlay dropAnimation={null}>
            {activeId ? <Badge>{fakeNodes.find((node) => node.id === activeId)?.name}</Badge> : null}
          </DragOverlay>
        </DndContext>

        <Stack>
          <Title>Table</Title>

          <Group>
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
        </Stack>
      </Stack>
    </div>
  )
}
