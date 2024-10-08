interface HtInputHelpTextProps {
  fieldName: string
  helpText: string
  className?: string
}

export const HtInputHelpText = ({ helpText, fieldName, className }: HtInputHelpTextProps) => {
  return (
    <small id={`${fieldName}-help`} className={className}>
      {helpText}
    </small>
  )
}
