import type { NodeFormProps } from './types'
import { generateURL, parseV2rayUrl } from '@daeuniverse/dae-node-parser'
import { Base64 } from 'js-base64'
import { createPortal } from 'react-dom'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { NumberInput } from '~/components/ui/number-input'
import { Select } from '~/components/ui/select'
import { DEFAULT_V2RAY_FORM_VALUES, v2raySchema } from '~/constants'
import { useNodeForm } from '~/hooks'

const formSchema = v2raySchema.extend({
  protocol: z.enum(['vmess', 'vless']),
})

export type V2rayFormValues = z.infer<typeof formSchema>

const defaultValues: V2rayFormValues = {
  protocol: 'vmess',
  ...DEFAULT_V2RAY_FORM_VALUES,
}

function generateV2rayLink(data: V2rayFormValues): string {
  const {
    protocol,
    net,
    tls,
    path,
    host,
    type,
    sni,
    flow,
    allowInsecure,
    alpn,
    ech,
    id,
    add,
    port,
    ps,
    pbk,
    fp,
    sid,
    spx,
    pqv,
    grpcMode,
    grpcAuthority,
    xhttpMode,
    xhttpExtra,
  } = data

  if (protocol === 'vless') {
    const params: Record<string, unknown> = {
      type: net,
      security: tls,
      host,
      headerType: type,
      sni,
      flow,
      allowInsecure,
    }

    // Path handling based on network type
    if (net === 'grpc') {
      params.serviceName = path
      if (grpcMode !== 'gun') params.mode = grpcMode
      if (grpcAuthority) params.authority = grpcAuthority
    } else if (net === 'kcp') {
      params.seed = path
    } else if (net === 'xhttp') {
      params.path = path
      if (xhttpMode) params.mode = xhttpMode
      if (xhttpExtra) params.extra = xhttpExtra
    } else {
      params.path = path
    }

    if (alpn !== '') params.alpn = alpn
    if (ech !== '') params.ech = ech

    // Reality-specific parameters
    if (tls === 'reality') {
      params.pbk = pbk
      params.fp = fp
      if (sid) params.sid = sid
      if (spx) params.spx = spx
      if (pqv) params.pqv = pqv
    }

    return generateURL({
      protocol,
      username: id,
      host: add,
      port,
      hash: ps,
      params,
    })
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

    return `vmess://${Base64.encode(JSON.stringify(body))}`
  }

  return ''
}

