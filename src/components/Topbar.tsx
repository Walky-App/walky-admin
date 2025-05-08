import { CIcon } from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CAvatar, CNavbar, CContainer, CButton } from '@coreui/react'
import { useTheme } from '../hooks/useTheme'

export const Topbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <CNavbar className="shadow-sm px-4">
      <CContainer fluid>
        <div className="d-flex w-100 justify-content-end align-items-center" style={{ gap: '1.5rem' }}>
          {/* Left-side icons */}
          <CIcon icon={icon.cilBell} size="lg" />
          <CIcon icon={icon.cilEnvelopeOpen} size="lg" />
          <CIcon icon={icon.cilListRich} size="lg" />

          {/* Theme toggle with left/right dividers */}
          <div
            className="d-flex align-items-center px-3"
            style={{
              borderLeft: `1px solid var(--app-borderColor)`,
              borderRight: `1px solid var(--app-borderColor)`,
              height: '32px',
            }}
          >
            <CButton 
              color="link" 
              className="p-0" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <CIcon 
                icon={theme.isDark ? icon.cilSun : icon.cilMoon} 
                size="lg" 
              />
            </CButton>
          </div>

          {/* Avatar */}
          <CAvatar src={'/images/avatars/1.jpg'} size="lg" />
        </div>
      </CContainer>
    </CNavbar>
  )
}
