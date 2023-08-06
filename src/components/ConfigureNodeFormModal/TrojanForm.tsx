import { Checkbox, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { TrojanNodeResolver } from '~/models'

export const TrojanForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const resolver = useRef(new TrojanNodeResolver())
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
        label={t('configureNode.protocol')}
        withAsterisk
        data={[
          { label: 'origin', value: 'origin' },
          { label: 'shadowsocks', value: 'shadowsocks' },
        ]}
        {...getInputProps('method')}
      />

      {values.method === 'shadowsocks' && (
        <Select
          label="Shadowsocks Cipher"
          withAsterisk
          data={[
            { label: 'aes-128-gcm', value: 'aes-128-gcm' },
            { label: 'aes-256-gcm', value: 'aes-256-gcm' },
            { label: 'chacha20-poly1305', value: 'chacha20-poly1305' },
            { label: 'chacha20-ietf-poly1305', value: 'chacha20-ietf-poly1305' },
          ]}
          {...getInputProps('ssCipher')}
        />
      )}

      {values.method === 'shadowsocks' && (
        <TextInput label="Shadowsocks password" withAsterisk {...getInputProps('ssPassword')} />
      )}

      <Checkbox
        label={t('allowInsecure')}
        disabled={values.method !== 'origin' || values.obfs !== 'none'}
        {...getInputProps('allowInsecure', { type: 'checkbox' })}
      />

      <TextInput label="SNI(Peer)" {...getInputProps('peer')} />

      <Select
        label="Obfs"
        data={[
          { label: t('configureNode.noObfuscation'), value: 'none' },
          { label: 'websocket', value: 'websocket' },
        ]}
        {...getInputProps('obfs')}
      />

      {values.obfs === 'websocket' && <TextInput label={t('configureNode.websocketHost')} {...getInputProps('host')} />}

      {values.obfs === 'websocket' && <TextInput label={t('configureNode.websocketPath')} {...getInputProps('path')} />}

      <FormActions reset={reset} />
    </form>
  )
}
