import type { GenerateURLParams } from '@daeuniverse/dae-node-parser'
import type { NodeFormProps } from './types'
import { generateURL, parseHTTPUrl } from '@daeuniverse/dae-node-parser'
import { createPortal } from 'react-dom'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_HTTP_FORM_VALUES, httpSchema } from '~/constants'
import { useNodeForm } from '~/hooks'

const formSchema = httpSchema.extend({
  protocol: z.enum(['http', 'https']),
})

export type HTTPFormValues = z.infer<typeof formSchema>

const defaultValues: HTTPFormValues = {
  protocol: 'http',
  ...DEFAULT_HTTP_FORM_VALUES,
}

function generateHTTPLink(data: HTTPFormValues): string {
  const generateURLParams: GenerateURLParams = {
    protocol: data.protocol,
    host: data.host,
    port: data.port,
    hash: data.name,
  }

  if (data.username && data.password) {
    Object.assign(generateURLParams, {
      username: data.username,
      password: data.password,
    })
  }

  return generateURL(generateURLParams)
}

export function HTTPForm({ onLinkGeneration, initialValues, actionsPortal }: NodeFormProps<HTTPFormValues>) {
  const { formValues, setValue, handleSubmit, onSubmit, submit, resetForm, isDirty, isValid, errors, t } = useNodeForm({
    schema: formSchema,
    defaultValues,
    initialValues,
    onLinkGeneration,
    generateLink: generateHTTPLink,
    parseLink: parseHTTPUrl,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Select
        label={t('configureNode.protocol')}
        data={[
          { label: 'HTTP', value: 'http' },
          { label: 'HTTPS', value: 'https' },
        ]}
        value={formValues.protocol}
        onChange={(val) => setValue('protocol', val as 'http' | 'https')}
      />

      <Input
        label={t('configureNode.name')}
        value={formValues.name}
        onChange={(e) => setValue('name', e.target.value)}
      />

      <Input
        label={t('configureNode.host')}
        withAsterisk
        value={formValues.host}
        onChange={(e) => setValue('host', e.target.value)}
      />

      <NumberInput
        label={t('configureNode.port')}
        withAsterisk
        min={0}
        max={65535}
        value={formValues.port}
        onChange={(val) => setValue('port', Number(val))}
      />

      <Input
        label={t('configureNode.username')}
        value={formValues.username}
        onChange={(e) => setValue('username', e.target.value)}
      />

      <Input
        label={t('configureNode.password')}
        value={formValues.password}
        onChange={(e) => setValue('password', e.target.value)}
      />

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
