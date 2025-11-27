import { CloudCog, CloudUpload, Download, Eye } from 'lucide-react'
import dayjs from 'dayjs'
import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  useImportSubscriptionsMutation,
  useRemoveSubscriptionsMutation,
  useSubscriptionsQuery,
  useUpdateSubscriptionsMutation,
} from '~/apis'
import { DraggableResourceBadge } from '~/components/DraggableResourceBadge'
import { DraggableResourceCard } from '~/components/DraggableResourceCard'
import { ImportResourceFormModal } from '~/components/ImportResourceFormModal'
import { QRCodeModal, QRCodeModalRef } from '~/components/QRCodeModal'
import { Section } from '~/components/Section'
import { UpdateSubscriptionAction } from '~/components/UpdateSubscriptionAction'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Button } from '~/components/ui/button'
import { DraggableResourceType } from '~/constants'
import { useDisclosure } from '~/hooks'

export const SubscriptionResource = () => {
  const { t } = useTranslation()

  const [openedQRCodeModal, { open: openQRCodeModal, close: closeQRCodeModal }] = useDisclosure(false)
  const [
    openedImportSubscriptionFormModal,
    { open: openImportSubscriptionFormModal, close: closeImportSubscriptionFormModal },
  ] = useDisclosure(false)
  const qrCodeModalRef = useRef<QRCodeModalRef>(null)
  const { data: subscriptionsQuery } = useSubscriptionsQuery()
  const removeSubscriptionsMutation = useRemoveSubscriptionsMutation()
  const importSubscriptionsMutation = useImportSubscriptionsMutation()
  const updateSubscriptionsMutation = useUpdateSubscriptionsMutation()

  return (
    <Section
      title={t('subscription')}
      icon={<CloudCog className="h-5 w-5" />}
      iconPlus={<CloudUpload className="h-4 w-4" />}
      onCreate={openImportSubscriptionFormModal}
      bordered
      actions={
        subscriptionsQuery?.subscriptions &&
        subscriptionsQuery.subscriptions.length > 2 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              updateSubscriptionsMutation.mutate(subscriptionsQuery?.subscriptions.map(({ id }) => id) || [])
            }}
            loading={updateSubscriptionsMutation.isLoading}
          >
            <Download className="h-4 w-4" />
          </Button>
        )
      }
    >
      {subscriptionsQuery?.subscriptions.map(({ id: subscriptionID, tag, link, updatedAt, nodes }) => (
        <DraggableResourceCard
          key={subscriptionID}
          id={`subscription-${subscriptionID}`}
          subscriptionID={subscriptionID}
          type={DraggableResourceType.subscription}
          name={tag || link}
          actions={
            <Fragment>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  qrCodeModalRef.current?.setProps({
                    name: tag!,
                    link,
                  })
                  openQRCodeModal()
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <UpdateSubscriptionAction id={subscriptionID} loading={updateSubscriptionsMutation.isLoading} />
            </Fragment>
          }
          onRemove={() => removeSubscriptionsMutation.mutate([subscriptionID])}
        >
          <p className="font-semibold">{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</p>

          <Spoiler label={link} showLabel={t('actions.show content')} hideLabel={t('actions.hide')} />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="node">
              <AccordionTrigger className="text-xs px-2 py-2">
                {t('node')} ({nodes.edges.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
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
        </DraggableResourceCard>
      ))}

      <QRCodeModal ref={qrCodeModalRef} opened={openedQRCodeModal} onClose={closeQRCodeModal} />

      <ImportResourceFormModal
        title={t('subscription')}
        opened={openedImportSubscriptionFormModal}
        onClose={closeImportSubscriptionFormModal}
        handleSubmit={async (values) => {
          await importSubscriptionsMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
        }}
      />
    </Section>
  )
}

const Spoiler = ({ label, showLabel, hideLabel }: { label: string; showLabel: string; hideLabel: string }) => {
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
