import type { z } from 'zod'
import type { GenerateURLParams } from '~/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { DEFAULT_SOCKS5_FORM_VALUES, socks5Schema } from '~/constants'
import { useSetValue } from '~/hooks/useSetValue'
import { generateURL } from '~/utils'

type FormValues = z.infer<typeof socks5Schema>

export function Socks5Form({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) {
  const { t } = useTranslation()

  const {
    handleSubmit,
    setValue: setValueOriginal,
    reset,
    control,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(socks5Schema),
    defaultValues: DEFAULT_SOCKS5_FORM_VALUES,
    mode: 'onChange',
  })

  const setValue = useSetValue(setValueOriginal)
  const formValues = useWatch({ control })

  const onSubmit = (data: FormValues) => {
    const generateURLParams: GenerateURLParams = {
      protocol: 'socks5',
      host: data.host,
      port: data.port,
      hash: data.name,
    }

    if (data.username && data.password) {
      Object.assign(generateURLParams, {
        username: data.username,
        password: data.password,
      })
    }

    return onLinkGeneration(generateURL(generateURLParams))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Input
        label={t('configureNode.name')}
        value={formValues.name}
        onChange={(e) => setValue('name', e.target.value)}
      />

      <Input
        label={t('configureNode.host')}
        withAsterisk
        value={formValues.host}
        onChange={(e) => setValue('host', e.target.value)}
      />

      <NumberInput
        label={t('configureNode.port')}
        withAsterisk
        min={0}
        max={65535}
        value={formValues.port}
        onChange={(val) => setValue('port', Number(val))}
      />

      <Input
        label={t('configureNode.username')}
        value={formValues.username}
        onChange={(e) => setValue('username', e.target.value)}
      />

      <Input
        label={t('configureNode.password')}
        value={formValues.password}
        onChange={(e) => setValue('password', e.target.value)}
      />

      <FormActions reset={() => reset(DEFAULT_SOCKS5_FORM_VALUES)} isDirty={isDirty} errors={errors} />
    </form>
  )
}
