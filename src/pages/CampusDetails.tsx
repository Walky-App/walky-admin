import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CAlert,
  CFormText,
  CSpinner,
} from '@coreui/react';
import { useTheme } from '../hooks/useTheme';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilSave, cilX } from '@coreui/icons';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import ImageUpload from '../components/ImageUpload';

// Fake campus data (would be fetched from API in a real app)
const fakeCampuses = [
  {
    id: '1',
    name: 'University of California, Berkeley',
    location: 'Berkeley, CA',
    address: '110 Sproul Hall, Berkeley, CA 94720',
    students: 42501,
    status: 'active',
    createdAt: '2023-05-10',
    contact: {
      name: 'John Smith',
      email: 'jsmith@berkeley.edu',
      phone: '(510) 642-6000'
    },
    description: 'The University of California, Berkeley is a public land-grant research university in Berkeley, California.',
    website: 'https://www.berkeley.edu',
    timezone: 'America/Los_Angeles',
    logo: null,
    ambassadors: ['s1', 's3']
  },
  {
    id: '2',
    name: 'Stanford University',
    location: 'Stanford, CA',
    address: '450 Serra Mall, Stanford, CA 94305',
    students: 16937,
    status: 'active',
    createdAt: '2023-06-15',
    contact: {
      name: 'Jane Doe',
      email: 'jdoe@stanford.edu',
      phone: '(650) 723-2300'
    },
    description: 'Stanford University is a private research university in Stanford, California.',
    website: 'https://www.stanford.edu',
    timezone: 'America/Los_Angeles',
    logo: null,
    ambassadors: ['s2', 's4']
  },
  // Other campuses would be here
];

// Fake student data
const fakeStudents = [
  { id: 's1', name: 'Alex Johnson', email: 'ajohnson@berkeley.edu' },
  { id: 's2', name: 'Maria Garcia', email: 'mgarcia@stanford.edu' },
  { id: 's3', name: 'David Lee', email: 'dlee@berkeley.edu' },
  { id: 's4', name: 'Sophia Patel', email: 'spatel@stanford.edu' },
  { id: 's5', name: 'James Wilson', email: 'jwilson@berkeley.edu' },
  { id: 's6', name: 'Emma Chen', email: 'echen@stanford.edu' },
];

// Type definitions
interface CampusContact {
  name: string;
  email: string;
  phone: string;
}

interface Campus {
  id: string;
  name: string;
  location: string;
  address: string;
  students: number;
  status: 'active' | 'inactive' | 'pending' | string;
  createdAt: string;
  contact: CampusContact;
  description: string;
  website: string;
  timezone: string;
  logo: File | null;
  ambassadors: string[];
}

interface CampusDetailsProps {
  campusId?: string;
  inTabView?: boolean;
}

