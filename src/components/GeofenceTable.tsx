import React, { useState, useEffect, useCallback } from 'react';
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
import { cilPencil, cilTrash, cilCloudDownload } from '@coreui/icons';

import { Geofence } from '../types/geofence';
import { geofenceService } from '../services/geofenceService';


interface GeofenceTableProps {
  onEdit: (geofence: Geofence) => void;
  onDelete: (id: string) => void;
  refreshTrigger: number;
  campusId?: string;
}

const GeofenceTable: React.FC<GeofenceTableProps> = ({ onEdit, onDelete, refreshTrigger, campusId }) => {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteGeofence = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this geofence?')) {
      return;
    }

    try {
      await geofenceService.delete(id);
      onDelete(id);
      fetchGeofences();
    } catch (error) {
      console.error('Failed to delete geofence:', error);
    }
  };

  const fetchGeofences = useCallback(async () => {
    try {
      setLoading(true);
      const data = campusId 
        ? await geofenceService.getByCampus(campusId)
        : await geofenceService.getAll();
      setGeofences(data);
    } catch (error) {
      console.error('Failed to fetch geofences:', error);
    } finally {
      setLoading(false);
    }
  }, [campusId]);

  const handleExportGeoJSON = async (geofence: Geofence) => {
    try {
      const geoJSON = await geofenceService.exportSingleGeoJSON(geofence);
      const blob = new Blob([JSON.stringify(geoJSON, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${geofence.name.replace(/\s+/g, '_')}_geofence.geojson`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export GeoJSON:', error);
      alert('Failed to export GeoJSON. Please try again.');
    }
  };

  const handleExportAllGeoJSON = async () => {
    try {
      const geoJSON = await geofenceService.exportGeoJSON(geofences);
      const blob = new Blob([JSON.stringify(geoJSON, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `geofences_collection.geojson`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export GeoJSON:', error);
      alert('Failed to export GeoJSON. Please try again.');
    }
  };

  useEffect(() => {
    fetchGeofences();
  }, [refreshTrigger, fetchGeofences]);

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
      {geofences.length > 0 && (
        <div className="p-3 border-bottom d-flex justify-content-end">
          <CButton
            color="info"
            size="sm"
            onClick={handleExportAllGeoJSON}
            className="d-flex align-items-center gap-1"
          >
            <CIcon icon={cilCloudDownload} size="sm" />
            Export All as GeoJSON
          </CButton>
        </div>
      )}
      
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Preview</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Type</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Created</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {geofences.map((geofence) => (
            <CTableRow key={geofence.id}>
              <CTableDataCell>
                <div 
                  style={{
                    width: '100px',
                    height: '60px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#6c757d'
                  }}
                >
                  {geofence.type === 'radius' ? '🔵' : '📐'} Map
                </div>
              </CTableDataCell>
              <CTableDataCell>
                <strong>{geofence.name}</strong>
                <br />
                <small className="text-muted">
                  {formatCoordinates(geofence.latitude, geofence.longitude)}
                </small>
              </CTableDataCell>
              <CTableDataCell>
                <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {geofence.description}
                </div>
              </CTableDataCell>
              <CTableDataCell>
                <CBadge color={geofence.type === 'radius' ? 'primary' : 'info'} shape="rounded-pill">
                  {geofence.type === 'radius' ? `Circle (${geofence.radius}m)` : 'Polygon'}
                </CBadge>
              </CTableDataCell>
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
                    title="Edit geofence"
                  >
                    <CIcon icon={cilPencil} size="sm" />
                  </CButton>
                  <CButton
                    color="success"
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportGeoJSON(geofence)}
                    title="Export as GeoJSON"
                  >
                    <CIcon icon={cilCloudDownload} size="sm" />
                  </CButton>
                  <CButton
                    color="danger"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteGeofence(geofence.id)}
                    title="Delete geofence"
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
