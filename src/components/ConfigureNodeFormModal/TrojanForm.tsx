import type { z } from 'zod'
import type { NodeFormProps } from './types'
import { createPortal } from 'react-dom'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_TROJAN_FORM_VALUES, trojanSchema } from '~/constants'
import { useNodeForm } from '~/hooks'
import { generateURL, parseTrojanUrl } from '~/utils'

export type TrojanFormValues = z.infer<typeof trojanSchema>

function generateTrojanLink(data: TrojanFormValues): string {
  const query: Record<string, unknown> = {
    allowInsecure: data.allowInsecure,
  }

  if (data.peer !== '') {
    query.sni = data.peer
  }

  let protocol = 'trojan'

  if (data.method !== 'origin' || data.obfs !== 'none') {
    protocol = 'trojan-go'
    query.type = data.obfs === 'none' ? 'original' : 'ws'

    if (data.method === 'shadowsocks') {
      query.encryption = `ss;${data.ssCipher};${data.ssPassword}`
    }

    if (query.type === 'ws') {
      query.host = data.host || ''
      query.path = data.path || '/'
    }

    delete query.allowInsecure
  }

  return generateURL({
    protocol,
    username: data.password,
    host: data.server,
    port: data.port,
    hash: data.name,
    params: query,
  })
}

export function TrojanForm({ onLinkGeneration, initialValues, actionsPortal }: NodeFormProps<TrojanFormValues>) {
  const { formValues, setValue, handleSubmit, onSubmit, resetForm, isDirty, isValid, errors, t } = useNodeForm({
    schema: trojanSchema,
    defaultValues: DEFAULT_TROJAN_FORM_VALUES,
    initialValues,
    onLinkGeneration,
    generateLink: generateTrojanLink,
    parseLink: parseTrojanUrl,
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

      <Input
        label={t('configureNode.password')}
        withAsterisk
        value={formValues.password}
        onChange={(e) => setValue('password', e.target.value)}
      />

      <Select
        label={t('configureNode.protocol')}
        withAsterisk
        data={[
          { label: 'origin', value: 'origin' },
          { label: 'shadowsocks', value: 'shadowsocks' },
        ]}
        value={formValues.method}
        onChange={(val) => setValue('method', (val || 'origin') as TrojanFormValues['method'])}
      />

      {formValues.method === 'shadowsocks' && (
        <Select
          label="Shadowsocks Cipher"
          withAsterisk
          data={[
            { label: 'aes-128-gcm', value: 'aes-128-gcm' },
            { label: 'aes-256-gcm', value: 'aes-256-gcm' },
            { label: 'chacha20-poly1305', value: 'chacha20-poly1305' },
            { label: 'chacha20-ietf-poly1305', value: 'chacha20-ietf-poly1305' },
          ]}
          value={formValues.ssCipher}
          onChange={(val) => setValue('ssCipher', (val || 'aes-128-gcm') as TrojanFormValues['ssCipher'])}
        />
      )}

      {formValues.method === 'shadowsocks' && (
        <Input
          label="Shadowsocks password"
          withAsterisk
          value={formValues.ssPassword}
          onChange={(e) => setValue('ssPassword', e.target.value)}
        />
      )}

      <Checkbox
        label={t('allowInsecure')}
        disabled={formValues.method !== 'origin' || formValues.obfs !== 'none'}
        checked={formValues.allowInsecure}
        onCheckedChange={(checked) => setValue('allowInsecure', !!checked)}
      />

      <Input label="SNI(Peer)" value={formValues.peer} onChange={(e) => setValue('peer', e.target.value)} />

      <Select
        label="Obfs"
        data={[
          { label: t('configureNode.noObfuscation'), value: 'none' },
          { label: 'websocket', value: 'websocket' },
        ]}
        value={formValues.obfs}
        onChange={(val) => setValue('obfs', (val || 'none') as TrojanFormValues['obfs'])}
      />

      {formValues.obfs === 'websocket' && (
        <Input
          label={t('configureNode.websocketHost')}
          value={formValues.host}
          onChange={(e) => setValue('host', e.target.value)}
        />
      )}

      {formValues.obfs === 'websocket' && (
        <Input
          label={t('configureNode.websocketPath')}
          value={formValues.path}
          onChange={(e) => setValue('path', e.target.value)}
        />
      )}

      {actionsPortal ? (
        createPortal(
          <FormActions reset={resetForm} isDirty={isDirty} isValid={isValid} errors={errors} requireDirty={false} />,
          actionsPortal,
        )
      ) : (
        <FormActions reset={resetForm} isDirty={isDirty} isValid={isValid} errors={errors} requireDirty={false} />
      )}
    </form>
  )
}
