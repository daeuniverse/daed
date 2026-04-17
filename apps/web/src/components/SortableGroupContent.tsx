import { Droppable } from '@hello-pangea/dnd'
import { ChevronDown, Plus } from 'lucide-react'
import { useStore } from '@nanostores/react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SortableResourceBadge } from '~/components/SortableResourceBadge'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
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
  subscription: {
    id: string
    tag?: string | null
    link: string
  }
  nameFilterRegex?: string | null
  matchedCount: number
  matchedNodes: Array<{
    id: string
    name: string
    protocol?: string | null
  }>
}

interface Subscription {
  id: string
  tag?: string | null
}

function GroupDropZone({
  droppableId,
  type,
  label,
  count,
  collapsed,
  open,
  onOpen,
  onToggle,
  addButtonLabel,
  onAdd,
  emptyLabel,
  children,
}: {
  droppableId: string
  type: 'NODE' | 'SUBSCRIPTION'
  label: string
  count: number
  collapsed?: boolean
  open: boolean
  onOpen: () => void
  onToggle: () => void
  addButtonLabel: string
  onAdd: () => void
  emptyLabel: string
  children: React.ReactNode[]
}) {
  const compact = collapsed || !open

  return (
    <div className="flex flex-col gap-2">
      {!collapsed && (
        <button
          type="button"
          className="flex items-center justify-between gap-3 py-1 text-left text-xs font-medium transition-colors hover:text-foreground"
          onClick={onToggle}
        >
          <span>
            {label} ({count})
          </span>
          <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', !open && '-rotate-90')} />
        </button>
      )}

      <Droppable droppableId={droppableId} type={type}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            role={compact ? 'button' : undefined}
            tabIndex={compact ? 0 : undefined}
            className={cn(
              'rounded-lg border transition-colors outline-none',
              compact
                ? 'flex min-h-11 cursor-pointer items-center justify-between border-dashed px-3 py-2 hover:border-primary/30 hover:bg-accent/40 focus-visible:border-primary/40'
                : 'flex min-h-[40px] flex-col gap-2 border-transparent',
              snapshot.isDraggingOver && 'border-primary bg-primary/5',
            )}
            onClick={compact ? onOpen : undefined}
            onKeyDown={
              compact
                ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onOpen()
                    }
                  }
                : undefined
            }
          >
            {compact ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{count}</span>
                </div>
                {provided.placeholder}
              </>
            ) : (
              <>
                <div className="mb-1 flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="xs" onClick={onAdd}>
                    <Plus className="h-3.5 w-3.5" />
                    {addButtonLabel}
                  </Button>
                </div>

                {children.length > 0 ? children : <p className="py-3 text-center text-xs text-muted-foreground">{emptyLabel}</p>}
                {provided.placeholder}
              </>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export function SortableGroupContent({
  groupId,
  nodes,
  subscriptions,
  allSubscriptions,
  autoExpandValue,
  collapsed,
  onExpand,
  onDelNode,
  onDelSubscription,
  onOpenAddNodes,
  onOpenAddSubscriptions,
}: {
  groupId: string
  nodes: GroupNode[]
  subscriptions: GroupSubscription[]
  allSubscriptions?: Subscription[]
  autoExpandValue?: string
  collapsed?: boolean
  onExpand: () => void
  onDelNode: (nodeId: string) => void
  onDelSubscription: (subscriptionId: string) => void
  onOpenAddNodes: () => void
  onOpenAddSubscriptions: () => void
}) {
  const { t } = useTranslation()
  const groupSortOrders = useStore(groupSortOrdersAtom)
  const groupSortOrder = groupSortOrders[groupId] || { nodes: [], subscriptions: [] }
  const nodeSortOrder = groupSortOrder.nodes
  const subSortOrder = groupSortOrder.subscriptions

  const [expandedSections, setExpandedSections] = useState<string[]>(['node', 'subscription'])

  const sortedNodeIds = useMemo(() => {
    const currentIds = nodes.map((node) => node.id)
    const currentIdSet = new Set(currentIds)
    const result = nodeSortOrder.filter((id) => currentIdSet.has(id))
    const resultSet = new Set(result)

    for (const id of currentIds) {
      if (!resultSet.has(id)) result.push(id)
    }

    return result
  }, [nodes, nodeSortOrder])

  const sortedSubscriptionIds = useMemo(() => {
    const currentIds = subscriptions.map((subscription) => subscription.subscription.id)
    const currentIdSet = new Set(currentIds)
    const result = subSortOrder.filter((id) => currentIdSet.has(id))
    const resultSet = new Set(result)

    for (const id of currentIds) {
      if (!resultSet.has(id)) result.push(id)
    }

    return result
  }, [subscriptions, subSortOrder])

  const effectiveExpandedSections = useMemo(() => {
    if (collapsed || !autoExpandValue || expandedSections.includes(autoExpandValue)) {
      return expandedSections
    }
    return [...expandedSections, autoExpandValue]
  }, [autoExpandValue, collapsed, expandedSections])

  const sortedNodes = useMemo(() => {
    const nodeMap = new Map(nodes.map((node) => [node.id, node]))
    return sortedNodeIds.map((id) => nodeMap.get(id)).filter(Boolean) as GroupNode[]
  }, [nodes, sortedNodeIds])

  const sortedSubscriptions = useMemo(() => {
    const subscriptionMap = new Map(subscriptions.map((subscription) => [subscription.subscription.id, subscription]))
    return sortedSubscriptionIds.map((id) => subscriptionMap.get(id)).filter(Boolean) as GroupSubscription[]
  }, [subscriptions, sortedSubscriptionIds])

  const toggleSection = (section: 'node' | 'subscription') => {
    setExpandedSections((current) =>
      current.includes(section) ? current.filter((value) => value !== section) : [...current, section],
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <GroupDropZone
        droppableId={`${groupId}-nodes`}
        type="NODE"
        label={t('node')}
        count={nodes.length}
        collapsed={collapsed}
        open={effectiveExpandedSections.includes('node')}
        onOpen={onExpand}
        onToggle={() => toggleSection('node')}
        addButtonLabel={t('groupPicker.openNodePicker')}
        onAdd={onOpenAddNodes}
        emptyLabel={t('empty')}
      >
        {sortedNodes.map(({ id: nodeId, tag, name, protocol, address, subscriptionID }, index) => (
          <SortableResourceBadge
            key={nodeId}
            id={`${groupId}-node-${nodeId}`}
            index={index}
            name={tag || name}
            protocol={protocol}
            address={address}
            onRemove={() => onDelNode(nodeId)}
          >
            {subscriptionID && allSubscriptions?.find((subscription) => subscription.id === subscriptionID)?.tag}
          </SortableResourceBadge>
        ))}
      </GroupDropZone>

      <GroupDropZone
        droppableId={`${groupId}-subscriptions`}
        type="SUBSCRIPTION"
        label={t('groupPicker.subscriptionGroupLabel')}
        count={subscriptions.length}
        collapsed={collapsed}
        open={effectiveExpandedSections.includes('subscription')}
        onOpen={onExpand}
        onToggle={() => toggleSection('subscription')}
        addButtonLabel={t('groupPicker.openSubscriptionPicker')}
        onAdd={onOpenAddSubscriptions}
        emptyLabel={t('empty')}
      >
        {sortedSubscriptions.map(({ subscription, nameFilterRegex, matchedCount, matchedNodes }, index) => (
          <SortableResourceBadge
            key={subscription.id}
            id={`${groupId}-sub-${subscription.id}`}
            index={index}
            name={subscription.tag || subscription.link}
            meta={
              nameFilterRegex
                ? `${t('groupPicker.subscriptionPreviewMatchedCount', { count: matchedCount })} · /${nameFilterRegex}/`
                : t('groupPicker.subscriptionPreviewMatchedCount', { count: matchedCount })
            }
            onRemove={() => onDelSubscription(subscription.id)}
          >
            <div className="flex flex-col gap-1 text-xs">
              {nameFilterRegex && <span>{t('groupPicker.subscriptionRegexTooltip', { regex: nameFilterRegex })}</span>}
              <span>{t('groupPicker.subscriptionPreviewMatchedCount', { count: matchedCount })}</span>
              {matchedNodes.length > 0 && (
                <span className="opacity-80">
                  {matchedNodes.slice(0, 5).map((node) => node.name).join(', ')}
                  {matchedNodes.length > 5 && ` +${matchedNodes.length - 5}`}
                </span>
              )}
            </div>
          </SortableResourceBadge>
        ))}
      </GroupDropZone>
    </div>
  )
}
