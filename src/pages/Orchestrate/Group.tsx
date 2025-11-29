import type { GroupFormModalRef } from '~/components/GroupFormModal'
import type { RenameFormModalRef } from '~/components/RenameFormModal'
import { useStore } from '@nanostores/react'
import { Pencil, Table2, Type } from 'lucide-react'

import { Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useGroupDelNodesMutation,
  useGroupDelSubscriptionsMutation,
  useGroupsQuery,
  useRemoveGroupMutation,
  useSubscriptionsQuery,
} from '~/apis'
import { DraggableResourceBadge } from '~/components/DraggableResourceBadge'
import { DroppableGroupCard } from '~/components/DroppableGroupCard'
import { GroupFormModal } from '~/components/GroupFormModal'
import { RenameFormModal } from '~/components/RenameFormModal'
import { Section } from '~/components/Section'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Button } from '~/components/ui/button'
import { DraggableResourceType, RuleType } from '~/constants'
import { useDisclosure } from '~/hooks'
import { defaultResourcesAtom } from '~/store'

export function GroupResource({ highlight }: { highlight?: boolean }) {
  const { t } = useTranslation()
  const { data: groupsQuery } = useGroupsQuery()
  const { defaultGroupID } = useStore(defaultResourcesAtom)
  const [openedRenameFormModal, { open: openRenameFormModal, close: closeRenameFormModal }] = useDisclosure(false)
  const [openedCreateGroupFormModal, { open: openCreateGroupFormModal, close: closeCreateGroupFormModal }] =
    useDisclosure(false)
  const [openedUpdateGroupFormModal, { open: openUpdateGroupFormModal, close: closeUpdateGroupFormModal }] =
    useDisclosure(false)
  const removeGroupMutation = useRemoveGroupMutation()
  const groupDelNodesMutation = useGroupDelNodesMutation()
  const groupDelSubscriptionsMutation = useGroupDelSubscriptionsMutation()
  const renameFormModalRef = useRef<RenameFormModalRef>(null)
  const updateGroupFormModalRef = useRef<GroupFormModalRef>(null)
  const { data: subscriptionsQuery } = useSubscriptionsQuery()

  return (
    <Section
      title={t('group')}
      icon={<Table2 className="h-5 w-5" />}
      onCreate={openCreateGroupFormModal}
      highlight={highlight}
      bordered
    >
      {groupsQuery?.groups.map(
        ({ id: groupId, name, policy, nodes: groupNodes, subscriptions: groupSubscriptions }) => (
          <DroppableGroupCard
            key={groupId}
            id={groupId}
            name={name}
            onRemove={defaultGroupID !== groupId ? () => removeGroupMutation.mutate(groupId) : undefined}
            actions={
              <Fragment>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    if (renameFormModalRef.current) {
                      renameFormModalRef.current.setProps({
                        id: groupId,
                        type: RuleType.group,
                        oldName: name,
                      })
                    }

                    openRenameFormModal()
                  }}
                >
                  <Type className="h-4 w-4" />
                </Button>

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
                  <Pencil className="h-4 w-4" />
                </Button>
              </Fragment>
            }
          >
            <p className="text-sm font-semibold">{policy}</p>

            <div className="h-2.5" />

            <Accordion type="multiple" className="w-full">
              {groupNodes.length > 0 && (
                <AccordionItem value="node">
                  <AccordionTrigger className="text-xs px-2 py-2">
                    {t('node')} ({groupNodes.length})
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2">
                      {groupNodes.map(({ id: nodeId, tag, name, subscriptionID }) => (
                        <DraggableResourceBadge
                          key={nodeId}
                          id={`${groupId}-${nodeId}`}
                          nodeID={nodeId}
                          groupID={groupId}
                          type={DraggableResourceType.groupNode}
                          name={tag || name}
                          onRemove={() =>
                            groupDelNodesMutation.mutate({
                              id: groupId,
                              nodeIDs: [nodeId],
                            })
                          }
                        >
                          {subscriptionID &&
                            subscriptionsQuery?.subscriptions.find((s) => s.id === subscriptionID)?.tag}
                        </DraggableResourceBadge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {groupSubscriptions.length > 0 && (
                <AccordionItem value="subscription">
                  <AccordionTrigger className="text-xs px-2 py-2">
                    {t('subscription')} ({groupSubscriptions.length})
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2">
                      {groupSubscriptions.map(({ id: subscriptionId, tag, link }) => (
                        <DraggableResourceBadge
                          key={subscriptionId}
                          id={`${groupId}-${subscriptionId}`}
                          groupID={groupId}
                          subscriptionID={subscriptionId}
                          type={DraggableResourceType.groupSubscription}
                          name={tag || link}
                          onRemove={() =>
                            groupDelSubscriptionsMutation.mutate({
                              id: groupId,
                              subscriptionIDs: [subscriptionId],
                            })
                          }
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </DroppableGroupCard>
        ),
      )}

      <GroupFormModal opened={openedCreateGroupFormModal} onClose={closeCreateGroupFormModal} />
      <GroupFormModal
        ref={updateGroupFormModalRef}
        opened={openedUpdateGroupFormModal}
        onClose={closeUpdateGroupFormModal}
      />

      <RenameFormModal ref={renameFormModalRef} opened={openedRenameFormModal} onClose={closeRenameFormModal} />
    </Section>
  )
}
