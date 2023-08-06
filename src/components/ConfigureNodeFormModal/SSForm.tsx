import { NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { ShadowsocksNodeResolver } from '~/models'

export const SSForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const resolver = useRef(new ShadowsocksNodeResolver())
  const { values, onSubmit, getInputProps, reset } = useForm({
    initialValues: resolver.current.defaultValues,
    validate: zodResolver(resolver.current.schema),
  })

  const handleSubmit = onSubmit((values) => onLinkGeneration(resolver.current.generate(values)))

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
