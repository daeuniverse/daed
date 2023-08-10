import { Base64 } from 'js-base64'
import { z } from 'zod'

import { DEFAULT_SS_FORM_VALUES, NodeType, ssSchema } from '~/constants'
import { BaseNodeResolver } from '~/models'

export class ShadowsocksNodeResolver extends BaseNodeResolver<typeof ssSchema> {
  type = NodeType.shadowsocks
  schema = ssSchema
  defaultValues = DEFAULT_SS_FORM_VALUES

  generate(values: z.infer<typeof ssSchema>) {
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
  }

  resolve(url: string) {
    const u = this.parseURL(url)

    let mp

    if (!u.password) {
      try {
        u.username = Base64.decode(decodeURIComponent(u.username))
        mp = u.username.split(':')

        if (mp.length > 2) {
          mp[1] = mp.slice(1).join(':')
          mp = mp.slice(0, 2)
        }
      } catch (e) {
        //pass
      }
    } else {
      mp = [u.username, u.password]
    }

    u.hash = decodeURIComponent(u.hash)

    const obj: z.infer<typeof ssSchema> = {
      method: mp[0],
      password: mp[1],
      server: u.host,
      port: u.port,
      name: u.hash,
      obfs: 'http',
      plugin: '',
      impl: '',
      path: '',
      tls: '',
      mode: '',
      host: '',
    }

    if (u.params.plugin) {
      u.params.plugin = decodeURIComponent(u.params.plugin)

      const arr = u.params.plugin.split(';')

      const plugin = arr[0]

      switch (plugin) {
        case 'obfs-local':
        case 'simpleobfs':
          obj.plugin = 'simple-obfs'
          break
        case 'v2ray-plugin':
          obj.tls = ''
          obj.mode = 'websocket'
          break
      }

      for (let i = 1; i < arr.length; i++) {
        //"obfs-local;obfs=tls;obfs-host=4cb6a43103.wns.windows.com"
        const a = arr[i].split('=')

        switch (a[0]) {
          case 'obfs':
            obj.obfs = a[1]
            break
          case 'host':
          case 'obfs-host':
            obj.host = a[1]
            break
          case 'path':
          case 'obfs-path':
            obj.path = a[1]
            break
          case 'mode':
            obj.mode = a[1]
            break
          case 'tls':
            obj.tls = 'tls'
            break
          case 'impl':
            obj.impl = a[1]
        }
      }
    }

    return obj
  }
}
