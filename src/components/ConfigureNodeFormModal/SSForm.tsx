import { NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { Base64 } from 'js-base64'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { DEFAULT_SS_FORM_VALUES, ssSchema } from '~/constants'

export const SSForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const { values, onSubmit, getInputProps, reset } = useForm<z.infer<typeof ssSchema>>({
    initialValues: DEFAULT_SS_FORM_VALUES,
    validate: zodResolver(ssSchema),
  })

  const handleSubmit = onSubmit((values) => {
    /* ss://BASE64(method:password)@server:port#name */
    let link = `ss://${Base64.encode(`${values.method}:${values.password}`)}@${values.server}:${values.port}/`

    if (values.plugin) {
      const plugin: string[] = [values.plugin]

      if (values.plugin === 'v2ray-plugin') {
        if (values.tls) {
          plugin.push('tls')
        }

        if (values.mode !== 'websocket') {
          plugin.push('mode=' + values.mode)
        }

        if (values.host) {
          plugin.push('host=' + values.host)
        }

        if (values.path) {
          if (!values.path.startsWith('/')) {
            values.path = '/' + values.path
          }

          plugin.push('path=' + values.path)
        }

        if (values.impl) {
          plugin.push('impl=' + values.impl)
        }
      } else {
        plugin.push('obfs=' + values.obfs)
        plugin.push('obfs-host=' + values.host)

        if (values.obfs === 'http') {
          plugin.push('obfs-path=' + values.path)
        }

        if (values.impl) {
          plugin.push('impl=' + values.impl)
        }
      }

      link += `?plugin=${encodeURIComponent(plugin.join(';'))}`
    }

    link += values.name.length ? `#${encodeURIComponent(values.name)}` : ''

    return link
  })

  return (
    <form onSubmit={handleSubmit}>
      <TextInput label={t('configureNode.name')} {...getInputProps('name')} />

      <TextInput label={t('configureNode.host')} withAsterisk {...getInputProps('server')} />

      <NumberInput label={t('configureNode.port')} withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label={t('configureNode.password')} withAsterisk {...getInputProps('password')} />

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
        {...getInputProps('method')}
      />

      <Select
        label="Plugin"
        data={[
          { label: 'off', value: '' },
          { label: 'simple-obfs', value: 'simple-obfs' },
          { label: 'v2ray-plugin', value: 'v2ray-plugin' },
        ]}
        {...getInputProps('plugin')}
      />

      {values.plugin === 'simple-obfs' ||
        (values.plugin === 'v2ray-plugin' && (
          <Select
            label="Impl"
            data={[
              { label: 'Keep Default', value: '' },
              { label: 'chained', value: 'chained' },
              { label: 'transport', value: 'transport' },
            ]}
            {...getInputProps('impl')}
          />
        ))}

      {values.plugin === 'simple-obfs' && (
        <Select
          label="Obfs"
          data={[
            { label: 'http', value: 'http' },
            { label: 'tls', value: 'tls' },
          ]}
          {...getInputProps('obfs')}
        />
      )}

      {values.plugin === 'v2ray-plugin' && (
        <Select label="Mode" data={[{ label: 'websocket', value: 'websocket' }]} {...getInputProps('mode')} />
      )}

      {values.plugin === 'v2ray-plugin' && (
        <Select
          label="TLS"
          data={[
            { label: 'off', value: '' },
            { label: 'tls', value: 'tls' },
          ]}
          {...getInputProps('tls')}
        />
      )}

      {((values.plugin === 'simple-obfs' && (values.obfs === 'http' || values.obfs === 'tls')) ||
        values.plugin === 'v2ray-plugin') && <TextInput label="Host" {...getInputProps('host')} />}

      {(values.plugin === 'simple-obfs' && values.obfs === 'http') ||
        (values.plugin === 'v2ray-plugin' && <TextInput label="Path" {...getInputProps('path')} />)}

      <FormActions reset={reset} />
    </form>
  )
}
