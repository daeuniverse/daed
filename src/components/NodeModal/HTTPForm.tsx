import { NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { DEFAULT_HTTP_FORM_VALUES, httpSchema } from '~/constants'
import { GenerateURLParams, generateURL } from '~/utils'

export const HTTPForm = () => {
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
        label="Protocol"
        data={[
          { label: 'HTTP', value: 'http' },
          { label: 'HTTPS', value: 'https' },
        ]}
        {...getInputProps('protocol')}
      />

      <TextInput label="Name" {...getInputProps('name')} />

      <TextInput label="Host" withAsterisk {...getInputProps('host')} />

      <NumberInput label="Port" withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label="Username" {...getInputProps('username')} />

      <TextInput label="Password" {...getInputProps('password')} />

      <FormActions reset={reset} />
    </form>
  )
}
