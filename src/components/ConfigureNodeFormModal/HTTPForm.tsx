import { NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { httpSchema } from '~/constants'
import { HTTPNodeResolver } from '~/models'

export const HTTPForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const resolver = useRef(new HTTPNodeResolver())
  const { onSubmit, getInputProps, reset } = useForm<z.infer<typeof httpSchema> & { protocol: 'http' | 'https' }>({
    initialValues: { protocol: 'http', ...resolver.current.defaultValues },
    validate: zodResolver(httpSchema),
  })

  const handleSubmit = onSubmit((values) => onLinkGeneration(resolver.current.generate(values)))

  return (
    <form onSubmit={handleSubmit}>
      <Select
        label={t('configureNode.protocol')}
        data={[
          { label: 'HTTP', value: 'http' },
          { label: 'HTTPS', value: 'https' },
        ]}
        {...getInputProps('protocol')}
      />

      <TextInput label={t('configureNode.name')} {...getInputProps('name')} />

      <TextInput label={t('configureNode.host')} withAsterisk {...getInputProps('host')} />

      <NumberInput label={t('configureNode.port')} withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label={t('configureNode.username')} {...getInputProps('username')} />

      <TextInput label={t('configureNode.password')} {...getInputProps('password')} />

      <FormActions reset={reset} />
    </form>
  )
}
