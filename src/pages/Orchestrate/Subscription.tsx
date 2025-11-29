import type { QRCodeModalRef } from '~/components/QRCodeModal'
import type { SubscriptionsQuery } from '~/schemas/gql/graphql'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import dayjs from 'dayjs'
import { CloudCog, CloudUpload, Download, Eye, Pencil } from 'lucide-react'
import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useImportSubscriptionsMutation,
  useRemoveSubscriptionsMutation,
  useSubscriptionsQuery,
  useUpdateSubscriptionsMutation,
} from '~/apis'
import { DraggableResourceBadge } from '~/components/DraggableResourceBadge'
import { EditSubscriptionFormModal } from '~/components/EditSubscriptionFormModal'
import { ImportResourceFormModal } from '~/components/ImportResourceFormModal'
import { QRCodeModal } from '~/components/QRCodeModal'
import { Section } from '~/components/Section'
import { SortableSubscriptionCard } from '~/components/SortableSubscriptionCard'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Button } from '~/components/ui/button'
import { UpdateSubscriptionAction } from '~/components/UpdateSubscriptionAction'
import { DraggableResourceType } from '~/constants'
import { useDisclosure } from '~/hooks'

export function SubscriptionResource({
  sortedSubscriptions,
}: {
  sortedSubscriptions: SubscriptionsQuery['subscriptions']
}) {
  const { t } = useTranslation()

  const [openedQRCodeModal, { open: openQRCodeModal, close: closeQRCodeModal }] = useDisclosure(false)
  const [
    openedImportSubscriptionFormModal,
    { open: openImportSubscriptionFormModal, close: closeImportSubscriptionFormModal },
  ] = useDisclosure(false)
  const [
    openedEditSubscriptionFormModal,
    { open: openEditSubscriptionFormModal, close: closeEditSubscriptionFormModal },
  ] = useDisclosure(false)
  const [editingSubscription, setEditingSubscription] = useState<{
    id: string
    link: string
    tag: string
  }>()
  const qrCodeModalRef = useRef<QRCodeModalRef>(null)
  const { refetch: refetchSubscriptions } = useSubscriptionsQuery()
  const removeSubscriptionsMutation = useRemoveSubscriptionsMutation()
  const importSubscriptionsMutation = useImportSubscriptionsMutation()
  const updateSubscriptionsMutation = useUpdateSubscriptionsMutation()

  const subscriptionIds = sortedSubscriptions.map((s) => `subscription-${s.id}`)

  return (
    <Section
      title={t('subscription')}
      icon={<CloudCog className="h-5 w-5" />}
      iconPlus={<CloudUpload className="h-4 w-4" />}
      onCreate={openImportSubscriptionFormModal}
      bordered
      actions={
        sortedSubscriptions.length > 2 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              updateSubscriptionsMutation.mutate(sortedSubscriptions.map(({ id }) => id))
            }}
            loading={updateSubscriptionsMutation.isPending}
          >
            <Download className="h-4 w-4" />
          </Button>
        )
      }
    >
      <SortableContext items={subscriptionIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {sortedSubscriptions.map(({ id: subscriptionID, tag, link, updatedAt, nodes }) => (
            <SortableSubscriptionCard
              key={subscriptionID}
              id={`subscription-${subscriptionID}`}
              subscriptionID={subscriptionID}
              type={DraggableResourceType.subscription}
              name={tag || link}
              leftSection={`${nodes.edges.length} ${t('node')}`}
              actions={
                <Fragment>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setEditingSubscription({
                        id: subscriptionID,
                        link,
                        tag: tag || '',
                      })
                      openEditSubscriptionFormModal()
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      qrCodeModalRef.current?.setProps({
                        name: tag!,
                        link,
                      })
                      openQRCodeModal()
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <UpdateSubscriptionAction id={subscriptionID} loading={updateSubscriptionsMutation.isPending} />
                </Fragment>
              }
              onRemove={() => removeSubscriptionsMutation.mutate([subscriptionID])}
            >
              <p className="text-xs opacity-70">{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</p>

              <Spoiler label={link} showLabel={t('actions.show content')} hideLabel={t('actions.hide')} />

              <Accordion type="single" collapsible className="w-full mt-2">
                <AccordionItem value="node" className="border-none">
                  <AccordionTrigger className="text-xs py-1 hover:no-underline">
                    {t('actions.show content')}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {nodes.edges.map(({ id, name }) => (
                        <DraggableResourceBadge
                          key={id}
                          name={name}
                          id={`subscription-node-${id}`}
                          nodeID={id}
                          type={DraggableResourceType.subscription_node}
                          subscriptionID={subscriptionID}
                        >
                          {name}
                        </DraggableResourceBadge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SortableSubscriptionCard>
          ))}
        </div>
      </SortableContext>

      <QRCodeModal ref={qrCodeModalRef} opened={openedQRCodeModal} onClose={closeQRCodeModal} />

      <ImportResourceFormModal
        title={t('subscription')}
        opened={openedImportSubscriptionFormModal}
        onClose={closeImportSubscriptionFormModal}
        handleSubmit={async (values) => {
          await importSubscriptionsMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
        }}
      />

      <EditSubscriptionFormModal
        opened={openedEditSubscriptionFormModal}
        onClose={closeEditSubscriptionFormModal}
        subscription={editingSubscription}
        onSubmit={async (values) => {
          // Remove the old subscription and re-import with new URL
          await removeSubscriptionsMutation.mutateAsync([values.id])
          await importSubscriptionsMutation.mutateAsync([{ link: values.link, tag: values.tag }])
          await refetchSubscriptions()
          closeEditSubscriptionFormModal()
        }}
      />
    </Section>
  )
}

function Spoiler({ label, showLabel, hideLabel }: { label: string; showLabel: string; hideLabel: string }) {
  const [show, setShow] = useState(false)

  return (
    <div>
      {show && <p className="text-sm break-all">{label}</p>}
      <button type="button" className="text-xs text-primary hover:underline" onClick={() => setShow(!show)}>
        {show ? hideLabel : showLabel}
      </button>
    </div>
  )
}
