import type { TFunction } from 'i18next'
import type { NodeLatencyProbeResult } from '~/apis'

export function hasMeasuredLatency(result?: NodeLatencyProbeResult) {
  return typeof result?.latencyMs === 'number'
}

export function formatLatencyLabel(result: NodeLatencyProbeResult | undefined, t: TFunction) {
  if (!result) {
    return undefined
  }
  if (typeof result.latencyMs === 'number') {
    return `${result.latencyMs} ms`
  }
  if (result.alive === false) {
    return t('latency.failed')
  }
  return t('latency.unavailable')
}
