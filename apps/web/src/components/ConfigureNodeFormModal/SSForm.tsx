import type { z } from 'zod'
import type { NodeFormProps } from './types'
import { parseSSUrl } from '@daeuniverse/dae-node-parser'
import { Base64 } from 'js-base64'
import { createPortal } from 'react-dom'

import { FormActions } from '~/components/FormActions'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_SS_FORM_VALUES, ssSchema } from '~/constants'
import { useNodeForm } from '~/hooks'

export type SSFormValues = z.infer<typeof ssSchema>

function generateSSLink(data: SSFormValues): string {
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

  return link
}

export function SSForm({ onLinkGeneration, initialValues, actionsPortal }: NodeFormProps<SSFormValues>) {
  const { formValues, setValue, handleSubmit, onSubmit, submit, resetForm, isDirty, isValid, errors, t } = useNodeForm({
    schema: ssSchema,
    defaultValues: DEFAULT_SS_FORM_VALUES,
    initialValues,
    onLinkGeneration,
    generateLink: generateSSLink,
    parseLink: parseSSUrl,
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
        label="Method"
        withAsterisk
        data={[
          { label: 'aes-128-gcm', value: 'aes-128-gcm' },
          { label: 'aes-256-gcm', value: 'aes-256-gcm' },
          { label: 'chacha20-poly1305', value: 'chacha20-poly1305' },
          { label: 'chacha20-ietf-poly1305', value: 'chacha20-ietf-poly1305' },
          { label: '2022-blake3-aes-128-gcm', value: '2022-blake3-aes-128-gcm' },
          { label: '2022-blake3-aes-256-gcm', value: '2022-blake3-aes-256-gcm' },
          { label: '2022-blake3-chacha20-poly1305', value: '2022-blake3-chacha20-poly1305' },
          { label: 'plain', value: 'plain' },
          { label: 'none', value: 'none' },
        ]}
        value={formValues.method}
        onChange={(val) => setValue('method', (val || 'aes-128-gcm') as SSFormValues['method'])}
      />

      <Select
        label="Plugin"
        data={[
          { label: 'off', value: '' },
          { label: 'simple-obfs', value: 'simple-obfs' },
          { label: 'v2ray-plugin', value: 'v2ray-plugin' },
        ]}
        value={formValues.plugin}
        onChange={(val) => setValue('plugin', (val || '') as SSFormValues['plugin'])}
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
          onChange={(val) => setValue('impl', (val || '') as SSFormValues['impl'])}
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
          onChange={(val) => setValue('obfs', (val || 'http') as SSFormValues['obfs'])}
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
          onChange={(val) => setValue('tls', (val || '') as SSFormValues['tls'])}
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
