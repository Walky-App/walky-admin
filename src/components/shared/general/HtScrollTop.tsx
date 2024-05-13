import { ScrollTop } from 'primereact/scrolltop'

import { cn } from '../../../utils/cn'

interface HtScrollTopProps {
  threshold?: number
  className?: string
}

export const HtScrollTop: React.FC<HtScrollTopProps> = ({ threshold = 100, className }) => {
  return (
    <ScrollTop
      target="parent"
      threshold={threshold}
      className={cn('h-8 w-8 rounded-md bg-primary', className)}
      icon="pi pi-arrow-up text-base"
      pt={{ root: { className: 'bottom-0 right-0' } }}
    />
  )
}
