import { NumberInput, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Socks5NodeResolver } from '~/models'

export const Socks5Form = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const resolver = useRef(new Socks5NodeResolver())
  const { onSubmit, getInputProps, reset } = useForm({
    initialValues: resolver.current.defaultValues,
    validate: zodResolver(resolver.current.schema),
  })

  const handleSubmit = onSubmit((values) => onLinkGeneration(resolver.current.resolve(values)))

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
