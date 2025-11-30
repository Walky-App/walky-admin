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
import { apiClient } from '../API'

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
        const response = await apiClient.api.adminAnalyticsWellbeingList({ period } as any) as any
        setMetrics(response.data)
        setError(null)
      } catch (err: unknown) {
        console.error('Failed to fetch wellbeing statistics:', err)
        const errorMessage = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || (err as { message?: string })?.message || 'Failed to load statistics. Please try again.'
        setError(`API Error: ${errorMessage}`)
        setMetrics(null)
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
