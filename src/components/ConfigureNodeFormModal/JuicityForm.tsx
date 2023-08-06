import { Checkbox, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { JuicityNodeResolver } from '~/models'

export const JuicityForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const resolver = useRef(new JuicityNodeResolver())
  const { onSubmit, getInputProps, reset } = useForm({
    initialValues: resolver.current.defaultValues,
    validate: zodResolver(resolver.current.schema),
  })

  const handleSubmit = onSubmit((values) => onLinkGeneration(resolver.current.generate(values)))

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
