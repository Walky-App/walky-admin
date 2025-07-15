import API from '../API';
import { PlaceType, GoogleType, CreatePlaceTypeRequest, UpdatePlaceTypeRequest } from '../types/placeType';

export const placeTypeService = {
  // Get all place types
  getAll: async (params?: {
    is_active?: boolean;
    search?: string;
  }): Promise<PlaceType[]> => {
    const response = await API.get(
      `/admin/place-types`,
      {
        params
      }
    );
    return response.data.data;
  },

  // Get place type by ID
  getById: async (id: string): Promise<PlaceType> => {
    const response = await API.get(
      `/admin/place-types/${id}`
    );
    return response.data.data;
  },

  // Create new place type
  create: async (data: CreatePlaceTypeRequest): Promise<PlaceType> => {
    const response = await API.post(
      `/admin/place-types`,
      data,
    );
    return response.data.data;
  },

  // Update place type
  update: async (id: string, data: UpdatePlaceTypeRequest): Promise<PlaceType> => {
    const response = await API.put(
      `/admin/place-types/${id}`,
      data,
    );
    return response.data.data;
  },

  // Delete place type
  delete: async (id: string): Promise<void> => {
    await API.delete(
      `/admin/place-types/${id}`,
    );
  },

  // Get available Google types
  getGoogleTypes: async (): Promise<GoogleType[]> => {
    const response = await API.get(
      `/admin/place-types/google-types`,
    );
    return response.data.data;
  },
};
