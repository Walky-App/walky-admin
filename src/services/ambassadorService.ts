import { logger } from "../lib/logger";
import { apiClient } from "../API";
import { Ambassador } from "../types/ambassador";

export const ambassadorService = {
  // Get all ambassadors
  getAll: async (): Promise<Ambassador[]> => {
    try {
      logger.debug("🚀 Fetching all ambassadors...");
      const response = await apiClient.ambassadors.ambassadorsList();
      logger.debug("✅ Ambassadors response:", response.data);

      return response.data.data || [];
    } catch (error) {
      logger.error("❌ Failed to fetch ambassadors:", error);
      return [];
    }
  },

  // Get ambassador by ID
  getById: async (id: string): Promise<Ambassador | undefined> => {
    try {
      logger.debug("🚀 Fetching ambassador with ID:", id);
      const response = await apiClient.ambassadors.ambassadorsDetail(id);
      logger.debug("✅ Ambassador response:", response.data);

      return response.data.data;
    } catch (error) {
      logger.error("❌ Failed to fetch ambassador:", error);
      throw error;
    }
  },

  // Create new ambassador
  create: async (data: {
    name: string;
    email: string;
    phone?: string;
    student_id?: string;
    is_active?: boolean;
    profile_image_url?: string;
    bio?: string;
    graduation_year?: number;
    major?: string;
  }): Promise<Ambassador | undefined> => {
    try {
      logger.debug("🚀 Creating ambassador with data:", data);

      const ambassadorData = {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        student_id: data.student_id || "",
        is_active: data.is_active ?? true,
        profile_image_url: data.profile_image_url || "",
        bio: data.bio || "",
        graduation_year: data.graduation_year,
        major: data.major || "",
      };

      logger.debug("📤 Sending ambassador data:", ambassadorData);
      const response =
        await apiClient.ambassadors.ambassadorsCreate(ambassadorData);
      logger.debug("✅ Create ambassador response:", response.data);

      return response.data.data;
    } catch (error) {
      logger.error("❌ Failed to create ambassador:", error);
      throw error;
    }
  },

  // Update ambassador
  update: async (
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      student_id?: string;
      is_active?: boolean;
      profile_image_url?: string;
      bio?: string;
      graduation_year?: number;
      major?: string;
    }
  ): Promise<Ambassador | undefined> => {
    try {
      logger.debug("🚀 Updating ambassador with ID:", id, "Data:", data);

      const response = await apiClient.ambassadors.ambassadorsUpdate(id, data);
      logger.debug("✅ Update ambassador response:", response.data);

      return response.data.data;
    } catch (error) {
      logger.error("❌ Failed to update ambassador:", error);
      throw error;
    }
  },

  // Delete ambassador
  delete: async (id: string): Promise<void> => {
    try {
      logger.debug("🗑️ Deleting ambassador with ID:", id);
      await apiClient.ambassadors.ambassadorsDelete(id);
      logger.debug("✅ Ambassador deleted successfully");
    } catch (error) {
      logger.error("❌ Failed to delete ambassador:", error);
      throw error;
    }
  },

  // Get ambassadors by campus
  getByCampus: async (campusId: string): Promise<Ambassador[]> => {
    try {
      logger.debug("🚀 Fetching ambassadors for campus:", campusId);
      const response = await apiClient.ambassadors.campusDetail(campusId);
      logger.debug("✅ Campus ambassadors response:", response.data);

      return response.data.data || [];
    } catch (error) {
      logger.error("❌ Failed to fetch campus ambassadors:", error);
      throw error;
    }
  },
};
