import { Place, PlacesFilters, PlacesResponse } from "../types/place";
import { apiClient } from "../API";

export const placeService = {
  getAll: async (filters: PlacesFilters = {}): Promise<PlacesResponse> => {
    try {
      const queryParams: {
        campus_id?: string;
        search?: string;
        categories?: string;
        place_category?: string;
        hierarchy_level?: string;
        parent_place_id?: string;
        is_deleted?: string;
        offset?: number;
        limit?: number;
        sort?: "name" | "rating" | "updated_at" | "created_at";
        order?: "asc" | "desc";
      } = {};

      if (filters.campus_id) queryParams.campus_id = filters.campus_id;
      if (filters.search) queryParams.search = filters.search;
      if (filters.categories?.length) queryParams.categories = filters.categories.join(",");
      if (filters.place_category) queryParams.place_category = filters.place_category;
      if (filters.hierarchy_level !== undefined) queryParams.hierarchy_level = String(filters.hierarchy_level);
      if (filters.parent_place_id !== undefined) queryParams.parent_place_id = filters.parent_place_id === null ? "" : filters.parent_place_id;
      if (filters.is_deleted !== undefined) queryParams.is_deleted = String(filters.is_deleted);
      if (filters.page && filters.limit) {
        const offset = (filters.page - 1) * filters.limit;
        queryParams.offset = offset;
      }
      if (filters.limit) queryParams.limit = filters.limit;
      if (filters.sort) queryParams.sort = filters.sort as "name" | "rating" | "updated_at" | "created_at";
      if (filters.order) queryParams.order = filters.order as "asc" | "desc";

      const response = await apiClient.admin.placesList(queryParams);

      // Handle success response with nested data structure
      if (response.data.success && response.data.data?.places && Array.isArray(response.data.data.places)) {
        return {
          places: response.data.data.places as Place[],
          total: response.data.data.pagination?.total || 0,
          page: (response.data.data.pagination?.offset || 0) / (response.data.data.pagination?.limit || 20) + 1,
          pages: Math.ceil((response.data.data.pagination?.total || 0) / (response.data.data.pagination?.limit || 20)),
          limit: response.data.data.pagination?.limit || 20,
        };
      }

      console.warn("Unexpected response structure:", response.data);
      return {
        places: [],
        total: 0,
        page: 1,
        pages: 1,
        limit: 20,
      };
    } catch (error) {
      console.error("Failed to fetch places:", error);

      // Handle 404 specifically (no places found)
      if (error instanceof Error && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          console.log("404 error - returning empty response");
          return {
            places: [],
            total: 0,
            page: 1,
            pages: 1,
            limit: 20,
          };
        }
      }

      throw error;
    }
  },

  updateCategories: async (placeId: string, categories: string[]): Promise<Place> => {
    try {
      const response = await apiClient.admin.placesCategoriesUpdate(placeId, { app_categories: categories });
      return (response.data as { data?: Place }).data as Place;
    } catch (error) {
      console.error("Failed to update place categories:", error);
      throw error;
    }
  },

  delete: async (placeId: string): Promise<void> => {
    try {
      await apiClient.admin.placesDelete(placeId);
    } catch (error) {
      console.error("Failed to delete place:", error);
      throw error;
    }
  },

  restore: async (placeId: string): Promise<Place> => {
    try {
      const response = await apiClient.admin.placesRestoreCreate(placeId);
      return (response.data as { data?: Place }).data as Place;
    } catch (error) {
      console.error("Failed to restore place:", error);
      throw error;
    }
  },

  syncPhotos: async (placeId: string): Promise<void> => {
    try {
      await apiClient.admin.placesSyncPhotosCreate(placeId);
    } catch (error) {
      console.error("Failed to sync place photos:", error);
      throw error;
    }
  },

  batchSyncPhotos: async (placeIds: string[]): Promise<void> => {
    try {
      await apiClient.admin.placesPhotoSyncBatchCreate({ place_ids: placeIds });
    } catch (error) {
      console.error("Failed to batch sync photos:", error);
      throw error;
    }
  },

  getNestedPlaces: async (placeId: string, limit: number = 50, offset: number = 0): Promise<{
    parent_place: { place_id: string; name: string; place_category: string };
    nested_places: Place[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      has_more: boolean;
      current_page: number;
      total_pages: number;
    };
  }> => {
    try {
      const response = await apiClient.admin.placesNestedList(placeId, { limit, offset });

      if (response.data.success && response.data.data) {
        return response.data.data as {
          parent_place: { place_id: string; name: string; place_category: string };
          nested_places: Place[];
          pagination: {
            total: number;
            limit: number;
            offset: number;
            has_more: boolean;
            current_page: number;
            total_pages: number;
          };
        };
      }

      throw new Error("Invalid response structure");
    } catch (error) {
      console.error("Failed to fetch nested places:", error);
      throw error;
    }
  }
};
