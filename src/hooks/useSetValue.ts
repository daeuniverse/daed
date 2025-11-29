import type { FieldValues, Path, PathValue, UseFormSetValue } from 'react-hook-form'
import { useCallback } from 'react'

/**
 * Wraps the react-hook-form setValue function to automatically set shouldDirty: true
 * This ensures that isDirty state is properly updated when using controlled components
 */
export function useSetValue<TFieldValues extends FieldValues>(setValue: UseFormSetValue<TFieldValues>) {
  return useCallback(
    <TFieldName extends Path<TFieldValues>>(name: TFieldName, value: PathValue<TFieldValues, TFieldName>) => {
      setValue(name, value, { shouldDirty: true })
    },
    [setValue],
  )
}