const CampusDetails = ({ campusId, inTabView = false }: CampusDetailsProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  // State for form data
  const [campus, setCampus] = useState<Campus | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [selectedAmbassadors, setSelectedAmbassadors] = useState<string[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  // Fetch campus data on mount
  useEffect(() => {
    // Determine the campusId to use - prefer prop, fallback to URL params
    const effectiveCampusId = campusId || id || new URLSearchParams(location.search).get('id') || '';
    
    // In a real app, this would be an API call
    const foundCampus = fakeCampuses.find(c => c.id === effectiveCampusId);
    
    if (foundCampus) {
      setCampus(foundCampus);
      setSelectedAmbassadors(foundCampus.ambassadors);
    } else {
      // If no campus is found, create a new one with default values
      setCampus({
        id: '',
        name: '',
        location: '',
        address: '',
        students: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        contact: {
          name: '',
          email: '',
          phone: ''
        },
        description: '',
        website: '',
        timezone: 'America/New_York',
        logo: null,
        ambassadors: []
      });
      setSelectedAmbassadors([]);
    }
    
    // Simulate loading students
    setLoadingStudents(true);
    setTimeout(() => {
      setLoadingStudents(false);
    }, 800);
  }, [campusId, id, location.search]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, field: string) => {
    if (!campus) return;
    
    setCampus({
      ...campus,
      [field]: e.target.value
    });
  };
  
  // Handle contact input changes
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!campus) return;
    
    setCampus({
      ...campus,
      contact: {
        ...campus.contact,
        [field]: e.target.value
      }
    });
  };
  
  // Handle logo change
  const handleLogoChange = (file: File | null) => {
    if (!campus) return;
    setCampus({
      ...campus,
      logo: file
    });
  };
  
  // Handle ambassadors change
  const handleAmbassadorsChange = (value: string[]) => {
    if (!campus) return;
    setSelectedAmbassadors(value);
    setCampus({
      ...campus,
      ambassadors: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campus) return;
    
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be saving to the backend
      console.log('Campus saved:', campus);
      
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save campus:', error);
      setSaveError('Failed to save campus. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/campuses');
  };
  
  // Convert students array to dropdown options
  const studentOptions = fakeStudents.map(student => ({
    value: student.id,
    label: student.name
  }));
  
  // For tab view, adjust padding
  const containerPadding = inTabView ? "0" : "p-4";
  
  // While loading
  if (!campus) {
    return (
      <div className={containerPadding}>
        <CCard style={{ 
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.borderColor
        }}>
          <CCardBody>
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3" style={{ color: theme.colors.bodyColor }}>Loading campus details...</p>
            </div>
          </CCardBody>
        </CCard>
      </div>
    );
  }
  
  return (
    <div className={containerPadding}>
      <CCard style={{ 
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor
      }}>
        <CCardHeader style={{ 
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.borderColor,
          color: theme.colors.bodyColor
        }}>
          <h4 className="mb-0">{campus.id ? 'Edit Campus' : 'New Campus'}</h4>
        </CCardHeader>
        <CCardBody>
          {saveSuccess && (
            <CAlert color="success" dismissible>
              Campus details saved successfully!
            </CAlert>
          )}
          
          {saveError && (
            <CAlert color="danger" dismissible>
              {saveError}
            </CAlert>
          )}
          
          <CForm onSubmit={handleSubmit}>
            <CRow>
              <CCol md={7}>
                <h5 className="mb-3" style={{ color: theme.colors.bodyColor }}>Basic Information</h5>
                
                <div className="mb-3">
                  <CFormLabel htmlFor="campusName" style={{ color: theme.colors.bodyColor }}>Campus Name*</CFormLabel>
                  <CFormInput
                    id="campusName"
                    value={campus.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                    required
                    style={{
                      backgroundColor: theme.isDark ? '#343a40' : undefined,
                      color: theme.isDark ? '#fff' : undefined,
                      borderColor: theme.colors.borderColor
                    }}
                  />
                </div>
                
                <div className="mb-3">
                  <CFormLabel htmlFor="campusLocation" style={{ color: theme.colors.bodyColor }}>Location*</CFormLabel>
                  <CFormInput
                    id="campusLocation"
                    value={campus.location}
                    onChange={(e) => handleInputChange(e, 'location')}
                    required
                    style={{
                      backgroundColor: theme.isDark ? '#343a40' : undefined,
                      color: theme.isDark ? '#fff' : undefined,
                      borderColor: theme.colors.borderColor
                    }}
                  />
                </div>
                
                <div className="mb-3">
                  <CFormLabel htmlFor="campusAddress" style={{ color: theme.colors.bodyColor }}>Full Address</CFormLabel>
                  <CFormInput
                    id="campusAddress"
                    value={campus.address}
                    onChange={(e) => handleInputChange(e, 'address')}
                    style={{
                      backgroundColor: theme.isDark ? '#343a40' : undefined,
                      color: theme.isDark ? '#fff' : undefined,
                      borderColor: theme.colors.borderColor
                    }}
                  />
                </div>    
                
                <div className="mb-3">
                  <CFormLabel htmlFor="campusWebsite" style={{ color: theme.colors.bodyColor }}>Website</CFormLabel>
                  <CFormInput
                    id="campusWebsite"
                    value={campus.website}
                    onChange={(e) => handleInputChange(e, 'website')}
                    style={{
                      backgroundColor: theme.isDark ? '#343a40' : undefined,
                      color: theme.isDark ? '#fff' : undefined,
                      borderColor: theme.colors.borderColor
                    }}
                  />
                </div>
                
                <h5 className="mb-3 mt-4" style={{ color: theme.colors.bodyColor }}>Contact Information</h5>
                
                <div className="mb-3">
                  <CFormLabel htmlFor="contactName" style={{ color: theme.colors.bodyColor }}>Contact Name</CFormLabel>
                  <CFormInput
                    id="contactName"
                    value={campus.contact.name}
                    onChange={(e) => handleContactChange(e, 'name')}
                    style={{
                      backgroundColor: theme.isDark ? '#343a40' : undefined,
                      color: theme.isDark ? '#fff' : undefined,
                      borderColor: theme.colors.borderColor
                    }}
                  />
                </div>
                
                <div className="mb-3">
                  <CFormLabel htmlFor="contactEmail" style={{ color: theme.colors.bodyColor }}>Contact Email</CFormLabel>
                  <CFormInput
                    id="contactEmail"
                    type="email"
                    value={campus.contact.email}
                    onChange={(e) => handleContactChange(e, 'email')}
                    style={{
                      backgroundColor: theme.isDark ? '#343a40' : undefined,
                      color: theme.isDark ? '#fff' : undefined,
                      borderColor: theme.colors.borderColor
                    }}
                  />
                </div>
                
                <div className="mb-3">
                  <CFormLabel htmlFor="contactPhone" style={{ color: theme.colors.bodyColor }}>Contact Phone</CFormLabel>
                  <CFormInput
                    id="contactPhone"
                    value={campus.contact.phone}
                    onChange={(e) => handleContactChange(e, 'phone')}
                    style={{
                      backgroundColor: theme.isDark ? '#343a40' : undefined,
                      color: theme.isDark ? '#fff' : undefined,
                      borderColor: theme.colors.borderColor
                    }}
                  />
                </div>
              </CCol>
              
              <CCol md={5}>
                <h5 className="mb-3" style={{ color: theme.colors.bodyColor }}>Campus Logo</h5>
                
                <div className="mb-4">
                  <ImageUpload
                    id="logo"
                    onChange={handleLogoChange}
                    value={campus.logo}
                    placeholder="Upload your campus logo (PNG, JPG, SVG)"
                    acceptedFormats="image/jpeg, image/png, image/svg+xml"
                    maxSizeMB={2}
                  />
                  <CFormText style={{ color: theme.colors.textMuted }}>
                    Recommended size: 200x200px, max 2MB
                  </CFormText>
                </div>
                
                <h5 className="mb-3" style={{ color: theme.colors.bodyColor }}>Student Ambassadors</h5>
                
                {loadingStudents ? (
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      <CSpinner size="sm" className="me-2" />
                      <span style={{ color: theme.colors.textMuted }}>Loading students...</span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <MultiSelectDropdown
                      id="ambassadors"
                      value={selectedAmbassadors}
                      onChange={handleAmbassadorsChange}
                      options={studentOptions}
                      placeholder="Select student ambassadors"
                      searchPlaceholder="Search students..."
                      helpText="These students will have special privileges"
                    />
                  </div>
                )}
                
                <h5 className="mb-3" style={{ color: theme.colors.bodyColor }}>Regional Settings</h5>
                
                <div className="mb-3">
                  <CFormLabel htmlFor="campusTimezone" style={{ color: theme.colors.bodyColor }}>Timezone</CFormLabel>
                  <CFormSelect
                    id="campusTimezone"
                    value={campus.timezone}
                    onChange={(e) => handleInputChange(e, 'timezone')}
                    style={{
                      backgroundColor: theme.isDark ? '#343a40' : undefined,
                      color: theme.isDark ? '#fff' : undefined,
                      borderColor: theme.colors.borderColor
                    }}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="America/Anchorage">Alaska Time (AKT)</option>
                    <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>
            
            <div className="d-flex justify-content-end mt-4">
              <CButton 
                type="button" 
                color="outline-secondary" 
                className="me-2"
                onClick={handleCancel}
              >
                <CIcon icon={cilX} className="me-1" />
                Cancel
              </CButton>
              <CButton 
                type="submit" 
                color="primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-1" />
                    Save Campus
                  </>
                )}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CampusDetails; 