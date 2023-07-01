import { NumberInput, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { DEFAULT_SOCKS5_FORM_VALUES, socks5Schema } from '~/constants'
import { GenerateURLParams, generateURL } from '~/utils'

export const Socks5Form = () => {
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
      <TextInput label="Name" {...getInputProps('name')} />

      <TextInput label="Host" withAsterisk {...getInputProps('host')} />

      <NumberInput label="Port" withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label="Username" {...getInputProps('username')} />

      <TextInput label="Password" {...getInputProps('password')} />

      <FormActions reset={reset} />
    </form>
  )
}
