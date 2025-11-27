import { Base64 } from 'js-base64'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_V2RAY_FORM_VALUES, v2raySchema } from '~/constants'
import { generateURL } from '~/utils'

export const V2rayForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<typeof DEFAULT_V2RAY_FORM_VALUES & { protocol: 'vless' | 'vmess' }>({
    protocol: 'vmess',
    ...DEFAULT_V2RAY_FORM_VALUES,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = v2raySchema.safeParse(formData)

    if (!result.success) return

    const { protocol, net, tls, path, host, type, sni, flow, allowInsecure, alpn, id, add, port, ps } = formData

    if (protocol === 'vless') {
      const params: Record<string, unknown> = {
        type: net,
        security: tls,
        path,
        host,
        headerType: type,
        sni,
        flow,
        allowInsecure,
      }

      if (alpn !== '') params.alpn = alpn

      if (net === 'grpc') params.serviceName = path

      if (net === 'kcp') params.seed = path

      return onLinkGeneration(
        generateURL({
          protocol,
          username: id,
          host: add,
          port,
          hash: ps,
          params,
        }),
      )
    }

    if (protocol === 'vmess') {
      const body: Record<string, unknown> = structuredClone(formData)

      switch (net) {
        case 'kcp':
        case 'tcp':
        default:
          body.type = ''
      }

      switch (body.net) {
        case 'ws':
          // No operation, skip
          break
        case 'h2':
        case 'grpc':
        case 'kcp':
        default:
          if (body.net === 'tcp' && body.type === 'http') {
            break
          }

          body.path = ''
      }

      if (!(body.protocol === 'vless' && body.tls === 'xtls')) {
        delete body.flow
      }

      return onLinkGeneration('vmess://' + Base64.encode(JSON.stringify(body)))
    }
  }

  const updateField = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Select
        label={t('configureNode.protocol')}
        data={[
          { label: 'VMESS', value: 'vmess' },
          { label: 'VLESS', value: 'vless' },
        ]}
        value={formData.protocol}
        onChange={(val) => updateField('protocol', (val || 'vmess') as 'vless' | 'vmess')}
      />

      <Input label={t('configureNode.name')} value={formData.ps} onChange={(e) => updateField('ps', e.target.value)} />

      <Input
        label={t('configureNode.host')}
        withAsterisk
        value={formData.add}
        onChange={(e) => updateField('add', e.target.value)}
      />

      <NumberInput
        label={t('configureNode.port')}
        withAsterisk
        min={0}
        max={65535}
        value={formData.port}
        onChange={(val) => updateField('port', Number(val))}
      />

      <Input label="ID" withAsterisk value={formData.id} onChange={(e) => updateField('id', e.target.value)} />

      {formData.protocol === 'vmess' && (
        <NumberInput
          label="AlterID"
          min={0}
          max={65535}
          value={formData.aid}
          onChange={(val) => updateField('aid', Number(val))}
        />
      )}

      {formData.protocol === 'vmess' && (
        <Select
          label={t('configureNode.security')}
          data={[
            { label: 'auto', value: 'auto' },
            { label: 'aes-128-gcm', value: 'aes-128-gcm' },
            { label: 'chacha20-poly1305', value: 'chacha20-poly1305' },
            { label: 'none', value: 'none' },
            { label: 'zero', value: 'zero' },
          ]}
          value={formData.scy}
          onChange={(val) => updateField('scy', val || '')}
        />
      )}

      {formData.type !== 'dtls' && (
        <Select
          label="TLS"
          data={[
            { label: 'off', value: 'none' },
            { label: 'tls', value: 'tls' },
            { label: 'xtls', value: 'xtls' },
          ]}
          value={formData.tls}
          onChange={(val) => updateField('tls', val || '')}
        />
      )}

      {formData.tls !== 'none' && (
        <Input label="SNI" value={formData.sni} onChange={(e) => updateField('sni', e.target.value)} />
      )}

      <Select
        label="Flow"
        data={[
          { label: 'none', value: 'none' },
          { label: 'xtls-rprx-origin', value: 'xtls-rprx-origin' },
          { label: 'xtls-rprx-origin-udp443', value: 'xtls-rprx-origin-udp443' },
          { label: 'xtls-rprx-vision', value: 'xtls-rprx-vision-udp443' },
        ]}
        value={formData.flow}
        onChange={(val) => updateField('flow', val || '')}
      />

      {formData.tls !== 'none' && (
        <Checkbox
          label="AllowInsecure"
          checked={formData.allowInsecure}
          onCheckedChange={(checked) => updateField('allowInsecure', !!checked)}
        />
      )}

      <Select
        label={t('configureNode.network')}
        data={[
          { label: 'TCP', value: 'tcp' },
          { label: 'mKCP', value: 'kcp' },
          { label: 'WebSocket', value: 'ws' },
          { label: 'HTTP/2', value: 'h2' },
          { label: 'gRPC', value: 'grpc' },
        ]}
        value={formData.net}
        onChange={(val) => updateField('net', val || '')}
      />

      {formData.net === 'tcp' && (
        <Select
          label={t('configureNode.type')}
          data={[
            { label: t('configureNode.noObfuscation'), value: 'none' },
            { label: t('configureNode.httpObfuscation'), value: 'srtp' },
          ]}
          value={formData.type}
          onChange={(val) => updateField('type', val || '')}
        />
      )}

      {formData.net === 'kcp' && (
        <Select
          label={t('configureNode.type')}
          data={[
            { label: t('configureNode.noObfuscation'), value: 'none' },
            { label: t('configureNode.srtpObfuscation'), value: 'srtp' },
            { label: t('configureNode.utpObfuscation'), value: 'utp' },
            { label: t('configureNode.wechatVideoObfuscation'), value: 'wechat-video' },
            { label: t('configureNode.dtlsObfuscation'), value: 'dtls' },
            { label: t('configureNode.wireguardObfuscation'), value: 'wireguard' },
          ]}
          value={formData.type}
          onChange={(val) => updateField('type', val || '')}
        />
      )}

      {(formData.net === 'ws' ||
        formData.net === 'h2' ||
        formData.tls === 'tls' ||
        (formData.net === 'tcp' && formData.type === 'http')) && (
        <Input
          label={t('configureNode.host')}
          value={formData.host}
          onChange={(e) => updateField('host', e.target.value)}
        />
      )}

      {formData.tls === 'tls' && (
        <Input label="Alpn" value={formData.alpn} onChange={(e) => updateField('alpn', e.target.value)} />
      )}

      {(formData.net === 'ws' || formData.net === 'h2' || (formData.net === 'tcp' && formData.type === 'http')) && (
        <Input
          label={t('configureNode.path')}
          value={formData.path}
          onChange={(e) => updateField('path', e.target.value)}
        />
      )}

      {formData.net === 'kcp' && (
        <Input label="Seed" value={formData.path} onChange={(e) => updateField('path', e.target.value)} />
      )}

      {formData.net === 'grpc' && (
        <Input label="ServiceName" value={formData.path} onChange={(e) => updateField('path', e.target.value)} />
      )}

      <FormActions reset={() => setFormData({ protocol: 'vmess', ...DEFAULT_V2RAY_FORM_VALUES })} />
    </form>
  )
}
