export interface Geofence {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  radius: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface GeofenceFormData {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  radius: number;
  status: 'active' | 'inactive';
}
