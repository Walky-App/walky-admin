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
  CAlert,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CCollapse,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilChevronTop, cilChevronBottom } from '@coreui/icons';
import { Campus, CampusFormData } from '../types/campus';
import { campusService } from '../services/campusService';
import GeofenceTable from '../components/GeofenceTable';


const Campuses: React.FC = () => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCampusId, setEditingCampusId] = useState<string | null>(null);
  const [expandedGeofences, setExpandedGeofences] = useState<string | null>(null);
  const [showGeofenceForm, setShowGeofenceForm] = useState<string | null>(null);
  
  const [campusFormData, setCampusFormData] = useState<CampusFormData>({
    name: '',
    location: '',
    address: '',
    logo: '',
    status: 'active'
  });
  const [campusFormErrors, setCampusFormErrors] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<string>('');

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

  const resetCampusForm = () => {
    setCampusFormData({
      name: '',
      location: '',
      address: '',
      logo: '',
      status: 'active'
    });
    setCampusFormErrors({});
    setLogoPreview('');
  };

  const validateCampusForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!campusFormData.name.trim()) {
      newErrors.name = 'Campus name is required';
    }

    if (!campusFormData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!campusFormData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setCampusFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCampusInputChange = (field: keyof CampusFormData, value: string) => {
    setCampusFormData(prev => ({ ...prev, [field]: value }));
    if (campusFormErrors[field]) {
      setCampusFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCampusFormErrors(prev => ({ ...prev, logo: 'Please select a valid image file' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setCampusFormErrors(prev => ({ ...prev, logo: 'Image size must be less than 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setCampusFormData(prev => ({ ...prev, logo: base64 }));
      setLogoPreview(base64);
      setCampusFormErrors(prev => ({ ...prev, logo: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCampusFormData(prev => ({ ...prev, logo: '' }));
    setLogoPreview('');
  };

  const handleAddCampus = () => {
    resetCampusForm();
    setShowAddForm(true);
  };

  const handleCancelAddCampus = () => {
    setShowAddForm(false);
    resetCampusForm();
  };

  const handleSubmitAddCampus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCampusForm()) return;

    try {
      setLoading(true);
      await campusService.create(campusFormData);
      setAlert({ type: 'success', message: 'Campus created successfully!' });
      setShowAddForm(false);
      resetCampusForm();
      await loadCampuses();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to create campus:', error);
      setAlert({ type: 'danger', message: 'Failed to create campus. Please try again.' });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCampus = (campus: Campus) => {
    setCampusFormData({
      name: campus.name,
      location: campus.location,
      address: campus.address,
      logo: campus.logo || '',
      status: campus.status
    });
    setLogoPreview(campus.logo || '');
    setCampusFormErrors({});
    setEditingCampusId(campus.id);
  };

  const handleCancelEditCampus = () => {
    setEditingCampusId(null);
    resetCampusForm();
  };

  const handleSubmitEditCampus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCampusForm() || !editingCampusId) return;

    try {
      setLoading(true);
      await campusService.update(editingCampusId, campusFormData);
      setAlert({ type: 'success', message: 'Campus updated successfully!' });
      setEditingCampusId(null);
      resetCampusForm();
      await loadCampuses();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to update campus:', error);
      setAlert({ type: 'danger', message: 'Failed to update campus. Please try again.' });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setLoading(false);
    }
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

  const handleToggleGeofences = (campusId: string) => {
    setExpandedGeofences(expandedGeofences === campusId ? null : campusId);
    setShowGeofenceForm(null);
  };

  const handleAddGeofence = (campusId: string) => {
    setShowGeofenceForm(campusId);
  };

  const handleCancelGeofence = () => {
    setShowGeofenceForm(null);
  };

  const renderCampusForm = (isEdit: boolean = false) => (
    <CForm onSubmit={isEdit ? handleSubmitEditCampus : handleSubmitAddCampus}>
      <CRow>
        <CCol md={8}>
          <div className="mb-3">
            <CFormLabel htmlFor="name">Campus Name *</CFormLabel>
            <CFormInput
              id="name"
              value={campusFormData.name}
              onChange={(e) => handleCampusInputChange('name', e.target.value)}
              invalid={!!campusFormErrors.name}
              placeholder="Enter campus name"
            />
            {campusFormErrors.name && (
              <div className="invalid-feedback d-block">{campusFormErrors.name}</div>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="location">Location *</CFormLabel>
            <CFormInput
              id="location"
              value={campusFormData.location}
              onChange={(e) => handleCampusInputChange('location', e.target.value)}
              invalid={!!campusFormErrors.location}
              placeholder="e.g., Miami, FL"
            />
            {campusFormErrors.location && (
              <div className="invalid-feedback d-block">{campusFormErrors.location}</div>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="address">Address *</CFormLabel>
            <CFormTextarea
              id="address"
              rows={3}
              value={campusFormData.address}
              onChange={(e) => handleCampusInputChange('address', e.target.value)}
              invalid={!!campusFormErrors.address}
              placeholder="Enter full campus address"
            />
            {campusFormErrors.address && (
              <div className="invalid-feedback d-block">{campusFormErrors.address}</div>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormSelect
              id="status"
              value={campusFormData.status}
              onChange={(e) => handleCampusInputChange('status', e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </CFormSelect>
          </div>
        </CCol>

        <CCol md={4}>
          <div className="mb-3">
            <CFormLabel htmlFor="logo">Campus Logo</CFormLabel>
            <CCard className="mb-3">
              <CCardBody className="text-center p-3">
                {logoPreview ? (
                  <div>
                    <img
                      src={logoPreview}
                      alt="Campus logo preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '120px',
                        objectFit: 'contain',
                        marginBottom: '10px'
                      }}
                    />
                    <div>
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveLogo}
                      >
                        Remove Logo
                      </CButton>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '20px', color: '#6c757d' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
                    <div>No logo uploaded</div>
                  </div>
                )}
              </CCardBody>
            </CCard>
            
            <CFormInput
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoUpload}
              invalid={!!campusFormErrors.logo}
            />
            {campusFormErrors.logo && (
              <div className="invalid-feedback d-block">{campusFormErrors.logo}</div>
            )}
            <div className="form-text">
              Upload an image file (max 2MB). Supported formats: JPG, PNG, GIF, SVG
            </div>
          </div>
        </CCol>
      </CRow>
      
      <div className="d-flex gap-2">
        <CButton color="primary" type="submit" disabled={loading}>
          {loading && <CSpinner size="sm" className="me-2" />}
          {isEdit ? 'Update Campus' : 'Create Campus'}
        </CButton>
        <CButton 
          color="secondary" 
          onClick={isEdit ? handleCancelEditCampus : handleCancelAddCampus} 
          disabled={loading}
        >
          Cancel
        </CButton>
      </div>
    </CForm>
  );

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Campus Management</strong>
            <CButton 
              color="primary" 
              size="sm" 
              onClick={handleAddCampus} 
              disabled={loading || showAddForm}
            >
              <CIcon icon={cilPlus} className="me-2" />
              Add Campus
            </CButton>
          </CCardHeader>
          <CCardBody>
            {alert && (
              <CAlert color={alert.type} className="mb-3">
                {alert.message}
              </CAlert>
            )}

            <CCollapse visible={showAddForm}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Add New Campus</strong>
                </CCardHeader>
                <CCardBody>
                  {renderCampusForm(false)}
                </CCardBody>
              </CCard>
            </CCollapse>
            
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
                  <React.Fragment key={campus.id}>
                    <CTableRow>
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
                        <CButton
                          color="info"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleGeofences(campus.id)}
                          className="p-0"
                        >
                          <CIcon 
                            icon={expandedGeofences === campus.id ? cilChevronTop : cilChevronBottom} 
                            className="me-1" 
                          />
                          <CBadge color="info">{campus.geofenceCount} geofences</CBadge>
                        </CButton>
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
                          disabled={loading || editingCampusId === campus.id}
                        >
                          <CIcon icon={cilPencil} size="sm" />
                        </CButton>
                        <CButton 
                          color="danger" 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCampus(campus.id)}
                          disabled={loading}
                        >
                          <CIcon icon={cilTrash} size="sm" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                    
                    {editingCampusId === campus.id && (
                      <CTableRow>
                        <CTableDataCell colSpan={6}>
                          <CCard>
                            <CCardHeader>
                              <strong>Edit Campus: {campus.name}</strong>
                            </CCardHeader>
                            <CCardBody>
                              {renderCampusForm(true)}
                            </CCardBody>
                          </CCard>
                        </CTableDataCell>
                      </CTableRow>
                    )}

                    {expandedGeofences === campus.id && (
                      <CTableRow>
                        <CTableDataCell colSpan={6}>
                          <CCard>
                            <CCardHeader className="d-flex justify-content-between align-items-center">
                              <strong>Geofences for {campus.name}</strong>
                              <CButton 
                                color="primary" 
                                size="sm" 
                                onClick={() => handleAddGeofence(campus.id)}
                                disabled={showGeofenceForm === campus.id}
                              >
                                <CIcon icon={cilPlus} className="me-2" />
                                Add Geofence
                              </CButton>
                            </CCardHeader>
                            <CCardBody>
                              {showGeofenceForm === campus.id && (
                                <div className="mb-4">
                                  <CCard>
                                    <CCardHeader>
                                      <h6 className="mb-0">Add New Geofence</h6>
                                    </CCardHeader>
                                    <CCardBody>
                                      <CForm>
                                        <CRow className="mb-3">
                                          <CCol md={6}>
                                            <CFormLabel htmlFor="geofence-name">Name *</CFormLabel>
                                            <CFormInput
                                              id="geofence-name"
                                              placeholder="Enter geofence name"
                                            />
                                          </CCol>
                                          <CCol md={3}>
                                            <CFormLabel htmlFor="geofence-type">Type</CFormLabel>
                                            <CFormSelect id="geofence-type">
                                              <option value="radius">Circle</option>
                                              <option value="polygon">Area</option>
                                            </CFormSelect>
                                          </CCol>
                                          <CCol md={3}>
                                            <CFormLabel htmlFor="geofence-status">Status</CFormLabel>
                                            <CFormSelect id="geofence-status">
                                              <option value="active">Active</option>
                                              <option value="inactive">Inactive</option>
                                            </CFormSelect>
                                          </CCol>
                                        </CRow>
                                        
                                        <div className="mb-3">
                                          <CFormLabel htmlFor="geofence-description">Description</CFormLabel>
                                          <CFormTextarea
                                            id="geofence-description"
                                            rows={2}
                                            placeholder="Enter geofence description"
                                          />
                                        </div>

                                        <CRow className="mb-3">
                                          <CCol md={4}>
                                            <CFormLabel htmlFor="geofence-lat">Latitude *</CFormLabel>
                                            <CFormInput
                                              id="geofence-lat"
                                              type="number"
                                              step="any"
                                              placeholder="25.7617"
                                            />
                                          </CCol>
                                          <CCol md={4}>
                                            <CFormLabel htmlFor="geofence-lng">Longitude *</CFormLabel>
                                            <CFormInput
                                              id="geofence-lng"
                                              type="number"
                                              step="any"
                                              placeholder="-80.1918"
                                            />
                                          </CCol>
                                          <CCol md={4}>
                                            <CFormLabel htmlFor="geofence-radius">Radius (meters)</CFormLabel>
                                            <CFormInput
                                              id="geofence-radius"
                                              type="number"
                                              min="1"
                                              max="10000"
                                              placeholder="100"
                                            />
                                          </CCol>
                                        </CRow>

                                        <CAlert color="info" className="mb-3">
                                          <strong>Map Integration:</strong> Interactive map with location search and area selection would be integrated here for visual geofence creation.
                                        </CAlert>

                                        <div className="d-flex gap-2">
                                          <CButton color="primary" size="sm">
                                            Create Geofence
                                          </CButton>
                                          <CButton 
                                            color="secondary" 
                                            size="sm"
                                            onClick={handleCancelGeofence}
                                          >
                                            Cancel
                                          </CButton>
                                        </div>
                                      </CForm>
                                    </CCardBody>
                                  </CCard>
                                </div>
                              )}
                              <GeofenceTable
                                campusId={campus.id}
                                onEdit={() => {}}
                                onDelete={() => loadCampuses()}
                                refreshTrigger={0}
                              />
                            </CCardBody>
                          </CCard>
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </React.Fragment>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Campuses;
