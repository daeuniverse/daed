import { Checkbox, NumberInput, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { DEFAULT_HYSTERIA2_FORM_VALUES, hysteria2Schema } from '~/constants'
import { generateHysteria2URL } from '~/utils'

export const Hysteria2Form = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const { onSubmit, getInputProps, reset } = useForm<z.infer<typeof hysteria2Schema>>({
    initialValues: DEFAULT_HYSTERIA2_FORM_VALUES,
    validate: zodResolver(hysteria2Schema),
  })

  const handleSubmit = onSubmit((values) => {
    /* hysteria2://[auth@]hostname[:port]/?[key=value]&[key=value]... */
    const query = {
      obfs: values.obfs,
      obfsPassword: values.obfsPassword,
      sni: values.sni,
      insecure: values.allowInsecure ? 1 : 0,
      pinSHA256: values.pinSHA256,
    }

    return onLinkGeneration(
      generateHysteria2URL({
        protocol: 'hysteria2',
        auth: values.auth,
        host: values.server,
        port: values.port,
        params: query,
      }),
    )
  })

  return (
    <form onSubmit={handleSubmit}>
      <TextInput label={t('configureNode.name')} {...getInputProps('name')} />
      <TextInput label={t('configureNode.host')} withAsterisk {...getInputProps('server')} />
      <NumberInput label={t('configureNode.port')} withAsterisk min={0} max={65535} {...getInputProps('port')} />
      <TextInput label="Auth" withAsterisk {...getInputProps('auth')} />
      {/* The obfuscation feature has not been implemented yet
      <Select
        label={t('configureNode.obfs')}
        data={[{ label: 'salamander', value: 'salamander' }]}
        {...getInputProps('obfs')}
      />
      <TextInput label={t('configureNode.obfsPassword')} {...getInputProps('obfsPassword')} />
      */}
      <TextInput label="SNI" {...getInputProps('sni')} />
      <TextInput label="Pin SHA256" {...getInputProps('pinSHA256')} />
      <Checkbox label={t('allowInsecure')} {...getInputProps('allowInsecure', { type: 'checkbox' })} />
      <FormActions reset={reset} />
    </form>
  )
}
