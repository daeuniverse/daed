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

  resolve(_url: string) {
    return {} as z.infer<typeof juicitySchema>
  }
}
