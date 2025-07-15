import { Place, PlacesFilters, PlacesResponse, Region } from "../types/place";
import API from "../API";

// Removed unused interface BackendPlaceResponse

export const placeService = {
  getAll: async (filters: PlacesFilters = {}): Promise<PlacesResponse> => {
    try {
      const params = new URLSearchParams();
      
      if (filters.campus_id) params.append("campus_id", filters.campus_id);
      if (filters.region_id) params.append("region_id", filters.region_id);
      if (filters.search) params.append("search", filters.search);
      if (filters.categories?.length) params.append("categories", filters.categories.join(","));
      if (filters.place_category) params.append("place_category", filters.place_category);
      if (filters.is_deleted !== undefined) params.append("is_deleted", String(filters.is_deleted));
      // Convert page to offset for backend
      if (filters.page && filters.limit) {
        const offset = (filters.page - 1) * filters.limit;
        params.append("offset", String(offset));
      }
      if (filters.limit) params.append("limit", String(filters.limit));
      if (filters.sort) params.append("sort", filters.sort);
      if (filters.order) params.append("order", filters.order);

      const response = await API.get(`/admin/places?${params.toString()}`);

      // Handle success response with nested data structure
      if (response.data.success && response.data.data && response.data.data.places && Array.isArray(response.data.data.places)) {
        return {
          places: response.data.data.places,
          total: response.data.data.pagination?.total || 0,
          page: (response.data.data.pagination?.offset || 0) / (response.data.data.pagination?.limit || 20) + 1,
          pages: Math.ceil((response.data.data.pagination?.total || 0) / (response.data.data.pagination?.limit || 20)),
          limit: response.data.data.pagination?.limit || 20,
        };
      }

      // Handle pagination response structure (fallback)
      if (response.data.places && Array.isArray(response.data.places)) {
        return {
          places: response.data.places,
          total: response.data.total || 0,
          page: response.data.page || 1,
          pages: response.data.pages || 1,
          limit: response.data.limit || 20,
        };
      }

      // Handle simple array response
      if (Array.isArray(response.data)) {
        return {
          places: response.data,
          total: response.data.length,
          page: 1,
          pages: 1,
          limit: response.data.length,
        };
      }

      console.warn("⚠️ Unexpected response structure:", response.data);
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
          console.log("📋 404 error - returning empty response");
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
      const response = await API.put(`/admin/places/${placeId}/categories`, { categories });
      return response.data;
    } catch (error) {
      console.error("Failed to update place categories:", error);
      throw error;
    }
  },

  delete: async (placeId: string): Promise<void> => {
    try {
      await API.delete(`/admin/places/${placeId}`);
    } catch (error) {
      console.error("Failed to delete place:", error);
      throw error;
    }
  },

  restore: async (placeId: string): Promise<Place> => {
    try {
      const response = await API.post(`/admin/places/${placeId}/restore`);
      return response.data;
    } catch (error) {
      console.error("Failed to restore place:", error);
      throw error;
    }
  },

  syncPhotos: async (placeId: string): Promise<void> => {
    try {
      await API.post(`/admin/places/${placeId}/sync-photos`);
    } catch (error) {
      console.error("Failed to sync place photos:", error);
      throw error;
    }
  },

  batchSyncPhotos: async (placeIds: string[]): Promise<void> => {
    try {
      await API.post("/admin/places/photo-sync/batch", { place_ids: placeIds });
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
      const params = new URLSearchParams();
      params.append("limit", String(limit));
      params.append("offset", String(offset));

      const response = await API.get(`/admin/places/${placeId}/nested?${params.toString()}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error("Invalid response structure");
    } catch (error) {
      console.error("Failed to fetch nested places:", error);
      throw error;
    }
  },

  getRegionsByCampus: async (campusId: string): Promise<Region[]> => {
    try {
      const response = await API.get(`/regions/campus/${campusId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch regions for campus:", error);
      
      // Handle 404 specifically (no regions found)
      if (error instanceof Error && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return [];
        }
      }
      
      throw error;
    }
  },
};
