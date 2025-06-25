import { Campus, CampusFormData } from '../types/campus';

const mockCampuses: Campus[] = [
  {
    id: '1',
    name: 'FIU Main Campus',
    location: 'Miami, FL',
    address: '11200 SW 8th St, Miami, FL 33199',
    status: 'active',
    geofenceCount: 3,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'FIU Biscayne Bay Campus',
    location: 'North Miami, FL',
    address: '3000 NE 151st St, North Miami, FL 33181',
    status: 'active',
    geofenceCount: 2,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  }
];

export const campusService = {
  getAll: async (): Promise<Campus[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockCampuses];
  },
  
  create: async (data: CampusFormData): Promise<Campus> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCampus: Campus = {
      id: Date.now().toString(),
      ...data,
      geofenceCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockCampuses.push(newCampus);
    return newCampus;
  },
  
  update: async (id: string, data: Partial<CampusFormData>): Promise<Campus> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockCampuses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Campus not found');
    
    mockCampuses[index] = {
      ...mockCampuses[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockCampuses[index];
  },
  
  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockCampuses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Campus not found');
    mockCampuses.splice(index, 1);
  }
};
