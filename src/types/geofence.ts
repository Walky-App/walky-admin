export interface Geofence {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  radius?: number;
  polygon?: Array<{ lat: number; lng: number }>;
  type: 'radius' | 'polygon';
  status: 'active' | 'inactive';
  campusId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeofenceFormData {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  radius?: number;
  polygon?: Array<{ lat: number; lng: number }>;
  type: 'radius' | 'polygon';
  status: 'active' | 'inactive';
  campusId: string;
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
    description: string;
    status: string;
    campusId: string;
    createdAt: string;
    updatedAt: string;
  };
  geometry: {
    type: 'Point' | 'Polygon';
    coordinates: number[] | number[][][];
  };
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}
