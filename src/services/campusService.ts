import { apiClient } from "../API";
import { Campus } from "../API/WalkyAPI";

// Extended Campus type with id for frontend compatibility
type CampusWithId = Campus & { id: string };

export const campusService = {
  getAll: async (): Promise<CampusWithId[]> => {
    try {
      const response = await apiClient.api.campusesList();

      console.log("📋 Fetched campuses raw response:", response);
      console.log("📋 Response data type:", typeof response.data);
      console.log("📋 Response data:", response.data);

      // Handle different response structures
      let campusArray: Campus[] = [];

      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          campusArray = response.data.data;
        } else {
          console.warn("⚠️ Unexpected response structure:", response.data);
          return [];
        }
      }

      console.log("📋 Campus array to process:", campusArray);

      // Map _id to id for frontend compatibility
      const campuses = campusArray.map((campus) => ({
        ...campus,
        id: campus._id || "",
      }));

      console.log("📋 Processed campuses:", campuses);
      return campuses;
    } catch (error) {
      console.error("Failed to fetch campuses:", error);

      // Handle 404 specifically (no campuses found)
      if (error instanceof Error && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          console.log("📋 404 error - returning empty array");
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
      console.log(
        "📤 Sending campus data to backend:",
        JSON.stringify(data, null, 2)
      );

      const response = await apiClient.api.campusesCreate(data);

      console.log("✅ Campus created successfully:", response.data);

      const campus = response.data.data;

      if (!campus) {
        throw new Error("No campus data returned from API");
      }

      return {
        ...campus,
        id: campus._id || "",
      };
    } catch (error) {
      console.error("❌ Failed to create campus:", error);

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

        console.error("🔍 Campus creation error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          responseData: axiosError.response?.data,
        });

        if (axiosError.response?.status === 400) {
          console.error(
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
      console.error("Failed to update campus:", error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      console.log("🗑️ Deleting campus with ID:", id);
      console.log("🔗 Making DELETE request to:", `/campus/${id}`);

      const response = await apiClient.api.campusesDelete(id);
      console.log("✅ Delete response:", response);
    } catch (error) {
      console.error("❌ Failed to delete campus:", error);

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

        console.error("🔍 Error details:", {
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
