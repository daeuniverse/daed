import type { DropResult } from '@hello-pangea/dnd'
import type { DraggingResource } from '~/constants'
import type { GroupsQuery, NodesQuery, SubscriptionsQuery } from '~/schemas/gql/graphql'
import { DragDropContext } from '@hello-pangea/dnd'
import { useStore } from '@nanostores/react'
import { useCallback, useMemo, useState } from 'react'
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

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array]
  const [removed] = newArray.splice(from, 1)
  newArray.splice(to, 0, removed)
  return newArray
}

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

  const onDragStart = (start: { draggableId: string; source: { droppableId: string } }) => {
    const draggableId = start.draggableId
    const droppableId = start.source.droppableId

    // Determine the type based on droppableId
    if (droppableId === 'node-list') {
      const nodeId = draggableId.replace('node-', '')
      setDraggingResource({ type: DraggableResourceType.node, nodeID: nodeId })
    } else if (droppableId === 'subscription-list') {
      const subId = draggableId.replace('subscription-', '')
      setDraggingResource({ type: DraggableResourceType.subscription, subscriptionID: subId })
    } else if (droppableId.startsWith('subscription-') && droppableId.endsWith('-nodes')) {
      // Subscription node dragged from a subscription's node list
      const nodeId = draggableId.replace('subscription-node-', '')
      setDraggingResource({ type: DraggableResourceType.subscription_node, nodeID: nodeId })
    } else if (droppableId.endsWith('-nodes')) {
      const groupId = droppableId.replace('-nodes', '')
      const parsed = parseGroupItemId(draggableId)
      if (parsed) {
        setDraggingResource({ type: DraggableResourceType.groupNode, nodeID: parsed.itemId, groupID: groupId })
      }
    } else if (droppableId.endsWith('-subscriptions')) {
      const groupId = droppableId.replace('-subscriptions', '')
      const parsed = parseGroupItemId(draggableId)
      if (parsed) {
        setDraggingResource({
          type: DraggableResourceType.groupSubscription,
          subscriptionID: parsed.itemId,
          groupID: groupId,
        })
      }
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    setDraggingResource(null)

    if (!destination) return

    const sourceDroppableId = source.droppableId
    const destDroppableId = destination.droppableId

    // Handle node list sorting
    if (sourceDroppableId === 'node-list' && destDroppableId === 'node-list') {
      if (source.index !== destination.index) {
        setNodeSortOrder(arrayMove(sortedNodeIds, source.index, destination.index))
      }
      return
    }

    // Handle subscription list sorting
    if (sourceDroppableId === 'subscription-list' && destDroppableId === 'subscription-list') {
      if (source.index !== destination.index) {
        setSubscriptionSortOrder(arrayMove(sortedSubscriptionIds, source.index, destination.index))
      }
      return
    }

    // Check if source is a subscription's node list (format: subscription-{id}-nodes)
    const isFromSubscriptionNodes =
      sourceDroppableId.startsWith('subscription-') &&
      sourceDroppableId.endsWith('-nodes') &&
      sourceDroppableId !== 'subscription-list'

    // Handle dropping subscription node to group
    if (isFromSubscriptionNodes && destDroppableId.endsWith('-nodes')) {
      const nodeId = draggableId.replace('subscription-node-', '')
      const targetGroupId = destDroppableId.replace('-nodes', '')
      const targetGroup = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === targetGroupId)

      if (
        targetGroup &&
        !targetGroup.nodes.find((n: GroupsQuery['groups'][number]['nodes'][number]) => n.id === nodeId)
      ) {
        groupAddNodesMutation.mutate({ id: targetGroupId, nodeIDs: [nodeId] })
      }
      return
    }

    // Handle group node sorting within same group OR cross-group drag
    if (sourceDroppableId.endsWith('-nodes') && destDroppableId.endsWith('-nodes')) {
      const sourceGroupId = sourceDroppableId.replace('-nodes', '')
      const destGroupId = destDroppableId.replace('-nodes', '')

      if (sourceGroupId === destGroupId) {
        // Same group sorting
        if (source.index !== destination.index) {
          const group = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === sourceGroupId)
          if (group) {
            const currentIds = group.nodes.map((n: GroupsQuery['groups'][number]['nodes'][number]) => n.id)
            const sortedIds = getGroupSortedIds(sourceGroupId, 'nodes', currentIds)
            updateGroupSortOrder(sourceGroupId, 'nodes', arrayMove(sortedIds, source.index, destination.index))
          }
        }
      } else {
        // Cross-group drag - add node to target group
        const parsed = parseGroupItemId(draggableId)
        if (parsed) {
          const targetGroup = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === destGroupId)
          if (
            targetGroup &&
            !targetGroup.nodes.find((n: GroupsQuery['groups'][number]['nodes'][number]) => n.id === parsed.itemId)
          ) {
            groupAddNodesMutation.mutate({ id: destGroupId, nodeIDs: [parsed.itemId] })
          }
        }
      }
      return
    }

    // Handle group subscription sorting within same group OR cross-group drag
    if (sourceDroppableId.endsWith('-subscriptions') && destDroppableId.endsWith('-subscriptions')) {
      const sourceGroupId = sourceDroppableId.replace('-subscriptions', '')
      const destGroupId = destDroppableId.replace('-subscriptions', '')

      if (sourceGroupId === destGroupId) {
        // Same group sorting
        if (source.index !== destination.index) {
          const group = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === sourceGroupId)
          if (group) {
            const currentIds = group.subscriptions.map(
              (s: GroupsQuery['groups'][number]['subscriptions'][number]) => s.id,
            )
            const sortedIds = getGroupSortedIds(sourceGroupId, 'subscriptions', currentIds)
            updateGroupSortOrder(sourceGroupId, 'subscriptions', arrayMove(sortedIds, source.index, destination.index))
          }
        }
      } else {
        // Cross-group drag - add subscription to target group
        const parsed = parseGroupItemId(draggableId)
        if (parsed) {
          const targetGroup = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === destGroupId)
          if (
            targetGroup &&
            !targetGroup.subscriptions.find(
              (s: GroupsQuery['groups'][number]['subscriptions'][number]) => s.id === parsed.itemId,
            )
          ) {
            groupAddSubscriptionsMutation.mutate({ id: destGroupId, subscriptionIDs: [parsed.itemId] })
          }
        }
      }
      return
    }

    // Handle dropping node from node-list to group
    if (sourceDroppableId === 'node-list' && destDroppableId.endsWith('-nodes')) {
      const nodeId = draggableId.replace('node-', '')
      const targetGroupId = destDroppableId.replace('-nodes', '')
      const targetGroup = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === targetGroupId)

      if (
        targetGroup &&
        !targetGroup.nodes.find((n: GroupsQuery['groups'][number]['nodes'][number]) => n.id === nodeId)
      ) {
        groupAddNodesMutation.mutate({ id: targetGroupId, nodeIDs: [nodeId] })
      }
      return
    }

    // Handle dropping subscription from subscription-list to group
    if (sourceDroppableId === 'subscription-list' && destDroppableId.endsWith('-subscriptions')) {
      const subId = draggableId.replace('subscription-', '')
      const targetGroupId = destDroppableId.replace('-subscriptions', '')
      const targetGroup = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === targetGroupId)

      if (
        targetGroup &&
        !targetGroup.subscriptions.find((s: GroupsQuery['groups'][number]['subscriptions'][number]) => s.id === subId)
      ) {
        groupAddSubscriptionsMutation.mutate({ id: targetGroupId, subscriptionIDs: [subId] })
      }
      return
    }

    // Handle dropping group node back to node list (remove from group)
    if (sourceDroppableId.endsWith('-nodes') && destDroppableId === NODE_DROPPABLE_ID) {
      const sourceGroupId = sourceDroppableId.replace('-nodes', '')
      const parsed = parseGroupItemId(draggableId)
      if (parsed) {
        groupDelNodesMutation.mutate({ id: sourceGroupId, nodeIDs: [parsed.itemId] })
      }
    }
  }

  const matchSmallScreen = useMediaQuery('(max-width: 640px)')

  return (
    <div className="flex flex-col gap-8">
      <div className={`grid gap-5 ${matchSmallScreen ? 'grid-cols-1' : 'grid-cols-3'}`}>
        <Config />
        <DNS />
        <Routing />
      </div>

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className={`grid gap-5 ${matchSmallScreen ? 'grid-cols-1' : 'grid-cols-3'}`}>
          <GroupResource highlight={!!draggingResource} draggingResource={draggingResource} />
          <NodeResource
            sortedNodes={sortedNodes}
            highlight={draggingResource?.type === DraggableResourceType.groupNode}
          />
          <SubscriptionResource sortedSubscriptions={sortedSubscriptions} />
        </div>
      </DragDropContext>
    </div>
  )
}
