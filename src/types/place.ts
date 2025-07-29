export interface Place {
  _id: string;
  place_id: string;
  name: string;
  address?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  opening_hours?: {
    weekday_text?: string[];
    periods?: Array<{
      close?: { day: number; time: string };
      open?: { day: number; time: string };
    }>;
  };
  price_level?: number;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  google_types?: string[];
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  coordinates?: {
    lat: number;
    lng: number;
    _id?: string;
  };
  photos?: Array<{
    height: number;
    width: number;
    html_attributions?: string[];
    photo_reference: string;
    photo_url?: string;
    gcs_url?: string;
    optimized_urls?: {
      thumb?: string;
      small?: string;
      medium?: string;
      large?: string;
      _id?: string;
    };
    uploaded_at?: Date;
    _id?: string;
  }>;
  
  // Additional Google Places API fields
  business_status?: string; // OPERATIONAL, CLOSED_TEMPORARILY, CLOSED_PERMANENTLY
  curbside_pickup?: boolean;
  delivery?: boolean;
  dine_in?: boolean;
  editorial_summary?: {
    language?: string;
    overview?: string; // This is the description!
  };
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  plus_code?: {
    compound_code?: string;
    global_code?: string;
  };
  reservable?: boolean;
  serves_beer?: boolean;
  serves_breakfast?: boolean;
  serves_brunch?: boolean;
  serves_dinner?: boolean;
  serves_lunch?: boolean;
  serves_vegetarian_food?: boolean;
  serves_wine?: boolean;
  takeout?: boolean;
  url?: string; // Google Maps URL
  vicinity?: string; // Simplified address
  wheelchair_accessible_entrance?: boolean;
  
  // Walky specific fields
  campus_id?: string;
  campus_ids?: string[];
  categories?: string[];
  
  // Hierarchy fields
  parent_place_id?: string;
  child_place_ids?: string[];
  hierarchy_level?: number;
  hierarchy_path?: string[];
  is_inside_place?: boolean;
  contains_places?: boolean;
  place_category?: 'container' | 'standalone' | 'nested';
  floor_level?: string;
  
  // Status fields
  is_synced?: boolean;
  is_deleted?: boolean;
  deleted_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  last_synced_at?: Date;
  status?: string;
  is_active?: boolean;
  
  // Enhanced fields from backend
  nested_places_count?: number;
  has_nested_places?: boolean;
  photo_info?: {
    total_photos: number;
    synced_photos: number;
    thumbnails: Array<{
      thumb_url?: string;
      large_url?: string;
    }>;
  };
  
  // For display purposes
  campus?: Campus;
  
  // Additional properties that might be in the data
  secondary_description?: string;
  adr_address?: string;
  reference?: string;
}

// Region interface removed - places are now directly associated with campuses

export interface PlacesFilters {
  campus_id?: string;
  search?: string;
  categories?: string[];
  place_category?: 'container' | 'standalone' | 'nested';
  hierarchy_level?: number;
  parent_place_id?: string | null;
  is_deleted?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PlacesResponse {
  places: Place[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

// Import Campus type
import { Campus } from './campus';
