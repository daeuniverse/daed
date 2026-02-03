import type { QRCodeModalRef } from '~/components/QRCodeModal'
import type { SubscriptionsQuery } from '~/schemas/gql/graphql'
import { Droppable } from '@hello-pangea/dnd'
import dayjs from 'dayjs'
import { CloudCog, CloudUpload, Download, Eye, Pencil } from 'lucide-react'
import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useImportSubscriptionsMutation,
  useRemoveSubscriptionsMutation,
  useSubscriptionsQuery,
  useTagSubscriptionMutation,
  useUpdateSubscriptionCronMutation,
  useUpdateSubscriptionLinkMutation,
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
import { SimpleTooltip } from '~/components/ui/tooltip'
import { UpdateSubscriptionAction } from '~/components/UpdateSubscriptionAction'
import { useDisclosure } from '~/hooks'
import { cn } from '~/lib/utils'

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
    cronExp: string
    cronEnable: boolean
  }>()
  const qrCodeModalRef = useRef<QRCodeModalRef>(null)
  const { refetch: refetchSubscriptions } = useSubscriptionsQuery()
  const removeSubscriptionsMutation = useRemoveSubscriptionsMutation()
  const importSubscriptionsMutation = useImportSubscriptionsMutation()
  const updateSubscriptionsMutation = useUpdateSubscriptionsMutation()
  const updateSubscriptionLinkMutation = useUpdateSubscriptionLinkMutation()
  const tagSubscriptionMutation = useTagSubscriptionMutation()

  const updateSubscriptionCronMutation = useUpdateSubscriptionCronMutation()

  return (
    <Section
      title={t('subscription')}
      icon={<CloudCog className="h-5 w-5" />}
      iconPlus={<CloudUpload className="h-4 w-4" />}
      onCreate={openImportSubscriptionFormModal}
      bordered
      actions={
        sortedSubscriptions.length > 2 && (
          <SimpleTooltip label={t('actions.updateAll')}>
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
          </SimpleTooltip>
        )
      }
    >
      <Droppable droppableId="subscription-list" type="SUBSCRIPTION">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn('flex flex-col gap-3 min-h-[100px]', snapshot.isDraggingOver && 'bg-primary/5 rounded-lg')}
          >
            {sortedSubscriptions.map(
              ({ id: subscriptionID, tag, link, updatedAt, cronExp, cronEnable, nodes }, index) => (
                <SortableSubscriptionCard
                  key={subscriptionID}
                  id={`subscription-${subscriptionID}`}
                  index={index}
                  name={tag || link}
                  leftSection={`${nodes.edges.length} ${t('node')}`}
                  actions={
                    <Fragment>
                      <SimpleTooltip label={t('actions.edit')}>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setEditingSubscription({
                              id: subscriptionID,
                              link,
                              tag: tag || '',
                              cronExp,
                              cronEnable,
                            })
                            openEditSubscriptionFormModal()
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </SimpleTooltip>
                      <SimpleTooltip label={t('actions.viewQRCode')}>
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
                      </SimpleTooltip>
                      <UpdateSubscriptionAction id={subscriptionID} loading={updateSubscriptionsMutation.isPending} />
                    </Fragment>
                  }
                  onRemove={() => removeSubscriptionsMutation.mutate([subscriptionID])}
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs opacity-70">
                    <span>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                    {cronEnable && (
                      <span className="inline-flex items-center gap-1 text-primary">
                        <span>⏱</span>
                        <span>{cronExp}</span>
                      </span>
                    )}
                  </div>

                  <Spoiler label={link} showLabel={t('actions.show sensitive')} hideLabel={t('actions.hide')} />

                  <Accordion type="single" collapsible defaultValue="node" className="w-full mt-2">
                    <AccordionItem value="node" className="border-none">
                      <AccordionTrigger className="text-xs py-1 hover:no-underline">
                        {t('actions.show content')}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {nodes.edges.map(({ id, name }, nodeIndex) => (
                            <DraggableResourceBadge
                              key={id}
                              id={`subscription-node-${id}`}
                              index={nodeIndex}
                              name={name}
                            >
                              {name}
                            </DraggableResourceBadge>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </SortableSubscriptionCard>
              ),
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

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
          // Update subscription link if changed
          if (values.link !== editingSubscription?.link) {
            await updateSubscriptionLinkMutation.mutateAsync({
              id: values.id,
              link: values.link,
            })
          }

          // Update subscription tag if changed
          if (values.tag !== editingSubscription?.tag) {
            await tagSubscriptionMutation.mutateAsync({
              id: values.id,
              tag: values.tag,
            })
          }

          // Update subscription cron if changed
          if (
            values.cronExp !== editingSubscription?.cronExp ||
            values.cronEnable !== editingSubscription?.cronEnable
          ) {
            await updateSubscriptionCronMutation.mutateAsync({
              id: values.id,
              cronExp: values.cronExp,
              cronEnable: values.cronEnable,
            })
          }

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
