import { useDroppable } from '@dnd-kit/core'
import { ActionIcon, Card, Group, Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconTrash } from '@tabler/icons-react'

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
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <Card
      ref={setNodeRef}
      withBorder
      shadow="sm"
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
                  title: 'Remove',
                  labels: {
                    cancel: 'No',
                    confirm: "Yes, I'm sure",
                  },
                  children: 'Are you sure you want to remove this?',
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
