'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'

import { cn } from '~/lib/utils'

const RadioGroupRoot = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />
})
RadioGroupRoot.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    size?: 'xs' | 'sm' | 'md' | 'lg'
  }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const iconSizeClasses = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
  }

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className={cn('fill-current text-current', iconSizeClasses[size])} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

// Simple wrapper for easier usage
interface RadioGroupProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  description?: string
  error?: string
  orientation?: 'horizontal' | 'vertical'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ value, onChange, label, description, error, orientation = 'vertical', children, className }, ref) => {
    return (
      <div className={cn('space-y-2', className)}>
        {label && <label className="text-sm font-medium leading-none">{label}</label>}
        <RadioGroupRoot
          ref={ref}
          value={value}
          onValueChange={onChange}
          className={cn(
            orientation === 'horizontal' && 'flex flex-row gap-4',
            orientation === 'vertical' && 'flex flex-col gap-2',
          )}
        >
          {children}
        </RadioGroupRoot>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  },
)
RadioGroup.displayName = 'RadioGroup'

// Radio item with label
interface RadioProps {
  value: string
  label?: string
  description?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const Radio = React.forwardRef<HTMLButtonElement, RadioProps>(
  ({ value, label, description, size = 'md', disabled }, ref) => {
    const id = React.useId()

    return (
      <div className="flex items-start space-x-2">
        <RadioGroupItem ref={ref} value={value} id={id} size={size} disabled={disabled} />
        {label && (
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor={id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </div>
    )
  },
)
Radio.displayName = 'Radio'

export { RadioGroup, RadioGroupRoot, RadioGroupItem, Radio }
