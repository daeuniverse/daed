import { Checkbox, MantineProvider, Modal, NumberInput, Select, Stack, Tabs, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { Base64 } from 'js-base64'
import { z } from 'zod'

import {
  DEFAULT_HTTP_FORM_VALUES,
  DEFAULT_SSR_FORM_VALUES,
  DEFAULT_SS_FORM_VALUES,
  DEFAULT_TROJAN_FORM_VALUES,
  DEFAULT_V2RAY_FORM_VALUES,
  httpSchema,
  ssSchema,
  ssrSchema,
  trojanSchema,
  v2raySchema,
} from '~/constants'
import { GenerateURLParams, generateURL } from '~/utils/node'

import { FormActions } from './FormActions'

const V2rayForm = () => {
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
      const body: Record<string, unknown> = structuredClone(values)

      switch (net) {
        case 'kcp':
        case 'tcp':
        default:
          body.type = ''
      }

      switch (body.net) {
        case 'ws':
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

      return 'vmess://' + Base64.encode(JSON.stringify(body))
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <Select
        label="Protocol"
        data={[
          { label: 'VMESS', value: 'vmess' },
          { label: 'VLESS', value: 'vless' },
        ]}
        {...getInputProps('protocol')}
      />

      <TextInput label="Name" {...getInputProps('ps')} />

      <TextInput label="Host" withAsterisk {...getInputProps('add')} />

      <NumberInput label="Port" withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label="ID" withAsterisk {...getInputProps('id')} />

      {values.protocol === 'vmess' && <NumberInput label="AlterID" min={0} max={65535} {...getInputProps('aid')} />}

      {values.protocol === 'vmess' && (
        <Select
          label="Security"
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
        label="Network"
        withAsterisk
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
          label="Type"
          data={[
            { label: 'No obfuscation', value: 'none' },
            { label: 'Obfuscated as Video Calls (SRTP)', value: 'srtp' },
          ]}
          {...getInputProps('type')}
        />
      )}

      {values.net === 'kcp' && (
        <Select
          label="Type"
          data={[
            { label: 'No obfuscation', value: 'none' },
            { label: 'Obfuscated as Video Calls (SRTP)', value: 'srtp' },
            { label: 'Obfuscated as Bittorrent (uTP)', value: 'utp' },
            { label: 'Obfuscated as Wechat Video Calls', value: 'wechat-video' },
            { label: 'Obfuscated as DTLS1.2 Packets (forcibly TLS on)', value: 'dtls' },
            { label: 'Obfuscated as WireGuard Packets', value: 'wireguard' },
          ]}
          {...getInputProps('type')}
        />
      )}

      {(values.net === 'ws' ||
        values.net === 'h2' ||
        values.tls === 'tls' ||
        (values.net === 'tcp' && values.type === 'http')) && <TextInput label="Host" {...getInputProps('host')} />}

      {values.tls === 'tls' && <TextInput label="Alpn" {...getInputProps('alpn')} />}

      {values.net === 'ws' ||
        values.net === 'h2' ||
        (values.net === 'tcp' && values.type === 'http' && <TextInput label="Path" {...getInputProps('path')} />)}

      {values.net === 'kcp' && <TextInput label="Seed" {...getInputProps('path')} />}

      {values.net === 'grpc' && <TextInput label="ServiceName" {...getInputProps('path')} />}

      <FormActions reset={reset} />
    </form>
  )
}

const SSForm = () => {
  const { values, onSubmit, getInputProps, reset } = useForm<z.infer<typeof ssSchema>>({
    initialValues: DEFAULT_SS_FORM_VALUES,
    validate: zodResolver(ssSchema),
  })

  const handleSubmit = onSubmit((values) => {
    /* ss://BASE64(method:password)@server:port#name */
    let link = `ss://${Base64.encode(`${values.method}:${values.password}`)}@${values.server}:${values.port}/`

    if (values.plugin) {
      const plugin: string[] = [values.plugin]

      if (values.plugin === 'v2ray-plugin') {
        if (values.tls) {
          plugin.push('tls')
        }

        if (values.mode !== 'websocket') {
          plugin.push('mode=' + values.mode)
        }

        if (values.host) {
          plugin.push('host=' + values.host)
        }

        if (values.path) {
          if (!values.path.startsWith('/')) {
            values.path = '/' + values.path
          }

          plugin.push('path=' + values.path)
        }

        if (values.impl) {
          plugin.push('impl=' + values.impl)
        }
      } else {
        plugin.push('obfs=' + values.obfs)
        plugin.push('obfs-host=' + values.host)

        if (values.obfs === 'http') {
          plugin.push('obfs-path=' + values.path)
        }

        if (values.impl) {
          plugin.push('impl=' + values.impl)
        }
      }

      link += `?plugin=${encodeURIComponent(plugin.join(';'))}`
    }

    link += values.name.length ? `#${encodeURIComponent(values.name)}` : ''

    return link
  })

  return (
    <form onSubmit={handleSubmit}>
      <TextInput label="Name" {...getInputProps('name')} />

      <TextInput label="Host" withAsterisk {...getInputProps('server')} />

      <NumberInput label="Port" withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label="Password" withAsterisk {...getInputProps('password')} />

      <Select
        label="Method"
        withAsterisk
        data={[
          { label: 'aes-128-gcm', value: 'aes-128-gcm' },
          { label: 'aes-256-gcm', value: 'aes-256-gcm' },
          { label: 'chacha20-poly1305', value: 'chacha20-poly1305' },
          { label: 'chacha20-ietf-poly1305', value: 'chacha20-ietf-poly1305' },
          { label: 'plain', value: 'plain' },
          { label: 'none', value: 'none' },
        ]}
        {...getInputProps('method')}
      />

      <Select
        label="Plugin"
        data={[
          { label: 'off', value: '' },
          { label: 'simple-obfs', value: 'simple-obfs' },
          { label: 'v2ray-plugin', value: 'v2ray-plugin' },
        ]}
        {...getInputProps('plugin')}
      />

      {values.plugin === 'simple-obfs' ||
        (values.plugin === 'v2ray-plugin' && (
          <Select
            label="Impl"
            data={[
              { label: 'Keep Default', value: '' },
              { label: 'chained', value: 'chained' },
              { label: 'transport', value: 'transport' },
            ]}
            {...getInputProps('impl')}
          />
        ))}

      {values.plugin === 'simple-obfs' && (
        <Select
          label="Obfs"
          data={[
            { label: 'http', value: 'http' },
            { label: 'tls', value: 'tls' },
          ]}
          {...getInputProps('obfs')}
        />
      )}

      {values.plugin === 'v2ray-plugin' && (
        <Select label="Mode" data={[{ label: 'websocket', value: 'websocket' }]} {...getInputProps('mode')} />
      )}

      {values.plugin === 'v2ray-plugin' && (
        <Select
          label="TLS"
          data={[
            { label: 'off', value: '' },
            { label: 'tls', value: 'tls' },
          ]}
          {...getInputProps('tls')}
        />
      )}

      {((values.plugin === 'simple-obfs' && (values.obfs === 'http' || values.obfs === 'tls')) ||
        values.plugin === 'v2ray-plugin') && <TextInput label="Host" {...getInputProps('host')} />}

      {(values.plugin === 'simple-obfs' && values.obfs === 'http') ||
        (values.plugin === 'v2ray-plugin' && <TextInput label="Path" {...getInputProps('path')} />)}

      <FormActions reset={reset} />
    </form>
  )
}

const SSRForm = () => {
  const { values, onSubmit, getInputProps, reset } = useForm<z.infer<typeof ssrSchema>>({
    initialValues: DEFAULT_SSR_FORM_VALUES,
    validate: zodResolver(ssrSchema),
  })

  const handleSubmit = onSubmit((values) => {
    /* ssr://server:port:proto:method:obfs:URLBASE64(password)/?remarks=URLBASE64(remarks)&protoparam=URLBASE64(protoparam)&obfsparam=URLBASE64(obfsparam)) */
    return `ssr://${Base64.encode(
      `${values.server}:${values.port}:${values.proto}:${values.method}:${values.obfs}:${Base64.encodeURI(
        values.password
      )}/?remarks=${Base64.encodeURI(values.name)}&protoparam=${Base64.encodeURI(
        values.protoParam
      )}&obfsparam=${Base64.encodeURI(values.obfsParam)}`
    )}`
  })

  return (
    <form onSubmit={handleSubmit}>
      <TextInput label="Name" {...getInputProps('name')} />

      <TextInput label="Host" withAsterisk {...getInputProps('server')} />

      <NumberInput label="Port" withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label="Password" withAsterisk {...getInputProps('password')} />

      <Select
        label="Method"
        withAsterisk
        data={[
          { label: 'aes-128-cfb', value: 'aes-128-cfb' },
          { label: 'aes-192-cfb', value: 'aes-192-cfb' },
          { label: 'aes-256-cfb', value: 'aes-256-cfb' },
          { label: 'aes-128-ctr', value: 'aes-128-ctr' },
          { label: 'aes-192-ctr', value: 'aes-192-ctr' },
          { label: 'aes-256-ctr', value: 'aes-256-ctr' },
          { label: 'aes-128-ofb', value: 'aes-128-ofb' },
          { label: 'aes-192-ofb', value: 'aes-192-ofb' },
          { label: 'aes-256-ofb', value: 'aes-256-ofb' },
          { label: 'dae-cfb', value: 'dae-cfb' },
          { label: 'bf-cfb', value: 'bf-cfb' },
          { label: 'cast5-cfb', value: 'cast5-cfb' },
          { label: 'rc4-md5', value: 'rc4-md5' },
          { label: 'chacha20', value: 'chacha20' },
          { label: 'chacha20-ietf', value: 'chacha20-ietf' },
          { label: 'salsa20', value: 'salsa20' },
          { label: 'camellia-128-cfb', value: 'camellia-128-cfb' },
          { label: 'camellia-192-cfb', value: 'camellia-192-cfb' },
          { label: 'camellia-256-cfb', value: 'camellia-256-cfb' },
          { label: 'idea-cfb', value: 'idea-cfb' },
          { label: 'rc2-cfb', value: 'rc2-cfb' },
          { label: 'seed-cfb', value: 'seed-cfb' },
          { label: 'none', value: 'none' },
        ]}
        {...getInputProps('method')}
      />

      <Select
        label="Protocol"
        withAsterisk
        data={[
          { label: 'origin', value: 'origin' },
          { label: 'verify_sha1', value: 'verify_sha1' },
          { label: 'auth_sha1_v4', value: 'auth_sha1_v4' },
          { label: 'auth_aes128_md5', value: 'auth_aes128_md5' },
          { label: 'auth_aes128_sha1', value: 'auth_aes128_sha1' },
          { label: 'auth_chain_a', value: 'auth_chain_a' },
          { label: 'auth_chain_b', value: 'auth_chain_b' },
        ]}
        {...getInputProps('proto')}
      />

      {values.proto !== 'origin' && <TextInput label="Protocol Param" {...getInputProps('protoParam')} />}

      <Select
        label="Obfs"
        withAsterisk
        data={[
          { label: 'plain', value: 'plain' },
          { label: 'http_simple', value: 'http_simple' },
          { label: 'http_post', value: 'http_post' },
          { label: 'random_head', value: 'random_head' },
          { label: 'tls1.2_ticket_auth', value: 'tls1.2_ticket_auth' },
        ]}
        {...getInputProps('obfs')}
      />

      {values.obfs !== 'plain' && <TextInput label="Obfs Param" {...getInputProps('obfsParam')} />}

      <FormActions reset={reset} />
    </form>
  )
}

const TrojanForm = () => {
  const { values, onSubmit, getInputProps, reset } = useForm<z.infer<typeof trojanSchema>>({
    initialValues: DEFAULT_TROJAN_FORM_VALUES,
    validate: zodResolver(trojanSchema),
  })

  const handleSubmit = onSubmit((values) => {
    const query: Record<string, unknown> = {
      allowInsecure: values.allowInsecure,
    }

    if (values.peer !== '') {
      query.sni = values.peer
    }

    let protocol = 'trojan'

    if (values.method !== 'origin' || values.obfs !== 'none') {
      protocol = 'trojan-go'
      query.type = values.obfs === 'none' ? 'original' : 'ws'

      if (values.method === 'shadowsocks') {
        query.encryption = `ss;${values.ssCipher};${values.ssPassword}`
      }

      if (query.type === 'ws') {
        query.host = values.host || ''
        query.path = values.path || '/'
      }

      delete query.allowInsecure
    }

    return generateURL({
      protocol: protocol,
      username: values.password,
      host: values.server,
      port: values.port,
      hash: values.name,
      params: query,
    })
  })

  return (
    <form onSubmit={handleSubmit}>
      <TextInput label="Name" {...getInputProps('name')} />

      <TextInput label="Host" withAsterisk {...getInputProps('server')} />

      <NumberInput label="Port" withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label="Password" withAsterisk {...getInputProps('password')} />

      <Select
        label="Protocol"
        withAsterisk
        data={[
          { label: 'origin', value: 'origin' },
          { label: 'shadowsocks', value: 'shadowsocks' },
        ]}
        {...getInputProps('method')}
      />

      {values.method === 'shadowsocks' && (
        <Select
          label="Shadowsocks Cipher"
          withAsterisk
          data={[
            { label: 'aes-128-gcm', value: 'aes-128-gcm' },
            { label: 'aes-256-gcm', value: 'aes-256-gcm' },
            { label: 'chacha20-poly1305', value: 'chacha20-poly1305' },
            { label: 'chacha20-ietf-poly1305', value: 'chacha20-ietf-poly1305' },
          ]}
          {...getInputProps('ssCipher')}
        />
      )}

      {values.method === 'shadowsocks' && (
        <TextInput label="Shadowsocks password" withAsterisk {...getInputProps('ssPassword')} />
      )}

      <Checkbox
        label="Allow Insecure"
        disabled={values.method !== 'origin' || values.obfs !== 'none'}
        {...getInputProps('allowInsecure', { type: 'checkbox' })}
      />

      <TextInput label="SNI(Peer)" {...getInputProps('peer')} />

      <Select
        label="Obfs"
        data={[
          { label: 'No obfuscation', value: 'none' },
          { label: 'websocket', value: 'websocket' },
        ]}
        {...getInputProps('obfs')}
      />

      {values.obfs === 'websocket' && <TextInput label="Websocket Host" {...getInputProps('host')} />}

      {values.obfs === 'websocket' && <TextInput label="Websocket Path" {...getInputProps('path')} />}

      <FormActions reset={reset} />
    </form>
  )
}

const HTTPForm = () => {
  const { onSubmit, getInputProps, reset } = useForm<z.infer<typeof httpSchema>>({
    initialValues: DEFAULT_HTTP_FORM_VALUES,
    validate: zodResolver(httpSchema),
  })

  const handleSubmit = onSubmit((values) => {
    const generateURLParams: GenerateURLParams = {
      protocol: `${values.protocol}-proxy`,
      host: values.host,
      port: values.port,
      hash: values.name,
    }

    if (values.username && values.password) {
      Object.assign(generateURLParams, {
        username: values.username,
        password: values.password,
      })
    }

    return generateURL(generateURLParams)
  })

  return (
    <form onSubmit={handleSubmit}>
      <Select
        label="Protocol"
        data={[
          { label: 'HTTP', value: 'http' },
          { label: 'HTTPS', value: 'https' },
        ]}
        {...getInputProps('protocol')}
      />

      <TextInput label="Name" {...getInputProps('name')} />

      <TextInput label="Host" withAsterisk {...getInputProps('host')} />

      <NumberInput label="Port" withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label="Username" {...getInputProps('username')} />

      <TextInput label="Password" {...getInputProps('password')} />

      <FormActions reset={reset} />
    </form>
  )
}

const Socks5Form = () => {
  const { onSubmit, getInputProps, reset } = useForm({
    initialValues: {},
  })

  return (
    <form
      onSubmit={onSubmit((values) => {
        console.log(values)
      })}
    >
      <TextInput label="Name" {...getInputProps('name')} />

      <TextInput label="Host" withAsterisk {...getInputProps('host')} />

      <NumberInput label="Port" withAsterisk min={0} max={65535} {...getInputProps('port')} />

      <TextInput label="Username" {...getInputProps('username')} />

      <TextInput label="Password" {...getInputProps('password')} />

      <FormActions reset={reset} />
    </form>
  )
}

export const NodeModal = ({ opened, onClose }: { opened: boolean; onClose: () => void }) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Configure Node" size="md">
      <MantineProvider
        theme={{
          components: {
            TabsPanel: { defaultProps: { pt: 'md' } },
            Stack: { defaultProps: { spacing: 'sm' } },
          },
        }}
        inherit
      >
        <Tabs defaultValue="v2ray" pt="xs">
          <Tabs.List position="center">
            <Tabs.Tab value="v2ray">V2RAY</Tabs.Tab>
            <Tabs.Tab value="ss">SS</Tabs.Tab>
            <Tabs.Tab value="ssr">SSR</Tabs.Tab>
            <Tabs.Tab value="trojan">Trojan</Tabs.Tab>
            <Tabs.Tab value="http">HTTP</Tabs.Tab>
            <Tabs.Tab value="socks5">SOCKS5</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="v2ray">
            <Stack>
              <V2rayForm />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="ss">
            <Stack>
              <SSForm />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="ssr">
            <Stack>
              <SSRForm />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="trojan">
            <Stack>
              <TrojanForm />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="http">
            <Stack>
              <HTTPForm />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="socks5">
            <Stack>
              <Socks5Form />
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </MantineProvider>
    </Modal>
  )
}
