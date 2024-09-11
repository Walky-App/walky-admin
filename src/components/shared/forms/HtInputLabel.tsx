import { cn } from '../../../utils/cn'

interface HtInputLabelProps {
  htmlFor: string
  labelText?: string
  asterisk?: boolean
  asteriskColor?: string
  className?: string
}

export const HtInputLabel: React.FC<HtInputLabelProps> = ({
  htmlFor,
  asterisk = false,
  labelText = 'Required',
  asteriskColor = 'red',
  className,
}) => {
  return (
    <label htmlFor={htmlFor} className={cn('block text-sm font-medium leading-6', className)}>
      {asterisk ? <span style={{ color: asteriskColor }}>*&nbsp;</span> : null}
      {labelText}
    </label>
  )
}
