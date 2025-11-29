import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { DraggingResource } from '~/constants'
import { DndContext, DragOverlay } from '@dnd-kit/core'

import { useMemo, useRef, useState } from 'react'
import {
  useGroupAddNodesMutation,
  useGroupAddSubscriptionsMutation,
  useGroupsQuery,
  useNodesQuery,
  useSubscriptionsQuery,
} from '~/apis'
import { Badge } from '~/components/ui/badge'
import { DraggableResourceType } from '~/constants'
import { useMediaQuery } from '~/hooks'
import { restrictToElement } from '~/utils'

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

  const draggingResourceDisplayName = useMemo(() => {
    if (draggingResource) {
      const { type, nodeID, groupID, subscriptionID } = draggingResource

      if (type === DraggableResourceType.node) {
        const node = nodesQuery?.nodes.edges.find(node => node.id === nodeID)

        return node?.tag
      }

      if (type === DraggableResourceType.subscription) {
        const subscription = subscriptionsQuery?.subscriptions.find(
          subscription => subscription.id === subscriptionID,
        )

        return subscription?.tag || subscription?.link
      }

      if (type === DraggableResourceType.subscription_node) {
        const subscription = subscriptionsQuery?.subscriptions.find(
          subscription => subscription.id === subscriptionID,
        )
        const node = subscription?.nodes.edges.find(node => node.id === nodeID)

        return node?.name
      }

      if (type === DraggableResourceType.groupNode) {
        const group = groupsQuery?.groups.find(group => group.id === groupID)

        const node = group?.nodes.find(node => node.id === nodeID)

        return node?.name
      }

      if (type === DraggableResourceType.groupSubscription) {
        const group = groupsQuery?.groups.find(group => group.id === groupID)

        const subscription = group?.subscriptions.find(subscription => subscription.id === subscriptionID)

        return subscription?.tag
      }
    }
  }, [draggingResource, groupsQuery?.groups, nodesQuery?.nodes.edges, subscriptionsQuery?.subscriptions])

  const onDragStart = (e: DragStartEvent) => {
    setDraggingResource({
      ...(e.active.data.current as DraggingResource),
    })
  }

  const onDragEnd = (e: DragEndEvent) => {
    const { over } = e

    if (over?.id && draggingResource) {
      const group = groupsQuery?.groups.find(group => group.id === over.id)

      if (
        [DraggableResourceType.node, DraggableResourceType.groupNode].includes(draggingResource.type)
        && draggingResource?.nodeID
        && !group?.nodes.find(node => node.id === draggingResource.nodeID)
      ) {
        groupAddNodesMutation.mutate({ id: over.id as string, nodeIDs: [draggingResource.nodeID] })
      }

      if (
        [DraggableResourceType.subscription, DraggableResourceType.groupSubscription].includes(draggingResource.type)
        && draggingResource.subscriptionID
        && !group?.subscriptions.find(subscription => subscription.id === draggingResource.subscriptionID)
      ) {
        groupAddSubscriptionsMutation.mutate({
          id: over.id as string,
          subscriptionIDs: [draggingResource.subscriptionID],
        })
      }

      if (
        draggingResource.type === DraggableResourceType.subscription_node
        && draggingResource.nodeID
        && !group?.nodes.find(node => node.id === draggingResource.nodeID)
      ) {
        groupAddNodesMutation.mutate({ id: over.id as string, nodeIDs: [draggingResource.nodeID] })
      }
    }

    setDraggingResource(null)
  }

  const dndAreaRef = useRef<HTMLDivElement>(null)
  const matchSmallScreen = useMediaQuery('(max-width: 640px)')
  // The ref is only accessed when drag events occur, not during render
  // eslint-disable-next-line react-hooks/refs
  const dndModifiers = useMemo(() => [restrictToElement(dndAreaRef)], [])

  return (
    <div className="flex flex-col gap-6">
      <div className={`grid gap-4 ${matchSmallScreen ? 'grid-cols-1' : 'grid-cols-3'}`}>
        <Config />
        <DNS />
        <Routing />
      </div>

      <div ref={dndAreaRef} className={`grid gap-4 ${matchSmallScreen ? 'grid-cols-1' : 'grid-cols-3'}`}>
        <DndContext modifiers={dndModifiers} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <GroupResource highlight={!!draggingResource} />
          <NodeResource />
          <SubscriptionResource />

          <DragOverlay dropAnimation={null}>
            {draggingResource && <Badge className="cursor-grabbing">{draggingResourceDisplayName}</Badge>}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
