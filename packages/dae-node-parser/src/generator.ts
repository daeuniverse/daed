import type { GenerateHysteria2URLParams, GenerateURLParams } from './types'

/**
 * Generate a URL from parameters
 */
export function generateURL({
  username,
  password,
  protocol,
  host,
  port,
  params,
  hash,
  path,
}: GenerateURLParams): string {
  // Build the URL manually to avoid external dependencies
  let url = `${protocol || 'http'}://`

  // Add auth if present
  if (username || password) {
    url += encodeURIComponent(username || '')

    if (password) {
      url += `:${encodeURIComponent(password)}`
    }

    url += '@'
  }

  // Add host and port
  url += host || ''

  if (port) {
    url += `:${port}`
  }

  // Add path
  if (path) {
    url += path
  }

  // Add query params
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value))
      }
    }

    const queryString = searchParams.toString()

    if (queryString) {
      url += `?${queryString}`
    }
  }

  // Add hash
  if (hash) {
    url += `#${encodeURIComponent(hash)}`
  }

  return url
}

/**
 * Generate Hysteria2 URL
 */
export function generateHysteria2URL({ protocol, auth, host, port, params }: GenerateHysteria2URLParams): string {
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

/**
 * Generate AnyTLS URL
 */
export function generateAnytlsURL({ protocol, auth, host, port, params }: GenerateHysteria2URLParams): string {
  // Use Hysteria2 generator structure as they are similar
  return generateHysteria2URL({ protocol, auth, host, port, params })
}
