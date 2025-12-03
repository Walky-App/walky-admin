import { apiClient } from "../API";
import { Interest, CreateInterestDto, UpdateInterestDto } from "../types/interest";

export const interestService = {
  // Get all interests
  async getAllInterests(): Promise<Interest[]> {
    const response = await apiClient.api.interestsList() as any;
    return response.data;
  },

  // Get a single interest by ID
  async getInterestById(id: string): Promise<Interest> {
    const response = await apiClient.api.interestsDetail(id) as any;
    return response.data;
  },

  // Create a new interest
  async createInterest(data: CreateInterestDto): Promise<Interest> {
    const response = await apiClient.api.interestsCreate(data as any) as any;
    return response.data;
  },

  // Update an interest
  async updateInterest(id: string, data: UpdateInterestDto): Promise<Interest> {
    const response = await apiClient.api.interestsUpdate(id, data) as any;
    return response.data;
  },

  // Delete an interest (soft delete)
  async deleteInterest(id: string): Promise<void> {
    await apiClient.api.interestsDelete(id);
  },

  // Upload image
  async uploadImage(file: File): Promise<{ url: string }> {
    const response = await apiClient.api.interestsUploadImageCreate({
      image: file,
      type: "image" // Defaulting to "image" as it was not specified before
    }) as any;

    return response.data;
  },
};