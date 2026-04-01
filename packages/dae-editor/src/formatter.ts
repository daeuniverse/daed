/**
 * RoutingA language formatter (editor adapter)
 *
 * Re-exports the shared formatter from @daeuniverse/dae-lang-core
 * with the original `formatRoutingA` name for backward compatibility.
 */

export type { FormatOptions } from '@daeuniverse/dae-lang-core'
export { formatDocument as formatRoutingA } from '@daeuniverse/dae-lang-core'
