import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useStore } from '@nanostores/react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SortableResourceBadge } from '~/components/SortableResourceBadge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { DraggableResourceType } from '~/constants'
import { groupSortOrdersAtom } from '~/store'

interface GroupNode {
  id: string
  tag?: string | null
  name: string
  protocol?: string | null
  address?: string | null
  subscriptionID?: string | null
}

interface GroupSubscription {
  id: string
  tag?: string | null
  link: string
}

interface Subscription {
  id: string
  tag?: string | null
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

  // Use persistent store for sort order
  const groupSortOrders = useStore(groupSortOrdersAtom)
  const groupSortOrder = groupSortOrders[groupId] || { nodes: [], subscriptions: [] }
  const nodeSortOrder = groupSortOrder.nodes
  const subSortOrder = groupSortOrder.subscriptions

  const [expandedSections, setExpandedSections] = useState<string[]>(['node', 'subscription'])

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

  const nodeIds = sortedNodes.map((n) => `${groupId}-node-${n.id}`)
  const subscriptionIds = sortedSubscriptions.map((s) => `${groupId}-sub-${s.id}`)

  return (
    <Accordion type="multiple" className="w-full" value={effectiveExpandedSections} onValueChange={setExpandedSections}>
      <AccordionItem value="node" className="border-none">
        <AccordionTrigger className="text-xs py-2 hover:no-underline">
          {t('node')} ({nodes.length})
        </AccordionTrigger>

        <AccordionContent>
          <SortableContext items={nodeIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {sortedNodes.map(({ id: nodeId, tag, name, protocol, address, subscriptionID }) => (
                <SortableResourceBadge
                  key={nodeId}
                  id={`${groupId}-node-${nodeId}`}
                  nodeID={nodeId}
                  groupID={groupId}
                  type={DraggableResourceType.groupNode}
                  name={tag || name}
                  protocol={protocol}
                  address={address}
                  onRemove={() => onDelNode(nodeId)}
                >
                  {subscriptionID && allSubscriptions?.find((s) => s.id === subscriptionID)?.tag}
                </SortableResourceBadge>
              ))}
              {nodes.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">{t('empty')}</p>}
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
  )
}
