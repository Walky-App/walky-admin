/**
 * Events & Activities Dashboard
 * Purpose: Supervise events and spaces with KPIs
 */

import { useState, useEffect, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CButtonGroup,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CSpinner,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCalendar,
  cilHome,
  cilPeople,
  cilStar,
} from '@coreui/icons'
// import { useTheme } from '../hooks/useTheme' // Not currently used
import API from '../API'

interface KPIs {
  topEvent: {
    name: string
    attendance: number
  }
  topSpace: {
    name: string
    members: number
  }
}

interface Event {
  _id: string
  name: string
  date: Date
  location: string
  type: 'public' | 'private'
  category: string
  attendees: number
  maxAttendees?: number
  createdBy: string
}

interface Space {
  _id: string
  title: string
  category: string
  membersCount: number
  createdAt: Date
  ownerId: string
  ownerName: string
  isActive: boolean
}

const EventsActivitiesDashboard = () => {

  const [activeTab, setActiveTab] = useState<'events' | 'spaces'>('events')
  const [kpis, setKPIs] = useState<KPIs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Events state
  const [events, setEvents] = useState<Event[]>([])
  const [eventView, setEventView] = useState<'list' | 'calendar'>('list')

  // Spaces state
  const [spaces, setSpaces] = useState<Space[]>([])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const fetchKPIs = async () => {
    try {
      const response = await API.get('/api/admin/analytics/activities/kpis')
      setKPIs(response.data)
      setError(null)
    } catch (err: unknown) {
      console.error('Failed to fetch KPIs:', err)
      const errorMessage = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || (err as { message?: string })?.message || 'Failed to load KPIs.'
      setError(`API Error: ${errorMessage}`)
      setKPIs(null)
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      if (activeTab === 'events') {
        const response = await API.get('/api/admin/events', {
          params: { page: currentPage, limit: itemsPerPage },
        })
        setEvents(response.data.events)
      } else if (activeTab === 'spaces') {
        const response = await API.get('/api/admin/spaces', {
          params: { page: currentPage, limit: itemsPerPage },
        })
        setSpaces(response.data.spaces)
      }
      setError(null)
    } catch (err: unknown) {
      console.error(`Failed to fetch ${activeTab}:`, err)
      const errorMessage = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || (err as { message?: string })?.message || `Failed to load ${activeTab}.`
      setError(`API Error: ${errorMessage}`)
      if (activeTab === 'events') {
        setEvents([])
      } else if (activeTab === 'spaces') {
        setSpaces([])
      }
    } finally {
      setLoading(false)
    }
  }, [activeTab, currentPage, itemsPerPage])

  useEffect(() => {
    fetchKPIs()
    fetchData()
  }, [fetchData])

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
          Events & Activities Dashboard
        </h2>
        <p style={{ color: '#6B7280', marginBottom: 0 }}>
          Supervise events and spaces across your campuses
        </p>
      </div>

      {/* KPIs */}
      <CRow className="g-4 mb-4">
        <CCol xs={12} md={6}>
          <CCard style={{ border: '1px solid #E5E7EB', borderRadius: '12px' }}>
            <CCardBody className="text-center p-4">
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #FFD60A15, #FFD60A25)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <CIcon icon={cilStar} size="xl" style={{ color: '#FFD60A' }} />
              </div>
              <h6 style={{ color: '#6B7280', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                Top Event
              </h6>
              <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
                {kpis?.topEvent.name || 'N/A'}
              </h4>
              <CBadge color="warning" style={{ fontSize: '0.875rem' }}>
                <CIcon icon={cilPeople} className="me-1" />
                {kpis?.topEvent.attendance || 0} attendees
              </CBadge>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <CCard style={{ border: '1px solid #E5E7EB', borderRadius: '12px' }}>
            <CCardBody className="text-center p-4">
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #5E5CE615, #5E5CE625)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <CIcon icon={cilStar} size="xl" style={{ color: '#5E5CE6' }} />
              </div>
              <h6 style={{ color: '#6B7280', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                Top Space
              </h6>
              <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
                {kpis?.topSpace.name || 'N/A'}
              </h4>
              <CBadge color="primary" style={{ fontSize: '0.875rem' }}>
                <CIcon icon={cilPeople} className="me-1" />
                {kpis?.topSpace.members || 0} members
              </CBadge>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Error Display */}
      {error && (
        <CAlert color="danger" className="mb-4">
          {error}
        </CAlert>
      )}

      {/* Tabs */}
      <CCard>
        <CCardHeader style={{ background: 'transparent', border: 'none' }}>
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                active={activeTab === 'events'}
                onClick={() => { setActiveTab('events'); setCurrentPage(1) }}
                style={{ cursor: 'pointer' }}
              >
                <CIcon icon={cilCalendar} className="me-2" />
                Events
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'spaces'}
                onClick={() => { setActiveTab('spaces'); setCurrentPage(1) }}
                style={{ cursor: 'pointer' }}
              >
                <CIcon icon={cilHome} className="me-2" />
                Spaces
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>

        <CCardBody>
          <CTabContent>
            {/* Events Tab */}
            <CTabPane visible={activeTab === 'events'}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CButtonGroup>
                  <CButton
                    color={eventView === 'list' ? 'primary' : 'secondary'}
                    variant={eventView === 'list' ? 'outline' : 'ghost'}
                    onClick={() => setEventView('list')}
                  >
                    List View
                  </CButton>
                  <CButton
                    color={eventView === 'calendar' ? 'primary' : 'secondary'}
                    variant={eventView === 'calendar' ? 'outline' : 'ghost'}
                    onClick={() => setEventView('calendar')}
                  >
                    Calendar View
                  </CButton>
                </CButtonGroup>
                <CFormSelect style={{ width: 'auto' }}>
                  <option value="all">All Categories</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="academic">Academic</option>
                </CFormSelect>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <CSpinner />
                </div>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Event Name</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                      <CTableHeaderCell>Location</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Category</CTableHeaderCell>
                      <CTableHeaderCell>Attendees</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {events.map((event) => (
                      <CTableRow key={event._id}>
                        <CTableDataCell style={{ fontWeight: '500' }}>
                          {event.name}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(event.date).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>{event.location}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={event.type === 'public' ? 'success' : 'info'}>
                            {event.type}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{event.category}</CTableDataCell>
                        <CTableDataCell>
                          {event.attendees}
                          {event.maxAttendees && `/${event.maxAttendees}`}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton size="sm" color="primary" variant="ghost">
                            View Details
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CTabPane>

            {/* Spaces Tab */}
            <CTabPane visible={activeTab === 'spaces'}>
              <div className="d-flex justify-content-end mb-3">
                <CFormSelect style={{ width: 'auto' }}>
                  <option value="all">All Categories</option>
                  <option value="academic">Academic</option>
                  <option value="social">Social</option>
                  <option value="professional">Professional</option>
                </CFormSelect>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <CSpinner />
                </div>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Space Name</CTableHeaderCell>
                      <CTableHeaderCell>Category</CTableHeaderCell>
                      <CTableHeaderCell>Members</CTableHeaderCell>
                      <CTableHeaderCell>Owner</CTableHeaderCell>
                      <CTableHeaderCell>Created</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {spaces.map((space) => (
                      <CTableRow key={space._id}>
                        <CTableDataCell style={{ fontWeight: '500' }}>
                          {space.title}
                        </CTableDataCell>
                        <CTableDataCell>{space.category}</CTableDataCell>
                        <CTableDataCell>{space.membersCount}</CTableDataCell>
                        <CTableDataCell>{space.ownerName}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(space.createdAt).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={space.isActive ? 'success' : 'secondary'}>
                            {space.isActive ? 'Active' : 'Inactive'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton size="sm" color="primary" variant="ghost">
                            Transfer Ownership
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CTabPane>
          </CTabContent>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <CPagination>
              <CPaginationItem onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                Previous
              </CPaginationItem>
              {[1, 2, 3, 4, 5].map(page => (
                <CPaginationItem
                  key={page}
                  active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </CPaginationItem>
              ))}
              <CPaginationItem onClick={() => setCurrentPage(currentPage + 1)}>
                Next
              </CPaginationItem>
            </CPagination>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default EventsActivitiesDashboard
