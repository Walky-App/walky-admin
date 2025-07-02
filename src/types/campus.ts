export interface Campus {
  id: string;
  campus_name: string;
  city: string;
  state: string;
  zip: string;
  phone_number: string;
  address: string;
  image_url?: string;
  ambassador_ids?: string[]; // Ambassador IDs only
  coordinates?: {
    type: string;
    coordinates: number[][][];
  };
  dawn_to_dusk?: number[]; // Array for minutes from midnight [dawn, dusk]
  time_zone: string;
  is_active: boolean;
  created_by?: string;
  school_id?: string; // Backend handled
  geofenceCount?: number;
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for compatibility
  name?: string;
  location?: string;
  logo?: string;
  status?: "active" | "inactive";
  campus_short_name?: string;
}

export interface CampusFormData {
  campus_name: string;
  image_url: string; // Backend expects this field
  ambassador_ids?: string[]; // Ambassador IDs only
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  coordinates?: {
    type: string;
    coordinates: number[][][];
  };
  dawn_to_dusk?: number[]; // Array for minutes from midnight [dawn, dusk]
  time_zone: string;
  is_active?: boolean; // Optional, defaults to true on backend
  // Backend automatically handles: school_id, enabled, created_by
}
