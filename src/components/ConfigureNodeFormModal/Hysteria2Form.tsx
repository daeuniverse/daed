import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { DEFAULT_HYSTERIA2_FORM_VALUES, hysteria2Schema } from '~/constants'
import { generateHysteria2URL } from '~/utils'

export const Hysteria2Form = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState(DEFAULT_HYSTERIA2_FORM_VALUES)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = hysteria2Schema.safeParse(formData)

    if (!result.success) return

    /* hysteria2://[auth@]hostname[:port]/?[key=value]&[key=value]... */
    const query = {
      obfs: formData.obfs,
      obfsPassword: formData.obfsPassword,
      sni: formData.sni,
      insecure: formData.allowInsecure ? 1 : 0,
      pinSHA256: formData.pinSHA256,
    }

    return onLinkGeneration(
      generateHysteria2URL({
        protocol: 'hysteria2',
        auth: formData.auth,
        host: formData.server,
        port: formData.port,
        params: query,
      }),
    )
  }

  const updateField = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        label={t('configureNode.name')}
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <Input
        label={t('configureNode.host')}
        withAsterisk
        value={formData.server}
        onChange={(e) => updateField('server', e.target.value)}
      />
      <NumberInput
        label={t('configureNode.port')}
        withAsterisk
        min={0}
        max={65535}
        value={formData.port}
        onChange={(val) => updateField('port', Number(val))}
      />
      <Input label="Auth" withAsterisk value={formData.auth} onChange={(e) => updateField('auth', e.target.value)} />
      <Input label="SNI" value={formData.sni} onChange={(e) => updateField('sni', e.target.value)} />
      <Input label="Pin SHA256" value={formData.pinSHA256} onChange={(e) => updateField('pinSHA256', e.target.value)} />
      <Checkbox
        label={t('allowInsecure')}
        checked={formData.allowInsecure}
        onCheckedChange={(checked) => updateField('allowInsecure', !!checked)}
      />
      <FormActions reset={() => setFormData(DEFAULT_HYSTERIA2_FORM_VALUES)} />
    </form>
  )
}
