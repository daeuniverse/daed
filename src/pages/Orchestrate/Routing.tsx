import { ActionIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Prism } from '@mantine/prism'
import { useStore } from '@nanostores/react'
import { IconEdit, IconForms, IconMap } from '@tabler/icons-react'
import { Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import {
  useCreateRoutingMutation,
  useRemoveRoutingMutation,
  useRoutingsQuery,
  useSelectRoutingMutation,
  useUpdateRoutingMutation,
} from '~/apis'
import { PlainTextFormModal, PlainTextgFormModalRef } from '~/components/PlainTextFormModal'
import { RenameFormModal, RenameFormModalRef } from '~/components/RenameFormModal'
import { Section } from '~/components/Section'
import { SimpleCard } from '~/components/SimpleCard'
import { RuleType } from '~/constants'
import { defaultResourcesAtom } from '~/store'

export const Routing = () => {
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
    <Section title={t('routing')} icon={<IconMap />} onCreate={openCreateRoutingFormModal}>
      {routingsQuery?.routings.map((routing) => (
        <SimpleCard
          key={routing.id}
          name={routing.name}
          actions={
            <Fragment>
              <ActionIcon
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
                <IconForms />
              </ActionIcon>

              <ActionIcon
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
                <IconEdit />
              </ActionIcon>
            </Fragment>
          }
          selected={routing.selected}
          onSelect={() => selectRoutingMutation.mutate({ id: routing.id })}
          onRemove={routing.id !== defaultRoutingID ? () => removeRoutingMutation.mutate(routing.id) : undefined}
        >
          <Prism language="bash">{routing.routing.string}</Prism>
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
