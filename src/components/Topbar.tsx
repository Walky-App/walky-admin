import { CIcon } from '@coreui/icons-react'
import { cilHamburgerMenu, cilBell, cilEnvelopeOpen, cilListRich, cilSun, cilMoon } from '@coreui/icons'
import { CAvatar, CNavbar, CContainer, CButton } from '@coreui/react'
import { useTheme } from '../hooks/useTheme'
import React, { useState } from 'react'
import profilePic from '../assets/fiu-panther-logo (2).png';
type TopbarProps = {
  onToggleSidebar: () => void;
};

export const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme.isDark;

  const [hovered, setHovered] = useState<string | null>(null);
  const [themeHovered, setThemeHovered] = useState(false);

  const iconColor = isDarkMode? '#f8f9fa' : '#212529';

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

  return (
    <CNavbar className="shadow-sm px-4" style={{ backgroundColor: theme.colors.cardBg }}>
      <CContainer fluid>
        <div className="d-flex w-100 justify-content-between align-items-center">

          {/* Hamburger Button */}
          <button
            onClick={onToggleSidebar}
            style={hovered === 'menu' ? iconBtnHoverStyle : iconBtnStyle}
            onMouseEnter={() => setHovered('menu')}
            onMouseLeave={() => setHovered(null)}
            aria-label="Toggle Sidebar"
          >
            <CIcon icon={cilHamburgerMenu} size="lg" style={{ color: iconColor }} />
          </button>

          {/* Right-side Icons */}
          <div className="d-flex align-items-center" style={{ gap: '1.5rem' }}>
            {[{ id: 'bell', icon: cilBell }, { id: 'envelope', icon: cilEnvelopeOpen }, { id: 'list', icon: cilListRich }].map(({ id, icon }) => (
              <button
                key={id}
                style={hovered === id ? iconBtnHoverStyle : iconBtnStyle}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                aria-label={id}
              >
                <CIcon icon={icon} size="lg" style={{ color: iconColor }} />
              </button>
            ))}

            {/* Theme Toggle */}
            <div
              className="d-flex align-items-center px-3"
              style={{
                borderLeft: `1px solid var(--app-borderColor)`,
                borderRight: `1px solid var(--app-borderColor)`,
                height: '32px',
                backgroundColor: themeHovered
                  ? isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
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
                <CIcon icon={isDarkMode ? cilSun : cilMoon} size="lg" />
              </CButton>
            </div>

            {/* Avatar */}
            <CAvatar src={profilePic} size="lg" />
          </div>
        </div>
      </CContainer>
    </CNavbar>
  );
};
