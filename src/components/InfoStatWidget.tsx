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

  return (
    <CTooltip 
      content={tooltip}
      placement="bottom"
      style={{
        '--cui-tooltip-bg': theme.isDark ? '#1e293b' : '#fff',
        '--cui-tooltip-color': theme.isDark ? '#f1f5f9' : '#1e293b',
        '--cui-tooltip-border-color': theme.isDark ? '#334155' : '#e2e8f0',
      } as React.CSSProperties}
    >
      <div
        className="d-flex rounded overflow-hidden"
        style={{
          width: '100%',
          height: '100px',
          border: "none",
          borderRadius: "16px",
          boxShadow: theme.isDark 
            ? "0 8px 32px rgba(0,0,0,0.3)" 
            : "0 8px 32px rgba(0,0,0,0.08)",
          background: theme.isDark 
            ? `linear-gradient(135deg, ${theme.colors.cardBg}, ${theme.colors.primary}10)`
            : `linear-gradient(135deg, ${theme.colors.cardBg}, ${theme.colors.primary}05)`,
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = theme.isDark 
            ? "0 12px 40px rgba(0,0,0,0.4)" 
            : "0 12px 40px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = theme.isDark 
            ? "0 8px 32px rgba(0,0,0,0.3)" 
            : "0 8px 32px rgba(0,0,0,0.08)";
        }}
      >
        {/* Left Icon Block */}
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: '35%',
            background: `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.primary}10)`,
          }}
        >
          <CIcon
            icon={icon as unknown as string}
            height={36}
            width={36}
            style={{ color: theme.colors.primary }}
          />
        </div>

        {/* Right Content Block */}
        <div
          className="d-flex flex-column justify-content-center align-items-start px-4"
          style={{
            width: '65%',
            backgroundColor: 'transparent',
          }}
        >
          <strong 
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: theme.colors.bodyColor,
              marginBottom: "4px",
            }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </strong>
          <span 
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: theme.colors.textMuted,
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </CTooltip>
  )
}

export default InfoStatWidget
