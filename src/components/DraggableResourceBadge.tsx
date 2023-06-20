import { useDraggable } from '@dnd-kit/core'
import { ActionIcon, Badge, Text, Tooltip } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import { DraggableResourceType } from '~/constants'

export const DraggableResourceBadge = ({
  id,
  name,
  type,
  nodeID,
  groupID,
  subscriptionID,
  onRemove,
  dragDisabled,
  children,
}: {
  id: string
  name: string
  type: DraggableResourceType
  nodeID?: string
  groupID?: string
  subscriptionID?: string
  onRemove?: () => void
  dragDisabled?: boolean
  children?: React.ReactNode
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: {
      type,
      nodeID,
      groupID,
      subscriptionID,
    },
    disabled: dragDisabled,
  })

  return (
    <Tooltip disabled={!children} label={<Text fz="xs">{children}</Text>} withArrow>
      <Badge
        ref={setNodeRef}
        pr={onRemove ? 3 : undefined}
        rightSection={
          onRemove && (
            <ActionIcon color="blue" size="xs" radius="xl" variant="transparent" onClick={onRemove}>
              <IconX size={12} />
            </ActionIcon>
          )
        }
        style={{
          zIndex: isDragging ? 10 : 0,
        }}
        opacity={isDragging ? 0.5 : undefined}
      >
        <Text {...listeners} {...attributes} truncate>
          {name}
        </Text>
      </Badge>
    </Tooltip>
  )
}
