import { useDraggable } from '@dnd-kit/core'
import { Badge, Text, Tooltip } from '@mantine/core'

import { DraggableResourceType } from '~/constants'

export const DraggableSubscriptionNodeBadge = ({
  id,
  subscriptionID,
  name,
  dragDisabled,
  children,
}: {
  id: string
  subscriptionID: string
  name: string
  dragDisabled?: boolean
  children?: React.ReactNode
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: {
      subscriptionID,
      type: DraggableResourceType.subscription_node,
    },
    disabled: dragDisabled,
  })

  return (
    <Tooltip fz="xs" label={children} withArrow>
      <Badge
        ref={setNodeRef}
        style={{ cursor: 'grab', zIndex: isDragging ? 10 : 0 }}
        opacity={isDragging ? 0.5 : undefined}
        {...listeners}
        {...attributes}
      >
        <Text truncate>{name}</Text>
      </Badge>
    </Tooltip>
  )
}
