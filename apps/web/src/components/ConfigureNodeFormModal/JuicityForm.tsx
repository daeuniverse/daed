import type { z } from 'zod'
import type { NodeFormProps } from './types'
import { generateURL, parseJuicityUrl } from '@daeuniverse/dae-node-parser'
import { createPortal } from 'react-dom'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_JUICITY_FORM_VALUES, juicitySchema } from '~/constants'
import { useNodeForm } from '~/hooks'

export type JuicityFormValues = z.infer<typeof juicitySchema>

function generateJuicityLink(data: JuicityFormValues): string {
  const query = {
    congestion_control: data.congestion_control,
    pinned_certchain_sha256: data.pinned_certchain_sha256,
    sni: data.sni,
    allow_insecure: data.allowInsecure,
  }

  return generateURL({
    protocol: 'juicity',
    username: data.uuid,
    password: data.password,
    host: data.server,
    port: data.port,
    hash: data.name,
    params: query,
  })
}

export function JuicityForm({ onLinkGeneration, initialValues, actionsPortal }: NodeFormProps<JuicityFormValues>) {
  const { formValues, setValue, handleSubmit, onSubmit, submit, resetForm, isDirty, isValid, errors, t } = useNodeForm({
    schema: juicitySchema,
    defaultValues: DEFAULT_JUICITY_FORM_VALUES,
    initialValues,
    onLinkGeneration,
    generateLink: generateJuicityLink,
    parseLink: parseJuicityUrl,
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
        value={formValues.server}
        onChange={(e) => setValue('server', e.target.value)}
      />

      <NumberInput
        label={t('configureNode.port')}
        withAsterisk
        min={0}
        max={65535}
        value={formValues.port}
        onChange={(val) => setValue('port', Number(val))}
      />

      <Input label="UUID" withAsterisk value={formValues.uuid} onChange={(e) => setValue('uuid', e.target.value)} />

      <Input
        label={t('configureNode.password')}
        withAsterisk
        value={formValues.password}
        onChange={(e) => setValue('password', e.target.value)}
      />

      <Select
        label={t('configureNode.congestionControl')}
        data={[
          { label: 'bbr', value: 'bbr' },
          { label: 'cubic', value: 'cubic' },
          { label: 'new_reno', value: 'new_reno' },
        ]}
        value={formValues.congestion_control}
        onChange={(val) => setValue('congestion_control', val || '')}
      />

      <Input
        label={t('configureNode.pinned_certchain_sha256')}
        value={formValues.pinned_certchain_sha256}
        onChange={(e) => setValue('pinned_certchain_sha256', e.target.value)}
      />

      <Input label="SNI" value={formValues.sni} onChange={(e) => setValue('sni', e.target.value)} />

      <Checkbox
        label={t('allowInsecure')}
        checked={formValues.allowInsecure}
        onCheckedChange={(checked) => setValue('allowInsecure', !!checked)}
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
