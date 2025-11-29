import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { DraggingResource } from '~/constants'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { snapCenterToCursor } from '@dnd-kit/modifiers'
import { GripVertical } from 'lucide-react'

import { useMemo, useRef, useState } from 'react'
import {
  useGroupAddNodesMutation,
  useGroupAddSubscriptionsMutation,
  useGroupsQuery,
  useNodesQuery,
  useSubscriptionsQuery,
} from '~/apis'
import { DraggableResourceType } from '~/constants'
import { useMediaQuery } from '~/hooks'

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  )

  const draggingResourceDisplayName = useMemo(() => {
    if (draggingResource) {
      const { type, nodeID, groupID, subscriptionID } = draggingResource

      if (type === DraggableResourceType.node) {
        const node = nodesQuery?.nodes.edges.find((node) => node.id === nodeID)

        return node?.tag
      }

      if (type === DraggableResourceType.subscription) {
        const subscription = subscriptionsQuery?.subscriptions.find(
          (subscription) => subscription.id === subscriptionID,
        )

        return subscription?.tag || subscription?.link
      }

      if (type === DraggableResourceType.subscription_node) {
        const subscription = subscriptionsQuery?.subscriptions.find(
          (subscription) => subscription.id === subscriptionID,
        )
        const node = subscription?.nodes.edges.find((node) => node.id === nodeID)

        return node?.tag || node?.name
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
  }, [draggingResource, groupsQuery?.groups, nodesQuery?.nodes.edges, subscriptionsQuery?.subscriptions])

  const onDragStart = (e: DragStartEvent) => {
    const rect = e.active.rect.current.initial
    setDraggingResource({
      ...(e.active.data.current as DraggingResource),
      rect: rect ? { width: rect.width, height: rect.height } : undefined,
    })
  }

  const onDragEnd = (e: DragEndEvent) => {
    const { over } = e

    if (over?.id && draggingResource) {
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
          <NodeResource />
          <SubscriptionResource />

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
