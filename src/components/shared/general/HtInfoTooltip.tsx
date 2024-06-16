import { Tooltip } from 'primereact/tooltip'

import { cn } from '../../../utils/cn'

interface HtInfoTooltipProps {
  message: string
  children?: React.ReactNode
  className?: string
}

export const HtInfoTooltip: React.FC<HtInfoTooltipProps> = ({ message, children, className }) => {
  return (
    <>
      <Tooltip target=".custom-target-icon" hideDelay={100} />
      <div className={cn('flex flex-row items-center gap-x-2', className)}>
        <i
          className="custom-target-icon pi pi-info-circle p-text-secondary p-overlay-badge cursor-pointer text-lg lg:text-sm"
          data-pr-tooltip={message}
          data-pr-position="top"
          data-pr-my="left bottom"
          data-pr-at="left top-5"
          data-pr-classname="text-sm text-wrap"
        />
        {children}
      </div>
    </>
  )
}
