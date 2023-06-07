import { DndContext, DragOverlay } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor, restrictToParentElement } from '@dnd-kit/modifiers'
import { SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable'
import {
  Accordion,
  ActionIcon,
  Anchor,
  Badge,
  Code,
  Divider,
  Group,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Prism } from '@mantine/prism'
import { useStore } from '@nanostores/react'
import { IconRefresh } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  useConfigsQuery,
  useCreateDNSMutation,
  useCreateRoutingMutation,
  useDNSsQuery,
  useGroupAddNodesMutation,
  useGroupAddSubscriptionsMutation,
  useGroupDelNodesMutation,
  useGroupDelSubscriptionsMutation,
  useGroupsQuery,
  useImportNodesMutation,
  useImportSubscriptionsMutation,
  useNodesQuery,
  useRemoveConfigMutation,
  useRemoveDNSMutation,
  useRemoveGroupMutation,
  useRemoveNodesMutation,
  useRemoveRoutingMutation,
  useRemoveSubscriptionsMutation,
  useRoutingsQuery,
  useSelectConfigMutation,
  useSelectDNSMutation,
  useSelectRoutingMutation,
  useSubscriptionsQuery,
  useUpdateSubscriptionsMutation,
} from '~/apis'
import { CreateConfigFormModal } from '~/components/CreateConfigFormModal'
import { CreateGroupFormModal } from '~/components/CreateGroupFormModal'
import { DraggableResourceCard } from '~/components/DraggableResourceCard'
import { DroppableGroupCard } from '~/components/DroppableGroupCard'
import { ImportResourceFormModal } from '~/components/ImportResourceFormModal'
import { PlainTextFormModal } from '~/components/PlainTextFormModal'
import { Section } from '~/components/Section'
import { SimpleCard } from '~/components/SimpleCard'
import { SortableResourceBadge } from '~/components/SortableResourceBadge'
import { ResourceType } from '~/constants'
import { defaultResourcesAtom } from '~/store'

