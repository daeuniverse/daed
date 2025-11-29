import type { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'
import type { ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useSetValue } from './useSetValue'

export interface UseNodeFormOptions<TFormValues extends FieldValues> {
  /** Zod schema for form validation */
  schema: ZodType<TFormValues, any, any>
  /** Default form values */
  defaultValues: TFormValues
  /** Initial values to populate the form (for edit mode) */
  initialValues?: Partial<TFormValues>
  /** Function to generate URL from form data */
  generateLink: (data: TFormValues) => string
  /** Callback when link is generated */
  onLinkGeneration: (link: string) => void
  /** Optional function to parse URL and return form values */
  parseLink?: (url: string) => Partial<TFormValues> | null
}

export interface UseNodeFormReturn<TFormValues extends FieldValues> {
  /** Form values watched in real-time */
  formValues: Partial<TFormValues>
  /** Set a form field value */
  setValue: <TFieldName extends Path<TFormValues>>(name: TFieldName, value: PathValue<TFormValues, TFieldName>) => void
  /** Handle form submission */
  handleSubmit: UseFormReturn<TFormValues>['handleSubmit']
  /** Submit handler to use with form onSubmit */
  onSubmit: (data: TFormValues) => void
  /** Reset form to default values */
  resetForm: () => void
  /** Whether form has been modified */
  isDirty: boolean
  /** Whether form passes all validation rules */
  isValid: boolean
  /** Form validation errors */
  errors: UseFormReturn<TFormValues>['formState']['errors']
  /** Form control for advanced usage */
  control: UseFormReturn<TFormValues>['control']
  /** Translation function */
  t: ReturnType<typeof useTranslation>['t']
  /** Load values from a protocol URL */
  loadFromURL: (url: string) => boolean
  /** Original react-hook-form instance for advanced usage */
  form: UseFormReturn<TFormValues>
}

/**
 * A custom hook that abstracts common form logic for node configuration forms.
 * Provides form state management, validation, URL generation, and URL parsing capabilities.
 *
 * @example
 * ```tsx
 * const { formValues, setValue, handleSubmit, onSubmit, resetForm, isDirty, errors, t } = useNodeForm({
 *   schema: httpSchema,
 *   defaultValues: DEFAULT_HTTP_FORM_VALUES,
 *   generateLink: (data) => generateURL({ protocol: 'http', ... }),
 *   onLinkGeneration,
 *   parseLink: parseHTTPUrl,
 * })
 * ```
 */
export function useNodeForm<TFormValues extends FieldValues>({
  schema,
  defaultValues,
  initialValues,
  generateLink,
  onLinkGeneration,
  parseLink,
}: UseNodeFormOptions<TFormValues>): UseNodeFormReturn<TFormValues> {
  const { t } = useTranslation()

  // Merge defaultValues with initialValues for edit mode
  const mergedDefaults = useMemo(
    () => (initialValues ? { ...defaultValues, ...initialValues } : defaultValues),
    [defaultValues, initialValues],
  )

  const form = useForm<TFormValues, any, TFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: mergedDefaults as any,
    mode: 'onChange',
    // Ensure isValid is computed on mount
    criteriaMode: 'all',
  })

  const {
    handleSubmit,
    setValue: setValueOriginal,
    reset,
    control,
    formState: { isDirty, errors },
  } = form

  const setValue = useSetValue(setValueOriginal)
  const formValues = useWatch({ control }) as Partial<TFormValues>

  // Validate formValues against schema to get accurate isValid state
  const isValid = useMemo(() => {
    const result = schema.safeParse(formValues)
    return result.success
  }, [schema, formValues])

  const onSubmit = useCallback(
    (data: TFormValues) => {
      const link = generateLink(data)
      onLinkGeneration(link)
    },
    [generateLink, onLinkGeneration],
  )

  const resetForm = useCallback(() => {
    reset(mergedDefaults as TFormValues)
  }, [reset, mergedDefaults])

  const loadFromURL = useCallback(
    (url: string): boolean => {
      if (!parseLink) {
        console.warn('parseLink function not provided, cannot load from URL')
        return false
      }

      try {
        const parsed = parseLink(url)

        if (!parsed) {
          return false
        }

        // Reset form first, then apply parsed values
        reset({
          ...mergedDefaults,
          ...parsed,
        } as TFormValues)

        return true
      } catch (error) {
        console.error('Failed to parse URL:', error)
        return false
      }
    },
    [parseLink, reset, mergedDefaults],
  )

  return useMemo(
    () => ({
      formValues,
      setValue,
      handleSubmit: handleSubmit as any,
      onSubmit,
      resetForm,
      isDirty,
      isValid,
      errors,
      control,
      t,
      loadFromURL,
      form,
    }),
    [formValues, setValue, handleSubmit, onSubmit, resetForm, isDirty, isValid, errors, control, t, loadFromURL, form],
  )
}
