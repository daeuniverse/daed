import type { GroupFormModalRef } from '~/components/GroupFormModal'
import type { DraggingResource } from '~/constants'
import type { GroupsQuery } from '~/schemas/gql/graphql'
import { useStore } from '@nanostores/react'
import { Settings2, Table2 } from 'lucide-react'

import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useGroupDelNodesMutation,
  useGroupDelSubscriptionsMutation,
  useGroupsQuery,
  useRemoveGroupMutation,
  useRenameGroupMutation,
  useSubscriptionsQuery,
} from '~/apis'
import { DroppableGroupCard } from '~/components/DroppableGroupCard'
import { GroupFormModal } from '~/components/GroupFormModal'
import { Section } from '~/components/Section'
import { SortableGroupContent } from '~/components/SortableGroupContent'
import { Button } from '~/components/ui/button'
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
  const updateGroupFormModalRef = useRef<GroupFormModalRef>(null)
  const { data: subscriptionsQuery } = useSubscriptionsQuery()

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
    </Section>
  )
}
