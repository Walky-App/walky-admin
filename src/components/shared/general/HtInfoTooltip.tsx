import { Tooltip } from 'primereact/tooltip'

interface HtInfoTooltipProps {
  message: string
  children?: React.ReactNode
}

export const HtInfoTooltip: React.FC<HtInfoTooltipProps> = ({ message, children }) => {
  return (
    <>
      <Tooltip target=".custom-target-icon" />
      <div className="flex flex-row items-center gap-x-1">
        {children}
        <i
          className="custom-target-icon pi pi-info-circle p-text-secondary p-overlay-badge cursor-pointer text-sm"
          data-pr-tooltip={message}
          data-pr-position="top"
          data-pr-at="right+5 top"
          data-pr-my="left center-2"
          data-pr-classname="max-w-lg text-sm"
        />
      </div>
    </>
  )
}
