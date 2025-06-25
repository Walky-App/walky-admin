import React, { useState, useEffect } from 'react';
import { 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell, 
  CButton, 
  CBadge,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';

import { Geofence } from '../types/geofence';
import { geofenceService } from '../services/geofenceService';

interface GeofenceTableProps {
  onEdit: (geofence: Geofence) => void;
  onDelete: (id: string) => void;
  refreshTrigger: number;
}

const GeofenceTable: React.FC<GeofenceTableProps> = ({ onEdit, onDelete, refreshTrigger }) => {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGeofences();
  }, [refreshTrigger]);

  const fetchGeofences = async () => {
    try {
      setLoading(true);
      const data = await geofenceService.getAll();
      setGeofences(data);
    } catch (error) {
      console.error('Failed to fetch geofences:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <CSpinner color="primary" />
        <div className="mt-2">Loading geofences...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '0',
        overflow: 'hidden',
      }}
    >
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Coordinates</CTableHeaderCell>
            <CTableHeaderCell>Radius (m)</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Created</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {geofences.map((geofence) => (
            <CTableRow key={geofence.id}>
              <CTableDataCell>
                <strong>{geofence.name}</strong>
              </CTableDataCell>
              <CTableDataCell>
                <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {geofence.description}
                </div>
              </CTableDataCell>
              <CTableDataCell>
                <code style={{ fontSize: '0.85em' }}>
                  {formatCoordinates(geofence.latitude, geofence.longitude)}
                </code>
              </CTableDataCell>
              <CTableDataCell>{geofence.radius}</CTableDataCell>
              <CTableDataCell>
                <CBadge 
                  color={geofence.status === 'active' ? 'success' : 'secondary'}
                  shape="rounded-pill"
                >
                  {geofence.status}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>{formatDate(geofence.createdAt)}</CTableDataCell>
              <CTableDataCell>
                <div className="d-flex gap-2">
                  <CButton
                    color="info"
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(geofence)}
                  >
                    <CIcon icon={cilPencil} size="sm" />
                  </CButton>
                  <CButton
                    color="danger"
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(geofence.id)}
                  >
                    <CIcon icon={cilTrash} size="sm" />
                  </CButton>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      {geofences.length === 0 && (
        <div className="text-center p-4 text-muted">
          No geofences found. Create your first geofence to get started.
        </div>
      )}
    </div>
  );
};

export default GeofenceTable;
