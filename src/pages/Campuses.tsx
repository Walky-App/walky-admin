import React, { useState } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CInputGroup,
  CFormInput,
  CFormSelect,
} from '@coreui/react';
import { useTheme } from '../hooks/useTheme';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilFilter, cilPlus } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

interface Campus {
  id: string;
  name: string;
  location: string;
  students: number;
  status: 'active' | 'inactive' | 'pending' | string;
  createdAt: string;
}

// Fake campus data
const fakeCampuses: Campus[] = [
  {
    id: '1',
    name: 'University of California, Berkeley',
    location: 'Berkeley, CA',
    students: 42501,
    status: 'active',
    createdAt: '2023-05-10',
  },
  {
    id: '2',
    name: 'Stanford University',
    location: 'Stanford, CA',
    students: 16937,
    status: 'active',
    createdAt: '2023-06-15',
  },
  {
    id: '3',
    name: 'Massachusetts Institute of Technology',
    location: 'Cambridge, MA',
    students: 11520,
    status: 'active',
    createdAt: '2023-07-22',
  },
  {
    id: '4',
    name: 'Harvard University',
    location: 'Cambridge, MA',
    students: 20970,
    status: 'active',
    createdAt: '2023-08-05',
  },
  {
    id: '5',
    name: 'Yale University',
    location: 'New Haven, CT',
    students: 12060,
    status: 'inactive',
    createdAt: '2023-09-12',
  },
  {
    id: '6',
    name: 'Princeton University',
    location: 'Princeton, NJ',
    students: 8374,
    status: 'pending',
    createdAt: '2023-10-30',
  },
  {
    id: '7',
    name: 'Columbia University',
    location: 'New York, NY',
    students: 31455,
    status: 'active',
    createdAt: '2023-11-18',
  },
];

const Campuses = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter campuses based on search term and status filter
  const filteredCampuses = fakeCampuses.filter(campus => {
    const matchesSearch = campus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campus.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campus.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <CBadge color="success">Active</CBadge>;
      case 'inactive':
        return <CBadge color="secondary">Inactive</CBadge>;
      case 'pending':
        return <CBadge color="warning">Pending</CBadge>;
      default:
        return <CBadge color="info">{status}</CBadge>;
    }
  };
  
  // Handle add new campus
  const handleAddCampus = () => {
    // Navigate to campus view to create a new campus
    navigate('/campus-view');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="p-4">
      <CCard style={{ 
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.borderColor
      }}>
        <CCardHeader style={{ 
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.borderColor,
          color: theme.colors.bodyColor
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Campuses</h4>
            <CButton 
              color="primary" 
              className="d-flex align-items-center"
              onClick={handleAddCampus}
            >
              <CIcon icon={cilPlus} className="me-1" />
              Add Campus
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {/* Filters and search */}
          <div className="d-flex mb-4">
            <CInputGroup className="me-2" style={{ maxWidth: '300px' }}>
              <CFormInput
                placeholder="Search campuses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: theme.isDark ? '#343a40' : undefined,
                  color: theme.isDark ? '#fff' : undefined,
                  borderColor: theme.colors.borderColor
                }}
              />
              <CButton 
                color="outline-secondary" 
                type="button" 
                variant="outline"
              >
                <CIcon icon={cilSearch} />
              </CButton>
            </CInputGroup>
            
            <CFormSelect
              className="ms-2 me-2"
              style={{ 
                maxWidth: '150px',
                backgroundColor: theme.isDark ? '#343a40' : undefined,
                color: theme.isDark ? '#fff' : undefined,
                borderColor: theme.colors.borderColor
              }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </CFormSelect>
            
            <CButton 
              color="outline-primary" 
              className="d-flex align-items-center"
            >
              <CIcon icon={cilFilter} className="me-1" />
              More Filters
            </CButton>
          </div>
          
          {/* Campus table */}
          <CTable bordered hover responsive style={{ 
            color: theme.colors.bodyColor,
            borderColor: theme.colors.borderColor
          }}>
            <CTableHead style={{ backgroundColor: theme.isDark ? '#343a40' : '#f8f9fa' }}>
              <CTableRow>
                <CTableHeaderCell scope="col" style={{ borderColor: theme.colors.borderColor }}>Campus Name</CTableHeaderCell>
                <CTableHeaderCell scope="col" style={{ borderColor: theme.colors.borderColor }}>Location</CTableHeaderCell>
                <CTableHeaderCell scope="col" style={{ borderColor: theme.colors.borderColor }}>Students</CTableHeaderCell>
                <CTableHeaderCell scope="col" style={{ borderColor: theme.colors.borderColor }}>Status</CTableHeaderCell>
                <CTableHeaderCell scope="col" style={{ borderColor: theme.colors.borderColor }}>Created</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredCampuses.map((campus) => (
                <CTableRow key={campus.id} style={{ 
                  backgroundColor: theme.colors.cardBg
                }}>
                  <CTableDataCell style={{ borderColor: theme.colors.borderColor }}>
                    <div 
                      className="fw-semibold" 
                      style={{ 
                        color: theme.colors.primary, 
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                      onClick={() => navigate(`/campus-view/${campus.id}`)}
                    >
                      {campus.name}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell style={{ borderColor: theme.colors.borderColor }}>{campus.location}</CTableDataCell>
                  <CTableDataCell style={{ borderColor: theme.colors.borderColor }}>{formatNumber(campus.students)}</CTableDataCell>
                  <CTableDataCell style={{ borderColor: theme.colors.borderColor }}>{getStatusBadge(campus.status)}</CTableDataCell>
                  <CTableDataCell style={{ borderColor: theme.colors.borderColor }}>{formatDate(campus.createdAt)}</CTableDataCell>
                </CTableRow>
              ))}
              
              {filteredCampuses.length === 0 && (
                <CTableRow style={{ backgroundColor: theme.colors.cardBg }}>
                  <CTableDataCell 
                    colSpan={5} 
                    className="text-center py-4"
                    style={{ borderColor: theme.colors.borderColor }}
                  >
                    No campuses found matching your criteria
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Campuses; 