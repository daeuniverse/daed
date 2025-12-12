import type { RoutingFormModalRef } from '~/components/RoutingFormModal'
import type { RoutingsQuery } from '~/schemas/gql/graphql'
import { useStore } from '@nanostores/react'
import { Map, Settings2 } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useCreateRoutingMutation,
  useGroupsQuery,
  useRemoveRoutingMutation,
  useRenameRoutingMutation,
  useRoutingsQuery,
  useSelectRoutingMutation,
  useUpdateRoutingMutation,
} from '~/apis'
import { RoutingFormModal } from '~/components/RoutingFormModal'
import { Section } from '~/components/Section'
import { SimpleCard } from '~/components/SimpleCard'
import { Button } from '~/components/ui/button'
import { SimpleTooltip } from '~/components/ui/tooltip'
import { DEFAULT_GROUP_NAME } from '~/constants/default'
import { useDisclosure } from '~/hooks'
import { createGroupCompletionItems, setDynamicCompletionItems } from '~/monaco'
import { defaultResourcesAtom } from '~/store'

export function Routing() {
  const { t } = useTranslation()
  const { defaultRoutingID, defaultGroupID } = useStore(defaultResourcesAtom)
  const { data: routingsQuery } = useRoutingsQuery()
  const { data: groupsQuery } = useGroupsQuery()
  const selectRoutingMutation = useSelectRoutingMutation()
  const removeRoutingMutation = useRemoveRoutingMutation()
  const renameRoutingMutation = useRenameRoutingMutation()
  const createRoutingMutation = useCreateRoutingMutation()
  const updateRoutingFormModalRef = useRef<RoutingFormModalRef>(null)
  const updateRoutingMutation = useUpdateRoutingMutation()

  // Set dynamic completion items for routingA when groups change
  useEffect(() => {
    if (groupsQuery?.groups) {
      const groupNames = groupsQuery.groups.map((group) => group.name)
      const completionItems = createGroupCompletionItems(groupNames)
      setDynamicCompletionItems(completionItems)
    }
  }, [groupsQuery?.groups])

  const proxyGroupName = useMemo(() => {
    const defaultGroup = groupsQuery?.groups?.find((g) => g.id === defaultGroupID)
    return defaultGroup?.name || DEFAULT_GROUP_NAME
  }, [groupsQuery?.groups, defaultGroupID])

  const [openedCreateRoutingFormModal, { open: openCreateRoutingFormModal, close: closeCreateRoutingFormModal }] =
    useDisclosure(false)
  const [openedUpdateRoutingFormModal, { open: openUpdateRoutingFormModal, close: closeUpdateRoutingFormModal }] =
    useDisclosure(false)

  return (
    <Section title={t('routing')} icon={<Map className="h-5 w-5" />} onCreate={openCreateRoutingFormModal} bordered>
      {routingsQuery?.routings.map((routing: RoutingsQuery['routings'][number]) => (
        <SimpleCard
          key={routing.id}
          name={routing.name}
          actions={
            <SimpleTooltip label={t('actions.settings')}>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  updateRoutingFormModalRef.current?.setEditingID(routing.id)

                  updateRoutingFormModalRef.current?.initOrigins({
                    name: routing.name,
                    text: routing.routing.string,
                  })

                  openUpdateRoutingFormModal()
                }}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </SimpleTooltip>
          }
          selected={routing.selected}
          onSelect={() => selectRoutingMutation.mutate({ id: routing.id })}
          onRemove={routing.id !== defaultRoutingID ? () => removeRoutingMutation.mutate(routing.id) : undefined}
          onRename={(newName) => renameRoutingMutation.mutate({ id: routing.id, name: newName })}
          onDuplicate={async () => {
            await createRoutingMutation.mutateAsync({
              name: `${routing.name} (Copy)`,
              routing: routing.routing.string,
            })
          }}
        />
      ))}

      <RoutingFormModal
        title={t('routing')}
        opened={openedCreateRoutingFormModal}
        onClose={closeCreateRoutingFormModal}
        configType="routing"
        proxyGroupName={proxyGroupName}
        handleSubmit={async (values) => {
          await createRoutingMutation.mutateAsync({
            name: values.name,
            routing: values.text,
          })
        }}
      />

      <RoutingFormModal
        ref={updateRoutingFormModalRef}
        title={t('routing')}
        opened={openedUpdateRoutingFormModal}
        onClose={closeUpdateRoutingFormModal}
        configType="routing"
        proxyGroupName={proxyGroupName}
        handleSubmit={async (values) => {
          if (updateRoutingFormModalRef.current) {
            await updateRoutingMutation.mutateAsync({
              id: updateRoutingFormModalRef.current.editingID,
              routing: values.text,
            })
          }
        }}
      />
    </Section>
  )
}
