import React from 'react'
import { CIcon } from '@coreui/icons-react'
import { CTooltip } from '@coreui/react'


type InfoStatWidgetProps = {
  icon: unknown
  value: string | number
  label: string
  tooltip: string
}

const InfoStatWidget: React.FC<InfoStatWidgetProps> = ({ icon, value, label, tooltip }) => {
  return (
    <CTooltip content={tooltip} placement="bottom">
      <div className="d-flex rounded border overflow-hidden" style={{ width: '100%', maxWidth: '279px', height: '72px' }}>
        {/* Left Icon Block */}
        <div className="bg-white d-flex align-items-center justify-content-center" style={{ width: '30%' }}>
          <CIcon icon = {icon as unknown as string} height={32} width={32} className="text-black" />
        </div>

        {/* Right Content Block */}
        <div className="bg-primary text-white d-flex flex-column justify-content-center align-items-start px-3" style={{ width: '70%' }}>
          <strong className="fs-5">{value}</strong>
          <span>{label}</span>
        </div>
      </div>
    </CTooltip>
  )
}

export default InfoStatWidget
