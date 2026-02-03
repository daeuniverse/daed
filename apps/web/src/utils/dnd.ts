import type { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd'

/**
 * Get style for draggable items with instant drop (no animation).
 * This disables the drop animation so items snap to their final position immediately.
 */
export function getInstantDropStyle(provided: DraggableProvided, snapshot: DraggableStateSnapshot) {
  const style = provided.draggableProps.style
  if (snapshot.isDropAnimating) {
    return {
      ...style,
      transitionDuration: '0.001s',
    }
  }
  return style
}
