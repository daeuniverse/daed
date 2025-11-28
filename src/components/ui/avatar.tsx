'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '~/lib/utils'

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
))
AvatarRoot.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// Simple wrapper for easier usage matching Mantine's Avatar API
interface AvatarProps {
  src?: string | null
  alt?: string
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  children?: React.ReactNode
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt, radius = 'full', size = 'md', className, children }, ref) => {
    const sizeValue =
      typeof size === 'number'
        ? size
        : {
            xs: 16,
            sm: 24,
            md: 40,
            lg: 56,
            xl: 84,
          }[size]

    const radiusClasses = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    }

    return (
      <AvatarRoot
        ref={ref}
        className={cn(radiusClasses[radius], className)}
        style={{ width: sizeValue, height: sizeValue }}
      >
        {src ? <AvatarImage src={src} alt={alt} /> : null}
        <AvatarFallback>{children || alt?.[0]?.toUpperCase()}</AvatarFallback>
      </AvatarRoot>
    )
  },
)
Avatar.displayName = 'Avatar'

export { Avatar, AvatarRoot, AvatarImage, AvatarFallback }
