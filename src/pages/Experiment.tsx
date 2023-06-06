import { DndContext, DragOverlay, UniqueIdentifier, useDraggable, useDroppable } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'
import { faker } from '@faker-js/faker'
import {
  ActionIcon,
  Anchor,
  Badge,
  Card,
  Flex,
  Group,
  HoverCard,
  List,
  SimpleGrid,
  Stack,
  Text,
  Title,
  createStyles,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { IconPlus, IconTrash, IconX } from '@tabler/icons-react'
import { produce } from 'immer'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CreateGroupFormModal } from '~/components/CreateGroupFormModal'
import { ImportNodeFormModal } from '~/components/ImportNodeFormModal'
import { Policy } from '~/schemas/gql/graphql'

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
        opacity: isOver ? 0.5 : undefined,
      }}
    >
      <Card.Section withBorder inheritPadding py="sm">
        <Group position="apart">
          <Title order={3}>{name}</Title>

          <Group>
            <ActionIcon
              color="red"
              size="sm"
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
            color="red"
            size="sm"
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
      </Card.Section>

      <Card.Section inheritPadding py="sm">
        {children}
      </Card.Section>
    </Card>
  )
}

export const ExperimentPage = () => {
  const { theme } = useStyles()
  const { t } = useTranslation()

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
        protocol: faker.helpers.arrayElement([
          'vmess',
          'vless',
          'shadowsocks',
          'trojan',
          'hysteria',
          'socks5',
          'direct',
          'http',
        ]),
        tag: faker.lorem.word(),
        link: faker.internet.url(),
      }),
      {
        count: 20,
      }
    )
  )

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const [openedCreateGroupModal, { open: openCreateGroupModal, close: closeCreateGroupModal }] = useDisclosure(false)
  const [openedImportNodeModal, { open: openImportNodeModal, close: closeImportNodeModal }] = useDisclosure(false)

  return (
    <div>
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
          <Stack id="group">
            <Group position="apart">
              <Anchor href="#group">
                <Title>{t('group')}</Title>
              </Anchor>

              <ActionIcon
                onClick={() => {
                  openCreateGroupModal()
                }}
              >
                <IconPlus />
              </ActionIcon>
            </Group>

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
                  <Text fw={600} color={theme.primaryColor}>
                    {policy}
                  </Text>

                  <List listStyleType="disc">
                    {policyParams.map((policyParam, i) => (
                      <List.Item key={i}>{policyParam}</List.Item>
                    ))}
                  </List>

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

          <Stack id="node">
            <Group position="apart">
              <Anchor href="#node">
                <Title>{t('node')}</Title>
              </Anchor>

              <ActionIcon onClick={openImportNodeModal}>
                <IconPlus />
              </ActionIcon>
            </Group>

            <SimpleGrid cols={3}>
              {fakeNodes.map(({ id, name, tag, protocol, link }) => (
                <DraggableNode
                  key={id}
                  id={id}
                  name={name}
                  onRemove={() => {
                    setFakeNodes((nodes) => nodes.filter((node) => node.id !== id))
                  }}
                >
                  <Text fw={600} color={theme.primaryColor}>
                    {tag}
                  </Text>
                  <Text fw={600}>{protocol}</Text>
                  <HoverCard withArrow>
                    <HoverCard.Target>
                      <Text truncate>{link}</Text>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text>{link}</Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                </DraggableNode>
              ))}
            </SimpleGrid>
          </Stack>

          <DragOverlay dropAnimation={null}>
            {activeId ? <Badge>{fakeNodes.find((node) => node.id === activeId)?.name}</Badge> : null}
          </DragOverlay>
        </DndContext>

        <CreateGroupFormModal opened={openedCreateGroupModal} onClose={closeCreateGroupModal} />
        <ImportNodeFormModal opened={openedImportNodeModal} onClose={closeImportNodeModal} />
      </Stack>
    </div>
  )
}
