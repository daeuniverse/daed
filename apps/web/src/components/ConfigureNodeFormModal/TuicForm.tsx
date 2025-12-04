import type { z } from 'zod'
import type { NodeFormProps } from './types'
import { generateURL, parseTuicUrl } from '@daeuniverse/dae-node-parser'
import { createPortal } from 'react-dom'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_TUIC_FORM_VALUES, tuicSchema } from '~/constants'
import { useNodeForm } from '~/hooks'

export type TuicFormValues = z.infer<typeof tuicSchema>

function generateTuicLink(data: TuicFormValues): string {
  const query = {
    congestion_control: data.congestion_control,
    alpn: data.alpn,
    sni: data.sni,
    allow_insecure: data.allowInsecure,
    disable_sni: data.disable_sni,
    udp_relay_mode: data.udp_relay_mode,
  }

  return generateURL({
    protocol: 'tuic',
    username: data.uuid,
    password: data.password,
    host: data.server,
    port: data.port,
    hash: data.name,
    params: query,
  })
}

export function TuicForm({ onLinkGeneration, initialValues, actionsPortal }: NodeFormProps<TuicFormValues>) {
  const { formValues, setValue, handleSubmit, onSubmit, submit, resetForm, isDirty, isValid, errors, t } = useNodeForm({
    schema: tuicSchema,
    defaultValues: DEFAULT_TUIC_FORM_VALUES,
    initialValues,
    onLinkGeneration,
    generateLink: generateTuicLink,
    parseLink: parseTuicUrl,
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
        ]}
        value={formValues.congestion_control}
        onChange={(val) => setValue('congestion_control', val || '')}
      />

      <Input label="Alpn" value={formValues.alpn} onChange={(e) => setValue('alpn', e.target.value)} />

      <Input label="SNI" value={formValues.sni} onChange={(e) => setValue('sni', e.target.value)} />

      <Checkbox
        label={t('configureNode.disableSNI')}
        checked={formValues.disable_sni}
        onCheckedChange={(checked) => setValue('disable_sni', !!checked)}
      />

      <Select
        label={t('configureNode.udpRelayMode')}
        data={[
          { label: 'native', value: 'native' },
          { label: 'quic', value: 'quic' },
        ]}
        value={formValues.udp_relay_mode}
        onChange={(val) => setValue('udp_relay_mode', val || '')}
      />

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
