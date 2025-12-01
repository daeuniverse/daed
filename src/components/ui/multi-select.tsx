'use client'

import { Command as CommandPrimitive } from 'cmdk'
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '~/lib/utils'
import { Badge } from './badge'
import { Label } from './label'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

interface MultiSelectProps {
  data: Array<{ label: string; value: string }>
  values?: string[]
  onChange?: (values: string[]) => void
  placeholder?: string
  className?: string
  label?: string
  description?: string
  withAsterisk?: boolean
}

const EMPTY_ARRAY: string[] = []

function MultiSelect({
  data,
  values = EMPTY_ARRAY,
  onChange,
  placeholder = 'Select options...',
  className,
  label,
  description,
  withAsterisk,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (value: string) => {
    if (values.includes(value)) {
      onChange?.(values.filter((v) => v !== value))
    } else {
      onChange?.([...values, value])
    }
  }

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(values.filter((v) => v !== value))
  }

  const selectedLabels = values.map((v) => {
    const item = data.find((d) => d.value === v)
    return item?.label || v
  })

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {withAsterisk && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "border-input data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full min-h-9 items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {values.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedLabels.map((label, index) => (
                  <Badge key={values[index]} variant="secondary" className="gap-1 pr-1">
                    {label}
                    <XIcon
                      className="size-3 cursor-pointer hover:text-destructive"
                      onClick={(e) => handleRemove(values[index], e)}
                    />
                  </Badge>
                ))
              )}
            </div>
            <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <CommandPrimitive className="w-full">
            <CommandPrimitive.List className="max-h-[200px] overflow-y-auto p-1">
              {data.map((item) => {
                const isSelected = values.includes(item.value)
                return (
                  <CommandPrimitive.Item
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item.value)}
                    className={cn(
                      'relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground',
                      isSelected && 'bg-accent/50',
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-sm border',
                        isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-input',
                      )}
                    >
                      {isSelected && <CheckIcon className="size-3" />}
                    </div>
                    <span>{item.label}</span>
                  </CommandPrimitive.Item>
                )
              })}
              {data.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">No options available</div>
              )}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { MultiSelect }
