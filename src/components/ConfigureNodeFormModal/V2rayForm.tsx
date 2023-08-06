import { Checkbox, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { VlessNodeResolver, VmessNodeResolver, v2raySchema } from '~/models'

export const V2rayForm = ({ onLinkGeneration }: { onLinkGeneration: (link: string) => void }) => {
  const { t } = useTranslation()
  const vmessResolver = useRef(new VmessNodeResolver())
  const vlessResolver = useRef(new VlessNodeResolver())
  const { values, onSubmit, getInputProps, reset } = useForm<
    z.infer<typeof v2raySchema> & { protocol: 'vless' | 'vmess' }
  >({
    initialValues: { protocol: 'vmess', ...vmessResolver.current.defaultValues },
    validate: zodResolver(vmessResolver.current.schema),
  })

  const handleSubmit = onSubmit((values) => {
    if (values.protocol === 'vless') {
      return onLinkGeneration(vlessResolver.current.resolve(values))
    }

    if (values.protocol === 'vmess') {
      return onLinkGeneration(vmessResolver.current.resolve(values))
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
