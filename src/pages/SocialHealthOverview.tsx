/**
 * Social Health Overview Dashboard
 * Purpose: Provide an overview of the campus's social health
 */

import { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  
  CCol,
  CRow,
  CSpinner,
  CButton,
  CButtonGroup,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilUserFollow,
  cilCalendar,
  cilCompass,
  cilCheckCircle,
  cilX,
  cilLightbulb,
  cilHome,
  cilWarning,
  cilChart,
} from '@coreui/icons'
import { useTheme } from '../hooks/useTheme'
import API from '../API'

interface SocialHealthMetrics {
  // User Metrics
  totalActiveUsers: number
  newUserRegistrations: {
    thisWeek: number
    thisMonth: number
    trend: number
  }
  appOpenings: {
    averagePerWeek: number
    averagePerMonth: number
  }

  // Walk/Invitation Metrics
  invitations: {
    averageCreated: number
    averageAccepted: number
    averageIgnored: number
    acceptanceRate: number
  }

  // Events Metrics
  events: {
    totalCreated: number
    averageAttendance: number
  }

  // Spaces Metrics
  activeSpaces: number

  // Ideas Metrics
  ideas: {
    createdThisWeek: number
    createdThisMonth: number
    collaborationsThisWeek: number
    collaborationsThisMonth: number
  }

  // Report Metrics
  reports: {
    byPeople: number
    byEvents: number
    byIdeas: number
    bySpaces: number
    totalRate: number
  }
}

type Period = 'week' | 'month'

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  loading = false,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: string | string[]
  color: string
  trend?: number
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
          {trend !== undefined && (
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: trend > 0 ? '#34C759' : trend < 0 ? '#FF3B30' : '#8E8E93',
              }}
            >
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
            </div>
          )}
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

