import { Accordion, ActionIcon, SimpleGrid, Space, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useStore } from '@nanostores/react'
import { IconEdit, IconForms, IconTable } from '@tabler/icons-react'
import { Fragment, useRef, useState } from 'react'
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
import { GroupFormModal, GroupFormModalRef } from '~/components/GroupFormModal'
import { RenameFormModal, RenameFormModalRef } from '~/components/RenameFormModal'
import { Section } from '~/components/Section'
import { DraggableResourceType, RuleType } from '~/constants'
import { defaultResourcesAtom } from '~/store'

export const GroupResource = ({ highlight }: { highlight?: boolean }) => {
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
  const [droppableGroupCardAccordionValues, setDroppableGroupCardAccordionValues] = useState<string[]>([])
  const renameFormModalRef = useRef<RenameFormModalRef>(null)
  const updateGroupFormModalRef = useRef<GroupFormModalRef>(null)
  const { data: subscriptionsQuery } = useSubscriptionsQuery()

  return (
    <Section title={t('group')} icon={<IconTable />} onCreate={openCreateGroupFormModal} highlight={highlight} bordered>
      {groupsQuery?.groups.map(
        ({ id: groupId, name, policy, nodes: groupNodes, subscriptions: groupSubscriptions }) => (
          <DroppableGroupCard
            key={groupId}
            id={groupId}
            name={name}
            onRemove={defaultGroupID !== groupId ? () => removeGroupMutation.mutate(groupId) : undefined}
            actions={
              <Fragment>
                <ActionIcon
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
                  <IconForms />
                </ActionIcon>

                <ActionIcon
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
                  <IconEdit />
                </ActionIcon>
              </Fragment>
            }
          >
            <Text fz="sm" fw={600}>
              {policy}
            </Text>

            <Space h={10} />

            <Accordion
              variant="filled"
              value={droppableGroupCardAccordionValues}
              onChange={setDroppableGroupCardAccordionValues}
              multiple
            >
              {groupNodes.length > 0 && (
                <Accordion.Item value="node">
                  <Accordion.Control fz="xs" px="xs">
                    {t('node')} ({groupNodes.length})
                  </Accordion.Control>

                  <Accordion.Panel>
                    <SimpleGrid cols={2}>
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
                    </SimpleGrid>
                  </Accordion.Panel>
                </Accordion.Item>
              )}

              {groupSubscriptions.length > 0 && (
                <Accordion.Item value="subscription">
                  <Accordion.Control fz="xs" px="xs">
                    {t('subscription')} ({groupSubscriptions.length})
                  </Accordion.Control>

                  <Accordion.Panel>
                    <SimpleGrid cols={2}>
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
                    </SimpleGrid>
                  </Accordion.Panel>
                </Accordion.Item>
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
