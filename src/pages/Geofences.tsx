import React, { useState, useEffect } from 'react';
import { CRow, CCol, CButton, CCard, CCardBody, CCardHeader } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLocationPin, cilPlus, cilCheckCircle, cilXCircle } from '@coreui/icons';
import InfoStatWidget from '../components/InfoStatWidget';
import GeofenceTable from '../components/GeofenceTable';
import GeofenceForm from '../components/GeofenceForm';
import { geofenceService } from '../services/geofenceService';
import { Geofence, GeofenceFormData } from '../types/geofence';

const Geofences: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState<Geofence | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    avgRadius: 0
  });

  useEffect(() => {
    fetchGeofences();
  }, []);

  const fetchGeofences = async () => {
    try {
      const data = await geofenceService.getAll();
      
      const total = data.length;
      const active = data.filter(g => g.status === 'active').length;
      const inactive = data.filter(g => g.status === 'inactive').length;
      const avgRadius = total > 0 ? Math.round(data.reduce((sum, g) => sum + g.radius, 0) / total) : 0;
      
      setStats({ total, active, inactive, avgRadius });
    } catch (error) {
      console.error('Failed to fetch geofences:', error);
    }
  };

  const handleCreateGeofence = () => {
    setEditingGeofence(null);
    setShowForm(true);
  };

  const handleEditGeofence = (geofence: Geofence) => {
    setEditingGeofence(geofence);
    setShowForm(true);
  };

  const handleDeleteGeofence = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this geofence?')) {
      try {
        setLoading(true);
        await geofenceService.delete(id);
        setRefreshTrigger(prev => prev + 1);
        fetchGeofences();
      } catch (error) {
        console.error('Failed to delete geofence:', error);
        alert('Failed to delete geofence. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFormSubmit = async (data: GeofenceFormData) => {
    try {
      setLoading(true);
      
      if (editingGeofence) {
        await geofenceService.update(editingGeofence.id, data);
      } else {
        await geofenceService.create(data);
      }
      
      setShowForm(false);
      setEditingGeofence(null);
      setRefreshTrigger(prev => prev + 1);
      fetchGeofences();
    } catch (error) {
      console.error('Failed to save geofence:', error);
      alert('Failed to save geofence. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingGeofence(null);
  };

  const widgets = [
    { 
      icon: cilLocationPin, 
      value: stats.total, 
      label: 'Total Geofences', 
      tooltip: 'Total number of geofences created' 
    },
    { 
      icon: cilCheckCircle, 
      value: stats.active, 
      label: 'Active Geofences', 
      tooltip: 'Number of currently active geofences' 
    },
    { 
      icon: cilXCircle, 
      value: stats.inactive, 
      label: 'Inactive Geofences', 
      tooltip: 'Number of inactive geofences' 
    },
    { 
      icon: cilLocationPin, 
      value: `${stats.avgRadius}m`, 
      label: 'Average Radius', 
      tooltip: 'Average radius of all geofences in meters' 
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Geofence Management</h2>
        <CButton color="primary" onClick={handleCreateGeofence}>
          <CIcon icon={cilPlus} className="me-2" />
          Create Geofence
        </CButton>
      </div>

      <CRow className="mb-4">
        {widgets.map((widget, idx) => (
          <CCol xs={12} sm={6} md={3} className="mb-3" key={idx}>
            <InfoStatWidget {...widget} />
          </CCol>
        ))}
      </CRow>

      <CCard>
        <CCardHeader>
          <h5 className="mb-0">Geofences</h5>
        </CCardHeader>
        <CCardBody className="p-0">
          <GeofenceTable
            onEdit={handleEditGeofence}
            onDelete={handleDeleteGeofence}
            refreshTrigger={refreshTrigger}
          />
        </CCardBody>
      </CCard>

      <GeofenceForm
        visible={showForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        geofence={editingGeofence}
        loading={loading}
      />
    </div>
  );
};

export default Geofences;
