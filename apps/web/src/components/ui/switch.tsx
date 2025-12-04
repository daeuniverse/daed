'use client'

import * as SwitchPrimitive from '@radix-ui/react-switch'
import * as React from 'react'

import { cn } from '~/lib/utils'

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  onLabel?: React.ReactNode
  offLabel?: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

function Switch({
  ref,
  className,
  onLabel,
  offLabel,
  size = 'md',
  ...props
}: SwitchProps & { ref?: React.RefObject<React.ElementRef<typeof SwitchPrimitive.Root> | null> }) {
  const sizeClasses = {
    xs: 'h-4 w-7',
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-7 w-14',
  }

  const thumbSizeClasses = {
    xs: 'size-3 data-[state=checked]:translate-x-3',
    sm: 'size-4 data-[state=checked]:translate-x-4',
    md: 'size-5 data-[state=checked]:translate-x-5',
    lg: 'size-6 data-[state=checked]:translate-x-7',
  }

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        sizeClasses[size],
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none flex items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0',
          thumbSizeClasses[size],
        )}
      >
        {props.checked ? onLabel : offLabel}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }
