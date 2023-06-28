import { Checkbox, MantineProvider, Modal, NumberInput, Select, Stack, Tabs, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

import { FormActions } from './FormActions'

const V2rayForm = () => {
  const { values, onSubmit, getInputProps, reset } = useForm({
    initialValues: {
      protocol: 'vmess',
      type: 'none',
      tls: 'none',
      net: 'tcp',
      scy: 'auto',
    },
  })

  return (
    <form
      onSubmit={onSubmit((values) => {
        console.log(values)
      })}
    >
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

      {values.tls === 'xtls' && (
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
      )}

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

      {values.net === 'mkcp' || (values.net === 'kcp' && <TextInput label="Seed" {...getInputProps('path')} />)}

      {values.net === 'grpc' && <TextInput label="ServiceName" {...getInputProps('path')} />}

      <FormActions reset={reset} />
    </form>
  )
}

const SSForm = () => {
  const { values, onSubmit, getInputProps, reset } = useForm({
    initialValues: {
      plugin: '',
      method: 'aes-128-gcm',
      obfs: '',
    },
  })

  return (
    <form
      onSubmit={onSubmit((values) => {
        console.log(values)
      })}
    >
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
  const { values, onSubmit, getInputProps, reset } = useForm({
    initialValues: {
      method: 'aes-128-cfb',
      proto: 'origin',
      obfs: 'plain',
    },
  })

  return (
    <form
      onSubmit={onSubmit((values) => {
        console.log(values)
      })}
    >
      <TextInput label="Name" withAsterisk {...getInputProps('name')} />

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
  const { values, onSubmit, getInputProps, reset } = useForm({
    initialValues: {
      method: 'origin',
      obfs: 'none',
    },
  })

  return (
    <form
      onSubmit={onSubmit((values) => {
        console.log(values)
      })}
    >
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
  const { values, onSubmit, getInputProps, reset } = useForm({
    initialValues: {
      protocol: 'http',
    },
  })

  return (
    <form
      onSubmit={onSubmit((values) => {
        console.log(values)
      })}
    >
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
  const { values, onSubmit, getInputProps, reset } = useForm({
    initialValues: {
      protocol: 'vmess',
      type: 'none',
      tls: 'none',
      net: 'tcp',
    },
  })

  return (
    <form
      onSubmit={onSubmit((values) => {
        console.log(values)
      })}
    >
      <Select
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

      {values.tls === 'xtls' && (
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
      )}

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

      {values.net === 'mkcp' || (values.net === 'kcp' && <TextInput label="Seed" {...getInputProps('path')} />)}

      {values.net === 'grpc' && <TextInput label="ServiceName" {...getInputProps('path')} />}

      <FormActions reset={reset} />
    </form>
  )
}

export const NodeModal = ({ opened, onClose }: { opened: boolean; onClose: () => void }) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Configure Node">
      <MantineProvider
        theme={{
          components: {
            TabsPanel: { defaultProps: { pt: 'md' } },
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
