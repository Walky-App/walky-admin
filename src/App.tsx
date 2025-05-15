import CIcon from '@coreui/icons-react'
import { cilArrowTop, cilOptions } from '@coreui/icons'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { CButton, CButtonGroup } from "@coreui/react"
import { cilCloudDownload } from "@coreui/icons"


import { 
  CCard, 
  CCardBody, 
  CRow, 
  CCol, 
  CCardHeader,
  CDropdownItem, 
  CDropdown, 
  CDropdownMenu, 
  CDropdownToggle, 
  CWidgetStatsA 
} from '@coreui/react' 

import './App.css'

import { useState, ReactElement, useEffect } from 'react'

import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'



import { useTheme } from './hooks/useTheme'
import Students from './pages/Students'
import Engagement from './pages/Engagement'
import Review from './pages/Review'
import Mywalky from './pages/Mywalky'
import Compliance from './pages/Compliance'
import Settings from './pages/Settings'
import CreateAccount from './pages/CreateAccount'  
import { AppTheme } from './theme'

import ExampleAdminLayout from './components/ExampleAdminLayout'
import MainChart from "./components/MainChart.tsx";
import API from './API/index.ts'
import Login from './pages/Login.tsx'

type DashboardProps = {
  theme: AppTheme;
  chartOptions: object;
  barChartOptions: object;
};

type WidgetData = {
  value: number | string;
  percentChange: number;
  chartData: number[];
};

const Dashboard = ({theme, chartOptions, barChartOptions} : DashboardProps) => {

  const [walks, setWalks] = useState<WidgetData | null>(null);
  const [events, setEvents] = useState<WidgetData | null>(null);
  const [ideas, setIdeas] = useState<WidgetData | null>(null);
  const [surprise, setSurprise] = useState<WidgetData | null>(null);

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const [walksRes, eventsRes, ideasRes, surpriseRes] = await Promise.all([
          API.get('/api/v1/walks'),
          API.get('/api/v1/events'),
          API.get('/api/v1/ideas'),
          API.get('/api/v1/surprise'),
        ]);
  
        setWalks(walksRes.data);
        setEvents(eventsRes.data);
        setIdeas(ideasRes.data);
        setSurprise(surpriseRes.data);
      } catch (err) {
        console.error('Failed to fetch one or more widgets:', err);
      }
    };
  
    fetchWidgets();
  }, []);
  


  return (
    <>
    
      <div className="mb-4 d-sm-flex justify-content-between align-items-center">
        <div>
          
          
        </div>
        <div className="mt-3 mt-sm-0">
          
        </div>
      </div>

    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4 px-0 py-0"
          color="primary"
          value={
            walks ? (
              <>
                {walks.value}{' '}
                <span className="fs-6 fw-normal">
                  ({walks.percentChange}% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            ) : (
              'Loading...'
            )
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
                    label: 'Walks',
                    backgroundColor: 'transparent',
                    borderColor: theme.colors.chartLine,
                    pointBackgroundColor: theme.colors.primary,
                    data: walks?.chartData || [],
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
            events ? (
              <>
                {events.value}{' '}
                <span className="fs-6 fw-normal">
                  ({events.percentChange}% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            ) : (
              'Loading...'
            )
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
                    label: 'Events',
                    backgroundColor: 'transparent',
                    borderColor: theme.colors.chartLine,
                    pointBackgroundColor: theme.colors.info,
                    data: events?.chartData || [],
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
            ideas ? (
              <>
                {ideas.value}{' '}
                <span className="fs-6 fw-normal">
                  ({ideas.percentChange}% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            ) : (
              'Loading...'
            )
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
                    label: 'Ideas',
                    backgroundColor: `${theme.colors.warning}33`,
                    borderColor: theme.colors.chartLine,
                    data: ideas?.chartData || [],
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
            surprise ? (
              <>
                {surprise.value}{' '}
                <span className="fs-6 fw-normal">
                  ({surprise.percentChange}% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            ) : (
              'Loading...'
            )
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
                    label: 'Surprise',
                    backgroundColor: theme.colors.danger,
                    borderColor: theme.colors.chartLine,
                    data: surprise?.chartData || [],
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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  console.log("💡 Logged in:", isLoggedIn); // ✅ DEBUG: See login state in browser console

  

  
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

  const PrivateRoute = ({ children }: { children: ReactElement }) => {
    const location = useLocation()
    return isLoggedIn
      ? children
      : <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <Routes>
      {/* ✅ Login route (still public) */}
      <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
      <Route path="/create-account" element={<CreateAccount />} />
  
      {/* ✅ Protected routes inside admin layout */}
      <Route
        path="*"
        element={
          <PrivateRoute>
            <ExampleAdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard theme={theme} chartOptions={chartOptions} barChartOptions={barChartOptions} />} />
                <Route path="/students" element={<Students />} />
                <Route path="/engagement" element={<Engagement />} />
                <Route path="/review" element={<Review />} />
                <Route path="/mywalky" element={<Mywalky />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </ExampleAdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  )  
  }
  
  export default App