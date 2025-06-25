import React from 'react';
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
  CBadge
} from '@coreui/react';

const Campuses: React.FC = () => {
  const campuses = [
    {
      id: '1',
      name: 'FIU Main Campus',
      location: 'Miami, FL',
      address: '11200 SW 8th St, Miami, FL 33199',
      status: 'active',
      geofenceCount: 3
    },
    {
      id: '2',
      name: 'FIU Biscayne Bay Campus',
      location: 'North Miami, FL',
      address: '3000 NE 151st St, North Miami, FL 33181',
      status: 'active',
      geofenceCount: 2
    }
  ];

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Campus Management</strong>
            <CButton color="primary" size="sm">
              Add Campus
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
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
                      <strong>{campus.name}</strong>
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
                      <CButton color="primary" variant="outline" size="sm" className="me-2">
                        Edit
                      </CButton>
                      <CButton color="info" variant="outline" size="sm">
                        Manage Geofences
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
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
