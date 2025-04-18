import { 
  CCard, 
  CCardBody, 
  CCardTitle, 
  CCardText, 
  CRow, 
  CCol, 
  CTabContent, 
  CTabPane, 
  CNav, 
  CNavItem, 
  CNavLink,
  CCardHeader,
  CBadge,
  CButton
} from '@coreui/react'
import { useState } from 'react'
import './App.css'

// Import example components
import ExampleAdminLayout from './components/ExampleAdminLayout'
import BasicForm from './components/examples/BasicForm'
import DataTable from './components/examples/DataTable'

function App() {
  const [activeKey, setActiveKey] = useState(1)

  return (
    <ExampleAdminLayout>
      <div className="mb-4 d-sm-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-0">Dashboard</h2>
          <p className="text-muted mb-0">Welcome to Walky Admin Panel</p>
        </div>
        <div className="mt-3 mt-sm-0">
          <CButton color="primary">
            <i className="fa fa-plus-circle me-1"></i> New Project
          </CButton>
        </div>
      </div>

      <CRow className="mb-4">
        <CCol sm={6} xl={3}>
          <CCard className="mb-4 mb-xl-0">
            <CCardBody className="p-4">
              <div className="d-flex align-items-center">
                <div className="me-3 text-white bg-primary p-3 rounded">
                  <i className="fa fa-users fa-2x"></i>
                </div>
                <div>
                  <div className="fs-5 fw-semibold">2,390</div>
                  <div className="text-uppercase fw-semibold small text-muted">Users</div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol sm={6} xl={3}>
          <CCard className="mb-4 mb-xl-0">
            <CCardBody className="p-4">
              <div className="d-flex align-items-center">
                <div className="me-3 text-white bg-info p-3 rounded">
                  <i className="fa fa-shopping-cart fa-2x"></i>
                </div>
                <div>
                  <div className="fs-5 fw-semibold">4,120</div>
                  <div className="text-uppercase fw-semibold small text-muted">Orders</div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol sm={6} xl={3}>
          <CCard className="mb-4 mb-xl-0">
            <CCardBody className="p-4">
              <div className="d-flex align-items-center">
                <div className="me-3 text-white bg-warning p-3 rounded">
                  <i className="fa fa-chart-bar fa-2x"></i>
                </div>
                <div>
                  <div className="fs-5 fw-semibold">$24,890</div>
                  <div className="text-uppercase fw-semibold small text-muted">Revenue</div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol sm={6} xl={3}>
          <CCard className="mb-4 mb-xl-0">
            <CCardBody className="p-4">
              <div className="d-flex align-items-center">
                <div className="me-3 text-white bg-success p-3 rounded">
                  <i className="fa fa-percent fa-2x"></i>
                </div>
                <div>
                  <div className="fs-5 fw-semibold">23%</div>
                  <div className="text-uppercase fw-semibold small text-muted">Conversion</div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Example Components</h5>
          <CBadge color="primary" shape="rounded-pill">CoreUI</CBadge>
        </CCardHeader>
        <CCardBody>
          <CCardText className="mb-3">
            Below are example components to help you get started with CoreUI. Switch between tabs to view different examples.
          </CCardText>
          
          <CNav variant="tabs" className="mt-2" role="tablist">
            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 1}
                component="button"
                role="tab"
                aria-controls="table-tab-pane"
                aria-selected={activeKey === 1}
                onClick={() => setActiveKey(1)}
              >
                <i className="fa fa-table me-2"></i>
                Data Table Example
              </CNavLink>
            </CNavItem>
            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 2}
                component="button"
                role="tab"
                aria-controls="form-tab-pane"
                aria-selected={activeKey === 2}
                onClick={() => setActiveKey(2)}
              >
                <i className="fa fa-edit me-2"></i>
                Form Example
              </CNavLink>
            </CNavItem>
          </CNav>
          
          <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="table-tab" visible={activeKey === 1}>
              <div className="pt-3">
                <DataTable />
              </div>
            </CTabPane>
            
            <CTabPane role="tabpanel" aria-labelledby="form-tab" visible={activeKey === 2}>
              <div className="pt-3">
                <BasicForm />
              </div>
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
      
      <CRow className="mt-4">
        <CCol>
          <CCard className="bg-light border-0">
            <CCardBody className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-info p-3 me-3 text-white rounded">
                  <i className="fa fa-info-circle fa-2x"></i>
                </div>
                <CCardTitle className="mb-0 h4">Quick Tips for Junior Developers</CCardTitle>
              </div>
              <CCardText>
                <ul className="text-start ps-0 list-unstyled">
                  <li className="mb-2 d-flex align-items-center">
                    <i className="fa fa-check-circle text-success me-2"></i> 
                    Check the README.md file for detailed instructions
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <i className="fa fa-check-circle text-success me-2"></i> 
                    Refer to <a href="https://coreui.io/react/docs/" target="_blank" rel="noopener noreferrer">CoreUI documentation</a> for components
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <i className="fa fa-check-circle text-success me-2"></i> 
                    Explore the example components in the codebase under src/components/examples
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <i className="fa fa-check-circle text-success me-2"></i> 
                    Use browser developer tools (F12) to inspect elements and debug issues
                  </li>
                </ul>
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </ExampleAdminLayout>
  )
}

export default App
