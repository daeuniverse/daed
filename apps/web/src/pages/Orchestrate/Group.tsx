import type { GroupFormModalRef } from '~/components/GroupFormModal'
import type { NodeLatencyProbeResult } from '~/apis'
import type { DraggingResource } from '~/constants'
import type { GroupsQuery, NodesQuery, SubscriptionsQuery } from '~/schemas/gql/graphql'
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd'
import type { DraggableStateSnapshot } from '@hello-pangea/dnd'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { useStore } from '@nanostores/react'
import { Settings2, Table2 } from 'lucide-react'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useGroupAddNodesMutation,
  useGroupAddSubscriptionsMutation,
  useGroupDelNodesMutation,
  useGroupDelSubscriptionsMutation,
  useGroupsQuery,
  useNodesQuery,
  useRemoveGroupMutation,
  useRenameGroupMutation,
  useSubscriptionsQuery,
} from '~/apis'
import { DroppableGroupCard } from '~/components/DroppableGroupCard'
import { GroupFormModal } from '~/components/GroupFormModal'
import {
  GroupAddNodesModal,
  GroupAddSubscriptionsModal,
  type GroupPickerItem,
} from '~/components/GroupResourcePickerModal'
import { Section } from '~/components/Section'
import { SortableGroupContent } from '~/components/SortableGroupContent'
import { Button } from '~/components/ui/button'
import { SimpleTooltip } from '~/components/ui/tooltip'
import { DraggableResourceType } from '~/constants'
import { useDisclosure } from '~/hooks'
import { cn } from '~/lib/utils'
import { getInstantDropStyle } from '~/utils'
import { appStateAtom, defaultResourcesAtom } from '~/store'

const GROUP_DROPPABLE_ID = 'group-list'

