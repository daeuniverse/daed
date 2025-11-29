import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { DraggingResource } from '~/constants'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { snapCenterToCursor } from '@dnd-kit/modifiers'
import { arrayMove } from '@dnd-kit/sortable'
import { useStore } from '@nanostores/react'
import { GripVertical } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import {
  useGroupAddNodesMutation,
  useGroupAddSubscriptionsMutation,
  useGroupsQuery,
  useNodesQuery,
  useSubscriptionsQuery,
} from '~/apis'
import { DraggableResourceType } from '~/constants'
import { useMediaQuery } from '~/hooks'
import { appStateAtom } from '~/store'
import { Config } from './Config'
import { DNS } from './DNS'
import { GroupResource } from './Group'
import { NodeResource } from './Node'
import { Routing } from './Routing'
import { SubscriptionResource } from './Subscription'

export function OrchestratePage() {
  const { data: nodesQuery } = useNodesQuery()
  const { data: groupsQuery } = useGroupsQuery()
  const { data: subscriptionsQuery } = useSubscriptionsQuery()

  const groupAddNodesMutation = useGroupAddNodesMutation()
  const groupAddSubscriptionsMutation = useGroupAddSubscriptionsMutation()

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
    const currentIds = nodes.map((n) => n.id)
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
    const nodeMap = new Map(nodes.map((n) => [n.id, n]))
    return sortedNodeIds.map((id) => nodeMap.get(id)).filter(Boolean) as typeof nodes
  }, [nodes, sortedNodeIds])

  // Get sorted subscription IDs
  const sortedSubscriptionIds = useMemo(() => {
    if (subscriptions.length === 0) return []
    const currentIds = subscriptions.map((s) => s.id)
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
    const subMap = new Map(subscriptions.map((s) => [s.id, s]))
    return sortedSubscriptionIds.map((id) => subMap.get(id)).filter(Boolean) as typeof subscriptions
  }, [subscriptions, sortedSubscriptionIds])

  const draggingResourceDisplayName = useMemo(() => {
    if (draggingResource) {
      const { type, nodeID, groupID, subscriptionID } = draggingResource

      if (type === DraggableResourceType.node) {
        const node = nodes.find((node) => node.id === nodeID)

        return node?.tag || node?.name
      }

      if (type === DraggableResourceType.subscription) {
        const subscription = subscriptions.find((subscription) => subscription.id === subscriptionID)

        return subscription?.tag || subscription?.link
      }

      if (type === DraggableResourceType.subscription_node) {
        const subscription = subscriptions.find((subscription) => subscription.id === subscriptionID)
        const node = subscription?.nodes.edges.find((node) => node.id === nodeID)

        return node?.name
      }

      if (type === DraggableResourceType.groupNode) {
        const group = groupsQuery?.groups.find((group) => group.id === groupID)

        const node = group?.nodes.find((node) => node.id === nodeID)

        return node?.tag || node?.name
      }

      if (type === DraggableResourceType.groupSubscription) {
        const group = groupsQuery?.groups.find((group) => group.id === groupID)

        const subscription = group?.subscriptions.find((subscription) => subscription.id === subscriptionID)

        return subscription?.tag
      }
    }
  }, [draggingResource, groupsQuery?.groups, nodes, subscriptions])

  const onDragStart = (e: DragStartEvent) => {
    const rect = e.active.rect.current.initial
    setDraggingResource({
      ...(e.active.data.current as DraggingResource),
      rect: rect ? { width: rect.width, height: rect.height } : undefined,
    })
  }

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

      // Handle dropping to group
      const group = groupsQuery?.groups.find((group) => group.id === over.id)

      if (
        [DraggableResourceType.node, DraggableResourceType.groupNode].includes(draggingResource.type) &&
        draggingResource?.nodeID &&
        !group?.nodes.find((node) => node.id === draggingResource.nodeID)
      ) {
        groupAddNodesMutation.mutate({ id: over.id as string, nodeIDs: [draggingResource.nodeID] })
      }

      if (
        [DraggableResourceType.subscription, DraggableResourceType.groupSubscription].includes(draggingResource.type) &&
        draggingResource.subscriptionID &&
        !group?.subscriptions.find((subscription) => subscription.id === draggingResource.subscriptionID)
      ) {
        groupAddSubscriptionsMutation.mutate({
          id: over.id as string,
          subscriptionIDs: [draggingResource.subscriptionID],
        })
      }

      if (
        draggingResource.type === DraggableResourceType.subscription_node &&
        draggingResource.nodeID &&
        !group?.nodes.find((node) => node.id === draggingResource.nodeID)
      ) {
        groupAddNodesMutation.mutate({ id: over.id as string, nodeIDs: [draggingResource.nodeID] })
      }
    }

    setDraggingResource(null)
  }

  const dndAreaRef = useRef<HTMLDivElement>(null)
  const matchSmallScreen = useMediaQuery('(max-width: 640px)')

  return (
    <div className="flex flex-col gap-6">
      <div className={`grid gap-4 ${matchSmallScreen ? 'grid-cols-1' : 'grid-cols-3'}`}>
        <Config />
        <DNS />
        <Routing />
      </div>

      <div ref={dndAreaRef} className={`grid gap-4 ${matchSmallScreen ? 'grid-cols-1' : 'grid-cols-3'}`}>
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <GroupResource highlight={!!draggingResource} draggingResource={draggingResource} />
          <NodeResource sortedNodes={sortedNodes} />
          <SubscriptionResource sortedSubscriptions={sortedSubscriptions} />

          <DragOverlay zIndex={9999} modifiers={[snapCenterToCursor]}>
            {draggingResource && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-card shadow-lg cursor-grabbing">
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                <span className="text-sm font-medium truncate max-w-[200px]">{draggingResourceDisplayName}</span>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
