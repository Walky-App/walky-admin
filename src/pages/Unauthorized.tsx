import { CButton, CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilShieldAlt, cilArrowLeft } from '@coreui/icons';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard className="p-4">
              <CCardBody className="text-center">
                <CIcon icon={cilShieldAlt} size="5xl" className="text-danger mb-4" />
                <h1 className="display-4 mb-3">Access Denied</h1>
                <p className="text-medium-emphasis mb-4">
                  You don't have permission to access this page. This area is restricted to authorized administrators only.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <CButton
                    color="primary"
                    onClick={() => navigate('/')}
                  >
                    <CIcon icon={cilArrowLeft} className="me-2" />
                    Go to Dashboard
                  </CButton>
                  <CButton
                    color="secondary"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Go Back
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Unauthorized;
