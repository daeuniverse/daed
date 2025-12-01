import { ChevronDown, ChevronUp } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '~/lib/utils'

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'type' | 'size'
> {
  label?: string
  description?: string
  error?: string
  withAsterisk?: boolean
  value?: number | string
  onChange?: (value: number | string) => void
  min?: number
  max?: number
  step?: number
  precision?: number
  hideControls?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

function NumberInput({
  ref,
  className,
  label,
  description,
  error,
  withAsterisk,
  value,
  onChange,
  min,
  max,
  step = 1,
  precision,
  hideControls = false,
  size = 'md',
  disabled,
  ...props
}: NumberInputProps & { ref?: React.RefObject<HTMLInputElement | null> }) {
  const { t } = useTranslation()
  const id = React.useId()

  const sizeClasses = {
    xs: 'h-7 text-xs px-2',
    sm: 'h-8 text-sm px-2',
    md: 'h-9 text-sm px-3',
    lg: 'h-10 text-base px-4',
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    if (val === '' || val === '-') {
      onChange?.(val)

      return
    }

    let num = Number.parseFloat(val)

    if (Number.isNaN(num)) return

    if (min !== undefined && num < min) num = min

    if (max !== undefined && num > max) num = max

    if (precision !== undefined) {
      num = Number.parseFloat(num.toFixed(precision))
    }

    onChange?.(num)
  }

  const increment = () => {
    if (disabled) return

    const current = typeof value === 'number' ? value : Number.parseFloat(value as string) || 0
    let newValue = current + step

    if (max !== undefined && newValue > max) newValue = max

    if (precision !== undefined) {
      newValue = Number.parseFloat(newValue.toFixed(precision))
    }

    onChange?.(newValue)
  }

  const decrement = () => {
    if (disabled) return

    const current = typeof value === 'number' ? value : Number.parseFloat(value as string) || 0
    let newValue = current - step

    if (min !== undefined && newValue < min) newValue = min

    if (precision !== undefined) {
      newValue = Number.parseFloat(newValue.toFixed(precision))
    }

    onChange?.(newValue)
  }

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {withAsterisk && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="number"
          id={id}
          className={cn(
            'flex w-full rounded-md border border-input bg-transparent py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            sizeClasses[size],
            !hideControls && 'pr-8',
            error && 'border-destructive',
            className,
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          {...props}
        />
        {!hideControls && (
          <div className="absolute right-0 top-0 h-full flex flex-col border-l">
            <button
              type="button"
              className="flex-1 px-1 hover:bg-accent disabled:opacity-50"
              onClick={increment}
              disabled={disabled || (max !== undefined && typeof value === 'number' && value >= max)}
              tabIndex={-1}
              aria-label={t('a11y.incrementValue')}
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="flex-1 px-1 hover:bg-accent border-t disabled:opacity-50"
              onClick={decrement}
              disabled={disabled || (min !== undefined && typeof value === 'number' && value <= min)}
              tabIndex={-1}
              aria-label={t('a11y.decrementValue')}
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
NumberInput.displayName = 'NumberInput'

export { NumberInput }
