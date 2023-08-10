import { z } from 'zod'

import { DEFAULT_HTTP_FORM_VALUES, NodeType, httpSchema } from '~/constants'
import { BaseNodeResolver } from '~/models'
import { GenerateURLParams } from '~/utils'

export class HTTPNodeResolver extends BaseNodeResolver<typeof httpSchema> {
  type = NodeType.http
  schema = httpSchema
  defaultValues = DEFAULT_HTTP_FORM_VALUES

  generate = (values: z.infer<typeof httpSchema> & { protocol: 'http' | 'https' }) => {
    const generateURLParams: GenerateURLParams = {
      protocol: values.protocol,
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

    return this.generateURL(generateURLParams)
  }

  resolve(_url: string) {
    return {} as z.infer<typeof httpSchema>
  }
}
