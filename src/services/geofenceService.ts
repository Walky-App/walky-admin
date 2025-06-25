import { Geofence, GeofenceFormData } from '../types/geofence';

const mockGeofences: Geofence[] = [
  {
    id: '1',
    name: 'FIU Campus Main',
    description: 'Main campus area for student activities',
    latitude: 25.7617,
    longitude: -80.1918,
    radius: 500,
    status: 'active',
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
    status: 'active',
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
    status: 'inactive',
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
    status: 'active',
    createdAt: '2024-02-15T11:20:00Z',
    updatedAt: '2024-02-15T11:20:00Z'
  }
];

export const geofenceService = {
  getAll: async (): Promise<Geofence[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockGeofences];
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
  }
};
