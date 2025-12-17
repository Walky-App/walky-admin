import { apiClient } from "../API";

// Use the actual API response type instead of the Interest interface
export type InterestResponse = {
  _id?: string;
  name?: string;
  image_url?: string;
  icon_url?: string;
  is_active?: boolean;
};

export const interestService = {
  // Get all interests
  async getAllInterests(): Promise<InterestResponse[]> {
    const response = await apiClient.api.interestsList();
    return response.data;
  },

  // Get a single interest by ID
  async getInterestById(id: string): Promise<InterestResponse | undefined> {
    const response = await apiClient.api.interestsDetail(id);
    return response.data as InterestResponse;
  },

  // Create a new interest
  async createInterest(data: {
    name: string;
    image_url: string;
    icon_url: string;
    is_active?: boolean;
  }): Promise<InterestResponse | undefined> {
    const response = await apiClient.api.interestsCreate(data);
    return response.data.data;
  },

  // Update an interest
  async updateInterest(
    id: string,
    data: {
      name?: string;
      image_url?: string;
      icon_url?: string;
      is_active?: boolean;
    }
  ): Promise<InterestResponse | undefined> {
    const response = await apiClient.api.interestsUpdate(id, data);
    return response.data.data;
  },

  // Delete an interest (soft delete)
  async deleteInterest(id: string): Promise<void> {
    await apiClient.api.interestsDelete(id);
  },

  // Upload image
  async uploadImage(file: File): Promise<{ url?: string }> {
    const response = await apiClient.api.interestsUploadImageCreate({
      image: file,
      type: "image",
    });

    return response.data;
  },
};
