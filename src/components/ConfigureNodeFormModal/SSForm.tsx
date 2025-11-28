import { Base64 } from 'js-base64'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_SS_FORM_VALUES, ssSchema } from '~/constants'

export const SSForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState(DEFAULT_SS_FORM_VALUES)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = ssSchema.safeParse(formData)

    if (!result.success) return

    /* ss://BASE64(method:password)@server:port#name */
    let link = `ss://${Base64.encode(`${formData.method}:${formData.password}`)}@${formData.server}:${formData.port}/`

    if (formData.plugin) {
      const plugin: string[] = [formData.plugin]

      if (formData.plugin === 'v2ray-plugin') {
        if (formData.tls) {
          plugin.push('tls')
        }

        if (formData.mode !== 'websocket') {
          plugin.push('mode=' + formData.mode)
        }

        if (formData.host) {
          plugin.push('host=' + formData.host)
        }

        let path = formData.path

        if (path) {
          if (!path.startsWith('/')) {
            path = '/' + path
          }

          plugin.push('path=' + path)
        }

        if (formData.impl) {
          plugin.push('impl=' + formData.impl)
        }
      } else {
        plugin.push('obfs=' + formData.obfs)
        plugin.push('obfs-host=' + formData.host)

        if (formData.obfs === 'http') {
          plugin.push('obfs-path=' + formData.path)
        }

        if (formData.impl) {
          plugin.push('impl=' + formData.impl)
        }
      }

      link += `?plugin=${encodeURIComponent(plugin.join(';'))}`
    }

    link += formData.name.length ? `#${encodeURIComponent(formData.name)}` : ''

    return onLinkGeneration(link)
  }

  const updateField = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        label={t('configureNode.name')}
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
      />

      <Input
        label={t('configureNode.host')}
        withAsterisk
        value={formData.server}
        onChange={(e) => updateField('server', e.target.value)}
      />

      <NumberInput
        label={t('configureNode.port')}
        withAsterisk
        min={0}
        max={65535}
        value={formData.port}
        onChange={(val) => updateField('port', Number(val))}
      />

      <Input
        label={t('configureNode.password')}
        withAsterisk
        value={formData.password}
        onChange={(e) => updateField('password', e.target.value)}
      />

      <Select
        label="Method"
        withAsterisk
        data={[
          { label: 'aes-128-gcm', value: 'aes-128-gcm' },
          { label: 'aes-256-gcm', value: 'aes-256-gcm' },
          { label: 'chacha20-poly1305', value: 'chacha20-poly1305' },
          { label: 'chacha20-ietf-poly1305', value: 'chacha20-ietf-poly1305' },
          { label: 'plain', value: 'plain' },
          { label: 'none', value: 'none' },
        ]}
        value={formData.method}
        onChange={(val) => updateField('method', val || '')}
      />

      <Select
        label="Plugin"
        data={[
          { label: 'off', value: '' },
          { label: 'simple-obfs', value: 'simple-obfs' },
          { label: 'v2ray-plugin', value: 'v2ray-plugin' },
        ]}
        value={formData.plugin}
        onChange={(val) => updateField('plugin', val || '')}
      />

      {(formData.plugin === 'simple-obfs' || formData.plugin === 'v2ray-plugin') && (
        <Select
          label="Impl"
          data={[
            { label: 'Keep Default', value: '' },
            { label: 'chained', value: 'chained' },
            { label: 'transport', value: 'transport' },
          ]}
          value={formData.impl}
          onChange={(val) => updateField('impl', val || '')}
        />
      )}

      {formData.plugin === 'simple-obfs' && (
        <Select
          label="Obfs"
          data={[
            { label: 'http', value: 'http' },
            { label: 'tls', value: 'tls' },
          ]}
          value={formData.obfs}
          onChange={(val) => updateField('obfs', val || '')}
        />
      )}

      {formData.plugin === 'v2ray-plugin' && (
        <Select
          label="Mode"
          data={[{ label: 'websocket', value: 'websocket' }]}
          value={formData.mode}
          onChange={(val) => updateField('mode', val || '')}
        />
      )}

      {formData.plugin === 'v2ray-plugin' && (
        <Select
          label="TLS"
          data={[
            { label: 'off', value: '' },
            { label: 'tls', value: 'tls' },
          ]}
          value={formData.tls}
          onChange={(val) => updateField('tls', val || '')}
        />
      )}

      {((formData.plugin === 'simple-obfs' && (formData.obfs === 'http' || formData.obfs === 'tls')) ||
        formData.plugin === 'v2ray-plugin') && (
        <Input label="Host" value={formData.host} onChange={(e) => updateField('host', e.target.value)} />
      )}

      {((formData.plugin === 'simple-obfs' && formData.obfs === 'http') || formData.plugin === 'v2ray-plugin') && (
        <Input label="Path" value={formData.path} onChange={(e) => updateField('path', e.target.value)} />
      )}

      <FormActions reset={() => setFormData(DEFAULT_SS_FORM_VALUES)} />
    </form>
  )
}
