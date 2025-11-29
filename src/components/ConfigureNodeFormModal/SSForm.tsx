import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Base64 } from 'js-base64'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_SS_FORM_VALUES, ssSchema } from '~/constants'

type FormValues = z.infer<typeof ssSchema>

export function SSForm({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) {
  const { t } = useTranslation()

  const { handleSubmit, setValue, reset, control } = useForm<FormValues>({
    resolver: zodResolver(ssSchema),
    defaultValues: DEFAULT_SS_FORM_VALUES,
  })

  const formValues = useWatch({ control })

  const onSubmit = (data: FormValues) => {
    /* ss://BASE64(method:password)@server:port#name */
    let link = `ss://${Base64.encode(`${data.method}:${data.password}`)}@${data.server}:${data.port}/`

    if (data.plugin) {
      const plugin: string[] = [data.plugin]

      if (data.plugin === 'v2ray-plugin') {
        if (data.tls) {
          plugin.push('tls')
        }

        if (data.mode !== 'websocket') {
          plugin.push(`mode=${data.mode}`)
        }

        if (data.host) {
          plugin.push(`host=${data.host}`)
        }

        let path = data.path

        if (path) {
          if (!path.startsWith('/')) {
            path = `/${path}`
          }

          plugin.push(`path=${path}`)
        }

        if (data.impl) {
          plugin.push(`impl=${data.impl}`)
        }
      } else {
        plugin.push(`obfs=${data.obfs}`)
        plugin.push(`obfs-host=${data.host}`)

        if (data.obfs === 'http') {
          plugin.push(`obfs-path=${data.path}`)
        }

        if (data.impl) {
          plugin.push(`impl=${data.impl}`)
        }
      }

      link += `?plugin=${encodeURIComponent(plugin.join(';'))}`
    }

    link += data.name.length ? `#${encodeURIComponent(data.name)}` : ''

    return onLinkGeneration(link)
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
        value={formValues.method}
        onChange={(val) => setValue('method', (val || 'aes-128-gcm') as FormValues['method'])}
      />

      <Select
        label="Plugin"
        data={[
          { label: 'off', value: '' },
          { label: 'simple-obfs', value: 'simple-obfs' },
          { label: 'v2ray-plugin', value: 'v2ray-plugin' },
        ]}
        value={formValues.plugin}
        onChange={(val) => setValue('plugin', (val || '') as FormValues['plugin'])}
      />

      {(formValues.plugin === 'simple-obfs' || formValues.plugin === 'v2ray-plugin') && (
        <Select
          label="Impl"
          data={[
            { label: 'Keep Default', value: '' },
            { label: 'chained', value: 'chained' },
            { label: 'transport', value: 'transport' },
          ]}
          value={formValues.impl}
          onChange={(val) => setValue('impl', (val || '') as FormValues['impl'])}
        />
      )}

      {formValues.plugin === 'simple-obfs' && (
        <Select
          label="Obfs"
          data={[
            { label: 'http', value: 'http' },
            { label: 'tls', value: 'tls' },
          ]}
          value={formValues.obfs}
          onChange={(val) => setValue('obfs', (val || 'http') as FormValues['obfs'])}
        />
      )}

      {formValues.plugin === 'v2ray-plugin' && (
        <Select
          label="Mode"
          data={[{ label: 'websocket', value: 'websocket' }]}
          value={formValues.mode}
          onChange={(val) => setValue('mode', val || '')}
        />
      )}

      {formValues.plugin === 'v2ray-plugin' && (
        <Select
          label="TLS"
          data={[
            { label: 'off', value: '' },
            { label: 'tls', value: 'tls' },
          ]}
          value={formValues.tls}
          onChange={(val) => setValue('tls', (val || '') as FormValues['tls'])}
        />
      )}

      {((formValues.plugin === 'simple-obfs' && (formValues.obfs === 'http' || formValues.obfs === 'tls')) ||
        formValues.plugin === 'v2ray-plugin') && (
        <Input label="Host" value={formValues.host} onChange={(e) => setValue('host', e.target.value)} />
      )}

      {((formValues.plugin === 'simple-obfs' && formValues.obfs === 'http') ||
        formValues.plugin === 'v2ray-plugin') && (
        <Input label="Path" value={formValues.path} onChange={(e) => setValue('path', e.target.value)} />
      )}

      <FormActions reset={() => reset(DEFAULT_SS_FORM_VALUES)} />
    </form>
  )
}
