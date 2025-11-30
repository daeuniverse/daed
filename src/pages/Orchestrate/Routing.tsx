import type { PlainTextFormModalRef } from '~/components/PlainTextFormModal'
import type { RoutingsQuery } from '~/schemas/gql/graphql'
import { useStore } from '@nanostores/react'
import { Map, Settings2 } from 'lucide-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useCreateRoutingMutation,
  useRemoveRoutingMutation,
  useRenameRoutingMutation,
  useRoutingsQuery,
  useSelectRoutingMutation,
  useUpdateRoutingMutation,
} from '~/apis'
import { PlainTextFormModal } from '~/components/PlainTextFormModal'
import { Section } from '~/components/Section'
import { SimpleCard } from '~/components/SimpleCard'
import { Button } from '~/components/ui/button'
import { useDisclosure } from '~/hooks'
import { defaultResourcesAtom } from '~/store'

export function Routing() {
  const { t } = useTranslation()
  const { defaultRoutingID } = useStore(defaultResourcesAtom)
  const { data: routingsQuery } = useRoutingsQuery()
  const selectRoutingMutation = useSelectRoutingMutation()
  const removeRoutingMutation = useRemoveRoutingMutation()
  const renameRoutingMutation = useRenameRoutingMutation()
  const createRoutingMutation = useCreateRoutingMutation()
  const updateRoutingFormModalRef = useRef<PlainTextFormModalRef>(null)
  const updateRoutingMutation = useUpdateRoutingMutation()

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
          }
          selected={routing.selected}
          onSelect={() => selectRoutingMutation.mutate({ id: routing.id })}
          onRemove={routing.id !== defaultRoutingID ? () => removeRoutingMutation.mutate(routing.id) : undefined}
          onRename={(newName) => renameRoutingMutation.mutate({ id: routing.id, name: newName })}
        />
      ))}

      <PlainTextFormModal
        title={t('routing')}
        opened={openedCreateRoutingFormModal}
        onClose={closeCreateRoutingFormModal}
        handleSubmit={async (values) => {
          await createRoutingMutation.mutateAsync({
            name: values.name,
            routing: values.text,
          })
        }}
      />

      <PlainTextFormModal
        ref={updateRoutingFormModalRef}
        title={t('routing')}
        opened={openedUpdateRoutingFormModal}
        onClose={closeUpdateRoutingFormModal}
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
