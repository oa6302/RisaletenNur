"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }

    // Use addListener for broader compatibility and to fix parsing issues.
    mql.addListener(onChange)
    // Set initial state
    setIsMobile(mql.matches)

    return () => mql.removeListener(onChange)
  }, [])

  return isMobile
}
