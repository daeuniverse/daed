import type { FieldValues } from 'react-hook-form'
import type { NodeFormProps } from '../types'
import type { FieldConfig, ProtocolConfig } from './types'
import { createPortal } from 'react-dom'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { useNodeForm } from '~/hooks'

interface GenericNodeFormProps extends NodeFormProps<FieldValues> {
  config: ProtocolConfig<FieldValues>
}

/**
 * Renders a single form field based on its configuration
 */
function FormField({
  field,
  formValues,
  setValue,
  translate,
}: {
  field: FieldConfig
  formValues: Record<string, unknown>
  setValue: (name: string, value: unknown) => void
  translate: (key: string) => string
}) {
  // Check visibility condition
  if (field.visible && !field.visible(formValues)) {
    return null
  }

  // Resolve label (check if it's a translation key)
  const label = field.label.includes('.') ? translate(field.label) : field.label
  const value = formValues[field.name]

  switch (field.type) {
    case 'text':
    case 'password':
      return (
        <Input
          key={field.name}
          type={field.type}
          label={label}
          withAsterisk={field.required}
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChange={(e) => setValue(field.name, e.target.value)}
        />
      )

    case 'number':
      return (
        <NumberInput
          key={field.name}
          label={label}
          withAsterisk={field.required}
          min={field.min}
          max={field.max}
          value={(value as number) ?? 0}
          onChange={(val) => setValue(field.name, Number(val))}
        />
      )

    case 'select': {
      const options = typeof field.options === 'function' ? field.options(formValues) : field.options
      return (
        <Select
          key={field.name}
          label={label}
          withAsterisk={field.required}
          data={options}
          value={(value as string) ?? ''}
          onChange={(val) => setValue(field.name, val)}
        />
      )
    }

    case 'checkbox':
      return (
        <Checkbox
          key={field.name}
          label={label}
          checked={(value as boolean) ?? false}
          onCheckedChange={(checked) => setValue(field.name, !!checked)}
        />
      )

    default:
      return null
  }
}

/**
 * Generic form component that can render any protocol form based on configuration
 */
export function GenericNodeForm({ config, onLinkGeneration, initialValues, actionsPortal }: GenericNodeFormProps) {
  const { formValues, setValue, handleSubmit, onSubmit, submit, resetForm, isDirty, isValid, errors, t } = useNodeForm({
    schema: config.schema,
    defaultValues: config.defaultValues,
    initialValues,
    onLinkGeneration,
    generateLink: config.generateLink,
    parseLink: config.parseLink,
  })

  // If no fields defined, this is an error state
  if (!config.fields || config.fields.length === 0) {
    return <div className="text-muted-foreground">No fields configured for this protocol</div>
  }

  // Create a translation helper that accepts any string
  const translate = (key: string): string => {
    // Using 'as never' to bypass i18next strict type checking
    return t(key as never) as string
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {config.fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          formValues={formValues as Record<string, unknown>}
          setValue={setValue as (name: string, value: unknown) => void}
          translate={translate}
        />
      ))}

      {actionsPortal ? (
        createPortal(
          <FormActions
            reset={resetForm}
            onSubmit={submit}
            isDirty={isDirty}
            isValid={isValid}
            errors={errors}
            requireDirty={false}
          />,
          actionsPortal,
        )
      ) : (
        <FormActions reset={resetForm} isDirty={isDirty} isValid={isValid} errors={errors} requireDirty={false} />
      )}
    </form>
  )
}
