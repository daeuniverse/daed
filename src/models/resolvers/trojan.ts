import { z } from 'zod'

import { DEFAULT_TROJAN_FORM_VALUES, NodeType, trojanSchema } from '~/constants'
import { BaseNodeResolver } from '~/models'

export class TrojanNodeResolver extends BaseNodeResolver<typeof trojanSchema> {
  type = NodeType.trojan
  schema = trojanSchema
  defaultValues = DEFAULT_TROJAN_FORM_VALUES

  generate = (values: z.infer<typeof trojanSchema>) => {
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

    return this.generateURL({
      protocol,
      username: values.password,
      host: values.server,
      port: values.port,
      hash: values.name,
      params: query,
    })
  }

  resolve(url: string) {
    const u = this.parseURL(url)

    const o: Record<string, unknown> = {
      password: decodeURIComponent(u.username),
      server: u.host,
      port: u.port,
      name: decodeURIComponent(u.hash),
      peer: u.params.peer || u.params.sni || '',
      allowInsecure: u.params.allowInsecure === true || u.params.allowInsecure === '1',
      method: 'origin',
      obfs: 'none',
      ssCipher: 'aes-128-gcm',
    }

    if (url.toLowerCase().startsWith('' + '')) {
      console.log(u.params.encryption)

      if (u.params.encryption?.startsWith('ss;')) {
        o.method = 'shadowsocks'
        const fields = u.params.encryption.split(';')
        o.ssCipher = fields[1]
        o.ssPassword = fields[2]
      }

      const obfsMap = {
        original: 'none',
        '': 'none',
        ws: 'websocket',
      }

      o.obfs = obfsMap[(u.params.type as keyof typeof obfsMap) || '']

      if (o.obfs === 'ws') {
        o.obfs = 'websocket'
      }

      if (o.obfs === 'websocket') {
        o.host = u.params.host || ''
        o.path = u.params.path || '/'
      }
    }

    return o as unknown as z.infer<typeof trojanSchema>
  }
}
