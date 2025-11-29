import type { z } from 'zod'
import type { NodeFormProps } from './types'
import type { GenerateURLParams } from '~/utils'

import { FormActions } from '~/components/FormActions'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { DEFAULT_SOCKS5_FORM_VALUES, socks5Schema } from '~/constants'
import { useNodeForm } from '~/hooks'
import { generateURL, parseSocks5Url } from '~/utils'

export type Socks5FormValues = z.infer<typeof socks5Schema>

function generateSocks5Link(data: Socks5FormValues): string {
  const generateURLParams: GenerateURLParams = {
    protocol: 'socks5',
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

export function Socks5Form({ onLinkGeneration, initialValues }: NodeFormProps<Socks5FormValues>) {
  const { formValues, setValue, handleSubmit, onSubmit, resetForm, isDirty, isValid, errors, t } = useNodeForm({
    schema: socks5Schema,
    defaultValues: DEFAULT_SOCKS5_FORM_VALUES,
    initialValues,
    onLinkGeneration,
    generateLink: generateSocks5Link,
    parseLink: parseSocks5Url,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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

      <FormActions reset={resetForm} isDirty={isDirty} isValid={isValid} errors={errors} requireDirty={false} />
    </form>
  )
}
