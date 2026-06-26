import { logger } from "../lib/logger";
import { apiClient } from "../API";
import { Campus } from "../types/campus";

// Re-export Campus with id included - types/campus.ts already has all extended properties
type CampusWithId = Campus & { id: string };

export const campusService = {
  getAll: async (): Promise<CampusWithId[]> => {
    try {
      const response = await apiClient.api.campusesList();

      logger.debug("📋 Fetched campuses raw response:", response);
      logger.debug("📋 Response data type:", typeof response.data);
      logger.debug("📋 Response data:", response.data);

      // Handle different response structures
      let campusArray: Campus[] = [];

      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          campusArray = response.data.data;
        } else {
          logger.warn("⚠️ Unexpected response structure:", response.data);
          return [];
        }
      }

      logger.debug("📋 Campus array to process:", campusArray);

      // Map _id to id for frontend compatibility
      const campuses = campusArray.map((campus) => ({
        ...campus,
        id: campus._id || "",
      }));

      logger.debug("📋 Processed campuses:", campuses);
      return campuses;
    } catch (error) {
      logger.error("Failed to fetch campuses:", error);

      // Handle 404 specifically (no campuses found)
      if (error instanceof Error && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          logger.debug("📋 404 error - returning empty array");
          return [];
        }
      }

      throw error;
    }
  },

  create: async (data: {
    campus_name: string;
    campus_short_name?: string;
    image_url?: string;
    ambassador_ids?: string[];
    phone_number: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    coordinates?: {
      type?: "Polygon";
      coordinates?: number[][][];
    };
    dawn_to_dusk?: string[];
    time_zone: string;
    is_active?: boolean;
  }): Promise<CampusWithId> => {
    try {
      logger.debug(
        "📤 Sending campus data to backend:",
        JSON.stringify(data, null, 2)
      );

      const response = await apiClient.api.campusesCreate(data);

      logger.debug("✅ Campus created successfully:", response.data);

      const campus = response.data.data;

      if (!campus) {
        throw new Error("No campus data returned from API");
      }

      return {
        ...campus,
        id: campus._id || "",
      };
    } catch (error) {
      logger.error("❌ Failed to create campus:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            statusText?: string;
            data?: unknown;
          };
          config?: {
            url?: string;
            method?: string;
          };
        };

        logger.error("🔍 Campus creation error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          responseData: axiosError.response?.data,
        });

        if (axiosError.response?.status === 400) {
          logger.error(
            "💥 Backend validation error (400):",
            axiosError.response.data
          );
        }
      }

      throw error;
    }
  },

  update: async (
    id: string,
    data: Partial<{
      campus_name: string;
      campus_short_name?: string;
      image_url?: string;
      ambassador_ids?: string[];
      phone_number: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      coordinates?: {
        type?: "Polygon";
        coordinates?: number[][][];
      };
      dawn_to_dusk?: string[];
      time_zone: string;
      is_active?: boolean;
    }>
  ): Promise<CampusWithId> => {
    try {
      const response = await apiClient.api.campusesUpdate(id, data);

      const campus = response.data.data;

      if (!campus) {
        throw new Error("No campus data returned from API");
      }

      return {
        ...campus,
        id: campus._id || "",
      };
    } catch (error) {
      logger.error("Failed to update campus:", error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      logger.debug("🗑️ Deleting campus with ID:", id);
      logger.debug("🔗 Making DELETE request to:", `/campus/${id}`);

      const response = await apiClient.api.campusesDelete(id);
      logger.debug("✅ Delete response:", response);
    } catch (error) {
      logger.error("❌ Failed to delete campus:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            statusText?: string;
            data?: unknown;
          };
          config?: {
            url?: string;
            method?: string;
          };
        };

        logger.error("🔍 Error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          url: axiosError.config?.url,
          method: axiosError.config?.method,
        });
      }

      throw error;
    }
  },
};
