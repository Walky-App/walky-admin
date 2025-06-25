import React, { useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';

import { Geofence, GeofenceFormData } from '../types/geofence';
import { geofenceService } from '../services/geofenceService';
import GeofenceTable from './GeofenceTable';
import GeofenceForm from './GeofenceForm';

interface CampusGeofenceModalProps {
  visible: boolean;
  onClose: () => void;
  campusId: string;
  campusName: string;
}

const CampusGeofenceModal: React.FC<CampusGeofenceModalProps> = ({
  visible,
  onClose,
  campusId,
  campusName
}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedGeofence, setSelectedGeofence] = useState<Geofence | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  const handleCreateGeofence = () => {
    setSelectedGeofence(null);
    setShowForm(true);
  };

  const handleEditGeofence = (geofence: Geofence) => {
    setSelectedGeofence(geofence);
    setShowForm(true);
  };

  const handleDeleteGeofence = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this geofence?')) {
      return;
    }

    try {
      setLoading(true);
      await geofenceService.delete(id);
      setRefreshTrigger(prev => prev + 1);
      setAlert({ type: 'success', message: 'Geofence deleted successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to delete geofence:', error);
      setAlert({ type: 'danger', message: 'Failed to delete geofence. Please try again.' });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: GeofenceFormData) => {
    try {
      setLoading(true);
      if (selectedGeofence) {
        await geofenceService.update(selectedGeofence.id, data);
        setAlert({ type: 'success', message: 'Geofence updated successfully!' });
      } else {
        await geofenceService.createForCampus(campusId, data);
        setAlert({ type: 'success', message: 'Geofence created successfully!' });
      }
      setShowForm(false);
      setSelectedGeofence(null);
      setRefreshTrigger(prev => prev + 1);
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to save geofence:', error);
      setAlert({ 
        type: 'danger', 
        message: `Failed to ${selectedGeofence ? 'update' : 'create'} geofence. Please try again.` 
      });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedGeofence(null);
  };

  return (
    <>
      <CModal visible={visible} onClose={onClose} size="xl">
        <CModalHeader>
          <CModalTitle>
            Geofences - {campusName}
          </CModalTitle>
        </CModalHeader>
        
        <CModalBody>
          {alert && (
            <CAlert color={alert.type} className="mb-3">
              {alert.message}
            </CAlert>
          )}
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Manage geofences for this campus</h6>
            <CButton 
              color="primary" 
              size="sm" 
              onClick={handleCreateGeofence}
              disabled={loading}
            >
              <CIcon icon={cilPlus} className="me-2" />
              Add Geofence
            </CButton>
          </div>

          <GeofenceTable
            onEdit={handleEditGeofence}
            onDelete={handleDeleteGeofence}
            refreshTrigger={refreshTrigger}
            campusId={campusId}
          />
        </CModalBody>
        
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <GeofenceForm
        visible={showForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        geofence={selectedGeofence}
        loading={loading}
        campusId={campusId}
      />
    </>
  );
};

export default CampusGeofenceModal;
