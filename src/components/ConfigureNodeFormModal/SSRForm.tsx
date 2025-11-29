import { Base64 } from 'js-base64'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_SSR_FORM_VALUES, ssrSchema } from '~/constants'

export function SSRForm({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState(DEFAULT_SSR_FORM_VALUES)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = ssrSchema.safeParse(formData)

    if (!result.success)
      return

    /* ssr://server:port:proto:method:obfs:URLBASE64(password)/?remarks=URLBASE64(remarks)&protoparam=URLBASE64(protoparam)&obfsparam=URLBASE64(obfsparam)) */
    return onLinkGeneration(
      `ssr://${Base64.encode(
        `${formData.server}:${formData.port}:${formData.proto}:${formData.method}:${formData.obfs}:${Base64.encodeURI(
          formData.password,
        )}/?remarks=${Base64.encodeURI(formData.name)}&protoparam=${Base64.encodeURI(
          formData.protoParam,
        )}&obfsparam=${Base64.encodeURI(formData.obfsParam)}`,
      )}`,
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
        label="Method"
        withAsterisk
        data={[
          { label: 'aes-128-cfb', value: 'aes-128-cfb' },
          { label: 'aes-192-cfb', value: 'aes-192-cfb' },
          { label: 'aes-256-cfb', value: 'aes-256-cfb' },
          { label: 'aes-128-ctr', value: 'aes-128-ctr' },
          { label: 'aes-192-ctr', value: 'aes-192-ctr' },
          { label: 'aes-256-ctr', value: 'aes-256-ctr' },
          { label: 'aes-128-ofb', value: 'aes-128-ofb' },
          { label: 'aes-192-ofb', value: 'aes-192-ofb' },
          { label: 'aes-256-ofb', value: 'aes-256-ofb' },
          { label: 'dae-cfb', value: 'dae-cfb' },
          { label: 'bf-cfb', value: 'bf-cfb' },
          { label: 'cast5-cfb', value: 'cast5-cfb' },
          { label: 'rc4-md5', value: 'rc4-md5' },
          { label: 'chacha20', value: 'chacha20' },
          { label: 'chacha20-ietf', value: 'chacha20-ietf' },
          { label: 'salsa20', value: 'salsa20' },
          { label: 'camellia-128-cfb', value: 'camellia-128-cfb' },
          { label: 'camellia-192-cfb', value: 'camellia-192-cfb' },
          { label: 'camellia-256-cfb', value: 'camellia-256-cfb' },
          { label: 'idea-cfb', value: 'idea-cfb' },
          { label: 'rc2-cfb', value: 'rc2-cfb' },
          { label: 'seed-cfb', value: 'seed-cfb' },
          { label: 'none', value: 'none' },
        ]}
        value={formData.method}
        onChange={val => updateField('method', (val || 'aes-128-cfb') as typeof formData.method)}
      />

      <Select
        label={t('configureNode.protocol')}
        withAsterisk
        data={[
          { label: 'origin', value: 'origin' },
          { label: 'verify_sha1', value: 'verify_sha1' },
          { label: 'auth_sha1_v4', value: 'auth_sha1_v4' },
          { label: 'auth_aes128_md5', value: 'auth_aes128_md5' },
          { label: 'auth_aes128_sha1', value: 'auth_aes128_sha1' },
          { label: 'auth_chain_a', value: 'auth_chain_a' },
          { label: 'auth_chain_b', value: 'auth_chain_b' },
        ]}
        value={formData.proto}
        onChange={val => updateField('proto', (val || 'origin') as typeof formData.proto)}
      />

      {formData.proto !== 'origin' && (
        <Input
          label={t('configureNode.protocolParam')}
          value={formData.protoParam}
          onChange={e => updateField('protoParam', e.target.value)}
        />
      )}

      <Select
        label={t('configureNode.obfs')}
        withAsterisk
        data={[
          { label: 'plain', value: 'plain' },
          { label: 'http_simple', value: 'http_simple' },
          { label: 'http_post', value: 'http_post' },
          { label: 'random_head', value: 'random_head' },
          { label: 'tls1.2_ticket_auth', value: 'tls1.2_ticket_auth' },
        ]}
        value={formData.obfs}
        onChange={val => updateField('obfs', (val || 'plain') as typeof formData.obfs)}
      />

      {formData.obfs !== 'plain' && (
        <Input
          label={t('configureNode.obfsParam')}
          value={formData.obfsParam}
          onChange={e => updateField('obfsParam', e.target.value)}
        />
      )}

      <FormActions reset={() => setFormData(DEFAULT_SSR_FORM_VALUES)} />
    </form>
  )
}
