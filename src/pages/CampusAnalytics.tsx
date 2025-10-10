/**
 * Campus Analytics Dashboard
 * Comprehensive analytics view for campus admins and super admins
 */

import { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
  CSpinner,
  CButton,
  CButtonGroup,
  CAlert,
  CListGroup,
  CListGroupItem,
  CProgress,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCompass,
  cilCalendar,
  cilLightbulb,
  cilPeople,
  cilCheckCircle,
  cilWarning,
  cilBell,
  cilClock,
  cilChart,
  cilUser,
  cilHome,
} from '@coreui/icons'
import { useTheme } from '../hooks/useTheme'
import { useParams } from 'react-router-dom'
import { analyticsService } from '../services/analyticsService'
import {
  SocialHealthMetrics,
  // WellbeingMetrics, // TODO: Display wellbeing metrics
  CampusKPIs,
  ActivityLogEntry,
  CampusAlert,
  MetricsPeriod,
} from '../types/analytics'

// Stat Card Component
const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  percentage,
  trend,
  loading = false,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: string | string[]
  color: string
  percentage?: number
  trend?: 'up' | 'down' | 'neutral'
  loading?: boolean
}) => {
  const { theme } = useTheme()
  const isDark = theme.isDark

  const trendColors = {
    up: '#34C759',
    down: '#FF3B30',
    neutral: '#8E8E93',
  }

  return (
    <CCard
      className="h-100"
      style={{
        background: isDark ? 'var(--modern-card-bg)' : '#FFFFFF',
        border: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
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
          {percentage !== undefined && trend && (
            <CBadge
              style={{
                backgroundColor: `${trendColors[trend]}15`,
                color: trendColors[trend],
                padding: '4px 8px',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {percentage}%
            </CBadge>
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

// Alert Item Component
const AlertItem = ({
  alert,
  onMarkAsRead,
}: {
  alert: CampusAlert
  onMarkAsRead: (alertId: string) => void
}) => {
  const { theme } = useTheme()
  const isDark = theme.isDark

  const severityColors = {
    info: '#007AFF',
    warning: '#FF9500',
    critical: '#FF3B30',
  }

  const severityIcons = {
    info: cilBell,
    warning: cilWarning,
    critical: cilWarning,
  }

  return (
    <CListGroupItem
      style={{
        backgroundColor: isDark ? 'var(--modern-card-bg)' : '#FFFFFF',
        borderColor: isDark ? 'var(--modern-border-primary)' : '#E5E7EB',
        opacity: alert.read ? 0.6 : 1,
      }}
    >
      <div className="d-flex align-items-start gap-3">
        <div
          style={{
            width: '40px',
            height: '40px',
            background: `${severityColors[alert.severity]}15`,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <CIcon
            icon={severityIcons[alert.severity]}
            size="lg"
            style={{ color: severityColors[alert.severity] }}
          />
        </div>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <h6 className="mb-0" style={{ fontWeight: '600' }}>
              {alert.title}
            </h6>
            <CBadge
              color={alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'}
              style={{ fontSize: '0.75rem' }}
            >
              {alert.severity}
            </CBadge>
          </div>
          <p
            className="mb-2"
            style={{
              fontSize: '0.875rem',
              color: isDark ? '#9CA3AF' : '#6B7280',
            }}
          >
            {alert.message}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <small style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
              {new Date(alert.createdAt).toLocaleString()}
            </small>
            {!alert.read && (
              <CButton
                size="sm"
                color="primary"
                variant="ghost"
                onClick={() => onMarkAsRead(alert._id)}
              >
                Mark as read
              </CButton>
            )}
          </div>
        </div>
      </div>
    </CListGroupItem>
  )
}

// Activity Timeline Item Component
const ActivityTimelineItem = ({ activity }: { activity: ActivityLogEntry }) => {
  const { theme } = useTheme()
  const isDark = theme.isDark

  const activityIcons = {
    walk_created: cilCompass,
    event_created: cilCalendar,
    space_joined: cilHome,
    idea_created: cilLightbulb,
    user_registered: cilUser,
  }

  const activityColors = {
    walk_created: '#5E5CE6',
    event_created: '#007AFF',
    space_joined: '#34C759',
    idea_created: '#FF9500',
    user_registered: '#FF2D55',
  }

  return (
    <div className="d-flex gap-3 mb-3">
      <div
        style={{
          width: '40px',
          height: '40px',
          background: `${activityColors[activity.activityType]}15`,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <CIcon
          icon={activityIcons[activity.activityType]}
          style={{ color: activityColors[activity.activityType] }}
        />
      </div>
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="mb-1" style={{ fontWeight: '500', fontSize: '0.875rem' }}>
              {activity.details}
            </p>
            <small style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
              {new Date(activity.timestamp).toLocaleString()}
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Campus Analytics Component
const CampusAnalytics = () => {
  const { campusId } = useParams<{ campusId: string }>()
  const { theme } = useTheme()
  const isDark = theme.isDark

  // State
  const [period, setPeriod] = useState<MetricsPeriod>('30d')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Metrics state
  const [socialHealth, setSocialHealth] = useState<SocialHealthMetrics | null>(null)
  // const [wellbeing, setWellbeing] = useState<WellbeingMetrics | null>(null) // TODO: Display wellbeing metrics
  const [kpis, setKPIs] = useState<CampusKPIs | null>(null)
  const [activities, setActivities] = useState<ActivityLogEntry[]>([])
  const [alerts, setAlerts] = useState<CampusAlert[]>([])
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0)

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      if (!campusId) {
        setError('No campus ID provided')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const [
          socialHealthData,
          // wellbeingData, // TODO: Display wellbeing metrics
          kpisData,
          activitiesData,
          alertsData,
        ] = await Promise.all([
          analyticsService.getSocialHealthMetrics(campusId, period),
          // analyticsService.getWellbeingMetrics(campusId, period), // TODO: Display wellbeing metrics
          analyticsService.getCampusKPIs(campusId),
          analyticsService.getActivityTimeline(campusId, period, 20),
          analyticsService.getCampusAlerts(campusId),
        ])

        setSocialHealth(socialHealthData)
        // setWellbeing(wellbeingData) // TODO: Display wellbeing metrics
        setKPIs(kpisData)
        setActivities(activitiesData)
        setAlerts(alertsData)
        setUnreadAlertsCount(alertsData.filter((a) => !a.read).length)
      } catch (err) {
        console.error('Failed to fetch analytics data:', err)
        setError('Failed to load analytics data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [campusId, period])

  // Mark alert as read handler
  const handleMarkAlertAsRead = async (alertId: string) => {
    if (!campusId) return

    try {
      await analyticsService.markAlertAsRead(campusId, alertId)
      setAlerts((prev) =>
        prev.map((alert) =>
          alert._id === alertId ? { ...alert, read: true } : alert
        )
      )
      setUnreadAlertsCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark alert as read:', err)
    }
  }

  // Mark all alerts as read handler
  const handleMarkAllAlertsAsRead = async () => {
    if (!campusId) return

    try {
      await analyticsService.markAllAlertsAsRead(campusId)
      setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })))
      setUnreadAlertsCount(0)
    } catch (err) {
      console.error('Failed to mark all alerts as read:', err)
    }
  }

  if (error) {
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
            Campus Analytics Dashboard
          </h2>
          <p style={{ color: '#6B7280', marginBottom: 0 }}>
            Comprehensive metrics and insights for campus engagement
          </p>
        </div>
        <CButtonGroup>
          <CButton
            color={period === '7d' ? 'primary' : 'secondary'}
            variant={period === '7d' ? 'outline' : 'ghost'}
            onClick={() => setPeriod('7d')}
          >
            7 Days
          </CButton>
          <CButton
            color={period === '30d' ? 'primary' : 'secondary'}
            variant={period === '30d' ? 'outline' : 'ghost'}
            onClick={() => setPeriod('30d')}
          >
            30 Days
          </CButton>
          <CButton
            color={period === '90d' ? 'primary' : 'secondary'}
            variant={period === '90d' ? 'outline' : 'ghost'}
            onClick={() => setPeriod('90d')}
          >
            90 Days
          </CButton>
        </CButtonGroup>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
          <p className="mt-3">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Social Health Metrics */}
          <CRow className="g-4 mb-4">
            <CCol xs={12}>
              <h5 style={{ fontWeight: '600', marginBottom: '1rem' }}>
                Social Health Metrics
              </h5>
            </CCol>
            <CCol xs={12} sm={6} lg={2}>
              <StatCard
                title="Total Walks"
                value={socialHealth?.totalWalks.toLocaleString() || '0'}
                icon={cilCompass}
                color="#5E5CE6"
                subtitle="Created walks"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={2}>
              <StatCard
                title="Accepted Walks"
                value={socialHealth?.acceptedWalks.toLocaleString() || '0'}
                icon={cilCheckCircle}
                color="#34C759"
                subtitle="Successful connections"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={2}>
              <StatCard
                title="Acceptance Rate"
                value={`${socialHealth?.acceptanceRate.toFixed(1) || '0'}%`}
                icon={cilChart}
                color="#007AFF"
                trend="up"
                percentage={socialHealth?.acceptanceRate || 0}
              />
            </CCol>
            <CCol xs={12} sm={6} lg={2}>
              <StatCard
                title="Avg Response"
                value={`${socialHealth?.averageResponseTime.toFixed(0) || '0'}m`}
                icon={cilClock}
                color="#FF9500"
                subtitle="Response time"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={2}>
              <StatCard
                title="Active Users"
                value={socialHealth?.activeUsers.toLocaleString() || '0'}
                icon={cilPeople}
                color="#FF2D55"
                subtitle="Currently active"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={2}>
              <StatCard
                title="New Connections"
                value={socialHealth?.newConnections.toLocaleString() || '0'}
                icon={cilUser}
                color="#5AC8FA"
                subtitle="This period"
              />
            </CCol>
          </CRow>

          {/* Campus KPIs */}
          <CRow className="g-4 mb-4">
            <CCol xs={12}>
              <h5 style={{ fontWeight: '600', marginBottom: '1rem' }}>
                Campus KPIs
              </h5>
            </CCol>
            <CCol lg={3}>
              <CCard
                style={{
                  background: isDark ? 'var(--modern-card-bg)' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
                  borderRadius: '12px',
                }}
              >
                <CCardBody className="p-4">
                  <h6 className="mb-3" style={{ fontWeight: '600' }}>
                    Users
                  </h6>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ fontSize: '0.875rem' }}>Total</span>
                      <strong>{kpis?.users.total.toLocaleString() || '0'}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ fontSize: '0.875rem', color: '#34C759' }}>
                        Active
                      </span>
                      <strong>{kpis?.users.active.toLocaleString() || '0'}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span style={{ fontSize: '0.875rem', color: '#8E8E93' }}>
                        Inactive
                      </span>
                      <strong>
                        {kpis?.users.inactive.toLocaleString() || '0'} (
                        {kpis?.users.inactivePercentage.toFixed(1) || '0'}%)
                      </strong>
                    </div>
                  </div>
                  <CProgress
                    color="success"
                    value={
                      kpis?.users.total
                        ? (kpis.users.active / kpis.users.total) * 100
                        : 0
                    }
                    height={8}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol lg={3}>
              <CCard
                style={{
                  background: isDark ? 'var(--modern-card-bg)' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
                  borderRadius: '12px',
                }}
              >
                <CCardBody className="p-4">
                  <h6 className="mb-3" style={{ fontWeight: '600' }}>
                    Spaces
                  </h6>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ fontSize: '0.875rem' }}>Total</span>
                      <strong>{kpis?.spaces.total.toLocaleString() || '0'}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ fontSize: '0.875rem', color: '#34C759' }}>
                        Active
                      </span>
                      <strong>{kpis?.spaces.active.toLocaleString() || '0'}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span style={{ fontSize: '0.875rem', color: '#8E8E93' }}>
                        Inactive
                      </span>
                      <strong>
                        {kpis?.spaces.inactive.toLocaleString() || '0'} (
                        {kpis?.spaces.inactivePercentage.toFixed(1) || '0'}%)
                      </strong>
                    </div>
                  </div>
                  <CProgress
                    color="success"
                    value={
                      kpis?.spaces.total
                        ? (kpis.spaces.active / kpis.spaces.total) * 100
                        : 0
                    }
                    height={8}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol lg={3}>
              <CCard
                style={{
                  background: isDark ? 'var(--modern-card-bg)' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
                  borderRadius: '12px',
                }}
              >
                <CCardBody className="p-4">
                  <h6 className="mb-3" style={{ fontWeight: '600' }}>
                    Events
                  </h6>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ fontSize: '0.875rem' }}>Total</span>
                      <strong>{kpis?.events.total.toLocaleString() || '0'}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span style={{ fontSize: '0.875rem', color: '#007AFF' }}>
                        Upcoming
                      </span>
                      <strong>{kpis?.events.upcoming.toLocaleString() || '0'}</strong>
                    </div>
                  </div>
                  <CProgress
                    color="info"
                    value={
                      kpis?.events.total
                        ? (kpis.events.upcoming / kpis.events.total) * 100
                        : 0
                    }
                    height={8}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol lg={3}>
              <CCard
                style={{
                  background: isDark ? 'var(--modern-card-bg)' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
                  borderRadius: '12px',
                }}
              >
                <CCardBody className="p-4">
                  <h6 className="mb-3" style={{ fontWeight: '600' }}>
                    Ideas & Walks
                  </h6>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ fontSize: '0.875rem' }}>Active Ideas</span>
                      <strong>{kpis?.ideas.active.toLocaleString() || '0'}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ fontSize: '0.875rem' }}>Walk Invites</span>
                      <strong>
                        {kpis?.walkInvites.total.toLocaleString() || '0'}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span style={{ fontSize: '0.875rem', color: '#34C759' }}>
                        Accepted
                      </span>
                      <strong>
                        {kpis?.walkInvites.accepted.toLocaleString() || '0'}
                      </strong>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* Alerts and Activity Timeline */}
          <CRow className="g-4 mb-4">
            <CCol lg={6}>
              <CCard
                style={{
                  background: isDark ? 'var(--modern-card-bg)' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
                  borderRadius: '12px',
                }}
              >
                <CCardHeader
                  style={{
                    background: 'transparent',
                    borderBottom: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <h5 className="mb-0" style={{ fontWeight: '600' }}>
                        Alerts
                      </h5>
                      {unreadAlertsCount > 0 && (
                        <CBadge color="danger">{unreadAlertsCount}</CBadge>
                      )}
                    </div>
                    {unreadAlertsCount > 0 && (
                      <CButton
                        size="sm"
                        color="primary"
                        variant="ghost"
                        onClick={handleMarkAllAlertsAsRead}
                      >
                        Mark all as read
                      </CButton>
                    )}
                  </div>
                </CCardHeader>
                <CCardBody style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {alerts.length === 0 ? (
                    <div className="text-center py-4">
                      <p style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                        No alerts available
                      </p>
                    </div>
                  ) : (
                    <CListGroup flush>
                      {alerts.map((alert) => (
                        <AlertItem
                          key={alert._id}
                          alert={alert}
                          onMarkAsRead={handleMarkAlertAsRead}
                        />
                      ))}
                    </CListGroup>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
            <CCol lg={6}>
              <CCard
                style={{
                  background: isDark ? 'var(--modern-card-bg)' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
                  borderRadius: '12px',
                }}
              >
                <CCardHeader
                  style={{
                    background: 'transparent',
                    borderBottom: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
                  }}
                >
                  <h5 className="mb-0" style={{ fontWeight: '600' }}>
                    Recent Activity
                  </h5>
                </CCardHeader>
                <CCardBody style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {activities.length === 0 ? (
                    <div className="text-center py-4">
                      <p style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                        No recent activity
                      </p>
                    </div>
                  ) : (
                    activities.map((activity, index) => (
                      <ActivityTimelineItem key={index} activity={activity} />
                    ))
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

export default CampusAnalytics
