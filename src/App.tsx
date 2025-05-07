import CIcon from '@coreui/icons-react'
import { cilArrowTop, cilOptions } from '@coreui/icons'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'

import { 
  CCard, 
  CCardBody, 
  CCardTitle, 
  CCardText, 
  CRow, //C
  CCol, //C
  CTabContent, 
  CTabPane, 
  CNav, 
  CNavItem, 
  CNavLink,
  CCardHeader,
  CBadge,
  CButton,
  CDropdownItem, //C
  CDropdown, //C
  CDropdownMenu, //C
  CDropdownToggle, //C
  CWidgetStatsA //C
} from '@coreui/react' //C
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

    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4 px-0 py-0"
          color="primary"
          value={
            <>
              46{' '}
              <span className="fs-6 fw-normal">
                (0% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title={
            <div className="text-start ps-0">
              <span className="text-white">Walks</span>
            </div>
          }     
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-white" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: '#5856d6',
                    data: [65, 59, 84, 84, 51, 55, 40],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4 px-0 py-0"
          color="info"
          value={
            <>
              281{' '}
              <span className="fs-6 fw-normal">
                (0% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title={
            <div className="text-start ps-0">
              <span className="text-white">Surprise</span>
            </div>
          }     
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-white" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: '#39f',
                    data: [1, 18, 9, 17, 34, 22, 11],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6}lg={3}>
        <CWidgetStatsA
          className="mb-4 px-0 py-0"
          color="warning"
          value={
            <>
              187{' '}
              <span className="fs-6 fw-normal">
                (0% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title={
            <div className="text-start ps-0">
              <span className="text-white">Walks</span>
            </div>
          } 
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-white" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4 px-0 py-0"
          color="danger"
          value={
            <>
              192{' '}
              <span className="fs-6 fw-normal">
                (0% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title={
            <div className="text-start ps-0">
              <span className="text-white">Surprise</span>
            </div>
          }          
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-white" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                  'January',
                  'February',
                  'March',
                  'April',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
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
