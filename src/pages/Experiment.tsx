import { DndContext, DragOverlay, UniqueIdentifier, closestCenter } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor, restrictToParentElement } from '@dnd-kit/modifiers'
import { SortableContext, arrayMove, rectSwappingStrategy } from '@dnd-kit/sortable'
import { faker } from '@faker-js/faker'
import {
  Accordion,
  ActionIcon,
  Anchor,
  Badge,
  Code,
  Divider,
  Group,
  HoverCard,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Prism } from '@mantine/prism'
import Editor from '@monaco-editor/react'
import { IconForms } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  useCreateDNSMutation,
  useCreateRoutingMutation,
  useImportNodesMutation,
  useImportSubscriptionsMutation,
} from '~/apis'
import { ConfigFormDrawer } from '~/components/ConfigFormModal'
import { CreateNodeFormModal } from '~/components/CreateNodeFormModal'
import { DraggableResourceBadge } from '~/components/DraggableResourceBadge'
import { DraggableResourceCard } from '~/components/DraggableResourceCard'
import { DroppableGroupCard } from '~/components/DroppableGroupCard'
import { GroupFormModal } from '~/components/GroupFormModal'
import { ImportResourceFormModal } from '~/components/ImportResourceFormModal'
import { NodeModal } from '~/components/NodeModal'
import { PlainTextFormModal } from '~/components/PlainTextFormModal'
import { RenameFormModal, RenameFormModalRef } from '~/components/RenameFormModal'
import { Section } from '~/components/Section'
import { SimpleCard } from '~/components/SimpleCard'
import { DialMode, DraggableResourceType, LogLevel, RuleType } from '~/constants'
import { EDITOR_OPTIONS } from '~/constants/editor'
import { Policy } from '~/schemas/gql/graphql'

