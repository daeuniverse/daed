import type { ClientRect, Modifier } from '@dnd-kit/core'
import type { Transform } from '@dnd-kit/utilities'
import type { RefObject } from 'react'

/**
 * This file is a copy taken from dnd-kits restrictToBoundingRect.ts
 */
export const restrictToBoundingRect = (transform: Transform, rect: ClientRect, boundingRect: ClientRect): Transform => {
  const value = {
    ...transform,
  }

  if (rect.top + transform.y <= boundingRect.top) {
    value.y = boundingRect.top - rect.top
  } else if (rect.bottom + transform.y >= boundingRect.top + boundingRect.height) {
    value.y = boundingRect.top + boundingRect.height - rect.bottom
  }

  if (rect.left + transform.x <= boundingRect.left) {
    value.x = boundingRect.left - rect.left
  } else if (rect.right + transform.x >= boundingRect.left + boundingRect.width) {
    value.x = boundingRect.left + boundingRect.width - rect.right
  }

  return value
}

export const restrictToElement = (elementRef: RefObject<HTMLElement | null>): Modifier => {
  return ({ draggingNodeRect, transform }) => {
    const element = elementRef.current
    const parentRect = element ? (element.getBoundingClientRect() as ClientRect) : null

    if (!draggingNodeRect || !parentRect) {
      return transform
    }

    return restrictToBoundingRect(transform, draggingNodeRect, parentRect)
  }
}
