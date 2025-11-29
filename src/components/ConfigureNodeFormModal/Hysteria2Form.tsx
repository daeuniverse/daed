import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { DEFAULT_HYSTERIA2_FORM_VALUES, hysteria2Schema } from '~/constants'
import { useSetValue } from '~/hooks/useSetValue'
import { generateHysteria2URL } from '~/utils'

type FormValues = z.infer<typeof hysteria2Schema>

export function Hysteria2Form({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) {
  const { t } = useTranslation()

  const {
    handleSubmit,
    setValue: setValueOriginal,
    reset,
    control,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(hysteria2Schema),
    defaultValues: DEFAULT_HYSTERIA2_FORM_VALUES,
    mode: 'onChange',
  })

  const setValue = useSetValue(setValueOriginal)
  const formValues = useWatch({ control })

  const onSubmit = (data: FormValues) => {
    /* hysteria2://[auth@]hostname[:port]/?[key=value]&[key=value]... */
    const query = {
      obfs: data.obfs,
      obfsPassword: data.obfsPassword,
      sni: data.sni,
      insecure: data.allowInsecure ? 1 : 0,
      pinSHA256: data.pinSHA256,
    }

    return onLinkGeneration(
      generateHysteria2URL({
        protocol: 'hysteria2',
        auth: data.auth,
        host: data.server,
        port: data.port,
        params: query,
      }),
    )
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
        value={formValues.server}
        onChange={(e) => setValue('server', e.target.value)}
      />
      <NumberInput
        label={t('configureNode.port')}
        withAsterisk
        min={0}
        max={65535}
        value={formValues.port}
        onChange={(val) => setValue('port', Number(val))}
      />
      <Input label="Auth" withAsterisk value={formValues.auth} onChange={(e) => setValue('auth', e.target.value)} />
      <Input label="SNI" value={formValues.sni} onChange={(e) => setValue('sni', e.target.value)} />
      <Input label="Pin SHA256" value={formValues.pinSHA256} onChange={(e) => setValue('pinSHA256', e.target.value)} />
      <Checkbox
        label={t('allowInsecure')}
        checked={formValues.allowInsecure}
        onCheckedChange={(checked) => setValue('allowInsecure', !!checked)}
      />
      <FormActions reset={() => reset(DEFAULT_HYSTERIA2_FORM_VALUES)} isDirty={isDirty} errors={errors} />
    </form>
  )
}
