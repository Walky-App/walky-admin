import React from 'react'

import { cn } from '../../../utils/cn'

interface HtScrollDownIndicatorProps {
  position?: 'center' | 'end'
  isIndicatorVisible: boolean
}

export const HtScrollDownIndicator: React.FC<HtScrollDownIndicatorProps> = ({ position, isIndicatorVisible }) => {
  return (
    <div
      className={cn(
        'sticky bottom-0 flex',
        { 'justify-center': position === 'center' },
        { 'justify-end': position === 'end' },
      )}>
      {isIndicatorVisible ? <i className="pi pi-angle-down animate-pulse text-4xl" /> : null}
    </div>
  )
}
