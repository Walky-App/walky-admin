import { CIcon } from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CAvatar, CNavbar, CContainer, CButton } from '@coreui/react'
import { useTheme } from '../hooks/useTheme'
import React, { useState } from 'react'

export const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme.isDark;
  const iconColor = isDarkMode ? '#f8f9fa' : '#212529';
  const [hovered, setHovered] = useState<string | null>(null);

  const iconBtnStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: iconColor,
  };

  const iconBtnHoverStyle: React.CSSProperties = {
    ...iconBtnStyle,
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  };

  const [themeHovered, setThemeHovered] = useState(false);

  const renderIconButton = (id: string, iconName: any, label: string) => (
    <button
      key={id}
      style={hovered === id ? iconBtnHoverStyle : iconBtnStyle}
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
      aria-label={label}
    >
      <CIcon icon={iconName} size="lg" style={{ color: iconColor }} />
    </button>
  );

  return (
    <CNavbar className="shadow-sm px-4">
      <CContainer fluid>
      <div className="d-flex w-100 justify-content-between align-items-center">

          {/* Left-side icons */}
          <div>
            {renderIconButton('menu', icon.cilHamburgerMenu, 'Menu')}
          </div>

          {/* Right-side icons */}
          <div className="d-flex align-items-center" style={{ gap: '1.5rem' }}>
            {renderIconButton('bell', icon.cilBell, 'Notifications')}
            {renderIconButton('envelope', icon.cilEnvelopeOpen, 'Messages')}
            {renderIconButton('list', icon.cilListRich, 'Tasks')}

            {/* Theme toggle */}
            <div
              className="d-flex align-items-center px-3"
              style={{
                borderLeft: `1px solid var(--app-borderColor)`,
                borderRight: `1px solid var(--app-borderColor)`,
                height: '32px',
                backgroundColor: themeHovered
                ? isDarkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)'
                  : 'transparent',
                borderRadius: '6px',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer',
              }}
               onMouseEnter={() => setThemeHovered(true)}
               onMouseLeave={() => setThemeHovered(false)}
            >
              <CButton
                color="link"
                className="p-0"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                 style={{ color: iconColor }}
              >
                <CIcon
                  icon={theme.isDark ? icon.cilSun : icon.cilMoon}
                  size="lg"
                  style={{ color: iconColor }}
                />
              </CButton>
            </div>

            {/* Avatar */}
            <CAvatar src={'/images/avatars/1.jpg'} size="lg" />
          </div>
        </div>
      </CContainer>
    </CNavbar>
  )
}