export interface PlaceType {
  _id: string;
  name: string;
  description?: string;
  google_types: string[];
  is_active: boolean;
  places_count?: number;
  created_by?: string;
  updated_by?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoogleType {
  type: string;
  places_count: number;
}

export interface CreatePlaceTypeRequest {
  name: string;
  description?: string;
  google_types: string[];
  is_active?: boolean;
}

export interface UpdatePlaceTypeRequest {
  name?: string;
  description?: string;
  google_types?: string[];
  is_active?: boolean;
}
