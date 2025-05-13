import React from 'react'
import { CIcon } from '@coreui/icons-react'
import { CTooltip } from '@coreui/react'
import { useTheme } from '../hooks/useTheme' // 👈 import the hook

type InfoStatWidgetProps = {
  icon: unknown
  value: string | number
  label: string
  tooltip: string
}

const InfoStatWidget: React.FC<InfoStatWidgetProps> = ({ icon, value, label, tooltip }) => {
  const { theme } = useTheme(); 
  const isDark = theme.isDark;

  return (
    <CTooltip 
    content={tooltip}
    placement="bottom"
    style={{
      '--cui-tooltip-bg': theme.isDark ? '#f8f9fa' : '#000',
      '--cui-tooltip-color': theme.isDark ? '#212529' : '#fff',
      '--cui-tooltip-border-color': theme.isDark ? '#adb5bd' : '#000',
    } as React.CSSProperties}>
      <div
        className="d-flex rounded border overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '279px',
          height: '72px',
          borderColor: theme.colors.borderColor,
        }}
      >
        {/* Left Icon Block */}
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: '30%',
            backgroundColor: isDark ? '#2a2d36' : '#fff',
          }}
        >
          <CIcon
            icon={icon as unknown as string}
            height={32}
            width={32}
            style={{ color: isDark ? theme.colors.bodyColor : '#000' }}
          />
        </div>

        {/* Right Content Block */}
        <div
          className="d-flex flex-column justify-content-center align-items-start px-3"
          style={{
            width: '70%',
            backgroundColor: theme.colors.primary,
            color: '#fff',
          }}
        >
          <strong className="fs-5">{value}</strong>
          <span>{label}</span>
        </div>
      </div>
    </CTooltip>
  )
}

export default InfoStatWidget
