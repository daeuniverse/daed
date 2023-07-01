import { NumberInput, Select, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { Base64 } from 'js-base64'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { DEFAULT_SSR_FORM_VALUES, ssrSchema } from '~/constants'

export const SSRForm = () => {
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
