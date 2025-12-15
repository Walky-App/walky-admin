import { apiClient } from '../API';
import { PlaceType, GoogleType, CreatePlaceTypeRequest, UpdatePlaceTypeRequest } from '../types/placeType';

export const placeTypeService = {
  // Get all place types
  getAll: async (params?: {
    is_active?: boolean;
    search?: string;
  }): Promise<PlaceType[]> => {
    const response = await apiClient.admin.placeTypesList(params);
    return response.data.data as PlaceType[];
  },

  // Get place type by ID
  getById: async (id: string): Promise<PlaceType> => {
    const response = await apiClient.admin.placeTypesDetail(id);
    return response.data.data as PlaceType;
  },

  // Create new place type
  create: async (data: CreatePlaceTypeRequest): Promise<PlaceType> => {
    const response = await apiClient.admin.placeTypesCreate(data);
    return response.data.data as PlaceType;
  },

  // Update place type
  update: async (id: string, data: UpdatePlaceTypeRequest): Promise<PlaceType> => {
    const response = await apiClient.admin.placeTypesUpdate(id, data);
    return response.data.data as PlaceType;
  },

  // Delete place type
  delete: async (id: string): Promise<void> => {
    await apiClient.admin.placeTypesDelete(id);
  },

  // Get available Google types
  getGoogleTypes: async (): Promise<GoogleType[]> => {
    const response = await apiClient.admin.placeTypesGoogleTypesList();
    return response.data.data as GoogleType[];
  },
};
