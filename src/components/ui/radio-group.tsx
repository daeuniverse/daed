'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { CircleIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '~/lib/utils'
import { Label } from './label'

interface RadioGroupProps extends React.ComponentProps<typeof RadioGroupPrimitive.Root> {
  label?: string
  onChange?: (value: string) => void
}

function RadioGroup({ className, label, onChange, onValueChange, ...props }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        className={cn('grid gap-3', className)}
        onValueChange={onChange || onValueChange}
        {...props}
      />
    </div>
  )
}

interface RadioGroupItemProps extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  label?: string
  description?: string
}

function RadioGroupItem({ className, label, description, ...props }: RadioGroupItemProps) {
  const id = React.useId()

  return (
    <div className="flex items-start gap-3">
      <RadioGroupPrimitive.Item
        id={id}
        data-slot="radio-group-item"
        className={cn(
          'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 mt-0.5',
          className,
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          data-slot="radio-group-indicator"
          className="relative flex items-center justify-center"
        >
          <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <Label htmlFor={id} className="font-normal cursor-pointer">
              {label}
            </Label>
          )}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
    </div>
  )
}

export { RadioGroupItem as Radio, RadioGroup, RadioGroupItem }
