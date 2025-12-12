export interface Upstream {
  id: string
  name: string
  link: string
}

export interface RoutingRule {
  id: string
  matcher: string // e.g. "qname(geosite:cn)"
  target: string // e.g. "alidns"
}

export interface DNSConfig {
  upstreams: Upstream[]
  requestRules: RoutingRule[]
  responseRules: RoutingRule[]
  others: string // Stores content that cannot be structured, e.g. global settings or comments
}
