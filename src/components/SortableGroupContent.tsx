import type { DragEndEvent } from '@dnd-kit/core'
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { GripVertical } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SortableResourceBadge } from '~/components/SortableResourceBadge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { DraggableResourceType } from '~/constants'

interface GroupNode {
  id: string
  tag: string
  name: string
  subscriptionID?: string | null
}

interface GroupSubscription {
  id: string
  tag: string
  link: string
}

interface Subscription {
  id: string
  tag: string
}

export function SortableGroupContent({
  groupId,
  nodes,
  subscriptions,
  allSubscriptions,
  autoExpandValue,
  onDelNode,
  onDelSubscription,
}: {
  groupId: string
  nodes: GroupNode[]
  subscriptions: GroupSubscription[]
  allSubscriptions?: Subscription[]
  autoExpandValue?: string
  onDelNode: (nodeId: string) => void
  onDelSubscription: (subscriptionId: string) => void
}) {
  const { t } = useTranslation()

  // Local sort order state - maps original index to sorted index
  const [nodeSortOrder, setNodeSortOrder] = useState<string[]>([])
  const [subSortOrder, setSubSortOrder] = useState<string[]>([])
  const [draggingItem, setDraggingItem] = useState<{ id: string; name: string } | null>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  // Get sorted node IDs - merge custom sort with current data
  const sortedNodeIds = useMemo(() => {
    const currentIds = nodes.map((n) => n.id)
    const currentIdSet = new Set(currentIds)

    // Start with sorted IDs that still exist
    const result = nodeSortOrder.filter((id) => currentIdSet.has(id))
    const resultSet = new Set(result)

    // Add any new IDs at the end
    for (const id of currentIds) {
      if (!resultSet.has(id)) {
        result.push(id)
      }
    }

    return result
  }, [nodes, nodeSortOrder])

  // Get sorted subscription IDs
  const sortedSubscriptionIds = useMemo(() => {
    const currentIds = subscriptions.map((s) => s.id)
    const currentIdSet = new Set(currentIds)

    const result = subSortOrder.filter((id) => currentIdSet.has(id))
    const resultSet = new Set(result)

    for (const id of currentIds) {
      if (!resultSet.has(id)) {
        result.push(id)
      }
    }

    return result
  }, [subscriptions, subSortOrder])

  // Compute expanded sections - include autoExpandValue when dragging
  const effectiveExpandedSections = useMemo(() => {
    if (autoExpandValue && !expandedSections.includes(autoExpandValue)) {
      return [...expandedSections, autoExpandValue]
    }
    return expandedSections
  }, [expandedSections, autoExpandValue])

  // Get sorted nodes
  const sortedNodes = useMemo(() => {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]))
    return sortedNodeIds.map((id) => nodeMap.get(id)).filter(Boolean) as GroupNode[]
  }, [nodes, sortedNodeIds])

  // Get sorted subscriptions
  const sortedSubscriptions = useMemo(() => {
    const subMap = new Map(subscriptions.map((s) => [s.id, s]))
    return sortedSubscriptionIds.map((id) => subMap.get(id)).filter(Boolean) as GroupSubscription[]
  }, [subscriptions, sortedSubscriptionIds])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  )

  const handleDragStart = (event: { active: { id: string | number } }) => {
    const activeId = String(event.active.id)

    // Find the item being dragged
    const node = nodes.find((n) => `${groupId}-node-${n.id}` === activeId)
    if (node) {
      setDraggingItem({ id: activeId, name: node.tag || node.name })
      return
    }

    const subscription = subscriptions.find((s) => `${groupId}-sub-${s.id}` === activeId)
    if (subscription) {
      setDraggingItem({ id: activeId, name: subscription.tag || subscription.link })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setDraggingItem(null)

    if (!over || active.id === over.id) return

    const activeId = String(active.id)
    const overId = String(over.id)

    // Check if sorting nodes
    if (activeId.includes('-node-') && overId.includes('-node-')) {
      const activeNodeId = activeId.replace(`${groupId}-node-`, '')
      const overNodeId = overId.replace(`${groupId}-node-`, '')

      const oldIndex = sortedNodeIds.indexOf(activeNodeId)
      const newIndex = sortedNodeIds.indexOf(overNodeId)
      setNodeSortOrder(arrayMove(sortedNodeIds, oldIndex, newIndex))
    }

    // Check if sorting subscriptions
    if (activeId.includes('-sub-') && overId.includes('-sub-')) {
      const activeSubId = activeId.replace(`${groupId}-sub-`, '')
      const overSubId = overId.replace(`${groupId}-sub-`, '')

      const oldIndex = sortedSubscriptionIds.indexOf(activeSubId)
      const newIndex = sortedSubscriptionIds.indexOf(overSubId)
      setSubSortOrder(arrayMove(sortedSubscriptionIds, oldIndex, newIndex))
    }
  }

  const nodeIds = sortedNodes.map((n) => `${groupId}-node-${n.id}`)
  const subscriptionIds = sortedSubscriptions.map((s) => `${groupId}-sub-${s.id}`)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Accordion
        type="multiple"
        className="w-full"
        value={effectiveExpandedSections}
        onValueChange={setExpandedSections}
      >
        <AccordionItem value="node" className="border-none">
          <AccordionTrigger className="text-xs py-2 hover:no-underline">
            {t('node')} ({nodes.length})
          </AccordionTrigger>

          <AccordionContent>
            <SortableContext items={nodeIds} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-1.5">
                {sortedNodes.map(({ id: nodeId, tag, name, subscriptionID }) => (
                  <SortableResourceBadge
                    key={nodeId}
                    id={`${groupId}-node-${nodeId}`}
                    nodeID={nodeId}
                    groupID={groupId}
                    type={DraggableResourceType.groupNode}
                    name={tag || name}
                    onRemove={() => onDelNode(nodeId)}
                  >
                    {subscriptionID && allSubscriptions?.find((s) => s.id === subscriptionID)?.tag}
                  </SortableResourceBadge>
                ))}
                {nodes.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">{t('empty')}</p>}
              </div>
            </SortableContext>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="subscription" className="border-none">
          <AccordionTrigger className="text-xs py-2 hover:no-underline">
            {t('subscription')} ({subscriptions.length})
          </AccordionTrigger>

          <AccordionContent>
            <SortableContext items={subscriptionIds} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-1.5">
                {sortedSubscriptions.map(({ id: subscriptionId, tag, link }) => (
                  <SortableResourceBadge
                    key={subscriptionId}
                    id={`${groupId}-sub-${subscriptionId}`}
                    groupID={groupId}
                    subscriptionID={subscriptionId}
                    type={DraggableResourceType.groupSubscription}
                    name={tag || link}
                    onRemove={() => onDelSubscription(subscriptionId)}
                  />
                ))}
                {subscriptions.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">{t('empty')}</p>
                )}
              </div>
            </SortableContext>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <DragOverlay>
        {draggingItem && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-card shadow-lg cursor-grabbing">
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
            <span className="text-sm font-medium truncate max-w-[200px]">{draggingItem.name}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
