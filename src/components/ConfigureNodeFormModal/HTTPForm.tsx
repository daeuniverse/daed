import { NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { DEFAULT_HTTP_FORM_VALUES, httpSchema } from '~/constants'
import { GenerateURLParams, generateURL } from '~/utils'

export const HTTPForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const { onSubmit, getInputProps, reset } = useForm<z.infer<typeof httpSchema> & { protocol: 'http' | 'https' }>({
    initialValues: {
      protocol: 'http',
      ...DEFAULT_HTTP_FORM_VALUES,
    },
    validate: zodResolver(httpSchema),
  })

  const handleSubmit = onSubmit((values) => {
    const generateURLParams: GenerateURLParams = {
      protocol: `${values.protocol}-proxy`,
      host: values.host,
      port: values.port,
      hash: values.name,
    }

    if (values.username && values.password) {
      Object.assign(generateURLParams, {
        username: values.username,
        password: values.password,
      })
    }

    return generateURL(generateURLParams)
  })

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
