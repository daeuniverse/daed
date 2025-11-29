import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_TROJAN_FORM_VALUES, trojanSchema } from '~/constants'
import { generateURL } from '~/utils'

export function TrojanForm({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState(DEFAULT_TROJAN_FORM_VALUES)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = trojanSchema.safeParse(formData)

    if (!result.success)
      return

    const query: Record<string, unknown> = {
      allowInsecure: formData.allowInsecure,
    }

    if (formData.peer !== '') {
      query.sni = formData.peer
    }

    let protocol = 'trojan'

    if (formData.method !== 'origin' || formData.obfs !== 'none') {
      protocol = 'trojan-go'
      query.type = formData.obfs === 'none' ? 'original' : 'ws'

      if (formData.method === 'shadowsocks') {
        query.encryption = `ss;${formData.ssCipher};${formData.ssPassword}`
      }

      if (query.type === 'ws') {
        query.host = formData.host || ''
        query.path = formData.path || '/'
      }

      delete query.allowInsecure
    }

    return onLinkGeneration(
      generateURL({
        protocol,
        username: formData.password,
        host: formData.server,
        port: formData.port,
        hash: formData.name,
        params: query,
      }),
    )
  }

  const updateField = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        label={t('configureNode.name')}
        value={formData.name}
        onChange={e => updateField('name', e.target.value)}
      />

      <Input
        label={t('configureNode.host')}
        withAsterisk
        value={formData.server}
        onChange={e => updateField('server', e.target.value)}
      />

      <NumberInput
        label={t('configureNode.port')}
        withAsterisk
        min={0}
        max={65535}
        value={formData.port}
        onChange={val => updateField('port', Number(val))}
      />

      <Input
        label={t('configureNode.password')}
        withAsterisk
        value={formData.password}
        onChange={e => updateField('password', e.target.value)}
      />

      <Select
        label={t('configureNode.protocol')}
        withAsterisk
        data={[
          { label: 'origin', value: 'origin' },
          { label: 'shadowsocks', value: 'shadowsocks' },
        ]}
        value={formData.method}
        onChange={val => updateField('method', (val || 'origin') as typeof formData.method)}
      />

      {formData.method === 'shadowsocks' && (
        <Select
          label="Shadowsocks Cipher"
          withAsterisk
          data={[
            { label: 'aes-128-gcm', value: 'aes-128-gcm' },
            { label: 'aes-256-gcm', value: 'aes-256-gcm' },
            { label: 'chacha20-poly1305', value: 'chacha20-poly1305' },
            { label: 'chacha20-ietf-poly1305', value: 'chacha20-ietf-poly1305' },
          ]}
          value={formData.ssCipher}
          onChange={val => updateField('ssCipher', (val || 'aes-128-gcm') as typeof formData.ssCipher)}
        />
      )}

      {formData.method === 'shadowsocks' && (
        <Input
          label="Shadowsocks password"
          withAsterisk
          value={formData.ssPassword}
          onChange={e => updateField('ssPassword', e.target.value)}
        />
      )}

      <Checkbox
        label={t('allowInsecure')}
        disabled={formData.method !== 'origin' || formData.obfs !== 'none'}
        checked={formData.allowInsecure}
        onCheckedChange={checked => updateField('allowInsecure', !!checked)}
      />

      <Input label="SNI(Peer)" value={formData.peer} onChange={e => updateField('peer', e.target.value)} />

      <Select
        label="Obfs"
        data={[
          { label: t('configureNode.noObfuscation'), value: 'none' },
          { label: 'websocket', value: 'websocket' },
        ]}
        value={formData.obfs}
        onChange={val => updateField('obfs', (val || 'none') as typeof formData.obfs)}
      />

      {formData.obfs === 'websocket' && (
        <Input
          label={t('configureNode.websocketHost')}
          value={formData.host}
          onChange={e => updateField('host', e.target.value)}
        />
      )}

      {formData.obfs === 'websocket' && (
        <Input
          label={t('configureNode.websocketPath')}
          value={formData.path}
          onChange={e => updateField('path', e.target.value)}
        />
      )}

      <FormActions reset={() => setFormData(DEFAULT_TROJAN_FORM_VALUES)} />
    </form>
  )
}
