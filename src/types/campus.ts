export interface Campus {
  id: string;
  name: string;
  location: string;
  address: string;
  logo?: string;
  status: 'active' | 'inactive';
  geofenceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampusFormData {
  name: string;
  location: string;
  address: string;
  logo?: string;
  status: 'active' | 'inactive';
}
