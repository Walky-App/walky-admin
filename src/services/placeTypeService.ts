import { apiClient } from '../API';
import { PlaceType, GoogleType, CreatePlaceTypeRequest, UpdatePlaceTypeRequest } from '../types/placeType';

export const placeTypeService = {
  // Get all place types
  getAll: async (params?: {
    is_active?: boolean;
    search?: string;
  }): Promise<PlaceType[]> => {
    const response = await apiClient.admin.placeTypesList(params) as any;
    return response.data.data;
  },

  // Get place type by ID
  getById: async (id: string): Promise<PlaceType> => {
    const response = await apiClient.admin.placeTypesDetail(id) as any;
    return response.data.data;
  },

  // Create new place type
  create: async (data: CreatePlaceTypeRequest): Promise<PlaceType> => {
    const response = await apiClient.admin.placeTypesCreate(data as any) as any;
    return response.data.data;
  },

  // Update place type
  update: async (id: string, data: UpdatePlaceTypeRequest): Promise<PlaceType> => {
    const response = await apiClient.admin.placeTypesUpdate(id, data as any) as any;
    return response.data.data;
  },

  // Delete place type
  delete: async (id: string): Promise<void> => {
    await apiClient.admin.placeTypesDelete(id);
  },

  // Get available Google types
  getGoogleTypes: async (): Promise<GoogleType[]> => {
    const response = await apiClient.admin.placeTypesGoogleTypesList() as any;
    return response.data.data;
  },
};
