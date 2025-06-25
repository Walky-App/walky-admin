import React, { useState, useEffect } from 'react';
import {
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CRow,
  CCol,
  CFormLabel,
  CSpinner,
  CAlert,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMap, cilPencil } from '@coreui/icons';
import { Geofence, GeofenceFormData } from '../types/geofence';
import GeofenceMapFree from './GeofenceMapFree';

interface GeofenceInlineFormProps {
  onSubmit: (data: GeofenceFormData) => void;
  geofence?: Geofence | null;
  loading?: boolean;
  campusId: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  radius?: string;
}

const GeofenceInlineForm: React.FC<GeofenceInlineFormProps> = ({ 
  onSubmit,
  geofence,
  loading = false,
  campusId
}) => {
  const [formData, setFormData] = useState<GeofenceFormData>({
    name: '',
    description: '',
    latitude: 25.7617,
    longitude: -80.1918,
    radius: 100,
    type: 'radius',
    status: 'active',
    campusId: campusId
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<'form' | 'map'>('form');

  useEffect(() => {
    if (geofence) {
      setFormData({
        name: geofence.name,
        description: geofence.description,
        latitude: geofence.latitude,
        longitude: geofence.longitude,
        radius: geofence.radius,
        polygon: geofence.polygon,
        type: geofence.type,
        status: geofence.status,
        campusId: geofence.campusId
      });
    } else {
      setFormData({
        name: '',
        description: '',
        latitude: 25.7617,
        longitude: -80.1918,
        radius: 100,
        type: 'radius',
        status: 'active',
        campusId: campusId
      });
    }
    setErrors({});
  }, [geofence, campusId]);

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

    if (formData.type === 'radius' && (!formData.radius || formData.radius <= 0 || formData.radius > 10000)) {
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

  const handleMapLocationChange = (lat: number, lng: number, radius?: number, polygon?: Array<{ lat: number; lng: number }>, type?: 'radius' | 'polygon') => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      radius: type === 'radius' ? (radius || prev.radius) : prev.radius,
      polygon: type === 'polygon' ? polygon : prev.polygon,
      type: type || prev.type
    }));
    
    setErrors(prev => ({
      ...prev,
      latitude: undefined,
      longitude: undefined,
      radius: undefined
    }));
  };

  return (
    <CForm onSubmit={handleSubmit}>
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink 
            active={activeTab === 'form'} 
            onClick={() => setActiveTab('form')}
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilPencil} className="me-2" />
            Form Entry
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink 
            active={activeTab === 'map'} 
            onClick={() => setActiveTab('map')}
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilMap} className="me-2" />
            Map Selection
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <CTabPane visible={activeTab === 'form'}>
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
            
            <CCol md={3}>
              <CFormLabel htmlFor="type">Type</CFormLabel>
              <CFormSelect
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as 'radius' | 'polygon')}
              >
                <option value="radius">Circle</option>
                <option value="polygon">Polygon</option>
              </CFormSelect>
            </CCol>
            
            <CCol md={3}>
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
                rows={2}
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

            {formData.type === 'radius' && (
              <CCol md={4}>
                <CFormLabel htmlFor="radius">Radius (m) *</CFormLabel>
                <CFormInput
                  id="radius"
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.radius || 100}
                  onChange={(e) => handleInputChange('radius', parseInt(e.target.value) || 0)}
                  invalid={!!errors.radius}
                  placeholder="100"
                />
                {errors.radius && (
                  <div className="invalid-feedback d-block">{errors.radius}</div>
                )}
              </CCol>
            )}
          </CRow>

          {formData.type === 'polygon' && (
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Polygon Info</CFormLabel>
                <div className="form-control-plaintext">
                  {formData.polygon && formData.polygon.length > 0 
                    ? `Polygon with ${formData.polygon.length} vertices`
                    : 'Use map selection to draw polygon or search for a location with boundaries'
                  }
                </div>
              </CCol>
            </CRow>
          )}
        </CTabPane>
        
        <CTabPane visible={activeTab === 'map'}>
          <CRow className="mb-3">
            <CCol>
              <CAlert color="info" className="mb-3">
                <strong>Instructions:</strong> 
                {formData.type === 'radius' 
                  ? 'Click on the map to set the geofence center. Adjust radius using the field above.'
                  : 'Search for locations with boundaries to auto-create polygons, or click on the map to manually draw polygon vertices.'
                }
              </CAlert>
              <GeofenceMapFree
                latitude={formData.latitude}
                longitude={formData.longitude}
                radius={formData.radius}
                polygon={formData.polygon}
                type={formData.type}
                onLocationChange={handleMapLocationChange}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormLabel>Selected Coordinates</CFormLabel>
              <div className="form-control-plaintext">
                <code>{formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</code>
                {formData.type === 'polygon' && formData.polygon && formData.polygon.length > 0 && (
                  <><br/><small className="text-muted">Polygon: {formData.polygon.length} vertices</small></>
                )}
              </div>
            </CCol>
          </CRow>
        </CTabPane>
      </CTabContent>
      
      <div className="d-flex justify-content-end gap-2 mt-3">
        <CButton color="primary" type="submit" disabled={loading}>
          {loading && <CSpinner size="sm" className="me-2" />}
          {geofence ? 'Update' : 'Create'} Geofence
        </CButton>
      </div>
    </CForm>
  );
};

export default GeofenceInlineForm;
