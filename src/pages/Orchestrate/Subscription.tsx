import { Accordion, ActionIcon, Group, Spoiler, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCloudComputing, IconDetails, IconDownload } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { Fragment, useRef } from 'react'
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
import { DraggableResourceType } from '~/constants'

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
      icon={<IconCloudComputing />}
      onCreate={openImportSubscriptionFormModal}
      bordered
      actions={
        subscriptionsQuery?.subscriptions &&
        subscriptionsQuery.subscriptions.length > 2 && (
          <ActionIcon
            onClick={() => {
              updateSubscriptionsMutation.mutate(subscriptionsQuery?.subscriptions.map(({ id }) => id) || [])
            }}
            loading={updateSubscriptionsMutation.isLoading}
          >
            <IconDownload />
          </ActionIcon>
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
              <ActionIcon
                size="xs"
                onClick={() => {
                  qrCodeModalRef.current?.setProps({
                    name: tag!,
                    link,
                  })
                  openQRCodeModal()
                }}
              >
                <IconDetails />
              </ActionIcon>
              <UpdateSubscriptionAction id={subscriptionID} loading={updateSubscriptionsMutation.isLoading} />
            </Fragment>
          }
          onRemove={() => removeSubscriptionsMutation.mutate([subscriptionID])}
        >
          <Text fw={600}>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>

          <Spoiler
            maxHeight={0}
            showLabel={<Text fz="xs">{t('actions.show content')}</Text>}
            hideLabel={<Text fz="xs">{t('actions.hide')}</Text>}
          >
            <Text
              fz="sm"
              style={{
                wordBreak: 'break-all',
              }}
            >
              {link}
            </Text>
          </Spoiler>

          <Accordion variant="filled">
            <Accordion.Item value="node">
              <Accordion.Control fz="xs" px="xs">
                {t('node')} ({nodes.edges.length})
              </Accordion.Control>
              <Accordion.Panel>
                <Group spacing="sm">
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
                </Group>
              </Accordion.Panel>
            </Accordion.Item>
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
