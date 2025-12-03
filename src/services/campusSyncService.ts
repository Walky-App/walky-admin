import { apiClient } from '../API';

export interface SyncResult {
  campus_id: string;
  sync_status: 'completed' | 'failed' | 'partial';
  places_added: number;
  places_updated: number;
  places_removed: number;
  api_calls_used: number;
  sync_duration_ms: number;
  total_places_processed: number;
  errors: string[];
  changes_summary: { new_places: number; updated_places: number; removed_places: number } | null;
}

export interface SyncLog {
  _id: string;
  campus_id: {
    _id: string;
    campus_name: string;
  };
  last_sync_date: Date;
  places_added: number;
  places_updated: number;
  places_removed: number;
  api_calls_used: number;
  sync_status: string;
  sync_duration_ms: number;
  total_places_processed: number;
  error_message?: string;
  createdAt: Date;
}

export interface CampusSyncStatus {
  _id: string;
  campus_name: string;
  coordinates: { type: string; coordinates: number[][][] } | null;
  places_count: number;
  last_sync: {
    date: Date;
    status: string;
    places_added: number;
    places_updated: number;
    places_removed: number;
    api_calls_used: number;
  } | null;
  has_coordinates: boolean;
}

export interface CampusBoundaryPreview {
  campus_name: string;
  boundary: { type: string; coordinates: number[][][] };
  search_points: Array<{
    lat: number;
    lng: number;
    radius: number;
  }>;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  center: {
    lat: number;
    lng: number;
    center: {
      lat: number;
      lng: number;
    };
  };
  area_sqm: number;
  area_acres: number;
  search_points_count: number;
}

export const campusSyncService = {
  // Trigger sync for a specific campus
  syncCampus: async (campusId: string): Promise<SyncResult> => {
    const response = await apiClient.api.adminCampusSyncSyncCreate(campusId, {}) as any;
    return response.data.data;
  },

  // Trigger sync for all campuses
  syncAllCampuses: async (): Promise<{ summary: { total: number; totalPlacesAdded: number; totalPlacesUpdated: number; totalPlacesRemoved: number }; results: SyncResult[] }> => {
    const response = await apiClient.api.adminCampusSyncSyncAllCreate() as any;
    return response.data.data;
  },

  // Get sync logs
  getSyncLogs: async (params?: {
    campus_id?: string;
    sync_status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: SyncLog[]; pagination: { total: number; limit: number; offset: number } }> => {
    const response = await apiClient.api.adminCampusSyncLogsList(params as any) as any;
    return response.data.data;
  },

  // Get campuses with sync status
  getCampusesWithSyncStatus: async (): Promise<CampusSyncStatus[]> => {
    const response = await apiClient.api.adminCampusSyncCampusesList() as any;
    return response.data.data;
  },

  // Preview campus boundary and search points
  previewCampusBoundary: async (campusId: string): Promise<CampusBoundaryPreview> => {
    const response = await apiClient.api.adminCampusSyncCampusPreviewList(campusId) as any;
    return response.data.data;
  }
};