import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ActionIcon, Badge, Text } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

export const SortableResourceBadge = ({ id, name, onRemove }: { id: string; name: string; onRemove: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <Badge
      ref={setNodeRef}
      pr={3}
      rightSection={
        <ActionIcon color="blue" size="xs" radius="xl" variant="transparent" onClick={onRemove}>
          <IconX size={12} />
        </ActionIcon>
      }
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 0,
      }}
    >
      <Text {...listeners} {...attributes} truncate>
        {name}
      </Text>
    </Badge>
  )
}
