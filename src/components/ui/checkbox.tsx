'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '~/lib/utils'

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  description?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, description, size = 'md', ...props }, ref) => {
    const id = React.useId()

    const sizeClasses = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    }

    const iconSizeClasses = {
      xs: 'h-2 w-2',
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    }

    const checkbox = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        className={cn(
          'peer shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
          <Check className={iconSizeClasses[size]} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )

    if (label) {
      return (
        <div className="flex items-start space-x-2">
          {checkbox}
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor={id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
      )
    }

    return checkbox
  },
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
