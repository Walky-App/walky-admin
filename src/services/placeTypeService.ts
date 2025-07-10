import axios from 'axios';
import { PlaceType, GoogleType, CreatePlaceTypeRequest, UpdatePlaceTypeRequest } from '../types/placeType';

const API_BASE_URL =  'https://staging.walkyapp.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const placeTypeService = {
  // Get all place types
  getAll: async (params?: {
    is_active?: boolean;
    search?: string;
  }): Promise<PlaceType[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/admin/place-types`,
      {
        params,
        headers: getAuthHeaders()
      }
    );
    return response.data.data;
  },

  // Get place type by ID
  getById: async (id: string): Promise<PlaceType> => {
    const response = await axios.get(
      `${API_BASE_URL}/admin/place-types/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data.data;
  },

  // Create new place type
  create: async (data: CreatePlaceTypeRequest): Promise<PlaceType> => {
    const response = await axios.post(
      `${API_BASE_URL}/admin/place-types`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data.data;
  },

  // Update place type
  update: async (id: string, data: UpdatePlaceTypeRequest): Promise<PlaceType> => {
    const response = await axios.put(
      `${API_BASE_URL}/admin/place-types/${id}`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data.data;
  },

  // Delete place type
  delete: async (id: string): Promise<void> => {
    await axios.delete(
      `${API_BASE_URL}/admin/place-types/${id}`,
      { headers: getAuthHeaders() }
    );
  },

  // Get available Google types
  getGoogleTypes: async (): Promise<GoogleType[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/admin/place-types/google-types`,
      { headers: getAuthHeaders() }
    );
    return response.data.data;
  },
};
