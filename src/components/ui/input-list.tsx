import { Minus, Plus } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'

interface InputListProps {
  label: string
  description?: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  withAsterisk?: boolean
  error?: string
  errors?: (string | undefined)[]
}

export function InputList({
  label,
  description,
  values,
  onChange,
  placeholder,
  withAsterisk = true,
  error,
  errors,
}: InputListProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className={cn('text-sm font-medium', error && 'text-destructive')}>
          {label} {withAsterisk && <span className="text-destructive">*</span>}
        </Label>
        <Button
          type="button"
          variant="default"
          size="icon"
          className="h-5 w-5 bg-green-600 hover:bg-green-700"
          onClick={() => onChange([...values, ''])}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      {values.map((value, i) => {
        const itemError = errors?.[i]

        return (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <Input
                  value={value}
                  placeholder={placeholder}
                  className={cn(itemError && 'border-destructive')}
                  onChange={(e) => {
                    const newValues = [...values]
                    newValues[i] = e.target.value
                    onChange(newValues)
                  }}
                />
              </div>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              >
                <Minus className="h-3 w-3" />
              </Button>
            </div>
            {itemError && <p className="text-xs text-destructive">{itemError}</p>}
          </div>
        )
      })}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
