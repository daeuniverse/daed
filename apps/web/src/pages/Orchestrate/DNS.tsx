import { useStore } from '@nanostores/react'
import { Route, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useCreateDNSMutation,
  useDNSsQuery,
  useRemoveDNSMutation,
  useRenameDNSMutation,
  useSelectDNSMutation,
  useUpdateDNSMutation,
} from '~/apis'
import { DNSFormModal } from '~/components/DNSFormModal'
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
  const updateDNSMutation = useUpdateDNSMutation()

  const [editingDNS, setEditingDNS] = useState<{ id: string; name: string; text: string } | null>(null)

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
                  setEditingDNS({
                    id: dns.id,
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

      <DNSFormModal
        title={t('dns')}
        opened={openedCreateDNSFormModal}
        onClose={closeCreateDNSFormModal}
        initialValues={{ name: '', text: '' }}
        handleSubmit={async (values) => {
          await createDNSMutation.mutateAsync({
            name: values.name,
            dns: values.text,
          })
        }}
      />

      <DNSFormModal
        title={t('dns')}
        opened={openedUpdateDNSFormModal}
        onClose={() => {
          setEditingDNS(null)
          closeUpdateDNSFormModal()
        }}
        initialValues={editingDNS ? { name: editingDNS.name, text: editingDNS.text } : undefined}
        handleSubmit={async (values) => {
          if (editingDNS) {
            if (editingDNS.name !== values.name) {
              await renameDNSMutation.mutateAsync({ id: editingDNS.id, name: values.name })
            }
            await updateDNSMutation.mutateAsync({
              id: editingDNS.id,
              dns: values.text,
            })
          }
        }}
      />
    </Section>
  )
}
