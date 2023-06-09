import { useDroppable } from '@dnd-kit/core'
import { ActionIcon, Card, Group, Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export const DroppableGroupCard = ({
  id,
  name,
  onRemove,
  children,
}: {
  id: string
  name: string
  onRemove?: () => void
  children?: React.ReactNode
}) => {
  const { t } = useTranslation()
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <Card
      ref={setNodeRef}
      withBorder
      shadow="sm"
      p="sm"
      style={{
        opacity: isOver ? 0.5 : undefined,
      }}
    >
      <Card.Section withBorder inheritPadding py="sm">
        <Group position="apart">
          <Title order={5}>{name}</Title>

          {onRemove && (
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
          )}
        </Group>
      </Card.Section>

      {children && (
        <Card.Section inheritPadding py="sm">
          {children}
        </Card.Section>
      )}
    </Card>
  )
}
