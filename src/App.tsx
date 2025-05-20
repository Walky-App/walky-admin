import CIcon from '@coreui/icons-react'
import { cilArrowTop, cilOptions } from '@coreui/icons'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { CButton, CButtonGroup } from "@coreui/react"
import { cilCloudDownload } from "@coreui/icons"
import { useTheme } from './hooks/useTheme'
import { Routes, Route } from 'react-router-dom';
import Students from './pages/Students';
import Engagement from './pages/Engagement'; 
import Review from './pages/Review';
import Mywalky from './pages/Mywalky';
import Compliance from './pages/Compliance';
import Settings from './pages/Settings';
import { AppTheme } from './theme';

import { 
  CCard, 
  CCardBody, 
  CRow, //C
  CCol, //C
  CCardHeader,
  CDropdownItem, //C
  CDropdown, //C
  CDropdownMenu, //C
  CDropdownToggle, //C
  CWidgetStatsA //C
} from '@coreui/react' //C
import './App.css'

// Import example components
import ExampleAdminLayout from './components/ExampleAdminLayout.tsx'
import MainChart from "./components/MainChart.tsx";


type DashboardProps = {
  theme: AppTheme;
  chartOptions: object;
  barChartOptions: object;
};

const Dashboard = ({theme, chartOptions, barChartOptions} : DashboardProps) => {
  return (
    <>
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
                    borderColor: theme.colors.chartLine,
                    pointBackgroundColor: theme.colors.primary,
                    data: [65, 59, 84, 84, 51, 55, 40],
                  },
                ],
              }}
              options={chartOptions}
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
              <span className="text-white">Events</span>
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
                    borderColor: theme.colors.chartLine,
                    pointBackgroundColor: theme.colors.info,
                    data: [1, 18, 9, 17, 34, 22, 11],
                  },
                ],
              }}
              options={chartOptions}
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
              <span className="text-white">Ideas</span>
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
                    backgroundColor: `${theme.colors.warning}33`,
                    borderColor: theme.colors.chartLine,
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true,
                  },
                ],
              }}
              options={chartOptions}
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
                    backgroundColor: theme.colors.danger,
                    borderColor: theme.colors.chartLine,
                    data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={barChartOptions}
            />
          }
        />
      </CCol>
    </CRow>
    <CCard className="mb-4"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <CCardHeader className="d-flex justify-content-between align-items-center border-0 py-0 px-3">
          <div>
            <h5
              className="mb-1"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: '24px',
              }}
            >
              Active Users
            </h5>
            <div
              style={{ 
                fontFamily: "Inter, sans-serif",
                fontSize: '12px',
                marginLeft: '-30px',
                color: theme.colors.secondary,
               }}
            >
              January - July 2025
            </div>
          </div>
          <div className="d-flex align-items-center">
            <CButtonGroup role="group">
              <CButton color="outline-secondary" size="sm">
                Day
              </CButton>
              <CButton color="dark" size="sm">
                Week
              </CButton>
              <CButton color="outline-secondary" size="sm">
                Month
              </CButton>
            </CButtonGroup>
            <CButton color="primary" size="sm" className="ms-2">
              <CIcon icon={cilCloudDownload} />
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody className="p-0">
          <MainChart />
        </CCardBody>
      </CCard>
    </>
  )
}

function App() {
  const { theme } = useTheme()

  

  // Chart color customization based on theme
  const chartOptions = {
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
          color: theme.colors.chartLine,
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
          color: theme.colors.chartLine,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4,
        borderColor: theme.colors.chartLine,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
        backgroundColor: theme.colors.chartPoint,
      },
    },
  }

  // Additional options for bar charts
  const barChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      x: {
        grid: {
          display: false,
          drawTicks: false,
        },
        ticks: {
          display: false,
          color: theme.colors.chartLine,
        },
      },
      y: {
        grid: {
          display: false,
          drawTicks: false,
        },
        ticks: {
          display: false,
          color: theme.colors.chartLine,
        },
      },
    },
  }

  return (
    <ExampleAdminLayout>
      {}
      <Routes>
        <Route
          path="/"
          element={<Dashboard theme={theme} chartOptions={chartOptions} barChartOptions={barChartOptions} />}
        />
        <Route path="/students" element={<Students />} />
        <Route path="/engagement" element={<Engagement />} />
        <Route path="/review" element={<Review />} />
        <Route path="/mywalky" element={<Mywalky />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </ExampleAdminLayout>
  );
}

export default App
