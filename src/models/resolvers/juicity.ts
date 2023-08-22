import { z } from 'zod'

import { DEFAULT_JUICITY_FORM_VALUES, NodeType, juicitySchema } from '~/constants'
import { BaseNodeResolver } from '~/models'

export class JuicityNodeResolver extends BaseNodeResolver<typeof juicitySchema> {
  type = NodeType.juicity
  schema = juicitySchema
  defaultValues = DEFAULT_JUICITY_FORM_VALUES

  generate = (values: z.infer<typeof juicitySchema>) =>
    this.generateURL({
      protocol: 'juicity',
      username: values.uuid,
      password: values.password,
      host: values.server,
      port: values.port,
      hash: values.name,
      params: {
        congestion_control: values.congestion_control,
        sni: values.sni,
        allow_insecure: values.allowInsecure,
      },
    })

  resolve(url: string) {
    const u = this.parseURL(url)

    return {
      name: decodeURIComponent(u.hash),
      uuid: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      server: u.host,
      port: u.port,
      sni: u.params.sni || '',
      allowInsecure: u.params.allow_insecure === true || u.params.allow_insecure === '1',
      pinnedCertchainSha256: u.params.pinned_certchain_sha256 || '',
      congestion_control: u.params.congestion_control || 'bbr',
    }
  }
}
