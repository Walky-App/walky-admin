import { CIcon } from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CAvatar, CNavbar, CContainer } from '@coreui/react'

export const Topbar = () => {
  return (
    <CNavbar className="bg-white shadow-sm px-4">
      <CContainer fluid>
        <div className="d-flex w-100 justify-content-end align-items-center" style={{ gap: '1.5rem' }}>
          {/* Left-side icons */}
          <CIcon icon={icon.cilBell} size="lg" />
          <CIcon icon={icon.cilEnvelopeOpen} size="lg" />
          <CIcon icon={icon.cilListRich} size="lg" />

          {/* Sun with left/right dividers */}
          <div
            className="d-flex align-items-center px-3"
            style={{
              borderLeft: '1px solid #dee2e6',
              borderRight: '1px solid #dee2e6',
              height: '32px',
            }}
          >
            <CIcon icon={icon.cilSun} size="lg" />
          </div>

          {/* Avatar */}
          <CAvatar src={'/images/avatars/1.jpg'} size="lg" />
        </div>
      </CContainer>
    </CNavbar>
  )
}
