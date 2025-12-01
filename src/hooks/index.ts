import { useCallback, useEffect, useState } from 'react'

export * from './useKeyboardShortcuts'
export * from './useNodeForm'
export * from './useSetValue'

export function useDisclosure(initialState = false) {
  const [opened, setOpened] = useState(initialState)

  const open = useCallback(() => setOpened(true), [])
  const close = useCallback(() => setOpened(false), [])
  const toggle = useCallback(() => setOpened((prev) => !prev), [])

  return [opened, { open, close, toggle }] as const
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }

    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

    // Sync state when query changes - this is intentional since the query prop may change
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches((prev) => {
      const current = mediaQuery.matches

      return prev !== current ? current : prev
    })
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}
