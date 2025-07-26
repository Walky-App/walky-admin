import API from "../API";
import { Interest, CreateInterestDto, UpdateInterestDto } from "../types/interest";

export const interestService = {
  // Get all interests
  async getAllInterests(): Promise<Interest[]> {
    const response = await API.get("/interests");
    return response.data;
  },

  // Get a single interest by ID
  async getInterestById(id: string): Promise<Interest> {
    const response = await API.get(`/interests/${id}`);
    return response.data;
  },

  // Create a new interest
  async createInterest(data: CreateInterestDto): Promise<Interest> {
    const response = await API.post("/interests", data);
    return response.data;
  },

  // Update an interest
  async updateInterest(id: string, data: UpdateInterestDto): Promise<Interest> {
    const response = await API.put(`/interests/${id}`, data);
    return response.data;
  },

  // Delete an interest (soft delete)
  async deleteInterest(id: string): Promise<void> {
    await API.delete(`/interests/${id}`);
  },

  // Upload image
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("image", file);
    
    const response = await API.post("/interests/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  },
};