import type { PlainTextFormModalRef } from '~/components/PlainTextFormModal'
import { useStore } from '@nanostores/react'
import { Route, Settings2 } from 'lucide-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useCreateDNSMutation,
  useDNSsQuery,
  useRemoveDNSMutation,
  useRenameDNSMutation,
  useSelectDNSMutation,
  useUpdateDNSMutation,
} from '~/apis'
import { PlainTextFormModal } from '~/components/PlainTextFormModal'
import { Section } from '~/components/Section'
import { SimpleCard } from '~/components/SimpleCard'
import { Button } from '~/components/ui/button'
import { SimpleTooltip } from '~/components/ui/tooltip'
import { useDisclosure } from '~/hooks'
import { defaultResourcesAtom } from '~/store'

export function DNS() {
  const { t } = useTranslation()

  const { defaultDNSID } = useStore(defaultResourcesAtom)
  const { data: dnssQuery } = useDNSsQuery()
  const selectDNSMutation = useSelectDNSMutation()
  const removeDNSMutation = useRemoveDNSMutation()
  const renameDNSMutation = useRenameDNSMutation()
  const createDNSMutation = useCreateDNSMutation()
  const updateDNSFormModalRef = useRef<PlainTextFormModalRef>(null)
  const updateDNSMutation = useUpdateDNSMutation()

  const [openedCreateDNSFormModal, { open: openCreateDNSFormModal, close: closeCreateDNSFormModal }] =
    useDisclosure(false)
  const [openedUpdateDNSFormModal, { open: openUpdateDNSFormModal, close: closeUpdateDNSFormModal }] =
    useDisclosure(false)

  return (
    <Section title={t('dns')} icon={<Route className="h-5 w-5" />} onCreate={openCreateDNSFormModal} bordered>
      {dnssQuery?.dnss.map((dns) => (
        <SimpleCard
          key={dns.id}
          name={dns.name}
          actions={
            <SimpleTooltip label={t('actions.settings')}>
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
                <Settings2 className="h-4 w-4" />
              </Button>
            </SimpleTooltip>
          }
          selected={dns.selected}
          onSelect={() => selectDNSMutation.mutate({ id: dns.id })}
          onRemove={dns.id !== defaultDNSID ? () => removeDNSMutation.mutate(dns.id) : undefined}
          onRename={(newName) => renameDNSMutation.mutate({ id: dns.id, name: newName })}
          onDuplicate={async () => {
            await createDNSMutation.mutateAsync({
              name: `${dns.name} (Copy)`,
              dns: dns.dns.string,
            })
          }}
        />
      ))}

      <PlainTextFormModal
        title={t('dns')}
        opened={openedCreateDNSFormModal}
        onClose={closeCreateDNSFormModal}
        configType="dns"
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
        configType="dns"
        handleSubmit={async (values) => {
          if (updateDNSFormModalRef.current) {
            await updateDNSMutation.mutateAsync({
              id: updateDNSFormModalRef.current.editingID,
              dns: values.text,
            })
          }
        }}
      />
    </Section>
  )
}
