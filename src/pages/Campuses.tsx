import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CAlert
} from '@coreui/react';
import CampusGeofenceModal from '../components/CampusGeofenceModal';
import CampusForm from '../components/CampusForm';
import { Campus, CampusFormData } from '../types/campus';
import { campusService } from '../services/campusService';

const Campuses: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState<{ id: string; name: string } | null>(null);
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);
  const [showCampusForm, setShowCampusForm] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  useEffect(() => {
    loadCampuses();
  }, []);

  const loadCampuses = async () => {
    try {
      setLoading(true);
      const data = await campusService.getAll();
      setCampuses(data);
    } catch (error) {
      console.error('Failed to load campuses:', error);
      setAlert({ type: 'danger', message: 'Failed to load campuses. Please try again.' });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleManageGeofences = (campus: { id: string; name: string }) => {
    setSelectedCampus(campus);
    setShowGeofenceModal(true);
  };

  const handleCloseGeofenceModal = () => {
    setShowGeofenceModal(false);
    setSelectedCampus(null);
  };

  const handleAddCampus = () => {
    setEditingCampus(null);
    setShowCampusForm(true);
  };

  const handleEditCampus = (campus: Campus) => {
    setEditingCampus(campus);
    setShowCampusForm(true);
  };

  const handleDeleteCampus = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this campus? This will also delete all associated geofences.')) {
      return;
    }

    try {
      setLoading(true);
      await campusService.delete(id);
      await loadCampuses();
      setAlert({ type: 'success', message: 'Campus deleted successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to delete campus:', error);
      setAlert({ type: 'danger', message: 'Failed to delete campus. Please try again.' });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCampusFormSubmit = async (data: CampusFormData) => {
    try {
      setLoading(true);
      if (editingCampus) {
        await campusService.update(editingCampus.id, data);
        setAlert({ type: 'success', message: 'Campus updated successfully!' });
      } else {
        await campusService.create(data);
        setAlert({ type: 'success', message: 'Campus created successfully!' });
      }
      setShowCampusForm(false);
      setEditingCampus(null);
      await loadCampuses();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to save campus:', error);
      setAlert({ 
        type: 'danger', 
        message: `Failed to ${editingCampus ? 'update' : 'create'} campus. Please try again.` 
      });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCampusForm = () => {
    setShowCampusForm(false);
    setEditingCampus(null);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Campus Management</strong>
            <CButton color="primary" size="sm" onClick={handleAddCampus} disabled={loading}>
              Add Campus
            </CButton>
          </CCardHeader>
          <CCardBody>
            {alert && (
              <CAlert color={alert.type} className="mb-3">
                {alert.message}
              </CAlert>
            )}
            
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Campus</CTableHeaderCell>
                  <CTableHeaderCell>Location</CTableHeaderCell>
                  <CTableHeaderCell>Address</CTableHeaderCell>
                  <CTableHeaderCell>Geofences</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {campuses.map((campus) => (
                  <CTableRow key={campus.id}>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        {campus.logo ? (
                          <img 
                            src={campus.logo} 
                            alt={`${campus.name} logo`} 
                            style={{
                              width: '40px', 
                              height: '40px', 
                              objectFit: 'contain',
                              marginRight: '12px',
                              borderRadius: '4px'
                            }} 
                          />
                        ) : (
                          <div 
                            style={{
                              width: '40px', 
                              height: '40px', 
                              backgroundColor: '#f8f9fa', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              marginRight: '12px',
                              borderRadius: '4px',
                              fontSize: '20px'
                            }}
                          >
                            📷
                          </div>
                        )}
                        <strong>{campus.name}</strong>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>{campus.location}</CTableDataCell>
                    <CTableDataCell>{campus.address}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info">{campus.geofenceCount} geofences</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={campus.status === 'active' ? 'success' : 'secondary'}>
                        {campus.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton 
                        color="primary" 
                        variant="outline" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEditCampus(campus)}
                        disabled={loading}
                      >
                        Edit
                      </CButton>
                      <CButton 
                        color="info" 
                        variant="outline" 
                        size="sm"
                        className="me-2"
                        onClick={() => handleManageGeofences({ id: campus.id, name: campus.name })}
                        disabled={loading}
                      >
                        Manage Geofences
                      </CButton>
                      <CButton 
                        color="danger" 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteCampus(campus.id)}
                        disabled={loading}
                      >
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      
      {selectedCampus && (
        <CampusGeofenceModal
          visible={showGeofenceModal}
          onClose={handleCloseGeofenceModal}
          campusId={selectedCampus.id}
          campusName={selectedCampus.name}
        />
      )}

      <CampusForm
        visible={showCampusForm}
        onClose={handleCloseCampusForm}
        onSubmit={handleCampusFormSubmit}
        campus={editingCampus}
        loading={loading}
      />
    </CRow>
  );
};

export default Campuses;