export function V2rayForm({ onLinkGeneration, initialValues, actionsPortal }: NodeFormProps<V2rayFormValues>) {
  const { formValues, setValue, handleSubmit, onSubmit, submit, resetForm, isDirty, isValid, errors, t } = useNodeForm({
    schema: formSchema,
    defaultValues,
    initialValues,
    onLinkGeneration,
    generateLink: generateV2rayLink,
    parseLink: parseV2rayUrl,
  })

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
          onChange={(val) => setValue('scy', (val || 'auto') as V2rayFormValues['scy'])}
        />
      )}

      {formValues.type !== 'dtls' && (
        <Select
          label="TLS"
          data={[
            { label: 'off', value: 'none' },
            { label: 'tls', value: 'tls' },
            { label: 'reality', value: 'reality' },
          ]}
          value={formValues.tls}
          onChange={(val) => setValue('tls', (val || 'none') as V2rayFormValues['tls'])}
        />
      )}

      {formValues.tls !== 'none' && (
        <Input label="SNI" value={formValues.sni} onChange={(e) => setValue('sni', e.target.value)} />
      )}

      {formValues.tls === 'reality' && (
        <>
          <Input
            label={t('configureNode.publicKey')}
            withAsterisk
            value={formValues.pbk}
            onChange={(e) => setValue('pbk', e.target.value)}
          />
          <Select
            label={t('configureNode.fingerprint')}
            data={[
              { label: 'chrome', value: 'chrome' },
              { label: 'firefox', value: 'firefox' },
              { label: 'safari', value: 'safari' },
              { label: 'edge', value: 'edge' },
              { label: 'ios', value: 'ios' },
              { label: 'android', value: 'android' },
              { label: 'random', value: 'random' },
              { label: 'randomized', value: 'randomized' },
            ]}
            value={formValues.fp || 'chrome'}
            onChange={(val) => setValue('fp', val || 'chrome')}
          />
          <Input
            label={t('configureNode.shortId')}
            value={formValues.sid}
            onChange={(e) => setValue('sid', e.target.value)}
          />
          <Input
            label={t('configureNode.spiderX')}
            value={formValues.spx}
            onChange={(e) => setValue('spx', e.target.value)}
          />
          <Input label="PQV (ML-DSA-65)" value={formValues.pqv} onChange={(e) => setValue('pqv', e.target.value)} />
        </>
      )}

      <Select
        label="Flow"
        data={[
          { label: 'none', value: 'none' },
          { label: 'xtls-rprx-vision', value: 'xtls-rprx-vision' },
          { label: 'xtls-rprx-vision-udp443', value: 'xtls-rprx-vision-udp443' },
        ]}
        value={formValues.flow}
        onChange={(val) => setValue('flow', (val || 'none') as V2rayFormValues['flow'])}
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
          { label: 'HTTPUpgrade', value: 'httpupgrade' },
          { label: 'XHTTP', value: 'xhttp' },
        ]}
        value={formValues.net}
        onChange={(val) => setValue('net', (val || 'tcp') as V2rayFormValues['net'])}
      />

      {formValues.net === 'tcp' && (
        <Select
          label={t('configureNode.type')}
          data={[
            { label: t('configureNode.noObfuscation'), value: 'none' },
            { label: t('configureNode.httpObfuscation'), value: 'srtp' },
          ]}
          value={formValues.type}
          onChange={(val) => setValue('type', (val || 'none') as V2rayFormValues['type'])}
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
          onChange={(val) => setValue('type', (val || 'none') as V2rayFormValues['type'])}
        />
      )}

      {(formValues.net === 'ws' ||
        formValues.net === 'h2' ||
        formValues.net === 'httpupgrade' ||
        formValues.net === 'xhttp' ||
        formValues.tls === 'tls' ||
        (formValues.net === 'tcp' && formValues.type === 'http')) && (
        <Input
          label={t('configureNode.host')}
          value={formValues.host}
          onChange={(e) => setValue('host', e.target.value)}
        />
      )}

      {formValues.tls === 'tls' && (
        <>
          <Input label="ALPN" value={formValues.alpn} onChange={(e) => setValue('alpn', e.target.value)} />
          <Input
            label="ECH"
            placeholder="Encrypted Client Hello"
            value={formValues.ech}
            onChange={(e) => setValue('ech', e.target.value)}
          />
        </>
      )}

      {(formValues.net === 'ws' ||
        formValues.net === 'h2' ||
        formValues.net === 'httpupgrade' ||
        formValues.net === 'xhttp' ||
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
        <>
          <Input label="ServiceName" value={formValues.path} onChange={(e) => setValue('path', e.target.value)} />
          <Select
            label="gRPC Mode"
            data={[
              { label: 'gun', value: 'gun' },
              { label: 'multi', value: 'multi' },
              { label: 'guna', value: 'guna' },
            ]}
            value={formValues.grpcMode}
            onChange={(val) => setValue('grpcMode', (val || 'gun') as V2rayFormValues['grpcMode'])}
          />
          <Input
            label="Authority"
            value={formValues.grpcAuthority}
            onChange={(e) => setValue('grpcAuthority', e.target.value)}
          />
        </>
      )}

      {formValues.net === 'xhttp' && (
        <>
          <Input
            label="XHTTP Mode"
            value={formValues.xhttpMode}
            onChange={(e) => setValue('xhttpMode', e.target.value)}
          />
          <Input
            label="XHTTP Extra"
            value={formValues.xhttpExtra}
            onChange={(e) => setValue('xhttpExtra', e.target.value)}
          />
        </>
      )}

      {actionsPortal ? (
        createPortal(
          <FormActions
            reset={resetForm}
            onSubmit={submit}
            isDirty={isDirty}
            isValid={isValid}
            errors={errors}
            requireDirty={false}
          />,
          actionsPortal,
        )
      ) : (
        <FormActions reset={resetForm} isDirty={isDirty} isValid={isValid} errors={errors} requireDirty={false} />
      )}
    </form>
  )
}
