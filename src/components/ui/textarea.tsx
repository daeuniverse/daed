import * as React from 'react'

import { cn } from '~/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  description?: string
  error?: string
  withAsterisk?: boolean
  autosize?: boolean
  minRows?: number
  maxRows?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, description, error, withAsterisk, autosize, minRows = 3, maxRows = 10, ...props }, ref) => {
    const id = React.useId()
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    React.useImperativeHandle(ref, () => textareaRef.current!)

    const handleAutosize = React.useCallback(() => {
      const textarea = textareaRef.current

      if (!textarea || !autosize) return

      textarea.style.height = 'auto'
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20
      const minHeight = lineHeight * minRows
      const maxHeight = lineHeight * maxRows
      const scrollHeight = textarea.scrollHeight

      textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`
    }, [autosize, minRows, maxRows])

    React.useEffect(() => {
      handleAutosize()
    }, [handleAutosize, props.value])

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
        <textarea
          id={id}
          ref={textareaRef}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive',
            autosize && 'resize-none overflow-hidden',
            className,
          )}
          onInput={autosize ? handleAutosize : undefined}
          {...props}
        />
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
