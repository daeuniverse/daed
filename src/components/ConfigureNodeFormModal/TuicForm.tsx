import { Checkbox, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { DEFAULT_TUIC_FORM_VALUES, tuicSchema } from '~/constants'
import { generateURL } from '~/utils'

export const TuicForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const { onSubmit, getInputProps, reset } = useForm<z.infer<typeof tuicSchema>>({
    initialValues: DEFAULT_TUIC_FORM_VALUES,
    validate: zodResolver(tuicSchema),
  })

  const handleSubmit = onSubmit((values) => {
    const query = {
      congestion_control: values.congestion_control,
      alpn: values.alpn,
      sni: values.sni,
      allow_insecure: values.allowInsecure,
      disable_sni: values.disable_sni,
      udp_relay_mode: values.udp_relay_mode,
    }

    return onLinkGeneration(
      generateURL({
        protocol: 'tuic',
        username: values.uuid,
        password: values.password,
        host: values.server,
        port: values.port,
        hash: values.name,
        params: query,
      }),
    )
  })

  return (
    <form onSubmit={handleSubmit}>
      <TextInput label={t('configureNode.name')} {...getInputProps('name')} />

      <TextInput label={t('configureNode.host')} withAsterisk {...getInputProps('server')} />

      <NumberInput label={t('configureNode.port')} withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label="UUID" withAsterisk {...getInputProps('uuid')} />

      <TextInput label={t('configureNode.password')} withAsterisk {...getInputProps('password')} />

      <TextInput label="Congestion Control" {...getInputProps('congestion_control')} />

      <TextInput label="Alpn" {...getInputProps('alpn')} />

      <TextInput label="SNI" {...getInputProps('sni')} />

      <Checkbox label="Disable SNI" {...getInputProps('disable_sni', { type: 'checkbox' })} />

      <Select
        label="UDP Relay Mode"
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
