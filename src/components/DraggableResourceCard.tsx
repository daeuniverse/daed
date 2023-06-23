import { useDraggable } from '@dnd-kit/core'
import { ActionIcon, Badge, Card, Group, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconTrash } from '@tabler/icons-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { DraggableResourceType } from '~/constants'

export const DraggableResourceCard = ({
  id,
  nodeID,
  subscriptionID,
  type,
  name,
  leftSection,
  onRemove,
  actions,
  children,
}: {
  id: string
  nodeID?: string
  subscriptionID?: string
  type: DraggableResourceType
  name: React.ReactNode
  leftSection?: React.ReactNode
  onRemove: () => void
  actions?: React.ReactNode
  children: React.ReactNode
}) => {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, data: { type, nodeID, subscriptionID } })

  return (
    <Card
      ref={setNodeRef}
      p="sm"
      withBorder
      shadow="sm"
      style={{
        opacity: isDragging ? 0.5 : undefined,
      }}
    >
      <Card.Section withBorder p="sm">
        <Group position="apart" spacing="xs">
          {leftSection}

          <Badge
            size="lg"
            style={{
              cursor: 'grab',
              flex: 1,
            }}
            {...listeners}
            {...attributes}
          >
            <Text truncate>{name}</Text>
          </Badge>

          <Group>
            {actions}

            <ActionIcon
              color="red"
              size="xs"
              onClick={() => {
                modals.openConfirmModal({
                  title: t('actions.remove'),
                  labels: {
                    cancel: t('confirmModal.cancel'),
                    confirm: t('confirmModal.confirm'),
                  },
                  children: t('confirmModal.removeConfirmDescription'),
                  onConfirm: onRemove,
                })
              }}
            >
              <IconTrash />
            </ActionIcon>
          </Group>
        </Group>
      </Card.Section>

      <Card.Section p="sm">{children}</Card.Section>
    </Card>
  )
}
