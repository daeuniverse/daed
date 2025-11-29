import { zodResolver } from '@hookform/resolvers/zod'
import { Base64 } from 'js-base64'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_V2RAY_FORM_VALUES, v2raySchema } from '~/constants'
import { useSetValue } from '~/hooks/useSetValue'
import { generateURL } from '~/utils'

const formSchema = v2raySchema.extend({
  protocol: z.enum(['vmess', 'vless']),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: FormValues = {
  protocol: 'vmess',
  ...DEFAULT_V2RAY_FORM_VALUES,
}

export function V2rayForm({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) {
  const { t } = useTranslation()

  const {
    handleSubmit,
    setValue: setValueOriginal,
    reset,
    control,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  })

  const setValue = useSetValue(setValueOriginal)
  const formValues = useWatch({ control })

  const onSubmit = (data: FormValues) => {
    const { protocol, net, tls, path, host, type, sni, flow, allowInsecure, alpn, id, add, port, ps } = data

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
      const body: Record<string, unknown> = structuredClone(data)

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

      return onLinkGeneration(`vmess://${Base64.encode(JSON.stringify(body))}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Select
        label={t('configureNode.protocol')}
        data={[
          { label: 'VMESS', value: 'vmess' },
          { label: 'VLESS', value: 'vless' },
        ]}
        value={formValues.protocol}
        onChange={(val) => setValue('protocol', (val || 'vmess') as 'vless' | 'vmess')}
      />

      <Input label={t('configureNode.name')} value={formValues.ps} onChange={(e) => setValue('ps', e.target.value)} />

      <Input
        label={t('configureNode.host')}
        withAsterisk
        value={formValues.add}
        onChange={(e) => setValue('add', e.target.value)}
      />

      <NumberInput
        label={t('configureNode.port')}
        withAsterisk
        min={0}
        max={65535}
        value={formValues.port}
        onChange={(val) => setValue('port', Number(val))}
      />

      <Input label="ID" withAsterisk value={formValues.id} onChange={(e) => setValue('id', e.target.value)} />

      {formValues.protocol === 'vmess' && (
        <NumberInput
          label="AlterID"
          min={0}
          max={65535}
          value={formValues.aid}
          onChange={(val) => setValue('aid', Number(val))}
        />
      )}

      {formValues.protocol === 'vmess' && (
        <Select
          label={t('configureNode.security')}
          data={[
            { label: 'auto', value: 'auto' },
            { label: 'aes-128-gcm', value: 'aes-128-gcm' },
            { label: 'chacha20-poly1305', value: 'chacha20-poly1305' },
            { label: 'none', value: 'none' },
            { label: 'zero', value: 'zero' },
          ]}
          value={formValues.scy}
          onChange={(val) => setValue('scy', (val || 'auto') as FormValues['scy'])}
        />
      )}

      {formValues.type !== 'dtls' && (
        <Select
          label="TLS"
          data={[
            { label: 'off', value: 'none' },
            { label: 'tls', value: 'tls' },
            { label: 'xtls', value: 'xtls' },
          ]}
          value={formValues.tls}
          onChange={(val) => setValue('tls', (val || 'none') as FormValues['tls'])}
        />
      )}

      {formValues.tls !== 'none' && (
        <Input label="SNI" value={formValues.sni} onChange={(e) => setValue('sni', e.target.value)} />
      )}

      <Select
        label="Flow"
        data={[
          { label: 'none', value: 'none' },
          { label: 'xtls-rprx-origin', value: 'xtls-rprx-origin' },
          { label: 'xtls-rprx-origin-udp443', value: 'xtls-rprx-origin-udp443' },
          { label: 'xtls-rprx-vision', value: 'xtls-rprx-vision-udp443' },
        ]}
        value={formValues.flow}
        onChange={(val) => setValue('flow', (val || 'none') as FormValues['flow'])}
      />

      {formValues.tls !== 'none' && (
        <Checkbox
          label="AllowInsecure"
          checked={formValues.allowInsecure}
          onCheckedChange={(checked) => setValue('allowInsecure', !!checked)}
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
        value={formValues.net}
        onChange={(val) => setValue('net', (val || 'tcp') as FormValues['net'])}
      />

      {formValues.net === 'tcp' && (
        <Select
          label={t('configureNode.type')}
          data={[
            { label: t('configureNode.noObfuscation'), value: 'none' },
            { label: t('configureNode.httpObfuscation'), value: 'srtp' },
          ]}
          value={formValues.type}
          onChange={(val) => setValue('type', (val || 'none') as FormValues['type'])}
        />
      )}

      {formValues.net === 'kcp' && (
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
          value={formValues.type}
          onChange={(val) => setValue('type', (val || 'none') as FormValues['type'])}
        />
      )}

      {(formValues.net === 'ws' ||
        formValues.net === 'h2' ||
        formValues.tls === 'tls' ||
        (formValues.net === 'tcp' && formValues.type === 'http')) && (
        <Input
          label={t('configureNode.host')}
          value={formValues.host}
          onChange={(e) => setValue('host', e.target.value)}
        />
      )}

      {formValues.tls === 'tls' && (
        <Input label="Alpn" value={formValues.alpn} onChange={(e) => setValue('alpn', e.target.value)} />
      )}

      {(formValues.net === 'ws' ||
        formValues.net === 'h2' ||
        (formValues.net === 'tcp' && formValues.type === 'http')) && (
        <Input
          label={t('configureNode.path')}
          value={formValues.path}
          onChange={(e) => setValue('path', e.target.value)}
        />
      )}

      {formValues.net === 'kcp' && (
        <Input label="Seed" value={formValues.path} onChange={(e) => setValue('path', e.target.value)} />
      )}

      {formValues.net === 'grpc' && (
        <Input label="ServiceName" value={formValues.path} onChange={(e) => setValue('path', e.target.value)} />
      )}

      <FormActions reset={() => reset(defaultValues)} isDirty={isDirty} errors={errors} />
    </form>
  )
}
