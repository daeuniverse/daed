import { Cloud, CloudUpload, Eye, FileInput } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useImportNodesMutation, useNodesQuery, useRemoveNodesMutation } from '~/apis'
import { ConfigureNodeFormModal } from '~/components'
import { DraggableResourceCard } from '~/components/DraggableResourceCard'
import { ImportResourceFormModal } from '~/components/ImportResourceFormModal'
import { QRCodeModal, QRCodeModalRef } from '~/components/QRCodeModal'
import { Section } from '~/components/Section'
import { Button } from '~/components/ui/button'
import { DraggableResourceType } from '~/constants'
import { useDisclosure } from '~/hooks'

export const NodeResource = () => {
  const { t } = useTranslation()

  const [openedQRCodeModal, { open: openQRCodeModal, close: closeQRCodeModal }] = useDisclosure(false)
  const [openedImportNodeFormModal, { open: openImportNodeFormModal, close: closeImportNodeFormModal }] =
    useDisclosure(false)
  const [openedConfigureNodeFormModal, { open: openConfigureNodeFormModal, close: closeConfigureNodeFormModal }] =
    useDisclosure(false)
  const qrCodeModalRef = useRef<QRCodeModalRef>(null)
  const { data: nodesQuery } = useNodesQuery()
  const removeNodesMutation = useRemoveNodesMutation()
  const importNodesMutation = useImportNodesMutation()

  return (
    <Section
      title={t('node')}
      icon={<Cloud className="h-5 w-5" />}
      iconPlus={<CloudUpload className="h-4 w-4" />}
      onCreate={openImportNodeFormModal}
      actions={
        <Button variant="ghost" size="icon" onClick={openConfigureNodeFormModal}>
          <FileInput className="h-4 w-4" />
        </Button>
      }
      bordered
    >
      {nodesQuery?.nodes.edges.map(({ id, name, tag, protocol, link }) => (
        <DraggableResourceCard
          key={id}
          id={`node-${id}`}
          nodeID={id}
          type={DraggableResourceType.node}
          name={tag}
          leftSection={<span className="text-xs font-semibold">{protocol}</span>}
          actions={
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                qrCodeModalRef.current?.setProps({
                  name: name || tag!,
                  link,
                })
                openQRCodeModal()
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          }
          onRemove={() => removeNodesMutation.mutate([id])}
        >
          <p className="font-semibold text-primary break-all">{name}</p>

          <Spoiler label={link} showLabel={t('actions.show content')} hideLabel={t('actions.hide')} />
        </DraggableResourceCard>
      ))}

      <QRCodeModal ref={qrCodeModalRef} opened={openedQRCodeModal} onClose={closeQRCodeModal} />

      <ImportResourceFormModal
        title={t('node')}
        opened={openedImportNodeFormModal}
        onClose={closeImportNodeFormModal}
        handleSubmit={async (values) => {
          await importNodesMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
        }}
      />

      <ConfigureNodeFormModal opened={openedConfigureNodeFormModal} onClose={closeConfigureNodeFormModal} />
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
