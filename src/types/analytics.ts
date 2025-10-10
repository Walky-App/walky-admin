/**
 * Campus Analytics Types
 * Types for the admin dashboard analytics features
 */

export interface SocialHealthMetrics {
  totalWalks: number
  acceptedWalks: number
  acceptanceRate: number
  averageResponseTime: number // in minutes
  activeUsers: number
  newConnections: number
}

export interface WellbeingMetrics {
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  averageSessionDuration: number // in minutes
  peakActivityHours: Array<{ hour: number; count: number }>
}

export interface CampusKPIs {
  users: {
    total: number
    active: number
    inactive: number
    inactivePercentage: number
  }
  spaces: {
    total: number
    active: number
    inactive: number
    inactivePercentage: number
  }
  events: {
    total: number
    upcoming: number
  }
  ideas: {
    total: number
    active: number
  }
  walkInvites: {
    total: number
    pending: number
    accepted: number
  }
}

export interface ActivityLogEntry {
  timestamp: Date
  activityType: 'walk_created' | 'event_created' | 'space_joined' | 'idea_created' | 'user_registered'
  userId: string
  userName?: string
  userAvatar?: string
  details: string
}

export interface CampusAlert {
  _id: string
  campusId: string
  severity: 'info' | 'warning' | 'critical'
  category: 'engagement' | 'safety' | 'technical'
  title: string
  message: string
  read: boolean
  createdAt: Date
  updatedAt?: Date
}

export type MetricsPeriod = '7d' | '30d' | '90d'
