import { Base64 } from 'js-base64'
import { z } from 'zod'

import { DEFAULT_SSR_FORM_VALUES, NodeType, ssrSchema } from '~/constants'
import { BaseNodeResolver } from '~/models'

export class ShadowsocksRNodeResolver extends BaseNodeResolver<typeof ssrSchema> {
  type = NodeType.shadowsocksR
  schema = ssrSchema
  defaultValues = DEFAULT_SSR_FORM_VALUES

  generate = (values: z.infer<typeof ssrSchema>) =>
    /* ssr://server:port:proto:method:obfs:URLBASE64(password)/?remarks=URLBASE64(remarks)&protoparam=URLBASE64(protoparam)&obfsparam=URLBASE64(obfsparam)) */
    `ssr://${Base64.encode(
      `${values.server}:${values.port}:${values.proto}:${values.method}:${values.obfs}:${Base64.encodeURI(
        values.password,
      )}/?remarks=${Base64.encodeURI(values.name)}&protoparam=${Base64.encodeURI(
        values.protoParam,
      )}&obfsparam=${Base64.encodeURI(values.obfsParam)}`,
    )}`

  resolve(url: string) {
    url = Base64.decode(url.substring(6))

    const arr = url.split('/?')
    const query = arr[1].split('&')

    const m: Record<string, unknown> = {}

    for (const param of query) {
      const pair = param.split('=', 2)
      const key = pair[0]
      const val = Base64.decode(pair[1])

      m[key] = val
    }

    let pre = arr[0].split(':')

    if (pre.length > 6) {
      //如果长度多于6，说明host中包含字符:，重新合并前几个分组到host去
      pre[pre.length - 6] = pre.slice(0, pre.length - 5).join(':')
      pre = pre.slice(pre.length - 6)
    }

    pre[5] = Base64.decode(pre[5])

    return {
      method: pre[3],
      password: pre[5],
      server: pre[0],
      port: pre[1],
      name: m['remarks'],
      proto: pre[2],
      protoParam: m['protoparam'],
      obfs: pre[4],
      obfsParam: m['obfsparam'],
    } as unknown as z.infer<typeof ssrSchema>
  }
}
