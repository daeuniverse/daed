import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ActionIcon, Badge, Text, Tooltip } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

export const SortableResourceBadge = ({
  id,
  name,
  onRemove,
  dragDisabled,
  children,
}: {
  id: string
  name: string
  onRemove: () => void
  dragDisabled?: boolean
  children?: React.ReactNode
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: dragDisabled,
  })

  return (
    <Tooltip disabled={!children} label={<Text fz="xs">{children}</Text>} withArrow>
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
    </Tooltip>
  )
}
