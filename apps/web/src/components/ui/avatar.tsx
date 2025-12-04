import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as React from 'react'

import { cn } from '~/lib/utils'

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string
  alt?: string
  size?: number
  fallback?: React.ReactNode
}

function Avatar({
  ref,
  className,
  src,
  alt,
  size = 32,
  fallback,
  ...props
}: AvatarProps & { ref?: React.RefObject<React.ElementRef<typeof AvatarPrimitive.Root> | null> }) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      data-slot="avatar"
      className={cn('relative flex shrink-0 overflow-hidden rounded-full', className)}
      style={{ width: size, height: size }}
      {...props}
    >
      {src && (
        <AvatarPrimitive.Image data-slot="avatar-image" className="aspect-square size-full" src={src} alt={alt} />
      )}
      <AvatarPrimitive.Fallback
        data-slot="avatar-fallback"
        className="bg-muted flex size-full items-center justify-center rounded-full"
      >
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
Avatar.displayName = AvatarPrimitive.Root.displayName

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image data-slot="avatar-image" className={cn('aspect-square size-full', className)} {...props} />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
