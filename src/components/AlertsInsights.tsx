/**
 * Automatic Alerts & Insights Component
 * Purpose: Help detect patterns or situations that require attention
 */

import { useState, useEffect, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
  CButton,
  CSpinner,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilWarning,
  cilBell,
  cilCheckCircle,
  cilChevronBottom,
  cilChevronTop,
  cilInfo,
  cilX,
  cilPeople,
  cilCalendar,
  cilChart,
} from '@coreui/icons'
import { useTheme } from '../hooks/useTheme'
import API from '../API'

export type AlertSeverity = 'critical' | 'warning' | 'info'
export type AlertCategory =
  | 'engagement'
  | 'safety'
  | 'activity'
  | 'community'
  | 'system'

export interface Alert {
  _id: string
  title: string
  message: string
  severity: AlertSeverity
  category: AlertCategory
  actionUrl?: string
  actionLabel?: string
  createdAt: Date
  isDismissed: boolean
  metadata?: Record<string, unknown>
}

interface AlertsInsightsProps {
  /**
   * Optional: Filter alerts by categories
   */
  categories?: AlertCategory[]
  /**
   * Optional: Maximum number of alerts to display
   */
  limit?: number
  /**
   * Optional: Show only undismissed alerts
   */
  showOnlyActive?: boolean
  /**
   * Optional: Compact mode (less padding, smaller text)
   */
  compact?: boolean
  /**
   * Optional: Auto-refresh interval in milliseconds (0 to disable)
   */
  refreshInterval?: number
}

