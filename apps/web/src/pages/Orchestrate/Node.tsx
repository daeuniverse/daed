import type { QRCodeModalRef } from '~/components/QRCodeModal.tsx'
import type { NodesQuery } from '~/schemas/gql/graphql.ts'
import { Droppable } from '@hello-pangea/dnd'
import { Cloud, CloudUpload, Eye, FileInput, Pencil } from 'lucide-react'
import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useImportNodesMutation, useRemoveNodesMutation } from '~/apis/index.ts'
import { EditNodeFormModal } from '~/components/EditNodeFormModal.tsx'
import { ImportResourceFormModal } from '~/components/ImportResourceFormModal.tsx'
import { ConfigureNodeFormModal, SortableNodeCard } from '~/components/index.ts'
import { QRCodeModal } from '~/components/QRCodeModal.tsx'
import { Section } from '~/components/Section.tsx'
import { Button } from '~/components/ui/button.tsx'
import { SimpleTooltip } from '~/components/ui/tooltip.tsx'
import { cn } from '~/lib/utils'

export const NODE_DROPPABLE_ID = 'node-list'

export function NodeResource({
  sortedNodes,
  highlight,
}: {
  sortedNodes: NodesQuery['nodes']['edges']
  highlight?: boolean
}) {
  const { t } = useTranslation()

  const [openedQRCodeModal, setOpenedQRCodeModal] = useState(false)
  const [openedImportNodeFormModal, setOpenedImportNodeFormModal] = useState(false)
  const [openedConfigureNodeFormModal, setOpenedConfigureNodeFormModal] = useState(false)
  const [openedEditNodeFormModal, setOpenedEditNodeFormModal] = useState(false)
  const [editingNode, setEditingNode] = useState<{
    id: string
    link: string
    tag: string
    name: string
  }>()
  const qrCodeModalRef = useRef<QRCodeModalRef>(null)
  const removeNodesMutation = useRemoveNodesMutation()
  const importNodesMutation = useImportNodesMutation()

  return (
    <Section
      title={t('node')}
      icon={<Cloud className="h-5 w-5" />}
      iconPlus={<CloudUpload className="h-4 w-4" />}
      onCreate={() => setOpenedImportNodeFormModal(true)}
      actions={
        <SimpleTooltip label={t('actions.configureNode')}>
          <Button variant="ghost" size="icon" onClick={() => setOpenedConfigureNodeFormModal(true)}>
            <FileInput className="h-4 w-4" />
          </Button>
        </SimpleTooltip>
      }
      bordered
      highlight={highlight}
    >
      <Droppable droppableId={NODE_DROPPABLE_ID} type="NODE">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn('flex flex-col gap-3 min-h-[100px]', snapshot.isDraggingOver && 'bg-primary/5 rounded-lg')}
          >
            {sortedNodes.map(({ id, name, tag, protocol, link }, index) => (
              <SortableNodeCard
                key={id}
                id={`node-${id}`}
                index={index}
                name={tag || name}
                leftSection={protocol}
                actions={
                  <Fragment>
                    <SimpleTooltip label={t('actions.edit')}>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingNode({
                            id,
                            link,
                            tag: tag || '',
                            name: name || '',
                          })
                          setOpenedEditNodeFormModal(true)
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
                            name: tag || name!,
                            link,
                          })
                          setOpenedQRCodeModal(true)
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </SimpleTooltip>
                  </Fragment>
                }
                onRemove={() => removeNodesMutation.mutate([id])}
              >
                {name && name !== tag && <p className="text-xs opacity-70">{name}</p>}
                <Spoiler label={link} showLabel={t('actions.show sensitive')} hideLabel={t('actions.hide')} />
              </SortableNodeCard>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <QRCodeModal ref={qrCodeModalRef} opened={openedQRCodeModal} onClose={() => setOpenedQRCodeModal(false)} />

      <ImportResourceFormModal
        title={t('node')}
        opened={openedImportNodeFormModal}
        onClose={() => setOpenedImportNodeFormModal(false)}
        handleSubmit={async (values) => {
          await importNodesMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
        }}
      />

      <ConfigureNodeFormModal
        opened={openedConfigureNodeFormModal}
        onClose={() => setOpenedConfigureNodeFormModal(false)}
      />

      <EditNodeFormModal
        opened={openedEditNodeFormModal}
        onClose={() => setOpenedEditNodeFormModal(false)}
        node={editingNode}
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
