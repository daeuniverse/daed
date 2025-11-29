import * as React from 'react'

import { cn } from '~/lib/utils'
import { Label } from './label'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  withAsterisk?: boolean
}

function Input({
  ref,
  className,
  type,
  label,
  error,
  withAsterisk,
  id,
  ...props
}: InputProps & { ref?: React.RefObject<HTMLInputElement | null> }) {
  const generatedId = React.useId()
  const inputId = id || generatedId

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {withAsterisk && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}
      <input
        type={type}
        id={inputId}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          error && 'border-destructive',
          className,
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
Input.displayName = 'Input'

export { Input }
