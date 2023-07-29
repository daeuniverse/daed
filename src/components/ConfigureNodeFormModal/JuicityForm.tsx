import { Checkbox, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { DEFAULT_TUIC_FORM_VALUES, juicitySchema } from '~/constants'
import { generateURL } from '~/utils'

export const JuicityForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const { onSubmit, getInputProps, reset } = useForm<z.infer<typeof juicitySchema>>({
    initialValues: DEFAULT_TUIC_FORM_VALUES,
    validate: zodResolver(juicitySchema),
  })

  const handleSubmit = onSubmit((values) => {
    const query = {
      congestion_control: values.congestion_control,
      sni: values.sni,
      allow_insecure: values.allowInsecure,
    }

    return onLinkGeneration(
      generateURL({
        protocol: 'juicity',
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

      <Select
        label={t('configureNode.congestionControl')}
        data={[
          { label: 'bbr', value: 'bbr' },
          { label: 'cubic', value: 'cubic' },
          { label: 'new_reno', value: 'new_reno' },
        ]}
        {...getInputProps('congestion_control')}
      />

      <TextInput label="SNI" {...getInputProps('sni')} />

      <Checkbox label={t('allowInsecure')} {...getInputProps('allowInsecure', { type: 'checkbox' })} />

      <FormActions reset={reset} />
    </form>
  )
}
