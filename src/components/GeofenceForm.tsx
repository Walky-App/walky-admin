import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CRow,
  CCol,
  CFormLabel,
  CSpinner,
  CAlert
} from '@coreui/react';
import { Geofence, GeofenceFormData } from '../types/geofence';

interface GeofenceFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: GeofenceFormData) => void;
  geofence?: Geofence | null;
  loading?: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  radius?: string;
}

const GeofenceForm: React.FC<GeofenceFormProps> = ({ 
  visible, 
  onClose, 
  onSubmit, 
  geofence, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<GeofenceFormData>({
    name: '',
    description: '',
    latitude: 0,
    longitude: 0,
    radius: 100,
    status: 'active'
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (geofence) {
      setFormData({
        name: geofence.name,
        description: geofence.description,
        latitude: geofence.latitude,
        longitude: geofence.longitude,
        radius: geofence.radius,
        status: geofence.status
      });
    } else {
      setFormData({
        name: '',
        description: '',
        latitude: 0,
        longitude: 0,
        radius: 100,
        status: 'active'
      });
    }
    setErrors({});
  }, [geofence, visible]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    if (formData.radius <= 0 || formData.radius > 10000) {
      newErrors.radius = 'Radius must be between 1 and 10000 meters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof GeofenceFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>
          {geofence ? 'Edit Geofence' : 'Create New Geofence'}
        </CModalTitle>
      </CModalHeader>
      
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="name">Name *</CFormLabel>
              <CFormInput
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                invalid={!!errors.name}
                placeholder="Enter geofence name"
              />
              {errors.name && (
                <div className="invalid-feedback d-block">{errors.name}</div>
              )}
            </CCol>
            
            <CCol md={6}>
              <CFormLabel htmlFor="status">Status</CFormLabel>
              <CFormSelect
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive')}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <CFormLabel htmlFor="description">Description *</CFormLabel>
              <CFormTextarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                invalid={!!errors.description}
                placeholder="Enter geofence description"
              />
              {errors.description && (
                <div className="invalid-feedback d-block">{errors.description}</div>
              )}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={4}>
              <CFormLabel htmlFor="latitude">Latitude *</CFormLabel>
              <CFormInput
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value) || 0)}
                invalid={!!errors.latitude}
                placeholder="25.7617"
              />
              {errors.latitude && (
                <div className="invalid-feedback d-block">{errors.latitude}</div>
              )}
            </CCol>
            
            <CCol md={4}>
              <CFormLabel htmlFor="longitude">Longitude *</CFormLabel>
              <CFormInput
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value) || 0)}
                invalid={!!errors.longitude}
                placeholder="-80.1918"
              />
              {errors.longitude && (
                <div className="invalid-feedback d-block">{errors.longitude}</div>
              )}
            </CCol>
            
            <CCol md={4}>
              <CFormLabel htmlFor="radius">Radius (meters) *</CFormLabel>
              <CFormInput
                id="radius"
                type="number"
                min="1"
                max="10000"
                value={formData.radius}
                onChange={(e) => handleInputChange('radius', parseInt(e.target.value) || 0)}
                invalid={!!errors.radius}
                placeholder="100"
              />
              {errors.radius && (
                <div className="invalid-feedback d-block">{errors.radius}</div>
              )}
            </CCol>
          </CRow>

          <CAlert color="info" className="mb-0">
            <strong>Tip:</strong> Use decimal degrees for coordinates. For example, FIU main campus is approximately at 25.7617, -80.1918.
          </CAlert>
        </CModalBody>
        
        <CModalFooter>
          <CButton color="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </CButton>
          <CButton color="primary" type="submit" disabled={loading}>
            {loading && <CSpinner size="sm" className="me-2" />}
            {geofence ? 'Update' : 'Create'} Geofence
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default GeofenceForm;
