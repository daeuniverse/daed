import { Checkbox, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { TuicNodeResolver } from '~/models'

export const TuicForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const resolver = useRef(new TuicNodeResolver())
  const { onSubmit, getInputProps, reset } = useForm({
    initialValues: resolver.current.defaultValues,
    validate: zodResolver(resolver.current.schema),
  })

  const handleSubmit = onSubmit((values) => onLinkGeneration(resolver.current.resolve(values)))

  return (
    <form onSubmit={handleSubmit}>
      <TextInput label={t('configureNode.name')} {...getInputProps('name')} />

      <TextInput label={t('configureNode.host')} withAsterisk {...getInputProps('server')} />

      <NumberInput label={t('configureNode.port')} withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label="UUID" withAsterisk {...getInputProps('uuid')} />

      <TextInput label={t('configureNode.password')} withAsterisk {...getInputProps('password')} />

      <Select
        label={t('configureNode.congestionControl')}
        data={[
          { label: 'bbr', value: 'bbr' },
          { label: 'cubic', value: 'cubic' },
        ]}
        {...getInputProps('congestion_control')}
      />

      <TextInput label="Alpn" {...getInputProps('alpn')} />

      <TextInput label="SNI" {...getInputProps('sni')} />

      <Checkbox label={t('configureNode.disableSNI')} {...getInputProps('disable_sni', { type: 'checkbox' })} />

      <Select
        label={t('configureNode.udpRelayMode')}
        data={[
          { label: 'native', value: 'native' },
          { label: 'quic', value: 'quic' },
        ]}
        {...getInputProps('udp_relay_mode')}
      />

      <Checkbox label={t('allowInsecure')} {...getInputProps('allowInsecure', { type: 'checkbox' })} />

      <FormActions reset={reset} />
    </form>
  )
}
