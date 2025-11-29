import type { PlainTextgFormModalRef } from '~/components/PlainTextFormModal'
import type { RenameFormModalRef } from '~/components/RenameFormModal'
import { useStore } from '@nanostores/react'
import { Pencil, Route, Type } from 'lucide-react'

import { Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useCreateDNSMutation,
  useDNSsQuery,
  useRemoveDNSMutation,
  useSelectDNSMutation,
  useUpdateDNSMutation,
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

export function DNS() {
  const { t } = useTranslation()

  const { defaultDNSID } = useStore(defaultResourcesAtom)
  const { data: dnssQuery } = useDNSsQuery()
  const selectDNSMutation = useSelectDNSMutation()
  const removeDNSMutation = useRemoveDNSMutation()
  const createDNSMutation = useCreateDNSMutation()
  const updateDNSFormModalRef = useRef<PlainTextgFormModalRef>(null)
  const updateDNSMutation = useUpdateDNSMutation()

  const renameFormModalRef = useRef<RenameFormModalRef>(null)
  const [openedRenameFormModal, { open: openRenameFormModal, close: closeRenameFormModal }] = useDisclosure(false)
  const [openedCreateDNSFormModal, { open: openCreateDNSFormModal, close: closeCreateDNSFormModal }]
    = useDisclosure(false)
  const [openedUpdateDNSFormModal, { open: openUpdateDNSFormModal, close: closeUpdateDNSFormModal }]
    = useDisclosure(false)

  return (
    <Section title={t('dns')} icon={<Route className="h-5 w-5" />} onCreate={openCreateDNSFormModal} bordered>
      {dnssQuery?.dnss.map(dns => (
        <SimpleCard
          key={dns.id}
          name={dns.name}
          actions={(
            <Fragment>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  if (renameFormModalRef.current) {
                    renameFormModalRef.current.setProps({
                      id: dns.id,
                      type: RuleType.dns,
                      oldName: dns.name,
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
                  updateDNSFormModalRef.current?.setEditingID(dns.id)

                  updateDNSFormModalRef.current?.initOrigins({
                    name: dns.name,
                    text: dns.dns.string,
                  })

                  openUpdateDNSFormModal()
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </Fragment>
          )}
          selected={dns.selected}
          onSelect={() => selectDNSMutation.mutate({ id: dns.id })}
          onRemove={dns.id !== defaultDNSID ? () => removeDNSMutation.mutate(dns.id) : undefined}
        >
          <Code block>{dns.dns.string}</Code>
        </SimpleCard>
      ))}

      <PlainTextFormModal
        title={t('dns')}
        opened={openedCreateDNSFormModal}
        onClose={closeCreateDNSFormModal}
        handleSubmit={async (values) => {
          await createDNSMutation.mutateAsync({
            name: values.name,
            dns: values.text,
          })
        }}
      />

      <PlainTextFormModal
        ref={updateDNSFormModalRef}
        title={t('dns')}
        opened={openedUpdateDNSFormModal}
        onClose={closeUpdateDNSFormModal}
        handleSubmit={async (values) => {
          if (updateDNSFormModalRef.current) {
            await updateDNSMutation.mutateAsync({
              id: updateDNSFormModalRef.current.editingID,
              dns: values.text,
            })
          }
        }}
      />

      <RenameFormModal ref={renameFormModalRef} opened={openedRenameFormModal} onClose={closeRenameFormModal} />
    </Section>
  )
}
