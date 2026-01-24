import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { DraggingResource } from '~/constants'
import type { GroupsQuery, NodesQuery, SubscriptionsQuery } from '~/schemas/gql/graphql'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { snapCenterToCursor } from '@dnd-kit/modifiers'
import { arrayMove } from '@dnd-kit/sortable'
import { useStore } from '@nanostores/react'
import { GripVertical } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import {
  useGroupAddNodesMutation,
  useGroupAddSubscriptionsMutation,
  useGroupDelNodesMutation,
  useGroupsQuery,
  useNodesQuery,
  useSubscriptionsQuery,
} from '~/apis'
import { DraggableResourceType } from '~/constants'
import { useMediaQuery } from '~/hooks'
import { appStateAtom, groupSortOrdersAtom } from '~/store'
import { Config } from './Config'
import { DNS } from './DNS'
import { GroupResource } from './Group'
import { NODE_DROPPABLE_ID, NodeResource } from './Node'
import { Routing } from './Routing'
import { SubscriptionResource } from './Subscription'

export function OrchestratePage() {
  const { data: nodesQuery } = useNodesQuery()
  const { data: groupsQuery } = useGroupsQuery()
  const { data: subscriptionsQuery } = useSubscriptionsQuery()

  const groupAddNodesMutation = useGroupAddNodesMutation()
  const groupAddSubscriptionsMutation = useGroupAddSubscriptionsMutation()
  const groupDelNodesMutation = useGroupDelNodesMutation()

  const [draggingResource, setDraggingResource] = useState<DraggingResource | null>(null)

  // Use persistent store for sort order
  const appState = useStore(appStateAtom)
  const nodeSortOrder = appState.nodeSortableKeys as string[]
  const subscriptionSortOrder = appState.subscriptionSortableKeys as string[]

  const setNodeSortOrder = useCallback((order: string[]) => {
    appStateAtom.setKey('nodeSortableKeys', order)
  }, [])

  const setSubscriptionSortOrder = useCallback((order: string[]) => {
    appStateAtom.setKey('subscriptionSortableKeys', order)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  )

  // Get nodes from query (memoized to avoid dependency issues)
  const nodes = useMemo(() => nodesQuery?.nodes.edges ?? [], [nodesQuery?.nodes.edges])
  const subscriptions = useMemo(() => subscriptionsQuery?.subscriptions ?? [], [subscriptionsQuery?.subscriptions])

  // Get sorted node IDs
  const sortedNodeIds = useMemo(() => {
    if (nodes.length === 0) return []
    const currentIds = nodes.map((n: NodesQuery['nodes']['edges'][number]) => n.id)
    const currentIdSet = new Set(currentIds)

    const result = nodeSortOrder.filter((id) => currentIdSet.has(id))
    const resultSet = new Set(result)

    for (const id of currentIds) {
      if (!resultSet.has(id)) {
        result.push(id)
      }
    }

    return result
  }, [nodes, nodeSortOrder])

  // Get sorted nodes
  const sortedNodes = useMemo(() => {
    if (nodes.length === 0) return []
    const nodeMap = new Map(nodes.map((n: NodesQuery['nodes']['edges'][number]) => [n.id, n]))
    return sortedNodeIds.map((id) => nodeMap.get(id)).filter(Boolean) as typeof nodes
  }, [nodes, sortedNodeIds])

  // Get sorted subscription IDs
  const sortedSubscriptionIds = useMemo(() => {
    if (subscriptions.length === 0) return []
    const currentIds = subscriptions.map((s: SubscriptionsQuery['subscriptions'][number]) => s.id)
    const currentIdSet = new Set(currentIds)

    const result = subscriptionSortOrder.filter((id) => currentIdSet.has(id))
    const resultSet = new Set(result)

    for (const id of currentIds) {
      if (!resultSet.has(id)) {
        result.push(id)
      }
    }

    return result
  }, [subscriptions, subscriptionSortOrder])

  // Get sorted subscriptions
  const sortedSubscriptions = useMemo(() => {
    if (subscriptions.length === 0) return []
    const subMap = new Map(subscriptions.map((s: SubscriptionsQuery['subscriptions'][number]) => [s.id, s]))
    return sortedSubscriptionIds.map((id) => subMap.get(id)).filter(Boolean) as typeof subscriptions
  }, [subscriptions, sortedSubscriptionIds])

  const draggingResourceDisplayName = useMemo(() => {
    if (draggingResource) {
      const { type, nodeID, groupID, subscriptionID } = draggingResource

      if (type === DraggableResourceType.node) {
        const node = nodes.find((n: NodesQuery['nodes']['edges'][number]) => n.id === nodeID)

        return node?.tag || node?.name
      }

      if (type === DraggableResourceType.subscription) {
        const subscription = subscriptions.find(
          (s: SubscriptionsQuery['subscriptions'][number]) => s.id === subscriptionID,
        )

        return subscription?.tag || subscription?.link
      }

      if (type === DraggableResourceType.subscription_node) {
        const subscription = subscriptions.find(
          (s: SubscriptionsQuery['subscriptions'][number]) => s.id === subscriptionID,
        )
        const node = subscription?.nodes.edges.find(
          (n: SubscriptionsQuery['subscriptions'][number]['nodes']['edges'][number]) => n.id === nodeID,
        )

        return node?.name
      }

      if (type === DraggableResourceType.groupNode) {
        const group = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === groupID)

        const node = group?.nodes.find((n: GroupsQuery['groups'][number]['nodes'][number]) => n.id === nodeID)

        return node?.tag || node?.name
      }

      if (type === DraggableResourceType.groupSubscription) {
        const group = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === groupID)

        const subscription = group?.subscriptions.find(
          (s: GroupsQuery['groups'][number]['subscriptions'][number]) => s.id === subscriptionID,
        )

        return subscription?.tag
      }
    }
  }, [draggingResource, groupsQuery?.groups, nodes, subscriptions])

  // Get full dragging resource data for overlay display
  const draggingResourceData = useMemo(() => {
    if (!draggingResource) return null

    const { type, nodeID, groupID, subscriptionID } = draggingResource

    if (type === DraggableResourceType.node) {
      const node = nodes.find((n: NodesQuery['nodes']['edges'][number]) => n.id === nodeID)
      if (node) {
        return { name: node.tag || node.name, protocol: node.protocol, address: node.address }
      }
    }

    if (type === DraggableResourceType.subscription) {
      const subscription = subscriptions.find(
        (s: SubscriptionsQuery['subscriptions'][number]) => s.id === subscriptionID,
      )
      if (subscription) {
        return { name: subscription.tag || subscription.link, protocol: null, address: null }
      }
    }

    if (type === DraggableResourceType.subscription_node) {
      const subscription = subscriptions.find(
        (s: SubscriptionsQuery['subscriptions'][number]) => s.id === subscriptionID,
      )
      const node = subscription?.nodes.edges.find(
        (n: SubscriptionsQuery['subscriptions'][number]['nodes']['edges'][number]) => n.id === nodeID,
      )
      if (node) {
        return { name: node.name, protocol: node.protocol, address: null }
      }
    }

    if (type === DraggableResourceType.groupNode) {
      const group = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === groupID)
      const node = group?.nodes.find((n: GroupsQuery['groups'][number]['nodes'][number]) => n.id === nodeID)
      if (node) {
        return { name: node.tag || node.name, protocol: node.protocol, address: node.address }
      }
    }

    if (type === DraggableResourceType.groupSubscription) {
      const group = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === groupID)
      const subscription = group?.subscriptions.find(
        (s: GroupsQuery['groups'][number]['subscriptions'][number]) => s.id === subscriptionID,
      )
      if (subscription) {
        return { name: subscription.tag || subscription.link, protocol: null, address: null }
      }
    }

    return { name: draggingResourceDisplayName || '', protocol: null, address: null }
  }, [draggingResource, groupsQuery?.groups, nodes, subscriptions, draggingResourceDisplayName])

  const onDragStart = (e: DragStartEvent) => {
    const rect = e.active.rect.current.initial
    setDraggingResource({
      ...(e.active.data.current as DraggingResource),
      rect: rect ? { width: rect.width, height: rect.height } : undefined,
    })
  }

  // Helper to parse group item IDs (format: groupId-node-nodeId or groupId-sub-subId)
  const parseGroupItemId = useCallback(
    (id: string): { groupId: string; type: 'node' | 'sub'; itemId: string } | null => {
      const nodeMatch = id.match(/^(.+)-node-(.+)$/)
      if (nodeMatch) {
        return { groupId: nodeMatch[1], type: 'node', itemId: nodeMatch[2] }
      }
      const subMatch = id.match(/^(.+)-sub-(.+)$/)
      if (subMatch) {
        return { groupId: subMatch[1], type: 'sub', itemId: subMatch[2] }
      }
      return null
    },
    [],
  )

  // Helper to update group sort order
  const updateGroupSortOrder = useCallback((groupId: string, type: 'nodes' | 'subscriptions', newOrder: string[]) => {
    const currentOrders = groupSortOrdersAtom.get()
    groupSortOrdersAtom.set({
      ...currentOrders,
      [groupId]: {
        nodes: type === 'nodes' ? newOrder : currentOrders[groupId]?.nodes || [],
        subscriptions: type === 'subscriptions' ? newOrder : currentOrders[groupId]?.subscriptions || [],
      },
    })
  }, [])

  // Get sorted IDs for a group
  const getGroupSortedIds = useCallback((groupId: string, type: 'nodes' | 'subscriptions', currentIds: string[]) => {
    const groupSortOrders = groupSortOrdersAtom.get()
    const sortOrder = groupSortOrders[groupId]?.[type] || []
    const currentIdSet = new Set(currentIds)

    const result = sortOrder.filter((id) => currentIdSet.has(id))
    const resultSet = new Set(result)

    for (const id of currentIds) {
      if (!resultSet.has(id)) {
        result.push(id)
      }
    }

    return result
  }, [])

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e

    if (over?.id && draggingResource) {
      const overId = String(over.id)
      const activeId = String(active.id)

      // Check if sorting nodes (both are node-* IDs)
      if (
        draggingResource.type === DraggableResourceType.node &&
        activeId.startsWith('node-') &&
        overId.startsWith('node-')
      ) {
        const activeNodeId = activeId.replace('node-', '')
        const overNodeId = overId.replace('node-', '')

        if (activeNodeId !== overNodeId) {
          const oldIndex = sortedNodeIds.indexOf(activeNodeId)
          const newIndex = sortedNodeIds.indexOf(overNodeId)

          if (oldIndex !== -1 && newIndex !== -1) {
            setNodeSortOrder(arrayMove(sortedNodeIds, oldIndex, newIndex))
          }
        }

        setDraggingResource(null)
        return
      }

      // Check if sorting subscriptions (both are subscription-* IDs)
      if (
        draggingResource.type === DraggableResourceType.subscription &&
        activeId.startsWith('subscription-') &&
        overId.startsWith('subscription-')
      ) {
        const activeSubId = activeId.replace('subscription-', '')
        const overSubId = overId.replace('subscription-', '')

        if (activeSubId !== overSubId) {
          const oldIndex = sortedSubscriptionIds.indexOf(activeSubId)
          const newIndex = sortedSubscriptionIds.indexOf(overSubId)

          if (oldIndex !== -1 && newIndex !== -1) {
            setSubscriptionSortOrder(arrayMove(sortedSubscriptionIds, oldIndex, newIndex))
          }
        }

        setDraggingResource(null)
        return
      }

      // Handle group item dragging (groupId-node-nodeId or groupId-sub-subId)
      const activeParsed = parseGroupItemId(activeId)
      const overParsed = parseGroupItemId(overId)

      if (activeParsed && overParsed) {
        const sourceGroupId = activeParsed.groupId
        const targetGroupId = overParsed.groupId

        // Same group - handle sorting within group
        if (sourceGroupId === targetGroupId && activeParsed.type === overParsed.type) {
          const group = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === sourceGroupId)
          if (group) {
            if (activeParsed.type === 'node') {
              const currentIds = group.nodes.map((n: GroupsQuery['groups'][number]['nodes'][number]) => n.id)
              const sortedIds = getGroupSortedIds(sourceGroupId, 'nodes', currentIds)

              const oldIndex = sortedIds.indexOf(activeParsed.itemId)
              const newIndex = sortedIds.indexOf(overParsed.itemId)

              if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                updateGroupSortOrder(sourceGroupId, 'nodes', arrayMove(sortedIds, oldIndex, newIndex))
              }
            } else {
              const currentIds = group.subscriptions.map(
                (s: GroupsQuery['groups'][number]['subscriptions'][number]) => s.id,
              )
              const sortedIds = getGroupSortedIds(sourceGroupId, 'subscriptions', currentIds)

              const oldIndex = sortedIds.indexOf(activeParsed.itemId)
              const newIndex = sortedIds.indexOf(overParsed.itemId)

              if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                updateGroupSortOrder(sourceGroupId, 'subscriptions', arrayMove(sortedIds, oldIndex, newIndex))
              }
            }
          }
          setDraggingResource(null)
          return
        }

        // Different groups - add to target group
        const targetGroup = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === targetGroupId)
        if (targetGroup) {
          if (activeParsed.type === 'node') {
            const nodeAlreadyInGroup = targetGroup.nodes.find(
              (n: GroupsQuery['groups'][number]['nodes'][number]) => n.id === activeParsed.itemId,
            )
            if (!nodeAlreadyInGroup) {
              groupAddNodesMutation.mutate({ id: targetGroupId, nodeIDs: [activeParsed.itemId] })
            }
          } else {
            const subAlreadyInGroup = targetGroup.subscriptions.find(
              (s: GroupsQuery['groups'][number]['subscriptions'][number]) => s.id === activeParsed.itemId,
            )
            if (!subAlreadyInGroup) {
              groupAddSubscriptionsMutation.mutate({ id: targetGroupId, subscriptionIDs: [activeParsed.itemId] })
            }
          }
        }
        setDraggingResource(null)
        return
      }

      // Handle dropping group item to group card (overId is a group ID)
      if (activeParsed) {
        // Handle dropping group node back to Node section - remove from group
        // Check for NODE_DROPPABLE_ID or node items (node-xxx format)
        if (activeParsed.type === 'node' && (overId === NODE_DROPPABLE_ID || overId.startsWith('node-'))) {
          groupDelNodesMutation.mutate({ id: activeParsed.groupId, nodeIDs: [activeParsed.itemId] })
          setDraggingResource(null)
          return
        }

        const targetGroup = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === overId)
        if (targetGroup) {
          if (activeParsed.type === 'node') {
            const nodeAlreadyInGroup = targetGroup.nodes.find(
              (n: GroupsQuery['groups'][number]['nodes'][number]) => n.id === activeParsed.itemId,
            )
            if (!nodeAlreadyInGroup) {
              groupAddNodesMutation.mutate({ id: overId, nodeIDs: [activeParsed.itemId] })
            }
          } else {
            const subAlreadyInGroup = targetGroup.subscriptions.find(
              (s: GroupsQuery['groups'][number]['subscriptions'][number]) => s.id === activeParsed.itemId,
            )
            if (!subAlreadyInGroup) {
              groupAddSubscriptionsMutation.mutate({ id: overId, subscriptionIDs: [activeParsed.itemId] })
            }
          }
          setDraggingResource(null)
          return
        }
      }

      // Handle dropping to group (from node/subscription panels)
      // Try to find group directly, or extract group ID from group item ID
      const overItemParsed = parseGroupItemId(overId)
      const targetGroupId = overItemParsed ? overItemParsed.groupId : overId
      const group = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === targetGroupId)

      if (
        [DraggableResourceType.node, DraggableResourceType.groupNode].includes(draggingResource.type) &&
        draggingResource?.nodeID &&
        group &&
        !group.nodes.find((n: GroupsQuery['groups'][number]['nodes'][number]) => n.id === draggingResource.nodeID)
      ) {
        groupAddNodesMutation.mutate({ id: targetGroupId, nodeIDs: [draggingResource.nodeID] })
      }

      if (
        [DraggableResourceType.subscription, DraggableResourceType.groupSubscription].includes(draggingResource.type) &&
        draggingResource.subscriptionID &&
        group &&
        !group.subscriptions.find(
          (s: GroupsQuery['groups'][number]['subscriptions'][number]) => s.id === draggingResource.subscriptionID,
        )
      ) {
        groupAddSubscriptionsMutation.mutate({
          id: targetGroupId,
          subscriptionIDs: [draggingResource.subscriptionID],
        })
      }

      if (
        draggingResource.type === DraggableResourceType.subscription_node &&
        draggingResource.nodeID &&
        group &&
        !group.nodes.find((n: GroupsQuery['groups'][number]['nodes'][number]) => n.id === draggingResource.nodeID)
      ) {
        groupAddNodesMutation.mutate({ id: targetGroupId, nodeIDs: [draggingResource.nodeID] })
      }
    }

    setDraggingResource(null)
  }

  const dndAreaRef = useRef<HTMLDivElement>(null)
  const matchSmallScreen = useMediaQuery('(max-width: 640px)')

  return (
    <div className="flex flex-col gap-8">
      <div className={`grid gap-5 ${matchSmallScreen ? 'grid-cols-1' : 'grid-cols-3'}`}>
        <Config />
        <DNS />
        <Routing />
      </div>

      <div ref={dndAreaRef} className={`grid gap-5 ${matchSmallScreen ? 'grid-cols-1' : 'grid-cols-3'}`}>
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <GroupResource highlight={!!draggingResource} draggingResource={draggingResource} />
          <NodeResource
            sortedNodes={sortedNodes}
            highlight={draggingResource?.type === DraggableResourceType.groupNode}
          />
          <SubscriptionResource sortedSubscriptions={sortedSubscriptions} />

          <DragOverlay zIndex={9999} modifiers={[snapCenterToCursor]}>
            {draggingResource && draggingResourceData && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card shadow-xl cursor-grabbing ring-2 ring-primary/30 min-w-[180px] max-w-[280px]">
                <GripVertical className="h-3.5 w-3.5 text-primary/60 shrink-0" />

                {draggingResourceData.protocol && (
                  <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded bg-primary/15 text-primary">
                    {draggingResourceData.protocol}
                  </span>
                )}

                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium truncate block">{draggingResourceData.name}</span>
                  {draggingResourceData.address && (
                    <span className="text-[10px] text-muted-foreground truncate block mt-0.5">
                      {draggingResourceData.address}
                    </span>
                  )}
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
