import { useState, useCallback, useEffect } from 'react'

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

    setMatches(mediaQuery.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}