export function GroupResource({
  highlight,
  draggingResource,
  dragDestinationDroppableId,
  hoveredGroupId,
  nodeLatencies,
}: {
  highlight?: boolean
  draggingResource?: DraggingResource | null
  dragDestinationDroppableId?: string | null
  hoveredGroupId?: string | null
  nodeLatencies?: Record<string, NodeLatencyProbeResult>
}) {
  const { t } = useTranslation()
  const { data: groupsQuery } = useGroupsQuery()
  const { data: nodesQuery } = useNodesQuery()
  const appState = useStore(appStateAtom)
  const { defaultGroupID } = useStore(defaultResourcesAtom)
  const [openedCreateGroupFormModal, { open: openCreateGroupFormModal, close: closeCreateGroupFormModal }] =
    useDisclosure(false)
  const [openedUpdateGroupFormModal, { open: openUpdateGroupFormModal, close: closeUpdateGroupFormModal }] =
    useDisclosure(false)
  const removeGroupMutation = useRemoveGroupMutation()
  const renameGroupMutation = useRenameGroupMutation()
  const groupAddNodesMutation = useGroupAddNodesMutation()
  const groupAddSubscriptionsMutation = useGroupAddSubscriptionsMutation()
  const groupDelNodesMutation = useGroupDelNodesMutation()
  const groupDelSubscriptionsMutation = useGroupDelSubscriptionsMutation()
  const updateGroupFormModalRef = useRef<GroupFormModalRef>(null)
  const { data: subscriptionsQuery } = useSubscriptionsQuery()
  const [addingNodesGroupId, setAddingNodesGroupId] = useState<string | null>(null)
  const [addingSubscriptionsGroupId, setAddingSubscriptionsGroupId] = useState<string | null>(null)
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(() => new Set())

  // Determine which accordion sections should be auto-expanded based on drag type
  const autoExpandValue = useMemo(() => {
    if (!draggingResource) return undefined

    const { type } = draggingResource
    if (
      type === DraggableResourceType.node ||
      type === DraggableResourceType.groupNode ||
      type === DraggableResourceType.subscription_node
    ) {
      return 'node'
    }
    if (type === DraggableResourceType.subscription || type === DraggableResourceType.groupSubscription) {
      return 'subscription'
    }
    return undefined
  }, [draggingResource])

  const groups: GroupsQuery['groups'] = groupsQuery?.groups || []
  const nodes: NodesQuery['nodes']['edges'] = nodesQuery?.nodes.edges || []
  const subscriptions: SubscriptionsQuery['subscriptions'] = subscriptionsQuery?.subscriptions || []
  const groupSortOrder = appState.groupSortableKeys as string[]

  const setGroupExpanded = useCallback((groupId: string, expanded: boolean) => {
    setExpandedGroupIds((current) => {
      const isExpanded = current.has(groupId)
      if (isExpanded === expanded) return current

      const next = new Set(current)
      if (expanded) {
        next.add(groupId)
      } else {
        next.delete(groupId)
      }
      return next
    })
  }, [])

  useEffect(() => {
    if (!dragDestinationDroppableId) return

    if (dragDestinationDroppableId.endsWith('-nodes')) {
      setGroupExpanded(dragDestinationDroppableId.replace('-nodes', ''), true)
    } else if (dragDestinationDroppableId.endsWith('-subscriptions')) {
      setGroupExpanded(dragDestinationDroppableId.replace('-subscriptions', ''), true)
    }
  }, [dragDestinationDroppableId, setGroupExpanded])

  useEffect(() => {
    if (hoveredGroupId) {
      setGroupExpanded(hoveredGroupId, true)
    }
  }, [hoveredGroupId, setGroupExpanded])

  const addingNodesGroup = useMemo(
    () => groups.find((group) => group.id === addingNodesGroupId) || null,
    [groups, addingNodesGroupId],
  )

  const addingSubscriptionsGroup = useMemo(
    () => groups.find((group) => group.id === addingSubscriptionsGroupId) || null,
    [groups, addingSubscriptionsGroupId],
  )

  const addableNodeItems = useMemo<GroupPickerItem[]>(() => {
    if (!addingNodesGroup) return []

    const existingNodeIds = new Set(addingNodesGroup.nodes.map((node) => node.id))

    const manualNodeItems = nodes
      .filter((node) => !existingNodeIds.has(node.id))
      .map((node) => {
        const title = node.tag || node.name || node.address || node.id
        const description = [node.name && node.name !== title ? node.name : '', node.address].filter(Boolean).join(' · ')

        return {
          id: node.id,
          title,
          description: description || undefined,
          meta: [t('groupPicker.manualNode'), formatLatencyMeta(nodeLatencies?.[node.id])]
            .filter(Boolean)
            .join(' · '),
          metaTone: nodeLatencies?.[node.id] ? 'primary' : 'default',
          badge: node.protocol || undefined,
          keywords: [node.name, node.tag, node.address, node.protocol].filter(Boolean) as string[],
        }
      })

    const subscriptionNodeItems = subscriptions.flatMap((subscription) => {
      const subscriptionName = subscription.tag || subscription.link

      return subscription.nodes.edges
        .filter((node) => !existingNodeIds.has(node.id))
        .map((node) => {
          const title = node.tag || node.name || node.address || node.id
          const description = [node.name && node.name !== title ? node.name : '', node.address]
            .filter(Boolean)
            .join(' · ')

          return {
            id: node.id,
            title,
            description: description || undefined,
            meta: [t('groupPicker.fromSubscription', { name: subscriptionName }), formatLatencyMeta(nodeLatencies?.[node.id])]
              .filter(Boolean)
              .join(' · '),
            metaTone: nodeLatencies?.[node.id] ? 'primary' : 'default',
            badge: node.protocol || undefined,
            keywords: [node.name, node.tag, node.address, node.protocol, subscriptionName].filter(Boolean) as string[],
          }
        })
    })

    return [...manualNodeItems, ...subscriptionNodeItems]
  }, [addingNodesGroup, nodeLatencies, nodes, subscriptions, t])

  const addableSubscriptionItems = useMemo<GroupPickerItem[]>(() => {
    if (!addingSubscriptionsGroup) return []

    const existingSubscriptionIds = new Set(
      addingSubscriptionsGroup.subscriptions.map((subscriptionBinding) => subscriptionBinding.subscription.id),
    )

    return subscriptions
      .filter((subscription) => !existingSubscriptionIds.has(subscription.id))
      .map((subscription) => {
        const title = subscription.tag || subscription.link
        const description = subscription.tag && subscription.tag !== subscription.link ? subscription.link : undefined

        return {
          id: subscription.id,
          title,
          description,
          meta: `${subscription.nodes.edges.length} ${t('node')}`,
          previewNodes: subscription.nodes.edges.map((node) => ({
            id: node.id,
            title: node.name,
            protocol: node.protocol || undefined,
          })),
          keywords: [subscription.tag, subscription.link, subscription.status, subscription.info].filter(Boolean) as string[],
        }
      })
  }, [addingSubscriptionsGroup, subscriptions, t])

  const sortedGroupIds = useMemo(() => {
    const currentIds = groups.map((group) => group.id)
    const currentIdSet = new Set(currentIds)
    const result = groupSortOrder.filter((id) => currentIdSet.has(id))
    const resultSet = new Set(result)

    for (const id of currentIds) {
      if (!resultSet.has(id)) result.push(id)
    }

    return result
  }, [groupSortOrder, groups])

  const sortedGroups = useMemo(() => {
    const groupMap = new Map(groups.map((group) => [group.id, group]))
    return sortedGroupIds.map((id) => groupMap.get(id)).filter(Boolean) as GroupsQuery['groups']
  }, [groups, sortedGroupIds])

  const renderGroupCard = (
    {
      groupId,
      name,
      policy,
      groupNodes,
      groupSubscriptions,
      dragHandleProps,
      snapshot,
    }: {
      groupId: string
      name: string
      policy: string
      groupNodes: GroupsQuery['groups'][number]['nodes']
      groupSubscriptions: GroupsQuery['groups'][number]['subscriptions']
      dragHandleProps?: DraggableProvidedDragHandleProps | null
      snapshot?: DraggableStateSnapshot
    },
  ) => (
    <div
      data-group-card-id={groupId}
      className={cn(snapshot?.isDragging && 'z-50 opacity-90')}
    >
      <DroppableGroupCard
        id={groupId}
        name={name}
        summary={
          <>
            <span className="rounded bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground/80">{policy}</span>
            <span>{t('groupPicker.nodesCount', { count: groupNodes.length })}</span>
            <span>{t('groupPicker.subscriptionGroupsCount', { count: groupSubscriptions.length })}</span>
          </>
        }
        collapsed={!expandedGroupIds.has(groupId)}
        dragHandleProps={dragHandleProps}
        onToggleCollapsed={() => setGroupExpanded(groupId, !expandedGroupIds.has(groupId))}
        onRemove={defaultGroupID !== groupId ? () => removeGroupMutation.mutate(groupId) : undefined}
        onRename={(newName) => renameGroupMutation.mutate({ id: groupId, name: newName })}
        actions={
          <SimpleTooltip label={t('actions.settings')}>
            <Button
              variant="ghost"
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
              <Settings2 className="h-4 w-4" />
            </Button>
          </SimpleTooltip>
        }
      >
        <SortableGroupContent
          groupId={groupId}
          nodes={groupNodes}
          subscriptions={groupSubscriptions}
          nodeLatencies={nodeLatencies}
          allSubscriptions={subscriptionsQuery?.subscriptions}
          autoExpandValue={autoExpandValue}
          collapsed={!expandedGroupIds.has(groupId)}
          onExpand={() => setGroupExpanded(groupId, true)}
          onDelNode={(nodeId) =>
            groupDelNodesMutation.mutate({
              id: groupId,
              nodeIDs: [nodeId],
            })
          }
          onDelSubscription={(subscriptionId) =>
            groupDelSubscriptionsMutation.mutate({
              id: groupId,
              subscriptionIDs: [subscriptionId],
            })
          }
          onOpenAddNodes={() => {
            setGroupExpanded(groupId, true)
            setAddingNodesGroupId(groupId)
          }}
          onOpenAddSubscriptions={() => {
            setGroupExpanded(groupId, true)
            setAddingSubscriptionsGroupId(groupId)
          }}
        />
      </DroppableGroupCard>
    </div>
  )

  return (
    <Section
      title={t('group')}
      icon={<Table2 className="h-5 w-5" />}
      onCreate={openCreateGroupFormModal}
      highlight={highlight}
      bordered
    >
      <Droppable droppableId={GROUP_DROPPABLE_ID} type="GROUP">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-3">
            {sortedGroups.map(({ id: groupId, name, policy, nodes: groupNodes, subscriptions: groupSubscriptions }, index) => (
              <Draggable key={groupId} draggableId={`group-${groupId}`} index={index}>
                {(draggableProvided, snapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    style={getInstantDropStyle(draggableProvided, snapshot)}
                  >
                    {renderGroupCard({
                      groupId,
                      name,
                      policy,
                      groupNodes,
                      groupSubscriptions,
                      dragHandleProps: draggableProvided.dragHandleProps,
                      snapshot,
                    })}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <GroupFormModal opened={openedCreateGroupFormModal} onClose={closeCreateGroupFormModal} />
      <GroupFormModal
        ref={updateGroupFormModalRef}
        opened={openedUpdateGroupFormModal}
        onClose={closeUpdateGroupFormModal}
      />

      <GroupAddNodesModal
        opened={!!addingNodesGroupId}
        onClose={() => setAddingNodesGroupId(null)}
        groupName={addingNodesGroup?.name || t('group')}
        items={addableNodeItems}
        loading={groupAddNodesMutation.isPending}
        resetKey={addingNodesGroupId || ''}
        onSubmit={async (nodeIDs) => {
          if (!addingNodesGroupId) return

          await groupAddNodesMutation.mutateAsync({
            id: addingNodesGroupId,
            nodeIDs,
          })
        }}
      />

      <GroupAddSubscriptionsModal
        opened={!!addingSubscriptionsGroupId}
        onClose={() => setAddingSubscriptionsGroupId(null)}
        groupName={addingSubscriptionsGroup?.name || t('group')}
        items={addableSubscriptionItems}
        loading={groupAddSubscriptionsMutation.isPending}
        resetKey={addingSubscriptionsGroupId || ''}
        onSubmit={async ({ ids: subscriptionIDs, nameFilterRegex }) => {
          if (!addingSubscriptionsGroupId) return

          await groupAddSubscriptionsMutation.mutateAsync({
            id: addingSubscriptionsGroupId,
            subscriptionIDs,
            nameFilterRegex,
          })
        }}
      />
    </Section>
  )
}

function formatLatencyMeta(result?: NodeLatencyProbeResult) {
  if (!result) {
    return undefined
  }
  if (typeof result.latencyMs === 'number') {
    return `${result.latencyMs}ms`
  }
  if (result.message) {
    return result.message === 'no latency result' ? 'N/A' : 'Fail'
  }
  return 'N/A'
}
