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
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CCol,
  CCard,
  CCardBody
} from '@coreui/react';
import { Campus, CampusFormData } from '../types/campus';

interface CampusFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CampusFormData) => void;
  campus?: Campus | null;
  loading?: boolean;
}

const CampusForm: React.FC<CampusFormProps> = ({
  visible,
  onClose,
  onSubmit,
  campus = null,
  loading = false
}) => {
  const [formData, setFormData] = useState<CampusFormData>({
    name: '',
    location: '',
    address: '',
    logo: '',
    status: 'active'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    if (campus) {
      setFormData({
        name: campus.name,
        location: campus.location,
        address: campus.address,
        logo: campus.logo || '',
        status: campus.status
      });
      setLogoPreview(campus.logo || '');
    } else {
      setFormData({
        name: '',
        location: '',
        address: '',
        logo: '',
        status: 'active'
      });
      setLogoPreview('');
    }
    setErrors({});
  }, [campus, visible]);

  const handleInputChange = (field: keyof CampusFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, logo: 'Please select a valid image file' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, logo: 'Image size must be less than 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFormData(prev => ({ ...prev, logo: base64 }));
      setLogoPreview(base64);
      setErrors(prev => ({ ...prev, logo: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campus name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
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

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logo: '' }));
    setLogoPreview('');
  };

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>
          {campus ? 'Edit Campus' : 'Add New Campus'}
        </CModalTitle>
      </CModalHeader>
      
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CRow>
            <CCol md={8}>
              <div className="mb-3">
                <CFormLabel htmlFor="name">Campus Name *</CFormLabel>
                <CFormInput
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  invalid={!!errors.name}
                  placeholder="Enter campus name"
                />
                {errors.name && (
                  <div className="invalid-feedback d-block">{errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="location">Location *</CFormLabel>
                <CFormInput
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  invalid={!!errors.location}
                  placeholder="e.g., Miami, FL"
                />
                {errors.location && (
                  <div className="invalid-feedback d-block">{errors.location}</div>
                )}
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="address">Address *</CFormLabel>
                <CFormTextarea
                  id="address"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  invalid={!!errors.address}
                  placeholder="Enter full campus address"
                />
                {errors.address && (
                  <div className="invalid-feedback d-block">{errors.address}</div>
                )}
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="status">Status</CFormLabel>
                <CFormSelect
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
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
                  invalid={!!errors.logo}
                />
                {errors.logo && (
                  <div className="invalid-feedback d-block">{errors.logo}</div>
                )}
                <div className="form-text">
                  Upload an image file (max 2MB). Supported formats: JPG, PNG, GIF, SVG
                </div>
              </div>
            </CCol>
          </CRow>
        </CModalBody>
        
        <CModalFooter>
          <CButton color="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </CButton>
          <CButton color="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : campus ? 'Update Campus' : 'Create Campus'}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default CampusForm;
