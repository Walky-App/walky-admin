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
  photos?: Array<{
    height: number;
    width: number;
    html_attributions: string[];
    photo_reference: string;
    photo_url?: string;
    gcs_url?: string;
    optimized_urls?: {
      thumb?: string;
      large?: string;
    };
  }>;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
  
  // Walky specific fields
  campus_id?: string;
  region_id?: string;
  categories?: string[];
  parent_place_id?: string;
  place_category?: 'container' | 'standalone' | 'nested';
  is_synced?: boolean;
  is_deleted?: boolean;
  deleted_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  last_synced_at?: Date;
  
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
  region?: Region;
}

export interface Region {
  _id: string;
  name: string;
  campus_id: string;
  type: 'circle' | 'polygon';
  center?: {
    lat: number;
    lng: number;
  };
  radius?: number;
  polygon?: Array<{ lat: number; lng: number }>;
  sync_settings?: {
    enabled: boolean;
    types?: string[];
    keywords?: string[];
    radius?: number;
    last_sync?: Date;
    sync_interval_hours?: number;
  };
  stats?: {
    total_places: number;
    synced_places: number;
    last_updated: Date;
  };
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlacesFilters {
  campus_id?: string;
  region_id?: string;
  search?: string;
  categories?: string[];
  place_category?: 'container' | 'standalone' | 'nested';
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
