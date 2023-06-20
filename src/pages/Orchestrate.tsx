import { DndContext, DragOverlay } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor, restrictToParentElement } from '@dnd-kit/modifiers'
import { SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable'
import {
  Accordion,
  ActionIcon,
  Anchor,
  Badge,
  Divider,
  Group,
  SimpleGrid,
  Space,
  Spoiler,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Prism } from '@mantine/prism'
import { useStore } from '@nanostores/react'
import {
  IconCloud,
  IconCloudComputing,
  IconEdit,
  IconForms,
  IconMap,
  IconRoute,
  IconSettings,
  IconTable,
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import { Fragment, useMemo, useRef, useState } from 'react'
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
  useRenameConfigMutation,
  useRenameDNSMutation,
  useRenameGroupMutation,
  useRenameRoutingMutation,
  useRoutingsQuery,
  useSelectConfigMutation,
  useSelectDNSMutation,
  useSelectRoutingMutation,
  useSubscriptionsQuery,
  useUpdateDNSMutation,
  useUpdateRoutingMutation,
} from '~/apis'
import { ConfigFormDrawer, ConfigFormDrawerRef } from '~/components/ConfigFormModal'
import { DraggableResourceCard } from '~/components/DraggableResourceCard'
import { DraggableSubscriptionNodeBadge } from '~/components/DraggableSubscriptionNodeBadge'
import { DroppableGroupCard } from '~/components/DroppableGroupCard'
import { GroupFormDrawerRef, GroupFormModal } from '~/components/GroupFormModal'
import { ImportResourceFormModal } from '~/components/ImportResourceFormModal'
import { PlainTextFormModal, PlainTextgFormModalRef } from '~/components/PlainTextFormModal'
import { RenameFormModal, RenameFormModalRef } from '~/components/RenameFormModal'
import { Section } from '~/components/Section'
import { SimpleCard } from '~/components/SimpleCard'
import { SortableResourceBadge } from '~/components/SortableResourceBadge'
import { UpdateSubscriptionAction } from '~/components/UpdateSubscriptionAction'
import { DraggableResourceType, GET_LOG_LEVEL_STEPS, RuleType } from '~/constants'
import { defaultResourcesAtom } from '~/store'
import { deriveTime } from '~/utils'

type DraggingResource = {
  id: string
  type: DraggableResourceType
  subscriptionID?: string
}

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

  const [draggingResource, setDraggingResource] = useState<DraggingResource | null>(null)

  const draggingResourceDisplayName = useMemo(() => {
    if (draggingResource) {
      const { type, id, subscriptionID } = draggingResource

      if (type === DraggableResourceType.node) {
        const node = nodesQuery?.nodes.edges.find((node) => node.id === id)

        return node?.tag
      }

      if (type === DraggableResourceType.subscription) {
        const subscription = subscriptionsQuery?.subscriptions.find((subscription) => subscription.id === id)

        return subscription?.tag || subscription?.link
      }

      if (type === DraggableResourceType.subscription_node) {
        const subscription = subscriptionsQuery?.subscriptions.find(
          (subscription) => subscription.id === subscriptionID
        )
        const node = subscription?.nodes.edges.find((node) => node.id === id)

        return node?.name
      }
    }
  }, [draggingResource, nodesQuery, subscriptionsQuery])

  const [openedRenameFormModal, { open: openRenameFormModal, close: closeRenameFormModal }] = useDisclosure(false)
  const [openedCreateConfigFormDrawer, { open: openCreateConfigFormDrawer, close: closeCreateConfigFormDrawer }] =
    useDisclosure(false)
  const [openedUpdateConfigFormDrawer, { open: openUpdateConfigFormDrawer, close: closeUpdateConfigFormDrawer }] =
    useDisclosure(false)
  const [openedCreateDNSFormModal, { open: openCreateDNSFormModal, close: closeCreateDNSFormModal }] =
    useDisclosure(false)
  const [openedUpdateDNSFormModal, { open: openUpdateDNSFormModal, close: closeUpdateDNSFormModal }] =
    useDisclosure(false)
  const [openedCreateRoutingFormModal, { open: openCreateRoutingFormModal, close: closeCreateRoutingFormModal }] =
    useDisclosure(false)
  const [openedUpdateRoutingFormModal, { open: openUpdateRoutingFormModal, close: closeUpdateRoutingFormModal }] =
    useDisclosure(false)
  const [openedCreateGroupFormModal, { open: openCreateGroupFormModal, close: closeCreateGroupFormModal }] =
    useDisclosure(false)
  const [openedUpdateGroupFormModal, { open: openUpdateGroupFormModal, close: closeUpdateGroupFormModal }] =
    useDisclosure(false)
  const [openedImportNodeFormModal, { open: openImportNodeFormModal, close: closeImportNodeFormModal }] =
    useDisclosure(false)
  const [
    openedImportSubscriptionFormModal,
    { open: openImportSubscriptionFormModal, close: closeImportSubscriptionFormModal },
  ] = useDisclosure(false)

  const createDNSMutation = useCreateDNSMutation()
  const createRoutingMutation = useCreateRoutingMutation()
  const importNodesMutation = useImportNodesMutation()
  const importSubscriptionsMutation = useImportSubscriptionsMutation()

  const renameFormModalRef = useRef<RenameFormModalRef>(null)
  const renameConfigMutation = useRenameConfigMutation()
  const renameDNSMutation = useRenameDNSMutation()
  const renameRoutingMutation = useRenameRoutingMutation()
  const renameGroupMutation = useRenameGroupMutation()

  const { defaultConfigID, defaultDNSID, defaultGroupID, defaultRoutingID } = useStore(defaultResourcesAtom)

  const updateConfigFormDrawerRef = useRef<ConfigFormDrawerRef>(null)
  const updateDNSFormModalRef = useRef<PlainTextgFormModalRef>(null)
  const updateRoutingFormModalRef = useRef<PlainTextgFormModalRef>(null)
  const updateGroupFormModalRef = useRef<GroupFormDrawerRef>(null)

  const updateDNSMutation = useUpdateDNSMutation()
  const updateRoutingMutation = useUpdateRoutingMutation()

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
        <Section title={t('config')} icon={<IconSettings />} onCreate={openCreateConfigFormDrawer}>
          <Stack>
            {configsQuery?.configs.map((config) => (
              <SimpleCard
                key={config.id}
                name={config.name}
                actions={
                  <Fragment>
                    <ActionIcon
                      size="xs"
                      onClick={() => {
                        if (renameFormModalRef.current) {
                          renameFormModalRef.current.setProps({
                            id: config.id,
                            type: RuleType.config,
                            oldName: config.name,
                          })
                        }
                        openRenameFormModal()
                      }}
                    >
                      <IconForms />
                    </ActionIcon>

                    <ActionIcon
                      size="xs"
                      onClick={() => {
                        updateConfigFormDrawerRef.current?.setEditingID(config.id)

                        const { checkInterval, checkTolerance, sniffingTimeout, logLevel, ...global } = config.global

                        const logLevelSteps = GET_LOG_LEVEL_STEPS(t)
                        const logLevelNumber = logLevelSteps.findIndex(([, l]) => l === logLevel)

                        updateConfigFormDrawerRef.current?.initOrigins({
                          name: config.name,
                          logLevelNumber,
                          checkIntervalSeconds: deriveTime(checkInterval, 's'),
                          checkToleranceMS: deriveTime(checkTolerance, 'ms'),
                          sniffingTimeoutMS: deriveTime(sniffingTimeout, 'ms'),
                          ...global,
                        })

                        openUpdateConfigFormDrawer()
                      }}
                    >
                      <IconEdit />
                    </ActionIcon>
                  </Fragment>
                }
                selected={config.selected}
                onSelect={() => selectConfigMutation.mutate({ id: config.id })}
                onRemove={config.id !== defaultConfigID ? () => removeConfigMutation.mutate(config.id) : undefined}
              >
                <Prism language="json">{JSON.stringify(config, null, 2)}</Prism>
              </SimpleCard>
            ))}
          </Stack>
        </Section>

        <Section title={t('dns')} icon={<IconRoute />} onCreate={openCreateDNSFormModal}>
          <Stack>
            {dnssQuery?.dnss.map((dns) => (
              <SimpleCard
                key={dns.id}
                name={dns.name}
                actions={
                  <Fragment>
                    <ActionIcon
                      size="xs"
                      onClick={() => {
                        if (renameFormModalRef.current) {
                          renameFormModalRef.current.setProps({
                            id: dns.id,
                            type: RuleType.dns,
                            oldName: dns.name,
                          })
                        }
                        openRenameFormModal()
                      }}
                    >
                      <IconForms />
                    </ActionIcon>

                    <ActionIcon
                      size="xs"
                      onClick={() => {
                        updateDNSFormModalRef.current?.setEditingID(dns.id)

                        updateDNSFormModalRef.current?.initOrigins({
                          name: dns.name,
                          text: dns.dns.string,
                        })

                        openUpdateDNSFormModal()
                      }}
                    >
                      <IconEdit />
                    </ActionIcon>
                  </Fragment>
                }
                selected={dns.selected}
                onSelect={() => selectDNSMutation.mutate({ id: dns.id })}
                onRemove={dns.id !== defaultDNSID ? () => removeDNSMutation.mutate(dns.id) : undefined}
              >
                <Prism language="bash">{dns.dns.string}</Prism>
              </SimpleCard>
            ))}
          </Stack>
        </Section>

        <Section title={t('routing')} icon={<IconMap />} onCreate={openCreateRoutingFormModal}>
          <Stack>
            {routingsQuery?.routings.map((routing) => (
              <SimpleCard
                key={routing.id}
                name={routing.name}
                actions={
                  <Fragment>
                    <ActionIcon
                      size="xs"
                      onClick={() => {
                        if (renameFormModalRef.current) {
                          renameFormModalRef.current.setProps({
                            id: routing.id,
                            type: RuleType.routing,
                            oldName: routing.name,
                          })
                        }
                        openRenameFormModal()
                      }}
                    >
                      <IconForms />
                    </ActionIcon>

                    <ActionIcon
                      size="xs"
                      onClick={() => {
                        updateRoutingFormModalRef.current?.setEditingID(routing.id)

                        updateRoutingFormModalRef.current?.initOrigins({
                          name: routing.name,
                          text: routing.routing.string,
                        })

                        openUpdateRoutingFormModal()
                      }}
                    >
                      <IconEdit />
                    </ActionIcon>
                  </Fragment>
                }
                selected={routing.selected}
                onSelect={() => selectRoutingMutation.mutate({ id: routing.id })}
                onRemove={routing.id !== defaultRoutingID ? () => removeRoutingMutation.mutate(routing.id) : undefined}
              >
                <Prism language="bash">{routing.routing.string}</Prism>
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
              ...(e.active.data.current as Omit<DraggingResource, 'id'>),
            })
          }}
          onDragEnd={(e) => {
            const { over } = e

            if (over?.id && draggingResource?.id) {
              if (draggingResource.type === DraggableResourceType.node) {
                groupAddNodesMutation.mutate({ id: over.id as string, nodeIDs: [draggingResource.id] })
              }

              if (draggingResource.type === DraggableResourceType.subscription) {
                groupAddSubscriptionsMutation.mutate({ id: over.id as string, subscriptionIDs: [draggingResource.id] })
              }

              if (draggingResource.type === DraggableResourceType.subscription_node) {
                groupAddNodesMutation.mutate({ id: over.id as string, nodeIDs: [draggingResource.id] })
              }
            }

            setDraggingResource(null)
          }}
        >
          <Section
            title={t('group')}
            icon={<IconTable />}
            onCreate={openCreateGroupFormModal}
            highlight={!!draggingResource}
            bordered
          >
            <Stack>
              {groupsQuery?.groups.map(
                ({ id: groupId, name, policy, nodes: groupNodes, subscriptions: groupSubscriptions }) => (
                  <DroppableGroupCard
                    key={groupId}
                    id={groupId}
                    name={name}
                    onRemove={defaultGroupID !== groupId ? () => removeGroupMutation.mutate(groupId) : undefined}
                    actions={
                      <Fragment>
                        <ActionIcon
                          size="xs"
                          onClick={() => {
                            if (renameFormModalRef.current) {
                              renameFormModalRef.current.setProps({
                                id: groupId,
                                type: RuleType.group,
                                oldName: name,
                              })
                            }
                            openRenameFormModal()
                          }}
                        >
                          <IconForms />
                        </ActionIcon>

                        <ActionIcon
                          size="xs"
                          onClick={() => {
                            updateGroupFormModalRef.current?.setEditingID(groupId)

                            updateGroupFormModalRef.current?.initOrigins({
                              name,
                              policy,
                            })

                            openUpdateGroupFormModal()
                          }}
                        >
                          <IconEdit />
                        </ActionIcon>
                      </Fragment>
                    }
                  >
                    <Text fz="sm" fw={600}>
                      {policy}
                    </Text>

                    <Space h={10} />

                    <Accordion
                      variant="filled"
                      value={droppableGroupCardAccordionValues}
                      onChange={setDroppableGroupCardAccordionValues}
                      multiple
                    >
                      {groupNodes.length > 0 && (
                        <Accordion.Item value="node">
                          <Accordion.Control fz="xs" px="xs">
                            {t('node')} ({groupNodes.length})
                          </Accordion.Control>

                          <Accordion.Panel>
                            <SimpleGrid cols={2}>
                              <DndContext modifiers={[restrictToParentElement]}>
                                <SortableContext items={groupNodes} strategy={rectSwappingStrategy}>
                                  {groupNodes.map(({ id: nodeId, tag, name, subscriptionID }) => (
                                    <SortableResourceBadge
                                      key={nodeId}
                                      id={nodeId}
                                      name={tag || name}
                                      onRemove={() =>
                                        groupDelNodesMutation.mutate({
                                          id: groupId,
                                          nodeIDs: [nodeId],
                                        })
                                      }
                                    >
                                      {subscriptionID &&
                                        subscriptionsQuery?.subscriptions.find((s) => s.id === subscriptionID)?.tag}
                                    </SortableResourceBadge>
                                  ))}
                                </SortableContext>
                              </DndContext>
                            </SimpleGrid>
                          </Accordion.Panel>
                        </Accordion.Item>
                      )}

                      {groupSubscriptions.length > 0 && (
                        <Accordion.Item value="subscription">
                          <Accordion.Control fz="xs" px="xs">
                            {t('subscription')} ({groupSubscriptions.length})
                          </Accordion.Control>

                          <Accordion.Panel>
                            <SimpleGrid cols={2}>
                              <DndContext modifiers={[restrictToParentElement]}>
                                <SortableContext items={groupSubscriptions} strategy={rectSwappingStrategy}>
                                  {groupSubscriptions.map(({ id: subscriptionId, tag, link }) => (
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
                      )}
                    </Accordion>
                  </DroppableGroupCard>
                )
              )}
            </Stack>
          </Section>

          <Section title={t('node')} icon={<IconCloud />} onCreate={openImportNodeFormModal} bordered>
            <Stack>
              {nodesQuery?.nodes.edges.map(({ id, name, tag, protocol, link }) => (
                <DraggableResourceCard
                  key={id}
                  id={id}
                  type={DraggableResourceType.node}
                  name={tag!}
                  onRemove={() => removeNodesMutation.mutate([id])}
                >
                  <Text fw={600} color={theme.primaryColor}>
                    {name}
                  </Text>
                  <Text fw={600}>{protocol}</Text>

                  <Spoiler
                    maxHeight={0}
                    showLabel={<Text fz="xs">{t('actions.show content')}</Text>}
                    hideLabel={<Text fz="xs">{t('actions.hide')}</Text>}
                  >
                    <Text
                      fz="sm"
                      style={{
                        wordBreak: 'break-all',
                      }}
                    >
                      {link}
                    </Text>
                  </Spoiler>
                </DraggableResourceCard>
              ))}
            </Stack>
          </Section>

          <Section
            title={t('subscription')}
            icon={<IconCloudComputing />}
            onCreate={openImportSubscriptionFormModal}
            bordered
          >
            <Stack>
              {subscriptionsQuery?.subscriptions.map(({ id: subscriptionID, tag, link, updatedAt, nodes }) => (
                <DraggableResourceCard
                  key={subscriptionID}
                  id={subscriptionID}
                  type={DraggableResourceType.subscription}
                  name={tag || link}
                  actions={<UpdateSubscriptionAction id={subscriptionID} />}
                  onRemove={() => removeSubscriptionsMutation.mutate([subscriptionID])}
                >
                  <Text fw={600}>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>

                  <Spoiler
                    maxHeight={0}
                    showLabel={<Text fz="xs">{t('actions.show content')}</Text>}
                    hideLabel={<Text fz="xs">{t('actions.hide')}</Text>}
                  >
                    <Text
                      fz="sm"
                      style={{
                        wordBreak: 'break-all',
                      }}
                    >
                      {link}
                    </Text>
                  </Spoiler>

                  <Accordion variant="filled">
                    <Accordion.Item value="node">
                      <Accordion.Control fz="xs" px="xs">
                        {t('node')} ({nodes.edges.length})
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Group spacing="sm">
                          {nodes.edges.map(({ id, name }) => (
                            <DraggableSubscriptionNodeBadge
                              key={id}
                              subscriptionID={subscriptionID}
                              name={name}
                              id={id}
                            >
                              {name}
                            </DraggableSubscriptionNodeBadge>
                          ))}
                        </Group>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </DraggableResourceCard>
              ))}
            </Stack>
          </Section>

          <DragOverlay dropAnimation={null}>
            {draggingResource ? (
              <Badge
                sx={{
                  cursor: 'grabbing',
                }}
              >
                {draggingResourceDisplayName}
              </Badge>
            ) : null}
          </DragOverlay>
        </DndContext>
      </SimpleGrid>

      <ConfigFormDrawer opened={openedCreateConfigFormDrawer} onClose={closeCreateConfigFormDrawer} />
      <ConfigFormDrawer
        ref={updateConfigFormDrawerRef}
        opened={openedUpdateConfigFormDrawer}
        onClose={closeUpdateConfigFormDrawer}
      />

      <PlainTextFormModal
        title={t('dns')}
        opened={openedCreateDNSFormModal}
        onClose={closeCreateDNSFormModal}
        handleSubmit={async (values) => {
          await createDNSMutation.mutateAsync({
            name: values.name,
            dns: values.text,
          })
        }}
      />

      <PlainTextFormModal
        ref={updateDNSFormModalRef}
        title={t('dns')}
        opened={openedUpdateDNSFormModal}
        onClose={closeUpdateDNSFormModal}
        handleSubmit={async (values) => {
          if (updateDNSFormModalRef.current) {
            await updateDNSMutation.mutateAsync({
              id: updateDNSFormModalRef.current.editingID,
              dns: values.text,
            })
          }
        }}
      />

      <PlainTextFormModal
        title={t('routing')}
        opened={openedCreateRoutingFormModal}
        onClose={closeCreateRoutingFormModal}
        handleSubmit={async (values) => {
          await createRoutingMutation.mutateAsync({
            name: values.name,
            routing: values.text,
          })
        }}
      />

      <PlainTextFormModal
        ref={updateRoutingFormModalRef}
        title={t('routing')}
        opened={openedUpdateRoutingFormModal}
        onClose={closeUpdateRoutingFormModal}
        handleSubmit={async (values) => {
          if (updateRoutingFormModalRef.current) {
            await updateRoutingMutation.mutateAsync({
              id: updateRoutingFormModalRef.current.editingID,
              routing: values.text,
            })
          }
        }}
      />

      <GroupFormModal opened={openedCreateGroupFormModal} onClose={closeCreateGroupFormModal} />
      <GroupFormModal
        ref={updateGroupFormModalRef}
        opened={openedUpdateGroupFormModal}
        onClose={closeUpdateGroupFormModal}
      />

      <ImportResourceFormModal
        title={t('node')}
        opened={openedImportNodeFormModal}
        onClose={closeImportNodeFormModal}
        handleSubmit={async (values) => {
          await importNodesMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
        }}
      />

      <ImportResourceFormModal
        title={t('subscription')}
        opened={openedImportSubscriptionFormModal}
        onClose={closeImportSubscriptionFormModal}
        handleSubmit={async (values) => {
          await importSubscriptionsMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
        }}
      />

      <RenameFormModal
        ref={renameFormModalRef}
        opened={openedRenameFormModal}
        onClose={closeRenameFormModal}
        handleSubmit={(type, id) => async (values) => {
          const { name } = values

          if (!type || !id) {
            return
          }

          if (type === RuleType.config) {
            renameConfigMutation.mutate({ id, name })
          }

          if (type === RuleType.dns) {
            renameDNSMutation.mutate({ id, name })
          }

          if (type === RuleType.routing) {
            renameRoutingMutation.mutate({ id, name })
          }

          if (type === RuleType.group) {
            renameGroupMutation.mutate({ id, name })
          }
        }}
      />
    </Stack>
  )
}
