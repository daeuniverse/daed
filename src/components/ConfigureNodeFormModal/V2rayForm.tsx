import { Checkbox, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { Base64 } from 'js-base64'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { DEFAULT_V2RAY_FORM_VALUES, v2raySchema } from '~/constants'
import { generateURL } from '~/utils'

export const V2rayForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const { values, onSubmit, getInputProps, reset } = useForm<
    z.infer<typeof v2raySchema> & { protocol: 'vless' | 'vmess' }
  >({
    initialValues: { protocol: 'vmess', ...DEFAULT_V2RAY_FORM_VALUES },
    validate: zodResolver(v2raySchema),
  })

  const handleSubmit = onSubmit((values) => {
    const { protocol, net, tls, path, host, type, sni, flow, allowInsecure, alpn, id, add, port, ps } = values

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
      const body: Record<string, unknown> = structuredClone(values)

      switch (net) {
        case 'kcp':
        case 'tcp':
        default:
          body.type = ''
      }

      switch (body.net) {
        case 'ws':
          // 不做任何操作，直接跳过
          break;
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
  })

  return (
    <form onSubmit={handleSubmit}>
      <Select
        label={t('configureNode.protocol')}
        data={[
          { label: 'VMESS', value: 'vmess' },
          { label: 'VLESS', value: 'vless' },
        ]}
        {...getInputProps('protocol')}
      />

      <TextInput label={t('configureNode.name')} {...getInputProps('ps')} />

      <TextInput label={t('configureNode.host')} withAsterisk {...getInputProps('add')} />

      <NumberInput label={t('configureNode.port')} withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label="ID" withAsterisk {...getInputProps('id')} />

      {values.protocol === 'vmess' && <NumberInput label="AlterID" min={0} max={65535} {...getInputProps('aid')} />}

      {values.protocol === 'vmess' && (
        <Select
          label={t('configureNode.security')}
          data={[
            { label: 'auto', value: 'auto' },
            { label: 'aes-128-gcm', value: 'aes-128-gcm' },
            { label: 'chacha20-poly1305', value: 'chacha20-poly1305' },
            { label: 'none', value: 'none' },
            { label: 'zero', value: 'zero' },
          ]}
          {...getInputProps('scy')}
        />
      )}

      {values.type !== 'dtls' && (
        <Select
          label="TLS"
          data={[
            { label: 'off', value: 'none' },
            { label: 'tls', value: 'tls' },
            { label: 'xtls', value: 'xtls' },
          ]}
          {...getInputProps('tls')}
        />
      )}

      {values.tls !== 'none' && <TextInput label="SNI" {...getInputProps('sni')} />}

      <Select
        label="Flow"
        data={[
          { label: 'none', value: 'none' },
          { label: 'xtls-rprx-origin', value: 'xtls-rprx-origin' },
          { label: 'xtls-rprx-origin-udp443', value: 'xtls-rprx-origin-udp443' },
          { label: 'xtls-rprx-vision', value: 'xtls-rprx-vision-udp443' },
        ]}
        {...getInputProps('flow')}
      />

      {values.tls !== 'none' && (
        <Checkbox label="AllowInsecure" {...getInputProps('allowInsecure', { type: 'checkbox' })} />
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
        {...getInputProps('net')}
      />

      {values.net === 'tcp' && (
        <Select
          label={t('configureNode.type')}
          data={[
            { label: t('configureNode.noObfuscation'), value: 'none' },
            { label: t('configureNode.httpObfuscation'), value: 'srtp' },
          ]}
          {...getInputProps('type')}
        />
      )}

      {values.net === 'kcp' && (
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
          {...getInputProps('type')}
        />
      )}

      {(values.net === 'ws' ||
        values.net === 'h2' ||
        values.tls === 'tls' ||
        (values.net === 'tcp' && values.type === 'http')) && (
        <TextInput label={t('configureNode.host')} {...getInputProps('host')} />
      )}

      {values.tls === 'tls' && <TextInput label="Alpn" {...getInputProps('alpn')} />}

      {(values.net === 'ws' || values.net === 'h2' || (values.net === 'tcp' && values.type === 'http')) && (
        <TextInput label={t('configureNode.path')} {...getInputProps('path')} />
      )}

      {values.net === 'kcp' && <TextInput label="Seed" {...getInputProps('path')} />}

      {values.net === 'grpc' && <TextInput label="ServiceName" {...getInputProps('path')} />}

      <FormActions reset={reset} />
    </form>
  )
}
