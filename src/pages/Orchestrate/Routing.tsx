import type { PlainTextgFormModalRef } from '~/components/PlainTextFormModal'
import type { RenameFormModalRef } from '~/components/RenameFormModal'
import { useStore } from '@nanostores/react'
import { Map, Pencil, Type } from 'lucide-react'

import { Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useCreateRoutingMutation,
  useRemoveRoutingMutation,
  useRoutingsQuery,
  useSelectRoutingMutation,
  useUpdateRoutingMutation,
} from '~/apis'
import { PlainTextFormModal } from '~/components/PlainTextFormModal'
import { RenameFormModal } from '~/components/RenameFormModal'
import { Section } from '~/components/Section'
import { SimpleCard } from '~/components/SimpleCard'
import { Button } from '~/components/ui/button'
import { Code } from '~/components/ui/code'
import { RuleType } from '~/constants'
import { useDisclosure } from '~/hooks'
import { defaultResourcesAtom } from '~/store'

export function Routing() {
  const { t } = useTranslation()
  const { defaultRoutingID } = useStore(defaultResourcesAtom)
  const { data: routingsQuery } = useRoutingsQuery()
  const selectRoutingMutation = useSelectRoutingMutation()
  const removeRoutingMutation = useRemoveRoutingMutation()
  const createRoutingMutation = useCreateRoutingMutation()
  const updateRoutingFormModalRef = useRef<PlainTextgFormModalRef>(null)
  const updateRoutingMutation = useUpdateRoutingMutation()

  const renameFormModalRef = useRef<RenameFormModalRef>(null)
  const [openedRenameFormModal, { open: openRenameFormModal, close: closeRenameFormModal }] = useDisclosure(false)
  const [openedCreateRoutingFormModal, { open: openCreateRoutingFormModal, close: closeCreateRoutingFormModal }] =
    useDisclosure(false)
  const [openedUpdateRoutingFormModal, { open: openUpdateRoutingFormModal, close: closeUpdateRoutingFormModal }] =
    useDisclosure(false)

  return (
    <Section title={t('routing')} icon={<Map className="h-5 w-5" />} onCreate={openCreateRoutingFormModal} bordered>
      {routingsQuery?.routings.map((routing) => (
        <SimpleCard
          key={routing.id}
          name={routing.name}
          actions={
            <Fragment>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  if (renameFormModalRef.current) {
                    renameFormModalRef.current.setProps({
                      id: routing.id,
                      type: RuleType.routing,
                      oldName: routing.name,
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
                  updateRoutingFormModalRef.current?.setEditingID(routing.id)

                  updateRoutingFormModalRef.current?.initOrigins({
                    name: routing.name,
                    text: routing.routing.string,
                  })

                  openUpdateRoutingFormModal()
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </Fragment>
          }
          selected={routing.selected}
          onSelect={() => selectRoutingMutation.mutate({ id: routing.id })}
          onRemove={routing.id !== defaultRoutingID ? () => removeRoutingMutation.mutate(routing.id) : undefined}
        >
          <Code block>{routing.routing.string}</Code>
        </SimpleCard>
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

      <RenameFormModal ref={renameFormModalRef} opened={openedRenameFormModal} onClose={closeRenameFormModal} />
    </Section>
  )
}
