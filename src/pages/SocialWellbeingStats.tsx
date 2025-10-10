/**
 * Social Wellbeing Statistics Page
 * Purpose: Evaluate Walky's impact on the university community
 */

import { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CSpinner,
  CRow,
  CCol,
  CButtonGroup,
  CProgress,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilCalendar,
  
  cilCompass,
  cilClock,
  cilWarning,
  cilChartLine,
  cilUser,
} from '@coreui/icons'
import { useTheme } from '../hooks/useTheme'
import API from '../API'

interface WellbeingMetrics {
  averagePeers: number
  averageTimeToFirstInteraction: {
    days: number
    hours: number
  }
  completionRates: {
    walksCompleted: number
    eventsAttended: number
    spacesJoined: number
  }
  commonInterests: Array<{
    interest: string
    count: number
    percentage: number
  }>
  topFieldsOfStudy: Array<{
    field: string
    interactionCount: number
    studentCount: number
    averageInteractions: number
  }>
  isolatedStudents: Array<{
    _id: string
    first_name: string
    last_name: string
    email: string
    daysSinceRegistration: number
    totalInteractions: number
    lastLogin?: Date
    campus: string
  }>
}

type Period = 'week' | 'month'

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  loading = false,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: string | string[]
  color: string
  loading?: boolean
}) => {
  const { theme } = useTheme()
  const isDark = theme.isDark

  return (
    <CCard
      className="h-100"
      style={{
        background: isDark ? 'var(--modern-card-bg)' : '#FFFFFF',
        border: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <CCardBody className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div
            style={{
              width: '48px',
              height: '48px',
              background: `linear-gradient(135deg, ${color}15, ${color}25)`,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CIcon icon={icon} size="lg" style={{ color }} />
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: isDark ? '#9CA3AF' : '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: '600',
              marginBottom: '4px',
            }}
          >
            {title}
          </div>
          {loading ? (
            <CSpinner size="sm" />
          ) : (
            <div
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: isDark ? '#FFFFFF' : '#111827',
                lineHeight: '1.2',
              }}
            >
              {value}
            </div>
          )}
          {subtitle && (
            <div
              style={{
                fontSize: '0.875rem',
                color: isDark ? '#9CA3AF' : '#6B7280',
                marginTop: '4px',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </CCardBody>
    </CCard>
  )
}

const SocialWellbeingStats = () => {
  // const { theme } = useTheme() // Theme not currently used in main component

  const [period, setPeriod] = useState<Period>('month')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<WellbeingMetrics | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await API.get(`/api/admin/wellbeing-stats?period=${period}`)
        setMetrics(response.data)
      } catch (err) {
        console.error('Failed to fetch wellbeing statistics:', err)
        setError('Failed to load statistics. Please try again.')

        // Mock data for development
        setMetrics({
          averagePeers: 12.4,
          averageTimeToFirstInteraction: {
            days: 2,
            hours: 18,
          },
          completionRates: {
            walksCompleted: 67.3,
            eventsAttended: 54.8,
            spacesJoined: 43.2,
          },
          commonInterests: [
            { interest: 'Music', count: 487, percentage: 26.4 },
            { interest: 'Sports', count: 423, percentage: 22.9 },
            { interest: 'Technology', count: 389, percentage: 21.1 },
            { interest: 'Art', count: 321, percentage: 17.4 },
            { interest: 'Travel', count: 298, percentage: 16.1 },
            { interest: 'Reading', count: 267, percentage: 14.5 },
            { interest: 'Gaming', count: 245, percentage: 13.3 },
            { interest: 'Food', count: 223, percentage: 12.1 },
          ],
          topFieldsOfStudy: [
            {
              field: 'Computer Science',
              interactionCount: 3421,
              studentCount: 234,
              averageInteractions: 14.6,
            },
            {
              field: 'Business Administration',
              interactionCount: 2987,
              studentCount: 298,
              averageInteractions: 10.0,
            },
            {
              field: 'Engineering',
              interactionCount: 2654,
              studentCount: 187,
              averageInteractions: 14.2,
            },
            {
              field: 'Psychology',
              interactionCount: 2134,
              studentCount: 156,
              averageInteractions: 13.7,
            },
            {
              field: 'Biology',
              interactionCount: 1876,
              studentCount: 143,
              averageInteractions: 13.1,
            },
          ],
          isolatedStudents: [
            {
              _id: '1',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john.doe@university.edu',
              daysSinceRegistration: 45,
              totalInteractions: 0,
              lastLogin: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
              campus: 'Main Campus',
            },
            {
              _id: '2',
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane.smith@university.edu',
              daysSinceRegistration: 32,
              totalInteractions: 1,
              lastLogin: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
              campus: 'North Campus',
            },
            {
              _id: '3',
              first_name: 'Alex',
              last_name: 'Johnson',
              email: 'alex.johnson@university.edu',
              daysSinceRegistration: 28,
              totalInteractions: 0,
              campus: 'Main Campus',
            },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [period])

  if (error && !metrics) {
    return (
      <div style={{ padding: '2rem' }}>
        <CAlert color="danger">{error}</CAlert>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', background: 'transparent' }}>
      {/* Page Header */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
            Social Wellbeing Statistics
          </h2>
          <p style={{ color: '#6B7280', marginBottom: 0 }}>
            Evaluate Walky's impact on your university community
          </p>
        </div>
        <CButtonGroup>
          <CButton
            color={period === 'week' ? 'primary' : 'secondary'}
            variant={period === 'week' ? 'outline' : 'ghost'}
            onClick={() => setPeriod('week')}
          >
            This Week
          </CButton>
          <CButton
            color={period === 'month' ? 'primary' : 'secondary'}
            variant={period === 'month' ? 'outline' : 'ghost'}
            onClick={() => setPeriod('month')}
          >
            This Month
          </CButton>
        </CButtonGroup>
      </div>

      {loading && !metrics ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
          <p className="mt-3">Loading statistics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <CRow className="g-4 mb-4">
            <CCol xs={12}>
              <h5 style={{ fontWeight: '600', marginBottom: '1rem' }}>
                <CIcon icon={cilChartLine} className="me-2" />
                Key Engagement Metrics
              </h5>
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <StatCard
                title="Average Peers"
                value={metrics?.averagePeers.toFixed(1) || '0'}
                icon={cilPeople}
                color="#5E5CE6"
                subtitle="Per student"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <StatCard
                title="Time to First Interaction"
                value={`${metrics?.averageTimeToFirstInteraction.days}d ${metrics?.averageTimeToFirstInteraction.hours}h`}
                icon={cilClock}
                color="#007AFF"
                subtitle="From registration"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <StatCard
                title="Walks Completed"
                value={`${metrics?.completionRates.walksCompleted.toFixed(1)}%`}
                icon={cilCompass}
                color="#34C759"
                subtitle="Of students"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <StatCard
                title="Event Attendance"
                value={`${metrics?.completionRates.eventsAttended.toFixed(1)}%`}
                icon={cilCalendar}
                color="#FF9500"
                subtitle="Of students"
              />
            </CCol>
          </CRow>

          {/* Completion Rates Breakdown */}
          <CRow className="g-4 mb-4">
            <CCol xs={12}>
              <h5 style={{ fontWeight: '600', marginBottom: '1rem' }}>
                <CIcon icon={cilUser} className="me-2" />
                Student Participation Rates
              </h5>
            </CCol>
            <CCol xs={12}>
              <CCard>
                <CCardBody>
                  <CRow className="g-4">
                    <CCol xs={12} md={4}>
                      <div className="mb-2 d-flex justify-content-between">
                        <span style={{ fontWeight: '500' }}>Completed Walks</span>
                        <span style={{ fontWeight: '700', color: '#34C759' }}>
                          {metrics?.completionRates.walksCompleted.toFixed(1)}%
                        </span>
                      </div>
                      <CProgress
                        value={metrics?.completionRates.walksCompleted || 0}
                        color="success"
                        height={12}
                      />
                      <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '4px' }}>
                        Students with at least one completed walk invitation
                      </div>
                    </CCol>
                    <CCol xs={12} md={4}>
                      <div className="mb-2 d-flex justify-content-between">
                        <span style={{ fontWeight: '500' }}>Attended Events</span>
                        <span style={{ fontWeight: '700', color: '#FF9500' }}>
                          {metrics?.completionRates.eventsAttended.toFixed(1)}%
                        </span>
                      </div>
                      <CProgress
                        value={metrics?.completionRates.eventsAttended || 0}
                        color="warning"
                        height={12}
                      />
                      <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '4px' }}>
                        Students who attended at least one event
                      </div>
                    </CCol>
                    <CCol xs={12} md={4}>
                      <div className="mb-2 d-flex justify-content-between">
                        <span style={{ fontWeight: '500' }}>Joined Spaces</span>
                        <span style={{ fontWeight: '700', color: '#5E5CE6' }}>
                          {metrics?.completionRates.spacesJoined.toFixed(1)}%
                        </span>
                      </div>
                      <CProgress
                        value={metrics?.completionRates.spacesJoined || 0}
                        color="info"
                        height={12}
                      />
                      <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '4px' }}>
                        Students who joined at least one space
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* Common Interests */}
          <CRow className="g-4 mb-4">
            <CCol xs={12}>
              <h5 style={{ fontWeight: '600', marginBottom: '1rem' }}>Most Common Interests</h5>
            </CCol>
            <CCol xs={12} lg={6}>
              <CCard>
                <CCardBody>
                  {metrics?.commonInterests.map((interest, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="mb-2 d-flex justify-content-between align-items-center">
                        <span style={{ fontWeight: '500' }}>{interest.interest}</span>
                        <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                          {interest.count} students ({interest.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <CProgress value={interest.percentage} height={8} />
                    </div>
                  ))}
                </CCardBody>
              </CCard>
            </CCol>

            {/* Top Fields of Study */}
            <CCol xs={12} lg={6}>
              <CCard>
                <CCardHeader>
                  <h6 className="mb-0" style={{ fontWeight: '600' }}>
                    Top Fields of Study by Interaction
                  </h6>
                </CCardHeader>
                <CCardBody className="p-0">
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Field</CTableHeaderCell>
                        <CTableHeaderCell>Students</CTableHeaderCell>
                        <CTableHeaderCell>Avg Interactions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {metrics?.topFieldsOfStudy.map((field, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <CBadge color="primary" className="me-2">
                                #{idx + 1}
                              </CBadge>
                              {field.field}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>{field.studentCount}</CTableDataCell>
                          <CTableDataCell>
                            <strong>{field.averageInteractions.toFixed(1)}</strong>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* Isolated Students */}
          <CRow className="g-4 mb-4">
            <CCol xs={12}>
              <h5 style={{ fontWeight: '600', marginBottom: '1rem' }}>
                <CIcon icon={cilWarning} className="me-2" />
                Potentially Isolated Students
              </h5>
              <CAlert color="info">
                <strong>Note:</strong> These students have minimal interactions and may need
                outreach or support to help them connect with their community.
              </CAlert>
            </CCol>
            <CCol xs={12}>
              <CCard>
                <CCardBody className="p-0">
                  {metrics?.isolatedStudents.length === 0 ? (
                    <div className="text-center py-5">
                      <CIcon icon={cilUser} size="3xl" style={{ color: '#34C759' }} />
                      <p className="mt-3" style={{ color: '#34C759', fontWeight: '500' }}>
                        Great! No isolated students detected this period.
                      </p>
                    </div>
                  ) : (
                    <CTable hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Student</CTableHeaderCell>
                          <CTableHeaderCell>Campus</CTableHeaderCell>
                          <CTableHeaderCell>Days Since Registration</CTableHeaderCell>
                          <CTableHeaderCell>Total Interactions</CTableHeaderCell>
                          <CTableHeaderCell>Last Login</CTableHeaderCell>
                          <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {metrics?.isolatedStudents.map((student) => (
                          <CTableRow key={student._id}>
                            <CTableDataCell>
                              <div>
                                <div style={{ fontWeight: '500' }}>
                                  {student.first_name} {student.last_name}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                  {student.email}
                                </div>
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>{student.campus}</CTableDataCell>
                            <CTableDataCell>
                              <CBadge color="warning">{student.daysSinceRegistration} days</CBadge>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CBadge
                                color={student.totalInteractions === 0 ? 'danger' : 'warning'}
                              >
                                {student.totalInteractions}
                              </CBadge>
                            </CTableDataCell>
                            <CTableDataCell>
                              {student.lastLogin
                                ? new Date(student.lastLogin).toLocaleDateString()
                                : 'Never'}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                size="sm"
                                color="primary"
                                variant="ghost"
                                onClick={() => {
                                  /* TODO: Implement outreach action */
                                }}
                              >
                                Send Outreach
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </div>
  )
}

export default SocialWellbeingStats