export const OrchestratePage = () => {
  const { t } = useTranslation()
  const theme = useMantineTheme()

  const { data: configsQuery } = useConfigsQuery()
  const selectConfigMutation = useSelectConfigMutation()
  const removeConfigMutation = useRemoveConfigMutation()

  const { data: dnssQuery } = useDNSsQuery()
  const selectDNSMutation = useSelectDNSMutation()
  const removeDNSMutation = useRemoveDNSMutation()

  const { data: routingsQuery } = useRoutingsQuery()
  const selectRoutingMutation = useSelectRoutingMutation()
  const removeRoutingMutation = useRemoveRoutingMutation()

  const { data: groupsQuery } = useGroupsQuery()
  const removeGroupMutation = useRemoveGroupMutation()
  const groupAddNodesMutation = useGroupAddNodesMutation()
  const groupAddSubscriptionsMutation = useGroupAddSubscriptionsMutation()
  const groupDelNodesMutation = useGroupDelNodesMutation()
  const groupDelSubscriptionsMutation = useGroupDelSubscriptionsMutation()

  const { data: nodesQuery } = useNodesQuery()
  const removeNodesMutation = useRemoveNodesMutation()

  const { data: subscriptionsQuery } = useSubscriptionsQuery()
  const removeSubscriptionsMutation = useRemoveSubscriptionsMutation()

  const [droppableGroupCardAccordionValues, setDroppableGroupCardAccordionValues] = useState<string[]>([])

  const [draggingResource, setDraggingResource] = useState<{
    id: string
    type: ResourceType
  } | null>(null)

  const draggingResourceDisplayName = useMemo(() => {
    if (draggingResource) {
      const { type, id } = draggingResource

      if (type === ResourceType.node) {
        const node = nodesQuery?.nodes.edges.find((node) => node.id === id)

        return node?.name
      }

      if (type === ResourceType.subscription) {
        const subscription = subscriptionsQuery?.subscriptions.find(
          (subscription) => subscription.id === draggingResource.id
        )

        return subscription?.tag || subscription?.link
      }
    }
  }, [draggingResource, nodesQuery, subscriptionsQuery])

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
  const updateSubscriptionsMutation = useUpdateSubscriptionsMutation()

  const { defaultConfigID, defaultDNSID, defaultGroupID, defaultRoutingID } = useStore(defaultResourcesAtom)

  return (
    <Stack>
      <Divider
        variant="dashed"
        labelPosition="center"
        label={
          <Title id="rule" order={3} tt="uppercase">
            <Anchor href="#rule">{t('rule')}</Anchor>
          </Title>
        }
      />

      <SimpleGrid cols={3}>
        <Section title={t('config')} onCreate={openCreateConfigModal}>
          <Stack>
            {configsQuery?.configs.map((config) => (
              <SimpleCard
                key={config.id}
                name={config.name}
                selected={config.selected}
                onSelect={() => selectConfigMutation.mutate({ id: config.id })}
                onRemove={config.id !== defaultConfigID ? () => removeConfigMutation.mutate(config.id) : undefined}
              >
                <Prism language="json">{JSON.stringify(config, null, 2)}</Prism>
              </SimpleCard>
            ))}
          </Stack>
        </Section>

        <Section title={t('dns')} onCreate={openCreateDnsModal}>
          <Stack>
            {dnssQuery?.dnss.map((dns) => (
              <SimpleCard
                key={dns.id}
                name={dns.name}
                selected={dns.selected}
                onSelect={() => selectDNSMutation.mutate({ id: dns.id })}
                onRemove={dns.id !== defaultDNSID ? () => removeDNSMutation.mutate(dns.id) : undefined}
              >
                <Code block>
                  <pre
                    style={{
                      display: 'contents',
                    }}
                  >
                    {dns.dns.string}
                  </pre>
                </Code>
              </SimpleCard>
            ))}
          </Stack>
        </Section>

        <Section title={t('routing')} onCreate={openCreateRoutingModal}>
          <Stack>
            {routingsQuery?.routings.map((routing) => (
              <SimpleCard
                key={routing.id}
                name={routing.name}
                selected={routing.selected}
                onSelect={() => selectRoutingMutation.mutate({ id: routing.id })}
                onRemove={routing.id !== defaultRoutingID ? () => removeRoutingMutation.mutate(routing.id) : undefined}
              >
                <Code block>
                  <pre
                    style={{
                      display: 'contents',
                    }}
                  >
                    {routing.routing.string}
                  </pre>
                </Code>
              </SimpleCard>
            ))}
          </Stack>
        </Section>
      </SimpleGrid>

      <Divider
        variant="dashed"
        labelPosition="center"
        label={
          <Title id="resource" order={3} tt="uppercase">
            <Anchor href="#resource">{t('resource')}</Anchor>
          </Title>
        }
      />

      <SimpleGrid cols={3}>
        <DndContext
          modifiers={[restrictToFirstScrollableAncestor]}
          onDragStart={(e) => {
            setDraggingResource({
              id: e.active.id as string,
              type: (
                e.active.data.current as {
                  type: ResourceType
                }
              ).type,
            })
          }}
          onDragEnd={(e) => {
            const { over } = e

            if (over?.id && draggingResource?.id) {
              if (draggingResource.type === ResourceType.node) {
                groupAddNodesMutation.mutate({ id: over.id as string, nodeIDs: [draggingResource.id] })
              }

              if (draggingResource.type === ResourceType.subscription) {
                groupAddSubscriptionsMutation.mutate({ id: over.id as string, subscriptionIDs: [draggingResource.id] })
              }
            }

            setDraggingResource(null)
          }}
        >
          <Section title={t('group')} onCreate={openCreateGroupModal} bordered>
            <Stack>
              {groupsQuery?.groups.map(({ id: groupId, name, policy, nodes, subscriptions }) => (
                <DroppableGroupCard
                  key={groupId}
                  id={groupId}
                  name={name}
                  onRemove={defaultGroupID !== groupId ? () => removeGroupMutation.mutate(groupId) : undefined}
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
                          <DndContext modifiers={[restrictToParentElement]}>
                            <SortableContext items={nodes} strategy={rectSwappingStrategy}>
                              {nodes.map(({ id: nodeId, name }) => (
                                <SortableResourceBadge
                                  key={nodeId}
                                  id={nodeId}
                                  name={name}
                                  onRemove={() =>
                                    groupDelNodesMutation.mutate({
                                      id: groupId,
                                      nodeIDs: [nodeId],
                                    })
                                  }
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
                              {subscriptions.map(({ id: subscriptionId, tag, link }) => (
                                <SortableResourceBadge
                                  key={subscriptionId}
                                  id={subscriptionId}
                                  name={tag || link}
                                  onRemove={() =>
                                    groupDelSubscriptionsMutation.mutate({
                                      id: groupId,
                                      subscriptionIDs: [subscriptionId],
                                    })
                                  }
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
              {nodesQuery?.nodes.edges.map(({ id, name, tag, protocol, link }) => (
                <DraggableResourceCard
                  key={id}
                  id={id}
                  type={ResourceType.node}
                  name={name}
                  onRemove={() => removeNodesMutation.mutate([id])}
                >
                  <Text fw={600} color={theme.primaryColor}>
                    {tag}
                  </Text>
                  <Text fw={600}>{protocol}</Text>

                  <Text
                    fz="sm"
                    style={{
                      wordBreak: 'break-all',
                    }}
                  >
                    {link}
                  </Text>
                </DraggableResourceCard>
              ))}
            </Stack>
          </Section>

          <Section title={t('subscription')} onCreate={openImportSubscriptionModal} bordered>
            <Stack>
              {subscriptionsQuery?.subscriptions.map(({ id, tag, link, updatedAt, nodes }) => (
                <DraggableResourceCard
                  key={id}
                  id={id}
                  type={ResourceType.subscription}
                  name={tag || link}
                  actions={
                    <ActionIcon size="sm" onClick={() => updateSubscriptionsMutation.mutate([id])}>
                      <IconRefresh />
                    </ActionIcon>
                  }
                  onRemove={() => removeSubscriptionsMutation.mutate([id])}
                >
                  <Text fw={600}>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>

                  <Text
                    fz="sm"
                    style={{
                      wordBreak: 'break-all',
                    }}
                  >
                    {link}
                  </Text>

                  <Space h={10} />

                  <Group spacing="sm">
                    {nodes.edges.map(({ id, name }) => (
                      <Badge key={id}>{name}</Badge>
                    ))}
                  </Group>
                </DraggableResourceCard>
              ))}
            </Stack>
          </Section>

          <DragOverlay dropAnimation={null}>
            {draggingResource ? <Badge>{draggingResourceDisplayName}</Badge> : null}
          </DragOverlay>
        </DndContext>
      </SimpleGrid>

      <CreateConfigFormModal opened={openedCreateConfigModal} onClose={closeCreateConfigModal} />

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

      <CreateGroupFormModal opened={openedCreateGroupModal} onClose={closeCreateGroupModal} />

      <ImportResourceFormModal
        title={t('node')}
        opened={openedImportNodeModal}
        onClose={closeImportNodeModal}
        handleSubmit={async (values) => {
          await importNodesMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
        }}
      />

      <ImportResourceFormModal
        title={t('subscription')}
        opened={openedImportSubscriptionModal}
        onClose={closeImportSubscriptionModal}
        handleSubmit={async (values) => {
          await importSubscriptionsMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
        }}
      />
    </Stack>
  )
}
