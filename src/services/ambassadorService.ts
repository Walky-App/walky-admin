import { apiClient } from "../API";
import {
  Ambassador,
  CreateAmbassadorRequest,
  UpdateAmbassadorRequest,
} from "../types/ambassador";

export const ambassadorService = {
  // Get all ambassadors
  getAll: async (): Promise<Ambassador[]> => {
    try {
      console.log("🚀 Fetching all ambassadors...");
      const response = await apiClient.ambassadors.ambassadorsList() as any;
      console.log("✅ Ambassadors response:", response.data);

      // Handle different response structures
      let ambassadors: Ambassador[];
      if (Array.isArray(response.data)) {
        ambassadors = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        ambassadors = response.data.data;
      } else if (
        response.data.ambassadors &&
        Array.isArray(response.data.ambassadors)
      ) {
        ambassadors = response.data.ambassadors;
      } else {
        console.warn("⚠️ Unexpected response structure:", response.data);
        ambassadors = [];
      }

      return ambassadors;
    } catch (error) {
      console.error("❌ Failed to fetch ambassadors:", error);
      // Return empty array when backend is not available
      return [];
    }
  },

  // Get ambassador by ID
  getById: async (id: string): Promise<Ambassador> => {
    try {
      console.log("🚀 Fetching ambassador with ID:", id);
      const response = await apiClient.ambassadors.ambassadorsDetail(id) as any;
      console.log("✅ Ambassador response:", response.data);

      // Handle different response structures
      if (response.data.data) {
        return response.data.data;
      } else if (response.data.ambassador) {
        return response.data.ambassador;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("❌ Failed to fetch ambassador:", error);
      throw error;
    }
  },

  // Create new ambassador
  create: async (data: CreateAmbassadorRequest): Promise<Ambassador> => {
    try {
      console.log("🚀 Creating ambassador with data:", data);

      // Ensure required fields are present
      const ambassadorData = {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        student_id: data.student_id || "",
        is_active: data.is_active ?? true,
        profile_image_url: data.profile_image_url || "",
        bio: data.bio || "",
        graduation_year: data.graduation_year || null,
        major: data.major || "",
      };

      console.log("📤 Sending ambassador data:", ambassadorData);
      const response = await apiClient.ambassadors.ambassadorsCreate(ambassadorData as any) as any;
      console.log("✅ Create ambassador response:", response.data);

      // Handle different response structures
      if (response.data.data) {
        return response.data.data;
      } else if (response.data.ambassador) {
        return response.data.ambassador;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("❌ Failed to create ambassador:", error);
      throw error;
    }
  },

  // Update ambassador
  update: async (
    id: string,
    data: UpdateAmbassadorRequest
  ): Promise<Ambassador> => {
    try {
      console.log("🚀 Updating ambassador with ID:", id, "Data:", data);

      const response = await apiClient.ambassadors.ambassadorsUpdate(id, data as any) as any;
      console.log("✅ Update ambassador response:", response.data);

      // Handle different response structures
      if (response.data.data) {
        return response.data.data;
      } else if (response.data.ambassador) {
        return response.data.ambassador;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("❌ Failed to update ambassador:", error);
      throw error;
    }
  },

  // Delete ambassador
  delete: async (id: string): Promise<void> => {
    try {
      console.log("🗑️ Deleting ambassador with ID:", id);
      await apiClient.ambassadors.ambassadorsDelete(id);
      console.log("✅ Ambassador deleted successfully");
    } catch (error) {
      console.error("❌ Failed to delete ambassador:", error);
      throw error;
    }
  },

  // Get ambassadors by campus
  getByCampus: async (campusId: string): Promise<Ambassador[]> => {
    try {
      console.log("🚀 Fetching ambassadors for campus:", campusId);
      const response = await apiClient.ambassadors.campusDetail(campusId) as any;
      console.log("✅ Campus ambassadors response:", response.data);

      // Handle different response structures
      let ambassadors: Ambassador[];
      if (Array.isArray(response.data)) {
        ambassadors = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        ambassadors = response.data.data;
      } else if (
        response.data.ambassadors &&
        Array.isArray(response.data.ambassadors)
      ) {
        ambassadors = response.data.ambassadors;
      } else {
        console.warn("⚠️ Unexpected response structure:", response.data);
        ambassadors = [];
      }

      return ambassadors;
    } catch (error) {
      console.error("❌ Failed to fetch campus ambassadors:", error);
      throw error;
    }
  },
};
