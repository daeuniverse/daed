import type { FieldErrors, FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'

import { cn } from '~/lib/utils'

export interface FormActionsProps<T extends FieldValues = FieldValues> {
  className?: string
  loading?: boolean
  reset?: () => void
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
  isDirty = true,
  isValid: isValidProp = true,
  errors,
  requireDirty = true,
}: FormActionsProps<T>) {
  const { t } = useTranslation()

  // Compute isValid from errors if provided, otherwise use isValid prop
  // This fixes react-hook-form + zod resolver sync issues
  const isValid = errors ? Object.keys(errors).length === 0 : isValidProp

  const isResetDisabled = !isDirty
  const isSubmitDisabled = (requireDirty && !isDirty) || !isValid

  return (
    <div className={cn('flex justify-end gap-2', className)}>
      <Button type="reset" variant="destructive" onClick={() => reset && reset()} disabled={isResetDisabled} uppercase>
        {t('actions.reset')}
      </Button>

      <Button type="submit" loading={loading} disabled={isSubmitDisabled} uppercase>
        {t('actions.submit')}
      </Button>
    </div>
  )
}
