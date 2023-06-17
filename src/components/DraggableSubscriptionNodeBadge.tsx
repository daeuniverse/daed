import { useDraggable } from '@dnd-kit/core'
import { Badge, Text } from '@mantine/core'

import { DraggableResourceType } from '~/constants'

export const DraggableSubscriptionNodeBadge = ({
  id,
  subscriptionID,
  name,
  dragDisabled,
}: {
  id: string
  subscriptionID: string
  name: string
  dragDisabled?: boolean
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
    <Badge ref={setNodeRef} style={{ zIndex: isDragging ? 10 : 0 }}>
      <Text {...listeners} {...attributes} truncate>
        {name}
      </Text>
    </Badge>
  )
}
