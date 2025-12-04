import type { FieldErrors, FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'

import { cn } from '~/lib/utils'

export interface FormActionsProps<T extends FieldValues = FieldValues> {
  className?: string
  loading?: boolean
  reset?: () => void
  /** Callback when submit button is clicked (use when button is rendered outside form via portal) */
  onSubmit?: () => void
  /** Whether the form has been modified from its initial values */
  isDirty?: boolean
  /** Whether the form has any validation errors (deprecated: use errors instead) */
  isValid?: boolean
  /** Form errors object from react-hook-form - used to compute validity */
  errors?: FieldErrors<T>
  /** If true, submit requires form to be dirty. If false, only validation matters. Default: true */
  requireDirty?: boolean
}

export function FormActions<T extends FieldValues = FieldValues>({
  className,
  loading,
  reset,
  onSubmit,
  isDirty = true,
  isValid: isValidProp,
  errors,
  requireDirty = true,
}: FormActionsProps<T>) {
  const { t } = useTranslation()

  // Priority: use isValid prop if explicitly provided (from react-hook-form's formState)
  // Fallback to computing from errors if isValid is not provided
  // Default to true only if neither is provided (backwards compatibility)
  const isValid = isValidProp !== undefined ? isValidProp : errors ? Object.keys(errors).length === 0 : true

  const isResetDisabled = !isDirty
  const isSubmitDisabled = (requireDirty && !isDirty) || !isValid

  // Generate error summary for tooltip
  const errorSummary =
    errors && Object.keys(errors).length > 0
      ? Object.entries(errors)
          .map(([field, error]) => `${field}: ${(error as { message?: string })?.message || 'Invalid'}`)
          .join('\n')
      : null

  const handleSubmitClick = () => {
    if (onSubmit && !isSubmitDisabled) {
      onSubmit()
    }
  }

  return (
    <div className={cn('flex justify-end gap-2', className)}>
      <Button type="reset" variant="destructive" onClick={() => reset && reset()} disabled={isResetDisabled} uppercase>
        {t('actions.reset')}
      </Button>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type={onSubmit ? 'button' : 'submit'}
            loading={loading}
            disabled={isSubmitDisabled}
            onClick={onSubmit ? handleSubmitClick : undefined}
            uppercase
          >
            {t('actions.submit')}
          </Button>
        </TooltipTrigger>
        {errorSummary && (
          <TooltipContent side="top" className="max-w-xs whitespace-pre-wrap text-left">
            {errorSummary}
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  )
}
