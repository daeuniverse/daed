import type { ComponentType } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { ZodType } from 'zod'
import type { NodeFormProps } from '../types'

/**
 * Field type definitions for form field generation
 */
export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'password'

export interface SelectOption {
  label: string
  value: string
}

/**
 * Base field configuration
 */
export interface BaseFieldConfig {
  /** Field name (key in form values) */
  name: string
  /** Label translation key or static label */
  label: string
  /** Whether the field is required */
  required?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Description or help text */
  description?: string
  /** Conditional visibility based on other field values */
  visible?: (values: Record<string, unknown>) => boolean
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'password'
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number'
  min?: number
  max?: number
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select'
  options: SelectOption[] | ((values: Record<string, unknown>) => SelectOption[])
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox'
}

export type FieldConfig = TextFieldConfig | NumberFieldConfig | SelectFieldConfig | CheckboxFieldConfig

/**
 * Protocol configuration for a node type
 */
export interface ProtocolConfig<TFormValues extends FieldValues = FieldValues> {
  /** Unique protocol identifier */
  id: string
  /** Display name for the tab */
  label: string
  /** Zod schema for form validation */
  schema: ZodType<TFormValues>
  /** Default form values */
  defaultValues: TFormValues
  /** Function to generate protocol link from form values */
  generateLink: (data: TFormValues) => string
  /** Function to parse protocol link into form values */
  parseLink?: (url: string) => Partial<TFormValues> | null
  /** Field configurations for automatic form generation */
  fields?: FieldConfig[]
  /** Custom form component (if fields are not sufficient) */
  FormComponent?: ComponentType<NodeFormProps<TFormValues>>
}

/**
 * Protocol registry for managing all supported protocols
 */
export interface ProtocolRegistry {
  protocols: ProtocolConfig<FieldValues>[]
  getProtocol: (id: string) => ProtocolConfig<FieldValues> | undefined
  register: (config: ProtocolConfig<FieldValues>) => void
}
