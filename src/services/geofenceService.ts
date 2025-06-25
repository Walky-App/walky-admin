import { Geofence, GeofenceFormData, GeoJSONFeature, GeoJSONFeatureCollection } from '../types/geofence';

const mockGeofences: Geofence[] = [
  {
    id: '1',
    name: 'FIU Campus Main',
    description: 'Main campus area for student activities',
    latitude: 25.7617,
    longitude: -80.1918,
    radius: 500,
    type: 'radius',
    status: 'active',
    campusId: '1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Engineering Building',
    description: 'Engineering and Computer Science building perimeter',
    latitude: 25.7580,
    longitude: -80.1920,
    radius: 200,
    type: 'radius',
    status: 'active',
    campusId: '1',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Student Union',
    description: 'Student Union building and surrounding area',
    latitude: 25.7600,
    longitude: -80.1900,
    radius: 150,
    type: 'radius',
    status: 'inactive',
    campusId: '1',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-10T16:45:00Z'
  },
  {
    id: '4',
    name: 'Recreation Center',
    description: 'Fitness and recreation center zone',
    latitude: 25.7640,
    longitude: -80.1880,
    radius: 300,
    type: 'radius',
    status: 'active',
    campusId: '1',
    createdAt: '2024-02-15T11:20:00Z',
    updatedAt: '2024-02-15T11:20:00Z'
  },
  {
    id: '5',
    name: 'BBC Library',
    description: 'Biscayne Bay Campus Library area',
    latitude: 25.9108,
    longitude: -80.1431,
    radius: 100,
    type: 'radius',
    status: 'active',
    campusId: '2',
    createdAt: '2024-02-20T12:00:00Z',
    updatedAt: '2024-02-20T12:00:00Z'
  },
  {
    id: '6',
    name: 'BBC Marine Sciences',
    description: 'Marine and Environmental Science building',
    latitude: 25.9120,
    longitude: -80.1440,
    radius: 150,
    type: 'radius',
    status: 'active',
    campusId: '2',
    createdAt: '2024-02-25T15:30:00Z',
    updatedAt: '2024-02-25T15:30:00Z'
  }
];

export const geofenceService = {
  getAll: async (): Promise<Geofence[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockGeofences];
  },

  getByCampus: async (campusId: string): Promise<Geofence[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockGeofences.filter(g => g.campusId === campusId);
  },
  
  create: async (data: GeofenceFormData): Promise<Geofence> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newGeofence: Geofence = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockGeofences.push(newGeofence);
    return newGeofence;
  },

  createForCampus: async (campusId: string, data: Omit<GeofenceFormData, 'campusId'>): Promise<Geofence> => {
    const formData = { ...data, campusId };
    const result = await geofenceService.create(formData);
    
    return result;
  },
  
  update: async (id: string, data: Partial<GeofenceFormData>): Promise<Geofence> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockGeofences.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Geofence not found');
    
    mockGeofences[index] = {
      ...mockGeofences[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockGeofences[index];
  },
  
  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockGeofences.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Geofence not found');
    mockGeofences.splice(index, 1);
  },

  exportGeoJSON: async (geofences: Geofence[]): Promise<GeoJSONFeatureCollection> => {
    const features: GeoJSONFeature[] = geofences.map(geofence => {
      const feature: GeoJSONFeature = {
        type: 'Feature',
        properties: {
          id: geofence.id,
          name: geofence.name,
          description: geofence.description,
          status: geofence.status,
          campusId: geofence.campusId,
          createdAt: geofence.createdAt,
          updatedAt: geofence.updatedAt
        },
        geometry: geofence.type === 'radius' 
          ? {
              type: 'Point',
              coordinates: [geofence.longitude, geofence.latitude]
            }
          : {
              type: 'Polygon',
              coordinates: [geofence.polygon?.map(p => [p.lng, p.lat]) || []]
            }
      };
      
      if (geofence.type === 'radius' && geofence.radius) {
        feature.properties = {
          ...feature.properties,
          radius: geofence.radius
        } as typeof feature.properties & { radius: number };
      }
      
      return feature;
    });

    return {
      type: 'FeatureCollection',
      features
    };
  },

  exportSingleGeoJSON: async (geofence: Geofence): Promise<GeoJSONFeature> => {
    const collection = await geofenceService.exportGeoJSON([geofence]);
    return collection.features[0];
  }
};
