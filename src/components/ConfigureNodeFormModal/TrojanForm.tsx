import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_TROJAN_FORM_VALUES, trojanSchema } from '~/constants'
import { generateURL } from '~/utils'

type FormValues = z.infer<typeof trojanSchema>

export function TrojanForm({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) {
  const { t } = useTranslation()

  const { handleSubmit, setValue, reset, control } = useForm<FormValues>({
    resolver: zodResolver(trojanSchema),
    defaultValues: DEFAULT_TROJAN_FORM_VALUES,
  })

  const formValues = useWatch({ control })

  const onSubmit = (data: FormValues) => {
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

    return onLinkGeneration(
      generateURL({
        protocol,
        username: data.password,
        host: data.server,
        port: data.port,
        hash: data.name,
        params: query,
      }),
    )
  }

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
        onChange={(val) => setValue('method', (val || 'origin') as FormValues['method'])}
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
          onChange={(val) => setValue('ssCipher', (val || 'aes-128-gcm') as FormValues['ssCipher'])}
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
        onChange={(val) => setValue('obfs', (val || 'none') as FormValues['obfs'])}
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

      <FormActions reset={() => reset(DEFAULT_TROJAN_FORM_VALUES)} />
    </form>
  )
}
