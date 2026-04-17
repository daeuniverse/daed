import type { DragUpdate, DropResult } from '@hello-pangea/dnd'
import type { DraggingResource } from '~/constants'
import type { GroupsQuery, NodesQuery, SubscriptionsQuery } from '~/schemas/gql/graphql'
import { DragDropContext } from '@hello-pangea/dnd'
import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  useGroupAddNodesMutation,
  useGroupAddSubscriptionsMutation,
  useGroupDelNodesMutation,
  useGroupsQuery,
  useNodesQuery,
  useSubscriptionsQuery,
  useTestNodeLatenciesMutation,
} from '~/apis'
import type { NodeLatencyProbeResult } from '~/apis'
import { DraggableResourceType } from '~/constants'
import { useMediaQuery } from '~/hooks'
import { appStateAtom, groupSortOrdersAtom } from '~/store'
import { Config } from './Config'
import { DNS } from './DNS'
import { GroupResource } from './Group'
import { NODE_DROPPABLE_ID, NodeResource } from './Node'
import { Routing } from './Routing'
import { SubscriptionResource } from './Subscription'
import { TrafficOverview } from './TrafficOverview'

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
  const testNodeLatenciesMutation = useTestNodeLatenciesMutation()

  const [draggingResource, setDraggingResource] = useState<DraggingResource | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragDestinationDroppableId, setDragDestinationDroppableId] = useState<string | null>(null)
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null)
  const [nodeLatencies, setNodeLatencies] = useState<Record<string, NodeLatencyProbeResult>>({})
  const autoScrollFrameRef = useRef<number | null>(null)
  const draggingActiveRef = useRef(false)
  const edgeAutoScrollEnabledRef = useRef(false)
  const dragPointerRef = useRef<{ y: number } | null>(null)
  const hoveredGroupIdRef = useRef<string | null>(null)

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

  const setGroupSortOrder = useCallback((order: string[]) => {
    appStateAtom.setKey('groupSortableKeys', order)
  }, [])

  // Get nodes from query (memoized to avoid dependency issues)
  const nodes = useMemo(() => nodesQuery?.nodes.edges ?? [], [nodesQuery?.nodes.edges])
  const groups = useMemo(() => groupsQuery?.groups ?? [], [groupsQuery?.groups])
  const subscriptions = useMemo(() => subscriptionsQuery?.subscriptions ?? [], [subscriptionsQuery?.subscriptions])
  const getGroupById = useCallback(
    (groupId: string) => groupsQuery?.groups.find((group: GroupsQuery['groups'][number]) => group.id === groupId),
    [groupsQuery?.groups],
  )
  const getGroupSubscriptionBinding = useCallback(
    (groupId: string, subscriptionId: string) =>
      getGroupById(groupId)?.subscriptions.find(
        (binding: GroupsQuery['groups'][number]['subscriptions'][number]) => binding.subscription.id === subscriptionId,
      ),
    [getGroupById],
  )
  const hasGroupSubscription = useCallback(
    (groupId: string, subscriptionId: string) => !!getGroupSubscriptionBinding(groupId, subscriptionId),
    [getGroupSubscriptionBinding],
  )
  const lastLatencyProbeAt = useMemo(() => {
    const testedAtList = Object.values(nodeLatencies)
      .map((item) => item.testedAt)
      .filter(Boolean)
      .sort()
    return testedAtList[testedAtList.length - 1] ?? null
  }, [nodeLatencies])

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

  const groupSortOrder = appState.groupSortableKeys as string[]

  const sortedGroupIds = useMemo(() => {
    if (groups.length === 0) return []
    const currentIds = groups.map((group: GroupsQuery['groups'][number]) => group.id)
    const currentIdSet = new Set(currentIds)
    const result = groupSortOrder.filter((id) => currentIdSet.has(id))
    const resultSet = new Set(result)

    for (const id of currentIds) {
      if (!resultSet.has(id)) {
        result.push(id)
      }
    }

    return result
  }, [groupSortOrder, groups])

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

  const stopEdgeAutoScroll = useCallback(() => {
    if (autoScrollFrameRef.current !== null) {
      window.cancelAnimationFrame(autoScrollFrameRef.current)
      autoScrollFrameRef.current = null
    }
  }, [])

  const tickEdgeAutoScroll = useCallback(() => {
    autoScrollFrameRef.current = null

    if (!draggingActiveRef.current || !edgeAutoScrollEnabledRef.current || !dragPointerRef.current) return

    const viewportHeight = window.innerHeight
    const threshold = Math.min(320, Math.max(180, Math.round(viewportHeight * 0.3)))
    const pointerY = dragPointerRef.current.y
    let delta = 0

    if (pointerY < threshold) {
      const intensity = Math.min(1, (threshold - pointerY) / threshold)
      delta = -Math.round(24 + intensity * intensity * 176)
    } else if (pointerY > viewportHeight - threshold) {
      const intensity = Math.min(1, (pointerY - (viewportHeight - threshold)) / threshold)
      delta = Math.round(24 + intensity * intensity * 176)
    }

    if (delta === 0) return

    window.scrollBy(0, delta)
    autoScrollFrameRef.current = window.requestAnimationFrame(tickEdgeAutoScroll)
  }, [])

  const ensureEdgeAutoScroll = useCallback(() => {
    if (autoScrollFrameRef.current === null) {
      autoScrollFrameRef.current = window.requestAnimationFrame(tickEdgeAutoScroll)
    }
  }, [tickEdgeAutoScroll])

  useEffect(() => {
    draggingActiveRef.current = isDragging

    if (!isDragging) {
      edgeAutoScrollEnabledRef.current = false
      hoveredGroupIdRef.current = null
      setHoveredGroupId(null)
      stopEdgeAutoScroll()
      return
    }

    edgeAutoScrollEnabledRef.current = true

    const handlePointerMove = (event: MouseEvent | PointerEvent) => {
      dragPointerRef.current = {
        y: event.clientY,
      }

      const hoveredCard = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-group-card-id]')
      const nextHoveredGroupId = hoveredCard?.getAttribute('data-group-card-id') ?? null

      if (hoveredGroupIdRef.current !== nextHoveredGroupId) {
        hoveredGroupIdRef.current = nextHoveredGroupId
        setHoveredGroupId(nextHoveredGroupId)
      }

      if (edgeAutoScrollEnabledRef.current) {
        ensureEdgeAutoScroll()
      }
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [ensureEdgeAutoScroll, isDragging, stopEdgeAutoScroll])

  useEffect(() => () => stopEdgeAutoScroll(), [stopEdgeAutoScroll])

  const onDragStart = (start: { draggableId: string; source: { droppableId: string } }) => {
    const draggableId = start.draggableId
    const droppableId = start.source.droppableId

    setIsDragging(true)
    setDragDestinationDroppableId(null)
    hoveredGroupIdRef.current = null
    setHoveredGroupId(null)
    edgeAutoScrollEnabledRef.current = true
    ensureEdgeAutoScroll()

    // Determine the type based on droppableId
    if (droppableId === 'group-list') {
      return
    } else if (droppableId === 'node-list') {
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

  const onDragUpdate = useCallback(
    (update: DragUpdate) => {
      const nextDroppableId = update.destination?.droppableId ?? null
      setDragDestinationDroppableId((current) => (current === nextDroppableId ? current : nextDroppableId))
      ensureEdgeAutoScroll()
    },
    [ensureEdgeAutoScroll],
  )

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result
    const fallbackGroupId = hoveredGroupIdRef.current

    setIsDragging(false)
    setDraggingResource(null)
    setDragDestinationDroppableId(null)
    setHoveredGroupId(null)
    hoveredGroupIdRef.current = null
    edgeAutoScrollEnabledRef.current = false
    stopEdgeAutoScroll()

    const sourceDroppableId = source.droppableId
    const destDroppableId = destination?.droppableId

    if (sourceDroppableId === 'group-list' && destDroppableId === 'group-list' && destination) {
      if (source.index !== destination.index) {
        setGroupSortOrder(arrayMove(sortedGroupIds, source.index, destination.index))
      }
      return
    }

    if (!destination) {
      if (fallbackGroupId) {
        if (sourceDroppableId === 'subscription-list') {
          const subId = draggableId.replace('subscription-', '')
          const targetGroup = getGroupById(fallbackGroupId)
          if (targetGroup && !hasGroupSubscription(fallbackGroupId, subId)) {
            groupAddSubscriptionsMutation.mutate({ id: fallbackGroupId, subscriptionIDs: [subId] })
            return
          }
        }

        if (sourceDroppableId === 'node-list') {
          const nodeId = draggableId.replace('node-', '')
          const targetGroup = groupsQuery?.groups.find((group: GroupsQuery['groups'][number]) => group.id === fallbackGroupId)
          if (
            targetGroup &&
            !targetGroup.nodes.find((node: GroupsQuery['groups'][number]['nodes'][number]) => node.id === nodeId)
          ) {
            groupAddNodesMutation.mutate({ id: fallbackGroupId, nodeIDs: [nodeId] })
            return
          }
        }

        if (sourceDroppableId.startsWith('subscription-') && sourceDroppableId.endsWith('-nodes') && sourceDroppableId !== 'subscription-list') {
          const nodeId = draggableId.replace('subscription-node-', '')
          const targetGroup = groupsQuery?.groups.find((group: GroupsQuery['groups'][number]) => group.id === fallbackGroupId)
          if (
            targetGroup &&
            !targetGroup.nodes.find((node: GroupsQuery['groups'][number]['nodes'][number]) => node.id === nodeId)
          ) {
            groupAddNodesMutation.mutate({ id: fallbackGroupId, nodeIDs: [nodeId] })
            return
          }
        }

        if (sourceDroppableId.endsWith('-nodes')) {
          const sourceGroupId = sourceDroppableId.replace('-nodes', '')
          const parsed = parseGroupItemId(draggableId)
          if (parsed && sourceGroupId !== fallbackGroupId) {
            const targetGroup = groupsQuery?.groups.find((group: GroupsQuery['groups'][number]) => group.id === fallbackGroupId)
            if (
              targetGroup &&
              !targetGroup.nodes.find((node: GroupsQuery['groups'][number]['nodes'][number]) => node.id === parsed.itemId)
            ) {
              groupAddNodesMutation.mutate({ id: fallbackGroupId, nodeIDs: [parsed.itemId] })
              return
            }
          }
        }

        if (sourceDroppableId.endsWith('-subscriptions')) {
          const sourceGroupId = sourceDroppableId.replace('-subscriptions', '')
          const parsed = parseGroupItemId(draggableId)
          if (parsed && sourceGroupId !== fallbackGroupId) {
            const targetGroup = getGroupById(fallbackGroupId)
            const sourceBinding = getGroupSubscriptionBinding(sourceGroupId, parsed.itemId)
            if (targetGroup && !hasGroupSubscription(fallbackGroupId, parsed.itemId)) {
              groupAddSubscriptionsMutation.mutate({
                id: fallbackGroupId,
                subscriptionIDs: [parsed.itemId],
                nameFilterRegex: sourceBinding?.nameFilterRegex ?? null,
              })
              return
            }
          }
        }
      }

      return
    }

    const confirmedDestDroppableId = destination.droppableId

    // Handle node list sorting
    if (sourceDroppableId === 'node-list' && confirmedDestDroppableId === 'node-list') {
      if (source.index !== destination.index) {
        setNodeSortOrder(arrayMove(sortedNodeIds, source.index, destination.index))
      }
      return
    }

    // Handle subscription list sorting
    if (sourceDroppableId === 'subscription-list' && confirmedDestDroppableId === 'subscription-list') {
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
    if (isFromSubscriptionNodes && confirmedDestDroppableId.endsWith('-nodes')) {
      const nodeId = draggableId.replace('subscription-node-', '')
      const targetGroupId = confirmedDestDroppableId.replace('-nodes', '')
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
    if (sourceDroppableId.endsWith('-nodes') && confirmedDestDroppableId.endsWith('-nodes')) {
      const sourceGroupId = sourceDroppableId.replace('-nodes', '')
      const destGroupId = confirmedDestDroppableId.replace('-nodes', '')

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
    if (sourceDroppableId.endsWith('-subscriptions') && confirmedDestDroppableId.endsWith('-subscriptions')) {
      const sourceGroupId = sourceDroppableId.replace('-subscriptions', '')
      const destGroupId = confirmedDestDroppableId.replace('-subscriptions', '')

      if (sourceGroupId === destGroupId) {
        // Same group sorting
        if (source.index !== destination.index) {
          const group = groupsQuery?.groups.find((g: GroupsQuery['groups'][number]) => g.id === sourceGroupId)
          if (group) {
            const currentIds = group.subscriptions.map(
              (s: GroupsQuery['groups'][number]['subscriptions'][number]) => s.subscription.id,
            )
            const sortedIds = getGroupSortedIds(sourceGroupId, 'subscriptions', currentIds)
            updateGroupSortOrder(sourceGroupId, 'subscriptions', arrayMove(sortedIds, source.index, destination.index))
          }
        }
      } else {
        // Cross-group drag - add subscription to target group
        const parsed = parseGroupItemId(draggableId)
        if (parsed) {
          const targetGroup = getGroupById(destGroupId)
          const sourceBinding = getGroupSubscriptionBinding(sourceGroupId, parsed.itemId)
          if (targetGroup && !hasGroupSubscription(destGroupId, parsed.itemId)) {
            groupAddSubscriptionsMutation.mutate({
              id: destGroupId,
              subscriptionIDs: [parsed.itemId],
              nameFilterRegex: sourceBinding?.nameFilterRegex ?? null,
            })
          }
        }
      }
      return
    }

    // Handle dropping node from node-list to group
    if (sourceDroppableId === 'node-list' && confirmedDestDroppableId.endsWith('-nodes')) {
      const nodeId = draggableId.replace('node-', '')
      const targetGroupId = confirmedDestDroppableId.replace('-nodes', '')
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
    if (sourceDroppableId === 'subscription-list' && confirmedDestDroppableId.endsWith('-subscriptions')) {
      const subId = draggableId.replace('subscription-', '')
      const targetGroupId = confirmedDestDroppableId.replace('-subscriptions', '')
      const targetGroup = getGroupById(targetGroupId)

      if (targetGroup && !hasGroupSubscription(targetGroupId, subId)) {
        groupAddSubscriptionsMutation.mutate({ id: targetGroupId, subscriptionIDs: [subId] })
      }
      return
    }

    // Handle dropping group node back to node list (remove from group)
    if (sourceDroppableId.endsWith('-nodes') && confirmedDestDroppableId === NODE_DROPPABLE_ID) {
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

      <TrafficOverview />

      <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
        <div className={`grid gap-5 ${matchSmallScreen ? 'grid-cols-1' : 'grid-cols-3'}`}>
          <GroupResource
            highlight={!!draggingResource}
            draggingResource={draggingResource}
            dragDestinationDroppableId={dragDestinationDroppableId}
            hoveredGroupId={hoveredGroupId}
          />
          <NodeResource
            sortedNodes={sortedNodes}
            highlight={draggingResource?.type === DraggableResourceType.groupNode}
            nodeLatencies={nodeLatencies}
          />
          <SubscriptionResource
            sortedSubscriptions={sortedSubscriptions}
            nodeLatencies={nodeLatencies}
            testingLatencies={testNodeLatenciesMutation.isPending}
            lastLatencyProbeAt={lastLatencyProbeAt}
            onTestAllNodeLatencies={async () => {
              const results = await testNodeLatenciesMutation.mutateAsync()
              setNodeLatencies(
                Object.fromEntries(results.map((result) => [result.id, result])),
              )
            }}
          />
        </div>
      </DragDropContext>
    </div>
  )
}