export const ExperimentPage = () => {
  const { t } = useTranslation()
  const theme = useMantineTheme()

  const [fakeConfigs, setFakeConfigs] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        selected: faker.datatype.boolean(),
        global: {
          tproxyPort: faker.internet.port(),
          logLevel: faker.helpers.enumValue(LogLevel),
          tcpCheckUrl: faker.helpers.multiple(() => faker.internet.url(), { count: { min: 1, max: 4 } }),
          udpCheckDns: faker.helpers.multiple(() => faker.internet.url(), { count: { min: 1, max: 4 } }),
          checkInterval: faker.number.int(),
          checkTolerence: faker.number.int(),
          sniffingTimeout: faker.number.int(),
          lanInterface: faker.helpers.multiple(() => faker.system.networkInterface(), { count: { min: 1, max: 4 } }),
          wanInterface: faker.helpers.multiple(() => faker.system.networkInterface(), { count: { min: 1, max: 4 } }),
          allowInsecure: faker.datatype.boolean(),
          dialMode: faker.helpers.enumValue(DialMode),
          disableWaitingNetwork: faker.datatype.boolean(),
          autoConfigKernelParameter: faker.datatype.boolean(),
        },
      }),
      {
        count: 2,
      }
    )
  )

  const [fakeDnss, setFakeDnss] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        selected: faker.datatype.boolean(),
        dns: faker.lorem.paragraph(),
      }),
      {
        count: 2,
      }
    )
  )

  const [fakeRoutings, setFakeRoutings] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        selected: faker.datatype.boolean(),
        routing: {
          string: faker.lorem.paragraph(),
          rules: [],
        },
        referenceGroups: [],
      }),
      {
        count: 2,
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
          }),
          {
            count: faker.number.int({ min: 5, max: 10 }),
          }
        ),
        subscriptions: faker.helpers.multiple(
          () => ({
            id: faker.string.uuid(),
            name: faker.lorem.word(),
          }),
          {
            count: 5,
          }
        ),
        policy: faker.helpers.enumValue(Policy),
      }),
      {
        count: 2,
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
        count: 3,
      }
    )
  )

  const [fakeSubscriptions, setFakeSubscriptions] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        tag: faker.lorem.word(),
        link: faker.internet.url(),
        updatedAt: dayjs(faker.date.recent()).format('YYYY-MM-DD HH:mm:ss'),
        nodes: faker.helpers.multiple(
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
            count: { min: 5, max: 10 },
          }
        ),
      }),
      {
        count: 2,
      }
    )
  )

  const [droppableGroupCardAccordionValues, setDroppableGroupCardAccordionValues] = useState<string[]>([])

  const [draggingResource, setDraggingResource] = useState<{
    id: UniqueIdentifier
    type: DraggableResourceType
  } | null>(null)

  const [openedRenameModal, { open: openRenameModal, close: closeRenameModal }] = useDisclosure(false)
  const [openedCreateConfigModal, { open: openCreateConfigModal, close: closeCreateConfigModal }] = useDisclosure(false)
  const [openedCreateDnsModal, { open: openCreateDnsModal, close: closeCreateDnsModal }] = useDisclosure(false)
  const [openedCreateRoutingModal, { open: openCreateRoutingModal, close: closeCreateRoutingModal }] =
    useDisclosure(false)
  const [openedCreateGroupModal, { open: openCreateGroupModal, close: closeCreateGroupModal }] = useDisclosure(false)
  const [openedImportNodeModal, { open: openImportNodeModal, close: closeImportNodeModal }] = useDisclosure(false)
  const [openedImportSubscriptionModal, { open: openImportSubscriptionModal, close: closeImportSubscriptionModal }] =
    useDisclosure(false)

  const createDNSMutation = useCreateDNSMutation()
  const createRoutingMutation = useCreateRoutingMutation()
  const importNodesMutation = useImportNodesMutation()
  const importSubscriptionsMutation = useImportSubscriptionsMutation()

  const renameModalRef = useRef<RenameFormModalRef>(null)

  return (
    <Stack>
      <Editor height={500} defaultValue="hello world" theme="vs-dark" options={EDITOR_OPTIONS} />

      <SimpleGrid cols={3}>
        <Section title={t('config')} onCreate={openCreateConfigModal}>
          <Stack>
            {fakeConfigs.map((config) => (
              <SimpleCard
                key={config.id}
                name={config.name}
                selected={false}
                actions={
                  <ActionIcon
                    size="xs"
                    onClick={() => {
                      if (renameModalRef.current) {
                        renameModalRef.current.setProps({
                          id: config.id,
                          type: RuleType.config,
                          oldName: config.name,
                        })
                      }

                      openRenameModal()
                    }}
                  >
                    <IconForms />
                  </ActionIcon>
                }
                onRemove={() => setFakeConfigs((configs) => configs.filter((c) => c.id !== config.id))}
              >
                <Prism language="json">{JSON.stringify(config, null, 2)}</Prism>
              </SimpleCard>
            ))}
          </Stack>
        </Section>

        <Section title={t('dns')} onCreate={openCreateDnsModal}>
          <Stack>
            {fakeDnss.map((dns) => (
              <SimpleCard
                key={dns.id}
                name={dns.name}
                selected={false}
                actions={
                  <ActionIcon
                    size="xs"
                    onClick={() => {
                      if (renameModalRef.current) {
                        renameModalRef.current.setProps({
                          id: dns.id,
                          type: RuleType.dns,
                          oldName: dns.name,
                        })
                      }

                      openRenameModal()
                    }}
                  >
                    <IconForms />
                  </ActionIcon>
                }
                onRemove={() => setFakeDnss((dnss) => dnss.filter((c) => c.id !== dns.id))}
              >
                <Code block>{dns.dns}</Code>
              </SimpleCard>
            ))}
          </Stack>
        </Section>

        <Section title={t('routing')} onCreate={openCreateRoutingModal}>
          <Stack>
            {fakeRoutings.map((routing) => (
              <SimpleCard
                key={routing.id}
                name={routing.name}
                selected={false}
                actions={
                  <ActionIcon
                    size="xs"
                    onClick={() => {
                      if (renameModalRef.current) {
                        renameModalRef.current.setProps({
                          id: routing.id,
                          type: RuleType.routing,
                          oldName: routing.name,
                        })
                      }

                      openRenameModal()
                    }}
                  >
                    <IconForms />
                  </ActionIcon>
                }
                onRemove={() => setFakeRoutings((routings) => routings.filter((c) => c.id !== routing.id))}
              >
                <Code>{routing.routing.string}</Code>
              </SimpleCard>
            ))}
          </Stack>
        </Section>
      </SimpleGrid>

      <Divider />

      <Title id="resource" order={3}>
        <Anchor href="#resource">{t('resource')}</Anchor>
      </Title>

      <SimpleGrid cols={3}>
        <DndContext
          modifiers={[restrictToFirstScrollableAncestor]}
          onDragStart={(e) => {
            setDraggingResource({
              id: e.active.id,
              type: (
                e.active.data.current as {
                  type: DraggableResourceType
                }
              ).type,
            })
          }}
          onDragEnd={(e) => {
            const { active, over } = e

            if (draggingResource?.type === DraggableResourceType.node) {
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
            }

            if (draggingResource?.type === DraggableResourceType.subscription) {
              const activeSubscription = fakeSubscriptions.find((subscription) => subscription.id === active.id)

              if (activeSubscription) {
                const updatedFakeGrups = produce(fakeGroups, (groups) => {
                  const group = groups.find((group) => group.id === over?.id)

                  if (!group?.subscriptions.find((subscription) => subscription.id === active.id)) {
                    group?.subscriptions.push(activeSubscription)
                  }
                })

                setFakeGroups(updatedFakeGrups)
              }
            }

            setDraggingResource(null)
          }}
        >
          <Section title={t('group')} onCreate={openCreateGroupModal} bordered>
            <Stack>
              {fakeGroups.map(({ id: groupId, name, policy, nodes, subscriptions }) => (
                <DroppableGroupCard
                  key={groupId}
                  id={groupId}
                  name={name}
                  onRemove={() => {
                    setFakeGroups((groups) => groups.filter((group) => group.id !== groupId))
                  }}
                >
                  <Text fw={600}>{policy}</Text>

                  <Space h={10} />

                  <Accordion
                    variant="filled"
                    value={droppableGroupCardAccordionValues}
                    onChange={setDroppableGroupCardAccordionValues}
                    multiple
                  >
                    <Accordion.Item value="node">
                      <Accordion.Control fz="xs" px="xs">
                        {t('node')}
                      </Accordion.Control>

                      <Accordion.Panel>
                        <SimpleGrid cols={2}>
                          <DndContext
                            modifiers={[restrictToParentElement]}
                            collisionDetection={closestCenter}
                            onDragEnd={({ active, over }) => {
                              if (active && over && active.id !== over.id) {
                                const updatedFakeGrups = produce(fakeGroups, (groups) => {
                                  const group = groups.find((group) => group.id === groupId)

                                  if (group) {
                                    const from = group?.nodes.findIndex((node) => node.id === active.id)
                                    const to = group?.nodes.findIndex((node) => node.id === over.id)

                                    group.nodes = arrayMove(group.nodes, from, to)
                                  }
                                })

                                setFakeGroups(updatedFakeGrups)
                              }
                            }}
                          >
                            <SortableContext items={nodes} strategy={rectSwappingStrategy}>
                              {nodes.map(({ id: nodeId, name }) => (
                                <DraggableResourceBadge
                                  key={nodeId}
                                  type={DraggableResourceType.node}
                                  id={nodeId}
                                  name={name}
                                  onRemove={() => {
                                    const updatedFakeGrups = produce(fakeGroups, (groups) => {
                                      const group = groups.find((group) => group.id === groupId)

                                      if (group) {
                                        group.nodes = group.nodes.filter((node) => node.id !== nodeId)
                                      }
                                    })

                                    setFakeGroups(updatedFakeGrups)
                                  }}
                                />
                              ))}
                            </SortableContext>
                          </DndContext>
                        </SimpleGrid>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="subscription">
                      <Accordion.Control fz="xs" px="xs">
                        {t('subscription')}
                      </Accordion.Control>

                      <Accordion.Panel>
                        <SimpleGrid cols={2}>
                          <DndContext modifiers={[restrictToParentElement]}>
                            <SortableContext items={subscriptions} strategy={rectSwappingStrategy}>
                              {subscriptions.map(({ id: subscriptionId, name }) => (
                                <DraggableResourceBadge
                                  key={subscriptionId}
                                  type={DraggableResourceType.subscription}
                                  id={subscriptionId}
                                  name={name}
                                  onRemove={() => {
                                    const updatedFakeGrups = produce(fakeGroups, (groups) => {
                                      const group = groups.find((group) => group.id === groupId)

                                      if (group) {
                                        group.subscriptions = group.subscriptions.filter(
                                          (subscription) => subscription.id !== subscriptionId
                                        )
                                      }
                                    })

                                    setFakeGroups(updatedFakeGrups)
                                  }}
                                />
                              ))}
                            </SortableContext>
                          </DndContext>
                        </SimpleGrid>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </DroppableGroupCard>
              ))}
            </Stack>
          </Section>

          <Section title={t('node')} onCreate={openImportNodeModal} bordered>
            <Stack>
              {fakeNodes.map(({ id, name, tag, protocol, link }) => (
                <DraggableResourceCard
                  key={id}
                  id={id}
                  type={DraggableResourceType.node}
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
                </DraggableResourceCard>
              ))}
            </Stack>
          </Section>

          <Section title={t('subscription')} onCreate={openImportSubscriptionModal} bordered>
            <Stack>
              {fakeSubscriptions.map(({ id, name, tag, link, updatedAt, nodes }) => (
                <DraggableResourceCard
                  key={id}
                  id={id}
                  type={DraggableResourceType.subscription}
                  name={name}
                  onRemove={() => {
                    setFakeSubscriptions((subscriptions) =>
                      subscriptions.filter((subscription) => subscription.id !== id)
                    )
                  }}
                >
                  <Text fw={600} color={theme.primaryColor}>
                    {tag}
                  </Text>
                  <Text fw={600}>{updatedAt}</Text>
                  <HoverCard withArrow>
                    <HoverCard.Target>
                      <Text truncate>{link}</Text>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text>{link}</Text>
                    </HoverCard.Dropdown>
                  </HoverCard>

                  <Space h={10} />

                  <Group spacing="sm">
                    {nodes.map(({ id, name }) => (
                      <Badge key={id}>{name}</Badge>
                    ))}
                  </Group>
                </DraggableResourceCard>
              ))}
            </Stack>
          </Section>

          <DragOverlay dropAnimation={null}>
            {draggingResource ? (
              <Badge>
                {draggingResource?.type === DraggableResourceType.node
                  ? fakeNodes.find((node) => node.id === draggingResource.id)?.name
                  : fakeSubscriptions.find((subscription) => subscription.id === draggingResource.id)?.name}
              </Badge>
            ) : null}
          </DragOverlay>
        </DndContext>
      </SimpleGrid>

      <ConfigFormDrawer opened={openedCreateConfigModal} onClose={closeCreateConfigModal} />

      <PlainTextFormModal
        title={t('dns')}
        opened={openedCreateDnsModal}
        onClose={closeCreateDnsModal}
        handleSubmit={async (values) => {
          await createDNSMutation.mutateAsync({
            name: values.name,
            dns: values.text,
          })
        }}
      />

      <PlainTextFormModal
        title={t('routing')}
        opened={openedCreateRoutingModal}
        onClose={closeCreateRoutingModal}
        handleSubmit={async (values) => {
          await createRoutingMutation.mutateAsync({
            name: values.name,
            routing: values.text,
          })
        }}
      />

      <GroupFormModal opened={openedCreateGroupModal} onClose={closeCreateGroupModal} />

      <ImportResourceFormModal
        title={t('node')}
        opened={openedImportNodeModal}
        onClose={closeImportNodeModal}
        handleSubmit={async (values) => {
          await importNodesMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
          closeImportNodeModal()
        }}
      />

      <ImportResourceFormModal
        title={t('subscription')}
        opened={openedImportSubscriptionModal}
        onClose={closeImportSubscriptionModal}
        handleSubmit={async (values) => {
          await importSubscriptionsMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
          closeImportNodeModal()
        }}
      />

      <CreateNodeFormModal
        opened={false}
        onClose={() => {
          //
        }}
      />

      <RenameFormModal ref={renameModalRef} opened={openedRenameModal} onClose={closeRenameModal} />

      <NodeModal
        opened
        onClose={() => {
          //
        }}
      />
    </Stack>
  )
}
