import URI from 'urijs'

export type GenerateURLParams = {
  username?: string
  password?: string
  protocol: string
  host: string
  port: number
  params?: Record<string, unknown>
  hash: string
  path?: string
}

export const generateURL = ({ username, password, protocol, host, port, params, hash, path }: GenerateURLParams) => {
  /**
   * 所有参数设置默认值
   * 避免方法检测到参数为null/undefine返回该值查询结果
   * 查询结果当然不是URI类型，导致链式调用失败
   */
  const uri = URI()
    .protocol(protocol || 'http')
    .username(username || '')
    .password(password || '')
    .host(host || '')
    .port(String(port) || '80')
    .path(path || '')
    .query(params || {})
    .hash(hash || '')

  return uri.toString()
}

export const generateHysteria2URL = ({
  protocol,
  auth,
  host,
  port,
  params,
}: {
  protocol: string
  auth: string
  host: string
  port: number
  params: Record<string, string | number | boolean>
}) => {
  // Encode the auth field to handle special characters like '@'
  const encodedAuth = encodeURIComponent(auth)
  const uri = new URL(`${protocol}://${encodedAuth}@${host}:${port}/`)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      uri.searchParams.append(key, String(value))
    }
  })

  return uri.toString()
}
