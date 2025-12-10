/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Admin<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Admin - Places
   * @name PlacesList
   * @summary List all places with filtering and pagination
   * @request GET:/admin/places
   * @secure
   */
  placesList = (
    query?: {
      /** Filter by campus ID */
      campus_id?: string;
      /** Comma-separated app categories */
      categories?: string;
      /** Filter by status */
      status?: "active" | "inactive" | "removed";
      /** Minimum rating */
      rating_min?: number;
      /** Maximum rating */
      rating_max?: number;
      /** Filter places with photos */
      has_photos?: boolean;
      /** Search in place names */
      search?: string;
      /**
       * Number of places to return
       * @default 50
       */
      limit?: number;
      /**
       * Number of places to skip
       * @default 0
       */
      offset?: number;
      /**
       * Sort field
       * @default "name"
       */
      sort?: "name" | "rating" | "updated_at" | "created_at";
      /**
       * Sort order
       * @default "asc"
       */
      order?: "asc" | "desc";
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/places`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Places
   * @name PlacesCategoriesUpdate
   * @summary Manually update place app categories
   * @request PUT:/admin/places/{id}/categories
   * @secure
   */
  placesCategoriesUpdate = (
    id: string,
    data: {
      /** Array of app categories */
      app_categories: string[];
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/places/${id}/categories`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Sync
   * @name SyncCampusCreate
   * @summary Trigger manual sync for a specific campus
   * @request POST:/admin/sync/campus/{campusId}
   * @secure
   */
  syncCampusCreate = (
    campusId: string,
    data?: {
      /** @default false */
      force_full_sync?: boolean;
      /** @default true */
      include_details?: boolean;
      max_api_calls?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/sync/campus/${campusId}`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Sync
   * @name SyncStatusList
   * @summary Get sync scheduler status
   * @request GET:/admin/sync/status
   * @secure
   */
  syncStatusList = (
    query?: {
      /** Filter by region ID */
      campus_id?: string;
      /**
       * Number of logs to return
       * @default 20
       */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/sync/status`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Places
   * @name PlacesDelete
   * @summary Soft delete a place
   * @request DELETE:/admin/places/{id}
   * @secure
   */
  placesDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/places/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Places
   * @name PlacesRestoreCreate
   * @summary Restore a soft-deleted place
   * @request POST:/admin/places/{id}/restore
   * @secure
   */
  placesRestoreCreate = (id: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/places/${id}/restore`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Photos
   * @name PlacesPhotoSyncStatsList
   * @summary Get place photo sync statistics
   * @request GET:/admin/places/photo-sync/stats
   * @secure
   */
  placesPhotoSyncStatsList = (params: RequestParams = {}) =>
    this.request<
      {
        success?: boolean;
        data?: {
          total_places?: number;
          places_with_photos?: number;
          places_with_synced_photos?: number;
          photos_needing_sync?: number;
          sync_progress?: number;
        };
      },
      void
    >({
      path: `/admin/places/photo-sync/stats`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Photos
   * @name PlacesSyncPhotosCreate
   * @summary Sync photos for a specific place
   * @request POST:/admin/places/{place_id}/sync-photos
   * @secure
   */
  placesSyncPhotosCreate = (
    placeId: string,
    data?: {
      /**
       * Force re-sync even if photos already exist
       * @default false
       */
      force_resync?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        success?: boolean;
        message?: string;
        data?: {
          place_id?: string;
          photos_processed?: number;
          photos_uploaded?: number;
          errors?: string[];
        };
      },
      void
    >({
      path: `/admin/places/${placeId}/sync-photos`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Photos
   * @name PlacesPhotoSyncBatchCreate
   * @summary Trigger batch photo sync for multiple places
   * @request POST:/admin/places/photo-sync/batch
   * @secure
   */
  placesPhotoSyncBatchCreate = (
    data?: {
      /** Array of Google Place IDs (optional, will auto-find if not provided) */
      place_ids?: string[];
      /**
       * Force re-sync even if photos already exist
       * @default false
       */
      force_resync?: boolean;
      /**
       * Maximum number of places to process (if auto-finding)
       * @default 50
       */
      limit?: number;
      /**
       * Number of places to process concurrently
       * @default 2
       */
      concurrency?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        success?: boolean;
        message?: string;
        data?: {
          total_places?: number;
          estimated_duration?: string;
        };
      },
      void
    >({
      path: `/admin/places/photo-sync/batch`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Places
   * @name PlacesSystemInitCreate
   * @summary Initialize or reinitialize the Places System
   * @request POST:/admin/places/system/init
   * @secure
   */
  placesSystemInitCreate = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/places/system/init`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Places
   * @name PlacesSystemStatusList
   * @summary Get Places System status
   * @request GET:/admin/places/system/status
   * @secure
   */
  placesSystemStatusList = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/places/system/status`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Places
   * @name PlacesSystemRestartCreate
   * @summary Restart the Places System
   * @request POST:/admin/places/system/restart
   * @secure
   */
  placesSystemRestartCreate = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/places/system/restart`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Places
   * @name PlacesNestedList
   * @summary Get nested places for a specific place
   * @request GET:/admin/places/{place_id}/nested
   * @secure
   */
  placesNestedList = (
    placeId: string,
    query?: {
      /**
       * Number of nested places to return
       * @default 50
       */
      limit?: number;
      /**
       * Number of nested places to skip
       * @default 0
       */
      offset?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/places/${placeId}/nested`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Places
   * @name PlacesPopularList
   * @summary Get list of popular places for a school/campus
   * @request GET:/admin/places/popular
   * @secure
   */
  placesPopularList = (
    query: {
      /** School ID */
      school_id: string;
      /** Campus ID (optional, for campus-specific popular places) */
      campus_id?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/places/popular`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Places
   * @name PlacesPopularCreate
   * @summary Set popular places for a school/campus
   * @request POST:/admin/places/popular
   * @secure
   */
  placesPopularCreate = (
    data: {
      school_id: string;
      campus_id?: string;
      places?: {
        place_id: string;
        order: number;
      }[];
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/places/popular`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Places
   * @name PlacesPopularDelete
   * @summary Remove a popular place
   * @request DELETE:/admin/places/popular/{id}
   * @secure
   */
  placesPopularDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/places/popular/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Places
   * @name PlacesPopularReorderPartialUpdate
   * @summary Reorder popular places
   * @request PATCH:/admin/places/popular/reorder
   * @secure
   */
  placesPopularReorderPartialUpdate = (
    data: {
      updates?: {
        id: string;
        order: number;
      }[];
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/places/popular/reorder`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - App Categories
   * @name AppCategoriesList
   * @summary Get all app categories
   * @request GET:/admin/app-categories
   * @secure
   */
  appCategoriesList = (
    query?: {
      /** Return only active categories */
      active_only?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/app-categories`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - App Categories
   * @name AppCategoriesCreate
   * @summary Create a new app category
   * @request POST:/admin/app-categories
   * @secure
   */
  appCategoriesCreate = (
    data: {
      name: string;
      display_name: string;
      description?: string;
      icon?: string;
      color?: string;
      google_types: string[];
      sort_order?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/app-categories`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - App Categories
   * @name AppCategoriesUpdate
   * @summary Update an app category
   * @request PUT:/admin/app-categories/{id}
   * @secure
   */
  appCategoriesUpdate = (
    id: string,
    data: {
      display_name?: string;
      description?: string;
      icon?: string;
      color?: string;
      google_types?: string[];
      sort_order?: number;
      is_active?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/app-categories/${id}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - App Categories
   * @name AppCategoriesDelete
   * @summary Delete an app category
   * @request DELETE:/admin/app-categories/{id}
   * @secure
   */
  appCategoriesDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/app-categories/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - App Categories
   * @name AppCategoriesGoogleTypesList
   * @summary Get all available Google Places types
   * @request GET:/admin/app-categories/google-types
   * @secure
   */
  appCategoriesGoogleTypesList = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/app-categories/google-types`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Monitoring
   * @name MonitoringDashboardList
   * @summary Get monitoring dashboard data
   * @request GET:/admin/monitoring/dashboard
   * @secure
   */
  monitoringDashboardList = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/monitoring/dashboard`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Monitoring
   * @name MonitoringHealthList
   * @summary Get system health status
   * @request GET:/admin/monitoring/health
   * @secure
   */
  monitoringHealthList = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/monitoring/health`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Monitoring
   * @name MonitoringApiUsageList
   * @summary Get API usage metrics
   * @request GET:/admin/monitoring/api-usage
   * @secure
   */
  monitoringApiUsageList = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/monitoring/api-usage`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Monitoring
   * @name MonitoringSyncPerformanceList
   * @summary Get sync performance metrics
   * @request GET:/admin/monitoring/sync-performance
   * @secure
   */
  monitoringSyncPerformanceList = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/monitoring/sync-performance`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Monitoring
   * @name MonitoringDatabaseList
   * @summary Get database performance metrics
   * @request GET:/admin/monitoring/database
   * @secure
   */
  monitoringDatabaseList = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/monitoring/database`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Monitoring
   * @name MonitoringAlertsList
   * @summary Get system alerts
   * @request GET:/admin/monitoring/alerts
   * @secure
   */
  monitoringAlertsList = (
    query?: {
      /** Filter unacknowledged alerts */
      unacknowledged?: boolean;
      /** Filter unresolved alerts */
      unresolved?: boolean;
      /** Filter by severity */
      severity?: "info" | "warning" | "critical";
      /**
       * Number of alerts to return
       * @default 50
       */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/monitoring/alerts`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Monitoring
   * @name MonitoringAlertsAcknowledgeCreate
   * @summary Acknowledge an alert
   * @request POST:/admin/monitoring/alerts/{alertId}/acknowledge
   * @secure
   */
  monitoringAlertsAcknowledgeCreate = (
    alertId: string,
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/monitoring/alerts/${alertId}/acknowledge`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Monitoring
   * @name MonitoringAlertsResolveCreate
   * @summary Resolve an alert
   * @request POST:/admin/monitoring/alerts/{alertId}/resolve
   * @secure
   */
  monitoringAlertsResolveCreate = (
    alertId: string,
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/monitoring/alerts/${alertId}/resolve`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Monitoring
   * @name MonitoringErrorsList
   * @summary Get error statistics and recent errors
   * @request GET:/admin/monitoring/errors
   * @secure
   */
  monitoringErrorsList = (
    query?: {
      /**
       * Time range in hours
       * @default 24
       */
      hours?: number;
      /**
       * Number of recent errors to return
       * @default 50
       */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/monitoring/errors`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Monitoring
   * @name MonitoringMetricsExportList
   * @summary Export monitoring metrics as CSV
   * @request GET:/admin/monitoring/metrics/export
   * @secure
   */
  monitoringMetricsExportList = (
    query: {
      /** Type of metrics to export */
      type: "api_usage" | "sync_performance" | "errors" | "alerts";
      /**
       * Number of days to export
       * @default 7
       */
      days?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<string, void>({
      path: `/admin/monitoring/metrics/export`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Place Types
   * @name PlaceTypesList
   * @summary Get all place types
   * @request GET:/admin/place-types
   * @secure
   */
  placeTypesList = (
    query?: {
      /** Filter by active status */
      is_active?: boolean;
      /** Search in name and description */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/place-types`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Place Types
   * @name PlaceTypesCreate
   * @summary Create a new place type
   * @request POST:/admin/place-types
   * @secure
   */
  placeTypesCreate = (
    data: {
      /** @maxLength 50 */
      name: string;
      /** @maxLength 200 */
      description?: string;
      /** @pattern ^#[0-9A-F]{6}$ */
      color?: string;
      /** @maxLength 50 */
      icon?: string;
      google_types: string[];
      is_active?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/place-types`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Place Types
   * @name PlaceTypesDetail
   * @summary Get place type by ID
   * @request GET:/admin/place-types/{id}
   * @secure
   */
  placeTypesDetail = (id: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/place-types/${id}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Place Types
   * @name PlaceTypesUpdate
   * @summary Update place type
   * @request PUT:/admin/place-types/{id}
   * @secure
   */
  placeTypesUpdate = (
    id: string,
    data: {
      /** @maxLength 50 */
      name?: string;
      /** @maxLength 200 */
      description?: string;
      /** @pattern ^#[0-9A-F]{6}$ */
      color?: string;
      /** @maxLength 50 */
      icon?: string;
      google_types?: string[];
      is_active?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/place-types/${id}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Place Types
   * @name PlaceTypesDelete
   * @summary Delete place type
   * @request DELETE:/admin/place-types/{id}
   * @secure
   */
  placeTypesDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/place-types/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Place Types
   * @name PlaceTypesGoogleTypesList
   * @summary Get all available Google types from existing places
   * @request GET:/admin/place-types/google-types
   * @secure
   */
  placeTypesGoogleTypesList = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/place-types/google-types`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Regions
   * @name RegionsCampusDetail
   * @summary Get campus region data
   * @request GET:/admin/regions/campus/{campus_id}
   * @secure
   */
  regionsCampusDetail = (campusId: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/regions/campus/${campusId}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Regions
   * @name RegionsCampusSummaryList
   * @summary Get campus summary with place statistics
   * @request GET:/admin/regions/campus/{campus_id}/summary
   * @secure
   */
  regionsCampusSummaryList = (campusId: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/regions/campus/${campusId}/summary`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Regions
   * @name RegionsCampusPlacesList
   * @summary Get places in a campus
   * @request GET:/admin/regions/campus/{campus_id}/places
   * @secure
   */
  regionsCampusPlacesList = (
    campusId: string,
    query?: {
      /** Filter by app category */
      category?: string;
      /** Filter by status */
      status?: "active" | "inactive" | "removed";
      /**
       * Number of places to return
       * @default 50
       */
      limit?: number;
      /**
       * Number of places to skip
       * @default 0
       */
      offset?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/regions/campus/${campusId}/places`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Regions
   * @name RegionsNearbyCreate
   * @summary Find nearby places across campuses
   * @request POST:/admin/regions/nearby
   * @secure
   */
  regionsNearbyCreate = (
    data: {
      campus_id: string;
      coordinates: {
        lat?: number;
        lng?: number;
      };
      /** @default 1000 */
      radius_meters?: number;
      /** @default 50 */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/regions/nearby`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Regions
   * @name RegionsCampusStatsList
   * @summary Get campus statistics
   * @request GET:/admin/regions/campus/{campus_id}/stats
   * @secure
   */
  regionsCampusStatsList = (campusId: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/regions/campus/${campusId}/stats`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Sync
   * @name SyncTriggerCreate
   * @summary Manually trigger sync for specific regions
   * @request POST:/admin/sync/trigger
   * @secure
   */
  syncTriggerCreate = (
    data: {
      /** Array of Region IDs (deprecated, use campus_ids) */
      region_ids: string[];
      /** Array of Campus IDs */
      campus_ids?: string[];
      force_full_sync?: boolean;
      include_details?: boolean;
      max_api_calls?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/sync/trigger`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Sync
   * @name SyncRetryFailedCreate
   * @summary Retry failed syncs
   * @request POST:/admin/sync/retry-failed
   * @secure
   */
  syncRetryFailedCreate = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/sync/retry-failed`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Sync
   * @name SyncLogsList
   * @summary Get sync logs
   * @request GET:/admin/sync/logs
   * @secure
   */
  syncLogsList = (
    query?: {
      /** Filter by region ID */
      region_id?: string;
      /** Filter by sync status */
      sync_status?: "pending" | "in_progress" | "completed" | "failed";
      /**
       * Number of logs to return
       * @default 50
       */
      limit?: number;
      /**
       * Number of logs to skip
       * @default 0
       */
      offset?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/sync/logs`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Sync
   * @name SyncStatsDetail
   * @summary Get sync statistics for a region
   * @request GET:/admin/sync/stats/{region_id}
   * @secure
   */
  syncStatsDetail = (regionId: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/sync/stats/${regionId}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Sync
   * @name SyncSchedulerStartCreate
   * @summary Start the sync scheduler
   * @request POST:/admin/sync/scheduler/start
   * @secure
   */
  syncSchedulerStartCreate = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/sync/scheduler/start`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Sync
   * @name SyncSchedulerStopCreate
   * @summary Stop the sync scheduler
   * @request POST:/admin/sync/scheduler/stop
   * @secure
   */
  syncSchedulerStopCreate = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/admin/sync/scheduler/stop`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin - Sync
   * @name SyncSchedulerConfigUpdate
   * @summary Update scheduler configuration
   * @request PUT:/admin/sync/scheduler/config
   * @secure
   */
  syncSchedulerConfigUpdate = (
    data: {
      syncCronPattern?: string;
      maxApiCallsPerDay?: number;
      maxApiCallsPerRegion?: number;
      enableNotifications?: boolean;
      retryFailedSyncs?: boolean;
      syncTimeoutMs?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/admin/sync/scheduler/config`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
