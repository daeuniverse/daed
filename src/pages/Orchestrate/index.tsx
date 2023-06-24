import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { Anchor, Badge, Divider, SimpleGrid, Stack, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  useGroupAddNodesMutation,
  useGroupAddSubscriptionsMutation,
  useGroupsQuery,
  useNodesQuery,
  useSubscriptionsQuery,
} from '~/apis'
import { DraggableResourceType, DraggingResource } from '~/constants'
import { restrictToElement } from '~/utils/dnd-kit'

import { Config } from './Config'
import { DNS } from './DNS'
import { GroupResource } from './Group'
import { NodeResource } from './Node'
import { Routing } from './Routing'
import { SubscriptionResource } from './Subscription'

export const OrchestratePage = () => {
  const { t } = useTranslation()

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
        const node = nodesQuery?.nodes.edges.find((node) => node.id === nodeID)

        return node?.tag
      }

      if (type === DraggableResourceType.subscription) {
        const subscription = subscriptionsQuery?.subscriptions.find(
          (subscription) => subscription.id === subscriptionID
        )

        return subscription?.tag || subscription?.link
      }

      if (type === DraggableResourceType.subscription_node) {
        const subscription = subscriptionsQuery?.subscriptions.find(
          (subscription) => subscription.id === subscriptionID
        )
        const node = subscription?.nodes.edges.find((node) => node.id === nodeID)

        return node?.name
      }

      if (type === DraggableResourceType.groupNode) {
        const group = groupsQuery?.groups.find((group) => group.id === groupID)

        const node = group?.nodes.find((node) => node.id === nodeID)

        return node?.name
      }

      if (type === DraggableResourceType.groupSubscription) {
        const group = groupsQuery?.groups.find((group) => group.id === groupID)

        const subscription = group?.subscriptions.find((subscription) => subscription.id === subscriptionID)

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
  const theme = useMantineTheme()
  const matchSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

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

      <SimpleGrid cols={matchSmallScreen ? 1 : 3}>
        <Config />
        <DNS />
        <Routing />
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

      <SimpleGrid ref={dndAreaRef} cols={matchSmallScreen ? 1 : 3}>
        <DndContext modifiers={[restrictToElement(dndAreaRef.current)]} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <GroupResource highlight={!!draggingResource} />
          <NodeResource />
          <SubscriptionResource />

          <DragOverlay dropAnimation={null}>
            {draggingResource && <Badge sx={{ cursor: 'grabbing' }}>{draggingResourceDisplayName}</Badge>}
          </DragOverlay>
        </DndContext>
      </SimpleGrid>
    </Stack>
  )
}