const SocialHealthOverview = () => {
  // const { theme } = useTheme() // Theme not currently used in main component

  const [period, setPeriod] = useState<Period>('month')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<SocialHealthMetrics | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await API.get(`/api/admin/analytics/social-health-metrics?period=${period}`)
        setMetrics(response.data)
        setError(null)
      } catch (err: unknown) {
        console.error('Failed to fetch social health metrics:', err)
        const errorMessage = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || (err as { message?: string })?.message || 'Failed to load metrics. Please try again.'
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
            Social Health Overview
          </h2>
          <p style={{ color: '#6B7280', marginBottom: 0 }}>
            Monitor campus social health and engagement metrics
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
          <p className="mt-3">Loading metrics...</p>
        </div>
      ) : (
        <>
          {/* User Metrics */}
          <CRow className="g-4 mb-4">
            <CCol xs={12}>
              <h5 style={{ fontWeight: '600', marginBottom: '1rem' }}>
                <CIcon icon={cilPeople} className="me-2" />
                User Engagement
              </h5>
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <StatCard
                title="Total Active Users"
                value={metrics?.totalActiveUsers.toLocaleString() || '0'}
                icon={cilPeople}
                color="#5E5CE6"
                subtitle="Currently active"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <StatCard
                title="New Registrations"
                value={
                  period === 'week'
                    ? metrics?.newUserRegistrations.thisWeek || 0
                    : metrics?.newUserRegistrations.thisMonth || 0
                }
                icon={cilUserFollow}
                color="#34C759"
                trend={metrics?.newUserRegistrations.trend}
                subtitle={`This ${period}`}
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <StatCard
                title="Avg App Openings"
                value={
                  period === 'week'
                    ? metrics?.appOpenings.averagePerWeek.toFixed(1) || '0'
                    : metrics?.appOpenings.averagePerMonth.toFixed(1) || '0'
                }
                icon={cilChart}
                color="#007AFF"
                subtitle={`Per ${period} per user`}
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <StatCard
                title="Acceptance Rate"
                value={`${metrics?.invitations.acceptanceRate.toFixed(1) || '0'}%`}
                icon={cilCheckCircle}
                color="#FF9500"
                subtitle="Walk invitations"
              />
            </CCol>
          </CRow>

          {/* Invitation Metrics */}
          <CRow className="g-4 mb-4">
            <CCol xs={12}>
              <h5 style={{ fontWeight: '600', marginBottom: '1rem' }}>
                <CIcon icon={cilCompass} className="me-2" />
                Walk Invitations
              </h5>
            </CCol>
            <CCol xs={12} sm={6} lg={4}>
              <StatCard
                title="Avg Invitations Created"
                value={metrics?.invitations.averageCreated.toFixed(1) || '0'}
                icon={cilCompass}
                color="#5E5CE6"
                subtitle="Per user"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={4}>
              <StatCard
                title="Avg Invitations Accepted"
                value={metrics?.invitations.averageAccepted.toFixed(1) || '0'}
                icon={cilCheckCircle}
                color="#34C759"
                subtitle="Per user"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={4}>
              <StatCard
                title="Avg Invitations Ignored"
                value={metrics?.invitations.averageIgnored.toFixed(1) || '0'}
                icon={cilX}
                color="#FF3B30"
                subtitle="Per user"
              />
            </CCol>
          </CRow>

          {/* Events, Spaces, Ideas */}
          <CRow className="g-4 mb-4">
            <CCol xs={12}>
              <h5 style={{ fontWeight: '600', marginBottom: '1rem' }}>
                <CIcon icon={cilCalendar} className="me-2" />
                Community Activity
              </h5>
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <StatCard
                title="Events Created"
                value={metrics?.events.totalCreated || 0}
                icon={cilCalendar}
                color="#007AFF"
                subtitle={`Avg ${metrics?.events.averageAttendance.toFixed(1)} attendees`}
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <StatCard
                title="Active Spaces"
                value={metrics?.activeSpaces || 0}
                icon={cilHome}
                color="#5AC8FA"
                subtitle="Community spaces"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <StatCard
                title="Ideas Created"
                value={
                  period === 'week'
                    ? metrics?.ideas.createdThisWeek || 0
                    : metrics?.ideas.createdThisMonth || 0
                }
                icon={cilLightbulb}
                color="#FF9500"
                subtitle={`This ${period}`}
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <StatCard
                title="Collaborations"
                value={
                  period === 'week'
                    ? metrics?.ideas.collaborationsThisWeek || 0
                    : metrics?.ideas.collaborationsThisMonth || 0
                }
                icon={cilPeople}
                color="#FF2D55"
                subtitle={`This ${period}`}
              />
            </CCol>
          </CRow>

          {/* Report Metrics */}
          <CRow className="g-4 mb-4">
            <CCol xs={12}>
              <h5 style={{ fontWeight: '600', marginBottom: '1rem' }}>
                <CIcon icon={cilWarning} className="me-2" />
                Reports & Safety
              </h5>
            </CCol>
            <CCol xs={12} sm={6} lg={2}>
              <StatCard
                title="User Reports"
                value={metrics?.reports.byPeople || 0}
                icon={cilPeople}
                color="#FF3B30"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={2}>
              <StatCard
                title="Event Reports"
                value={metrics?.reports.byEvents || 0}
                icon={cilCalendar}
                color="#FF9500"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={2}>
              <StatCard
                title="Idea Reports"
                value={metrics?.reports.byIdeas || 0}
                icon={cilLightbulb}
                color="#FF9500"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={2}>
              <StatCard
                title="Space Reports"
                value={metrics?.reports.bySpaces || 0}
                icon={cilHome}
                color="#FF9500"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={4}>
              <StatCard
                title="Total Report Rate"
                value={`${metrics?.reports.totalRate.toFixed(2) || '0'}%`}
                icon={cilWarning}
                color="#FF3B30"
                subtitle="Of total users"
              />
            </CCol>
          </CRow>
        </>
      )}
    </div>
  )
}

export default SocialHealthOverview
