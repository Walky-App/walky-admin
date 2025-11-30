/**
 * Campus Analytics Service
 * API service for fetching campus analytics data
 */

import { apiClient } from '../API'
import {
  SocialHealthMetrics,
  WellbeingMetrics,
  CampusKPIs,
  ActivityLogEntry,
  CampusAlert,
  MetricsPeriod,
} from '../types/analytics'

export const analyticsService = {
  /**
   * Get social health metrics for a campus
   */
  getSocialHealthMetrics: async (
    campusId: string,
    period: MetricsPeriod = '30d'
  ): Promise<SocialHealthMetrics> => {
    try {
      const response = await apiClient.api.adminCampusMetricsSocialHealthList(
        campusId,
        { period: period as any }
      ) as any
      return response.data
    } catch (error) {
      console.error('Failed to fetch social health metrics:', error)
      throw error
    }
  },

  /**
   * Get wellbeing metrics for a campus
   */
  getWellbeingMetrics: async (
    campusId: string,
    period: MetricsPeriod = '30d'
  ): Promise<WellbeingMetrics> => {
    try {
      const response = await apiClient.api.adminCampusMetricsWellbeingList(
        campusId,
        { period: period as any }
      ) as any
      return response.data
    } catch (error) {
      console.error('Failed to fetch wellbeing metrics:', error)
      throw error
    }
  },

  /**
   * Get KPIs for a campus
   */
  getCampusKPIs: async (campusId: string): Promise<CampusKPIs> => {
    try {
      const response = await apiClient.api.adminCampusMetricsKpisList(campusId) as any
      return response.data
    } catch (error) {
      console.error('Failed to fetch campus KPIs:', error)
      throw error
    }
  },

  /**
   * Get activity timeline for a campus
   */
  getActivityTimeline: async (
    campusId: string,
    period: MetricsPeriod = '30d',
    limit: number = 100
  ): Promise<ActivityLogEntry[]> => {
    try {
      const response = await apiClient.api.adminCampusMetricsActivityTimelineList(
        campusId,
        { period: period as any, limit }
      ) as any
      return response.data.map((entry: Record<string, unknown>) => ({
        ...entry,
        timestamp: new Date(entry.timestamp as string),
      }))
    } catch (error) {
      console.error('Failed to fetch activity timeline:', error)
      throw error
    }
  },

  /**
   * Get campus alerts
   */
  getCampusAlerts: async (
    campusId: string,
    unreadOnly: boolean = false,
    severity?: 'info' | 'warning' | 'critical'
  ): Promise<CampusAlert[]> => {
    try {
      const response = await apiClient.api.adminCampusAlertsList(
        campusId,
        { unreadOnly, severity }
      ) as any
      return response.data.map((alert: Record<string, unknown>) => ({
        ...alert,
        createdAt: new Date(alert.createdAt as string),
        updatedAt: alert.updatedAt ? new Date(alert.updatedAt as string) : undefined,
      }))
    } catch (error) {
      console.error('Failed to fetch campus alerts:', error)
      throw error
    }
  },

  /**
   * Mark alert as read
   */
  markAlertAsRead: async (
    campusId: string,
    alertId: string
  ): Promise<void> => {
    try {
      await apiClient.api.adminCampusAlertsMarkReadPartialUpdate(campusId, alertId)
    } catch (error) {
      console.error('Failed to mark alert as read:', error)
      throw error
    }
  },

  /**
   * Mark all alerts as read
   */
  markAllAlertsAsRead: async (campusId: string): Promise<void> => {
    try {
      await apiClient.api.adminCampusAlertsMarkAllReadPartialUpdate(campusId)
    } catch (error) {
      console.error('Failed to mark all alerts as read:', error)
      throw error
    }
  },
}