const AlertsInsights: React.FC<AlertsInsightsProps> = ({
  categories,
  limit = 10,
  showOnlyActive = true,
  compact = false,
  refreshInterval = 60000, // 1 minute default
}) => {
  const { theme } = useTheme()
  const isDark = theme.isDark

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set())

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, unknown> = {
        limit,
        active: showOnlyActive,
      }

      if (categories && categories.length > 0) {
        params.categories = categories.join(',')
      }

      const response = await API.get('/api/admin/alerts', { params })
      setAlerts(response.data.alerts)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)

      // Mock data for development
      const mockAlerts: Alert[] = [
        {
          _id: '1',
          title: 'New Users Not Engaging',
          message:
            '15 students registered in the last week but have not accepted any walk invitations or joined any events. Consider sending a welcome email or creating orientation events.',
          severity: 'warning',
          category: 'engagement',
          actionUrl: '/students?filter=new-inactive',
          actionLabel: 'View Students',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isDismissed: false,
          metadata: {
            studentCount: 15,
          },
        },
        {
          _id: '2',
          title: 'Space Activity Decreased',
          message:
            'The "Study Group" space has seen a 60% decrease in activity over the past 7 days. There may be an issue or conflict that needs attention.',
          severity: 'warning',
          category: 'activity',
          actionUrl: '/spaces/space-id-123',
          actionLabel: 'View Space',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          isDismissed: false,
          metadata: {
            spaceId: 'space-id-123',
            activityDropPercentage: 60,
          },
        },
        {
          _id: '3',
          title: 'Multiple Reports on User',
          message:
            'User John Doe (john.doe@university.edu) has received 5 reports in the past 48 hours. Immediate review recommended.',
          severity: 'critical',
          category: 'safety',
          actionUrl: '/reports?user=user-id-456',
          actionLabel: 'View Reports',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          isDismissed: false,
          metadata: {
            userId: 'user-id-456',
            reportCount: 5,
          },
        },
        {
          _id: '4',
          title: 'High Event Registration',
          message:
            'The upcoming "Welcome Back BBQ" event has 200+ registrations. Consider logistics and capacity planning.',
          severity: 'info',
          category: 'community',
          actionUrl: '/events/event-id-789',
          actionLabel: 'View Event',
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          isDismissed: false,
          metadata: {
            eventId: 'event-id-789',
            registrationCount: 203,
          },
        },
        {
          _id: '5',
          title: 'Campus Engagement Trending Up',
          message:
            'North Campus has seen a 35% increase in walk invitations and event attendance this month. Great progress!',
          severity: 'info',
          category: 'engagement',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isDismissed: false,
          metadata: {
            campusId: 'north-campus',
            increasePercentage: 35,
          },
        },
      ]

      setAlerts(mockAlerts)
    } finally {
      setLoading(false)
    }
  }, [categories, showOnlyActive, limit])

  useEffect(() => {
    fetchAlerts()

    if (refreshInterval > 0) {
      const interval = setInterval(fetchAlerts, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchAlerts, refreshInterval])

  const dismissAlert = async (alertId: string) => {
    try {
      await API.patch(`/api/admin/alerts/${alertId}/dismiss`)
      setAlerts((prev) => prev.filter((alert) => alert._id !== alertId))
    } catch (error) {
      console.error('Failed to dismiss alert:', error)
    }
  }

  const toggleExpanded = (alertId: string) => {
    setExpandedAlerts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(alertId)) {
        newSet.delete(alertId)
      } else {
        newSet.add(alertId)
      }
      return newSet
    })
  }

  const getSeverityColor = (severity: AlertSeverity): string => {
    switch (severity) {
      case 'critical':
        return 'danger'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
    }
  }

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return cilWarning
      case 'warning':
        return cilBell
      case 'info':
        return cilInfo
    }
  }

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case 'engagement':
        return cilChart
      case 'safety':
        return cilWarning
      case 'activity':
        return cilCalendar
      case 'community':
        return cilPeople
      case 'system':
        return cilCheckCircle
    }
  }

  const getCategoryLabel = (category: AlertCategory): string => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  if (loading && alerts.length === 0) {
    return (
      <CCard>
        <CCardBody className="text-center py-5">
          <CSpinner color="primary" />
          <p className="mt-3">Loading alerts...</p>
        </CCardBody>
      </CCard>
    )
  }

  if (alerts.length === 0) {
    return (
      <CCard>
        <CCardBody className="text-center py-5">
          <CIcon icon={cilCheckCircle} size="3xl" style={{ color: '#34C759' }} />
          <p className="mt-3" style={{ color: '#34C759', fontWeight: '500' }}>
            All clear! No alerts at this time.
          </p>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CCard>
      <CCardHeader
        style={{
          background: isDark ? 'var(--modern-card-bg)' : '#FFFFFF',
          borderBottom: `1px solid ${isDark ? 'var(--modern-border-primary)' : '#E5E7EB'}`,
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0" style={{ fontWeight: '600' }}>
              <CIcon icon={cilBell} className="me-2" />
              Alerts & Insights
            </h5>
            {!compact && (
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: 0, marginTop: '4px' }}>
                Automatic pattern detection and recommendations
              </p>
            )}
          </div>
          {alerts.length > 0 && (
            <CBadge color="primary" style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}>
              {alerts.length} active
            </CBadge>
          )}
        </div>
      </CCardHeader>
      <CCardBody className={compact ? 'p-2' : 'p-3'}>
        <div className="d-flex flex-column gap-3">
          {alerts.map((alert) => {
            const isExpanded = expandedAlerts.has(alert._id)
            const severityColor = getSeverityColor(alert.severity)

            return (
              <CAlert
                key={alert._id}
                color={severityColor}
                className="mb-0"
                style={{
                  border: `1px solid var(--cui-${severityColor})`,
                }}
              >
                <div className="d-flex align-items-start justify-content-between">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <CIcon icon={getSeverityIcon(alert.severity)} size="lg" />
                      <strong style={{ fontSize: compact ? '0.875rem' : '1rem' }}>
                        {alert.title}
                      </strong>
                      <CBadge color={severityColor} style={{ fontSize: '0.75rem' }}>
                        <CIcon icon={getCategoryIcon(alert.category)} size="sm" className="me-1" />
                        {getCategoryLabel(alert.category)}
                      </CBadge>
                    </div>

                    <div
                      style={{
                        fontSize: compact ? '0.8rem' : '0.875rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {alert.message.length > 150 && !isExpanded
                        ? `${alert.message.substring(0, 150)}...`
                        : alert.message}
                    </div>

                    {alert.message.length > 150 && (
                      <CButton
                        size="sm"
                        color={severityColor}
                        variant="ghost"
                        onClick={() => toggleExpanded(alert._id)}
                        className="p-0 mb-2"
                      >
                        <CIcon
                          icon={isExpanded ? cilChevronTop : cilChevronBottom}
                          className="me-1"
                        />
                        {isExpanded ? 'Show less' : 'Show more'}
                      </CButton>
                    )}

                    <div className="d-flex gap-2 align-items-center">
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: isDark ? '#9CA3AF' : '#6B7280',
                        }}
                      >
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                      {alert.actionUrl && (
                        <CButton
                          size="sm"
                          color={severityColor}
                          href={alert.actionUrl}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {alert.actionLabel || 'Take Action'}
                        </CButton>
                      )}
                    </div>
                  </div>

                  <CButton
                    color={severityColor}
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert._id)}
                    className="ms-2"
                  >
                    <CIcon icon={cilX} />
                  </CButton>
                </div>
              </CAlert>
            )
          })}
        </div>
      </CCardBody>
    </CCard>
  )
}

export default AlertsInsights
