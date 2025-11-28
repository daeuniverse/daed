import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { DEFAULT_SOCKS5_FORM_VALUES, socks5Schema } from '~/constants'
import { GenerateURLParams, generateURL } from '~/utils'

export const Socks5Form = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState(DEFAULT_SOCKS5_FORM_VALUES)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = socks5Schema.safeParse(formData)

    if (!result.success) return

    const generateURLParams: GenerateURLParams = {
      protocol: 'socks5',
      host: formData.host,
      port: formData.port,
      hash: formData.name,
    }

    if (formData.username && formData.password) {
      Object.assign(generateURLParams, {
        username: formData.username,
        password: formData.password,
      })
    }

    return onLinkGeneration(generateURL(generateURLParams))
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
        value={formData.host}
        onChange={(e) => updateField('host', e.target.value)}
      />

      <NumberInput
        label={t('configureNode.port')}
        withAsterisk
        min={0}
        max={65535}
        value={formData.port}
        onChange={(val) => updateField('port', Number(val))}
      />

      <Input
        label={t('configureNode.username')}
        value={formData.username}
        onChange={(e) => updateField('username', e.target.value)}
      />

      <Input
        label={t('configureNode.password')}
        value={formData.password}
        onChange={(e) => updateField('password', e.target.value)}
      />

      <FormActions reset={() => setFormData(DEFAULT_SOCKS5_FORM_VALUES)} />
    </form>
  )
}
