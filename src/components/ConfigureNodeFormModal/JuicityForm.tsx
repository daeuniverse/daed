import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_JUICITY_FORM_VALUES, juicitySchema } from '~/constants'
import { generateURL } from '~/utils'

export function JuicityForm({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState(DEFAULT_JUICITY_FORM_VALUES)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = juicitySchema.safeParse(formData)

    if (!result.success)
      return

    const query = {
      congestion_control: formData.congestion_control,
      pinned_certchain_sha256: formData.pinned_certchain_sha256,
      sni: formData.sni,
      allow_insecure: formData.allowInsecure,
    }

    return onLinkGeneration(
      generateURL({
        protocol: 'juicity',
        username: formData.uuid,
        password: formData.password,
        host: formData.server,
        port: formData.port,
        hash: formData.name,
        params: query,
      }),
    )
  }

  const updateField = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        label={t('configureNode.name')}
        value={formData.name}
        onChange={e => updateField('name', e.target.value)}
      />

      <Input
        label={t('configureNode.host')}
        withAsterisk
        value={formData.server}
        onChange={e => updateField('server', e.target.value)}
      />

      <NumberInput
        label={t('configureNode.port')}
        withAsterisk
        min={0}
        max={65535}
        value={formData.port}
        onChange={val => updateField('port', Number(val))}
      />

      <Input label="UUID" withAsterisk value={formData.uuid} onChange={e => updateField('uuid', e.target.value)} />

      <Input
        label={t('configureNode.password')}
        withAsterisk
        value={formData.password}
        onChange={e => updateField('password', e.target.value)}
      />

      <Select
        label={t('configureNode.congestionControl')}
        data={[
          { label: 'bbr', value: 'bbr' },
          { label: 'cubic', value: 'cubic' },
          { label: 'new_reno', value: 'new_reno' },
        ]}
        value={formData.congestion_control}
        onChange={val => updateField('congestion_control', val || '')}
      />

      <Input
        label={t('configureNode.pinned_certchain_sha256')}
        value={formData.pinned_certchain_sha256}
        onChange={e => updateField('pinned_certchain_sha256', e.target.value)}
      />

      <Input label="SNI" value={formData.sni} onChange={e => updateField('sni', e.target.value)} />

      <Checkbox
        label={t('allowInsecure')}
        checked={formData.allowInsecure}
        onCheckedChange={checked => updateField('allowInsecure', !!checked)}
      />

      <FormActions reset={() => setFormData(DEFAULT_JUICITY_FORM_VALUES)} />
    </form>
  )
}
