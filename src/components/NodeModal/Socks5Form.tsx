import { NumberInput, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { DEFAULT_SOCKS5_FORM_VALUES, socks5Schema } from '~/constants'
import { GenerateURLParams, generateURL } from '~/utils'

export const Socks5Form = () => {
  const { t } = useTranslation()
  const { onSubmit, getInputProps, reset } = useForm<z.infer<typeof socks5Schema>>({
    initialValues: DEFAULT_SOCKS5_FORM_VALUES,
    validate: zodResolver(socks5Schema),
  })

  const handleSubmit = onSubmit((values) => {
    const generateURLParams: GenerateURLParams = {
      protocol: 'socks5',
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
      <TextInput label={t('configureNode.name')} {...getInputProps('name')} />

      <TextInput label={t('configureNode.host')} withAsterisk {...getInputProps('host')} />

      <NumberInput label={t('configureNode.port')} withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label={t('configureNode.username')} {...getInputProps('username')} />

      <TextInput label={t('configureNode.password')} {...getInputProps('password')} />

      <FormActions reset={reset} />
    </form>
  )
}
