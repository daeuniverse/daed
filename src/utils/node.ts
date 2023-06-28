import URI from 'urijs'

export const generateURL = ({
  username,
  password,
  protocol,
  host,
  port,
  params,
  hash,
  path,
}: {
  username: string
  password: string
  protocol: string
  host: string
  port: string
  params: Record<string, unknown>
  hash: string
  path: string
}) => {
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
    .port(port || '80')
    .path(path || '')
    .query(params || {})
    .hash(hash || '')

  return uri.toString()
}
