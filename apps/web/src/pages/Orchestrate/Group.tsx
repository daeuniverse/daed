import type { GroupFormModalRef } from '~/components/GroupFormModal'
import type { DraggingResource } from '~/constants'
import type { GroupsQuery } from '~/schemas/gql/graphql'
import { useStore } from '@nanostores/react'
import { ListPlus, Settings2, Table2 } from 'lucide-react'

import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useGroupAddNodesMutation,
  useGroupDelNodesMutation,
  useGroupDelSubscriptionsMutation,
  useGroupsQuery,
  useRemoveGroupMutation,
  useRenameGroupMutation,
  useSubscriptionsQuery,
} from '~/apis'
import { BatchAddNodesModal } from '~/components/BatchAddNodesModal'
import { DroppableGroupCard } from '~/components/DroppableGroupCard'
import { GroupFormModal } from '~/components/GroupFormModal'
import { Section } from '~/components/Section'
import { SortableGroupContent } from '~/components/SortableGroupContent'
import { Button } from '~/components/ui/button'
import { SimpleTooltip } from '~/components/ui/tooltip'
import { DraggableResourceType } from '~/constants'
import { useDisclosure } from '~/hooks'
import { defaultResourcesAtom } from '~/store'

export function GroupResource({
  highlight,
  draggingResource,
}: {
  highlight?: boolean
  draggingResource?: DraggingResource | null
}) {
  const { t } = useTranslation()
  const { data: groupsQuery } = useGroupsQuery()
  const { defaultGroupID } = useStore(defaultResourcesAtom)
  const [openedCreateGroupFormModal, { open: openCreateGroupFormModal, close: closeCreateGroupFormModal }] =
    useDisclosure(false)
  const [openedUpdateGroupFormModal, { open: openUpdateGroupFormModal, close: closeUpdateGroupFormModal }] =
    useDisclosure(false)
  const removeGroupMutation = useRemoveGroupMutation()
  const renameGroupMutation = useRenameGroupMutation()
  const groupDelNodesMutation = useGroupDelNodesMutation()
  const groupDelSubscriptionsMutation = useGroupDelSubscriptionsMutation()
  const groupAddNodesMutation = useGroupAddNodesMutation()
  const updateGroupFormModalRef = useRef<GroupFormModalRef>(null)
  const { data: subscriptionsQuery } = useSubscriptionsQuery()
  const [batchAddGroupId, setBatchAddGroupId] = useState<string | null>(null)

  // Determine which accordion sections should be auto-expanded based on drag type
  const autoExpandValue = useMemo(() => {
    if (!draggingResource) return undefined

    const { type } = draggingResource
    if (
      type === DraggableResourceType.node ||
      type === DraggableResourceType.groupNode ||
      type === DraggableResourceType.subscription_node
    ) {
      return 'node'
    }
    if (type === DraggableResourceType.subscription || type === DraggableResourceType.groupSubscription) {
      return 'subscription'
    }
    return undefined
  }, [draggingResource])

  return (
    <Section
      title={t('group')}
      icon={<Table2 className="h-5 w-5" />}
      onCreate={openCreateGroupFormModal}
      highlight={highlight}
      bordered
    >
      {groupsQuery?.groups.map(
        ({
          id: groupId,
          name,
          policy,
          nodes: groupNodes,
          subscriptions: groupSubscriptions,
        }: GroupsQuery['groups'][number]) => (
          <DroppableGroupCard
            key={groupId}
            id={groupId}
            name={name}
            onRemove={defaultGroupID !== groupId ? () => removeGroupMutation.mutate(groupId) : undefined}
            onRename={(newName) => renameGroupMutation.mutate({ id: groupId, name: newName })}
            actions={
              <>
                <SimpleTooltip label={t('batchAddNodes.title')}>
                  <Button variant="ghost" size="xs" onClick={() => setBatchAddGroupId(groupId)}>
                    <ListPlus className="h-4 w-4" />
                  </Button>
                </SimpleTooltip>

                <SimpleTooltip label={t('actions.settings')}>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      updateGroupFormModalRef.current?.setEditingID(groupId)

                      updateGroupFormModalRef.current?.initOrigins({
                        name,
                        policy,
                      })

                      openUpdateGroupFormModal()
                    }}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </SimpleTooltip>
              </>
            }
          >
            <p className="text-sm font-semibold">{policy}</p>

            <div className="h-2.5" />

            <SortableGroupContent
              groupId={groupId}
              nodes={groupNodes}
              subscriptions={groupSubscriptions}
              allSubscriptions={subscriptionsQuery?.subscriptions}
              autoExpandValue={autoExpandValue}
              onDelNode={(nodeId) =>
                groupDelNodesMutation.mutate({
                  id: groupId,
                  nodeIDs: [nodeId],
                })
              }
              onDelSubscription={(subscriptionId) =>
                groupDelSubscriptionsMutation.mutate({
                  id: groupId,
                  subscriptionIDs: [subscriptionId],
                })
              }
            />
          </DroppableGroupCard>
        ),
      )}

      <GroupFormModal opened={openedCreateGroupFormModal} onClose={closeCreateGroupFormModal} />
      <GroupFormModal
        ref={updateGroupFormModalRef}
        opened={openedUpdateGroupFormModal}
        onClose={closeUpdateGroupFormModal}
      />

      <BatchAddNodesModal
        opened={batchAddGroupId !== null}
        onClose={() => setBatchAddGroupId(null)}
        existingNodeIDs={groupsQuery?.groups.find((g) => g.id === batchAddGroupId)?.nodes.map((n) => n.id) ?? []}
        onSubmit={(nodeIDs) => {
          if (batchAddGroupId) {
            groupAddNodesMutation.mutate({ id: batchAddGroupId, nodeIDs })
          }
        }}
        onRemove={(nodeIDs) => {
          if (batchAddGroupId) {
            groupDelNodesMutation.mutate({ id: batchAddGroupId, nodeIDs })
          }
        }}
      />
    </Section>
  )
}
