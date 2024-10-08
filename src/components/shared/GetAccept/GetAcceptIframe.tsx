import { useEffect, useRef } from 'react'

import { cn } from '../../../utils/cn'

interface GetAcceptIframeProps {
  documentUrl: string
  className?: string
}

export const GetAcceptIframe: React.FC<GetAcceptIframeProps> = ({ documentUrl, className }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const classes = cn(className)

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = documentUrl
    }
  }, [documentUrl])

  return <iframe ref={iframeRef} title="GetAccept Document" className={classes} />
}
