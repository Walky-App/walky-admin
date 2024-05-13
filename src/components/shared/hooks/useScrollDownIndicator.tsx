import { useState, useRef, useEffect } from 'react'

import { useOverlayScrollListener } from 'primereact/hooks'

const useScrollDownIndicator = (initialVisibility: boolean) => {
  const [isIndicatorVisible, setIsIndicatorVisible] = useState(initialVisibility)
  const scrollableContentRef = useRef(null)

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    const { scrollTop, scrollHeight, clientHeight } = target
    if (scrollTop + clientHeight >= scrollHeight) {
      setIsIndicatorVisible(false)
    } else {
      setIsIndicatorVisible(true)
    }
  }

  const [bindOverlayScrollListener, unbindOverlayScrollListener] = useOverlayScrollListener({
    target: scrollableContentRef.current,
    listener: handleScroll,
    options: { passive: true },
    when: initialVisibility,
  })

  useEffect(() => {
    bindOverlayScrollListener()

    return () => {
      unbindOverlayScrollListener()
    }
  }, [bindOverlayScrollListener, unbindOverlayScrollListener])

  return { isIndicatorVisible, scrollableContentRef }
}

export default useScrollDownIndicator
