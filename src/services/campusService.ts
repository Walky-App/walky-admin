import { Campus, CampusFormData } from "../types/campus";
import API from "../API";

// Interface for backend campus response (may have _id instead of id)
interface BackendCampusResponse extends Omit<Campus, "id"> {
  _id?: string;
  id?: string;
}

export const campusService = {
  getAll: async (): Promise<Campus[]> => {
    try {
      const response = await API.get("/campus");

      console.log("📋 Fetched campuses raw response:", response);
      console.log("📋 Response data type:", typeof response.data);
      console.log("📋 Response data:", response.data);

      // Handle different response structures
      let campusArray: BackendCampusResponse[] = [];

      if (response.data) {
        // Check if response.data is already an array
        if (Array.isArray(response.data)) {
          campusArray = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Handle nested structure like { data: [...] }
          campusArray = response.data.data;
        } else if (
          response.data.campuses &&
          Array.isArray(response.data.campuses)
        ) {
          // Handle structure like { campuses: [...] }
          campusArray = response.data.campuses;
        } else {
          console.warn("⚠️ Unexpected response structure:", response.data);
          return [];
        }
      }

      console.log("📋 Campus array to process:", campusArray);

      // Map _id to id if backend returns MongoDB _id field
      const campuses = campusArray.map((campus: BackendCampusResponse) => ({
        ...campus,
        id: campus.id || campus._id || "", // Use id if available, otherwise use _id, fallback to empty string
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
          return []; // Return empty array for no campuses found
        }
      }

      throw error;
    }
  },

  create: async (data: CampusFormData): Promise<Campus> => {
    try {
      const campusData = {
        ...data,
      };

      console.log(
        "📤 Sending campus data to backend:",
        JSON.stringify(campusData, null, 2)
      );

      const response = await API.post("/campus", campusData);

      console.log("✅ Campus created successfully:", response.data);
      
      // Handle nested response structure
      const campus = response.data.data || response.data;

      return {
        ...campus,
        id: campus.id || campus._id || "",
      };
    } catch (error) {
      console.error("❌ Failed to create campus:", error);

      // Log detailed error information for 400 errors
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

        // Log the specific backend error message
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
    data: Partial<CampusFormData>
  ): Promise<Campus> => {
    try {
      const response = await API.patch(`/campus/${id}`, data);
      // Handle nested response structure
      const campus = response.data.data || response.data;
      return {
        ...campus,
        id: campus.id || campus._id || "",
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

      const response = await API.delete(`/campus/${id}`);
      console.log("✅ Delete response:", response);
    } catch (error) {
      console.error("❌ Failed to delete campus:", error);

      // Log more details about the error
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
