import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_JUICITY_FORM_VALUES, juicitySchema } from '~/constants'
import { generateURL } from '~/utils'

type FormValues = z.infer<typeof juicitySchema>

export function JuicityForm({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) {
  const { t } = useTranslation()

  const { handleSubmit, setValue, reset, control } = useForm<FormValues>({
    resolver: zodResolver(juicitySchema),
    defaultValues: DEFAULT_JUICITY_FORM_VALUES,
  })

  const formValues = useWatch({ control })

  const onSubmit = (data: FormValues) => {
    const query = {
      congestion_control: data.congestion_control,
      pinned_certchain_sha256: data.pinned_certchain_sha256,
      sni: data.sni,
      allow_insecure: data.allowInsecure,
    }

    return onLinkGeneration(
      generateURL({
        protocol: 'juicity',
        username: data.uuid,
        password: data.password,
        host: data.server,
        port: data.port,
        hash: data.name,
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

      <Input label="UUID" withAsterisk value={formValues.uuid} onChange={(e) => setValue('uuid', e.target.value)} />

      <Input
        label={t('configureNode.password')}
        withAsterisk
        value={formValues.password}
        onChange={(e) => setValue('password', e.target.value)}
      />

      <Select
        label={t('configureNode.congestionControl')}
        data={[
          { label: 'bbr', value: 'bbr' },
          { label: 'cubic', value: 'cubic' },
          { label: 'new_reno', value: 'new_reno' },
        ]}
        value={formValues.congestion_control}
        onChange={(val) => setValue('congestion_control', val || '')}
      />

      <Input
        label={t('configureNode.pinned_certchain_sha256')}
        value={formValues.pinned_certchain_sha256}
        onChange={(e) => setValue('pinned_certchain_sha256', e.target.value)}
      />

      <Input label="SNI" value={formValues.sni} onChange={(e) => setValue('sni', e.target.value)} />

      <Checkbox
        label={t('allowInsecure')}
        checked={formValues.allowInsecure}
        onCheckedChange={(checked) => setValue('allowInsecure', !!checked)}
      />

      <FormActions reset={() => reset(DEFAULT_JUICITY_FORM_VALUES)} />
    </form>
  )
}
