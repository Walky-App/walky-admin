//Icon/Components
import CIcon from '@coreui/icons-react'
import { cilArrowTop,cilCloudDownload } from '@coreui/icons'
import {
  CButton,
  CButtonGroup,
  CCard, 
  CCardBody, 
  CCardHeader,
  CRow,
  CCol, 
  // CDropdownItem, 
  // CDropdown, 
  // CDropdownMenu, 
  // CDropdownToggle, 
  CWidgetStatsA 
} from '@coreui/react' 
import { CChartBar, CChartLine } from '@coreui/react-chartjs'

import { useState, useEffect, JSX } from 'react'

//React Routes
import {
  Routes,
  Route,
  Navigate,
  // useLocation
} from 'react-router-dom'

//Project Hooks and Theme
import { useTheme } from './hooks/useTheme'

import Students from './pages/Students.tsx'
import Engagement from './pages/Engagement.tsx'
import Review from './pages/Review.tsx'
import Mywalky from './pages/Mywalky.tsx'
import Compliance from './pages/Compliance.tsx'
import Settings from './pages/Settings.tsx'
import CreateAccount from './pages/CreateAccount.tsx'  
import { AppTheme } from './theme'

import ExampleAdminLayout from './components/ExampleAdminLayout.tsx'

//Styles
import './App.css'

import MainChart from "./components/MainChart.tsx";

//Chart.js Types
import { Chart as ChartJS, TooltipModel } from 'chart.js';

//API
import API from './API/index.ts'
import Login from './pages/Login.tsx'

type DashboardProps = {
  theme: AppTheme;
  // chartOptions: object;
  // barChartOptions: object;
};

type BaseWidgetData = {
  percentChange: number;
  chartData: number[];
};

type WalksData = {
  totalWalksCreated: number;
  chartData?: number[];
  percentChange?: number;
};

type EventsData = {
  day: {
    totalEventEngagement: number;
    percentChange: number | null;
  };
  week: {
    totalEventEngagement: number;
    percentChange: number;
  };
  month: {
    totalEventEngagement: number;
    percentChange: number;
  };
  allTime: {
    totalEventEngagement: number;
  };
  chartData?: number[];
};

type IdeasData = BaseWidgetData & {
  totalIdeasCreated?: number; // Made optional
  value?: number | string; // Added alternate property
};

type SurpriseData = BaseWidgetData & {
  value: number | string;
};
const Dashboard = ({theme} : DashboardProps) => {


    const [walks, setWalks] = useState<WalksData | null>(null);
    const [events, setEvents] = useState<EventsData | null>(null);
    const [ideas, setIdeas] = useState<IdeasData | null>(null);
    const [surprise, setSurprise] = useState<SurpriseData | null>(null);
    // Add CSS to hide default Chart.js tooltips
    useEffect(() => {
      // Create a style element
      const style = document.createElement('style');
      
      style.textContent = `
        .chartjs-tooltip {
          display: none !important;
        }
      `;
      // Add the style to the document head
      document.head.appendChild(style);
  
      // Clean up function to remove the style when component unmounts
      return () => {
        document.head.removeChild(style);
      };
    }, []);
    
    useEffect(() => {
    const getIdeasData = async () => {
      try {
        const ideasData = await API.get('/ideas/count');
        
        if (ideasData) {
          setIdeas(ideasData.data);
        }
      } catch (err) {
        console.error('❌ Failed to fetch ideas data:', err);
      }
    };

    const getEventsData = async () => {
      try {
        const response = await API.get('/events/eventEngagement-count');
        
        if (response && response.data) {
          // Add chartData since it's not in the API response
          const eventsData = {
            ...response.data,
            chartData: [20, 40, 60, 80, 100, 120, response.data.allTime.totalEventEngagement]
          };
          
          setEvents(eventsData);
        }
      } catch (err) {
        console.error('❌ Failed to fetch events data:', err);
      }
    };

    const getWalksData = async () => {
      try {
        const response = await API.get('/walks/count');
        
        if (response && response.data) {
          const totalWalks = response.data.totalWalksCreated;
          
          // Create synthetic chart data and add percentChange
          const walksData = {
            ...response.data,
            percentChange: 5.2, //These are dummy values, will get replaced when endpoint is done.
            chartData: [
              Math.round(totalWalks * 0.4),
              Math.round(totalWalks * 0.5),
              Math.round(totalWalks * 0.6),
              Math.round(totalWalks * 0.7),
              Math.round(totalWalks * 0.8),
              Math.round(totalWalks * 0.9),
              totalWalks
            ]
          };
          
          setWalks(walksData);
        }
      } catch (err) {
        console.error('❌ Failed to fetch walks data:', err);
      }
    };

    // Placeholder for surprise data
    const getSurpriseData = async () => {
      try {
        // If you have a surprise endpoint, uncomment and modify this:
        // const surpriseData = await API.get('/your-surprise-endpoint');
        // if (surpriseData && surpriseData.data) {
        //   setSurprise(surpriseData.data);
        // }
        
        // For now, set placeholder data
        setSurprise({
          value: 'Coming Soon',
          percentChange: 0,
          chartData: [10, 15, 20, 25, 30, 35, 40]
        });
      } catch (err) {
        console.error('❌ Failed to fetch surprise data:', err);
      }
    };

    // Execute all API calls
    getWalksData();
    getEventsData();
    getIdeasData();
    getSurpriseData();
  }, []);

    const tooltipPlugin = {
      id: "customTooltip",
      afterDraw: (chart: ChartJS) => {
        const tooltipModel = chart.tooltip as TooltipModel<'line'>;
      
        let tooltipEl = document.getElementById("chartjs-tooltip");
        if (!tooltipEl) {
          tooltipEl = document.createElement("div");
          tooltipEl.id = "chartjs-tooltip";
          tooltipEl.style.position = "absolute";
          tooltipEl.style.padding = "8px 12px";
          tooltipEl.style.borderRadius = "6px";
          tooltipEl.style.pointerEvents = "none";
          tooltipEl.style.transition = "all 0.1s ease";
          tooltipEl.style.fontFamily = "Inter, sans-serif";
          tooltipEl.style.fontSize = "12px";
          document.body.appendChild(tooltipEl);
        }
  
        tooltipEl.style.background = theme.isDark
          ? "rgba(255, 255, 255, 0.7)"
          : "rgba(4, 4, 4, 0.75)";
        tooltipEl.style.color = theme.isDark ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
  
        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = "0";
          return;
        }
  
        if (tooltipModel.dataPoints) {
          const dataPoint = tooltipModel.dataPoints[0];
          const hoveredMonth = dataPoint.label;
          const value = dataPoint.raw;
  
          tooltipEl.innerHTML = `<strong>${hoveredMonth}</strong><br>Walks this month: ${value}`;
        }
  
        const position = chart.canvas.getBoundingClientRect();
        tooltipEl.style.opacity = "1";
        tooltipEl.style.left = `${position.left + window.pageXOffset + tooltipModel.caretX}px`;
        tooltipEl.style.top = `${position.top + window.pageYOffset + tooltipModel.caretY}px`;
      },
    };
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
          className="mb-4"
          color="primary"
          value={
            walks ? (
              <>
                {walks.totalWalksCreated}{' '}
                <span className="fs-6 fw-normal">
                  ({walks.percentChange}% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            ) : (
              'Loading...'
            )
          }
          title="Walks"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="p-0">
          //       <CIcon icon={cilOptions} className="text-white" />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //     <CDropdownItem>Daily Walks</CDropdownItem>
          //         <CDropdownItem>Weekly Walks</CDropdownItem>
          //         <CDropdownItem>Monthly Walks</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
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
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    enabled: false,
                  },
                  title: {
                    display: false
                  },
                  subtitle: {
                    display: false
                  }
                },
                interaction: {
                  mode: "index",
                  intersect: false,
                },
                maintainAspectRatio: false,
                scales: {
                  x: { 
                    display: false,
                    grid: { display: false },
                    ticks: { display: false }
                  },
                  y: { 
                    display: false,
                    grid: { display: false },
                    ticks: { display: false }
                  },
                },
                elements: {
                  line: { borderWidth: 1, tension: 0.4 },
                  point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
                },
                // Disable all animations to prevent label flash
                animation: false,
                // Additional options to prevent labels
                layout: {
                  padding: {
                    bottom: 10 // Add some padding to clear the area where labels appear
                  }
                },
              }}
              plugins={[tooltipPlugin]}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
      <CWidgetStatsA
          className="mb-4"
          color="info"
          value={
            events ? (
              <>
                {events.allTime.totalEventEngagement}{' '}
                <span className="fs-6 fw-normal">
                  ({events.month.percentChange}% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            ) : (
              'Loading...'
            )
          }
          title="Events"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="p-0">
          //       <CIcon icon={cilOptions} className="text-white" />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
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
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    enabled: false,
                  },
                  title: {
                    display: false
                  },
                  subtitle: {
                    display: false
                  }
                },
                interaction: {
                  mode: "index",
                  intersect: false,
                },
                maintainAspectRatio: false,
                scales: {
                  x: { 
                    display: false,
                    grid: { display: false },
                    ticks: { display: false }
                  },
                  y: { 
                    display: false,
                    grid: { display: false },
                    ticks: { display: false }
                  },
                },
                elements: {
                  line: { borderWidth: 1, tension: 0.4 },
                  point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
                },
                // Disable all animations to prevent label flash
                animation: false,
                // Additional options to prevent labels
                layout: {
                  padding: {
                    bottom: 10 // Add some padding to clear the area where labels appear
                  }
                },
              }}
              plugins={[tooltipPlugin]}
            />
          }
        />
      </CCol>
      <CCol sm={6}lg={3}>
      <CWidgetStatsA
          className="mb-4"
          color="warning"
          value={
            ideas ? (
              <>
                {ideas.totalIdeasCreated}{' '}
                <span className="fs-6 fw-normal">
                  ({ideas.percentChange}% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            ) : (
              'Loading...'
            )
          }
          title="Ideas"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="p-0">
          //       <CIcon icon={cilOptions} className="text-white" />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
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
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    enabled: false,
                  },
                title: {
                  display: false
                },
                subtitle:{
                  display:false
                }
                },
                interaction: {
                  mode: "index",
                  intersect: false,
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                    grid: { display: false },
                    ticks: { display: false }
                  },
                  y: {
                    display: false,
                    grid: { display: false },
                    ticks: { display: false }
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
              plugins={[tooltipPlugin]}
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
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="p-0">
          //       <CIcon icon={cilOptions} className="text-white" />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
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
                elements: {
                  line: { borderWidth: 1, tension: 0.4 },
                  point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
                },
                animation: false,
                layout: {
                  padding: {
                    bottom: 0 //ensure graph is touching bottom of widget
                  }
                },
              }}
              plugins={[tooltipPlugin]}

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
                marginLeft: '0px',
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

  const PrivateRoute = ({ children }: { children: JSX.Element }) => { // ⬅️ PrivateRoute defined here
    return isLoggedIn ? children : <Navigate to="/login" />;
  };
  // Chart color customization based on theme
  // const chartOptions = {
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //   },
  //   maintainAspectRatio: false,
  //   scales: {
  //     x: {
  //       grid: {
  //         display: false,
  //       },
  //       ticks: {
  //         display: false,
  //         color: theme.colors.chartLine,
  //       },
  //     },
  //     y: {
  //       min: 30,
  //       max: 89,
  //       display: false,
  //       grid: {
  //         display: false,
  //       },
  //       ticks: {
  //         display: false,
  //         color: theme.colors.chartLine,
  //       },
  //     },
  //   },
  //   elements: {
  //     line: {
  //       borderWidth: 1,
  //       tension: 0.4,
  //       borderColor: theme.colors.chartLine,
  //     },
  //     point: {
  //       radius: 4,
  //       hitRadius: 10,
  //       hoverRadius: 4,
  //       backgroundColor: theme.colors.chartPoint,
  //     },
  //   },
  // }

  // Additional options for bar charts
  // const barChartOptions = {
  //   ...chartOptions,
  //   scales: {
  //     ...chartOptions.scales,
  //     x: {
  //       grid: {
  //         display: false,
  //         drawTicks: false,
  //       },
  //       ticks: {
  //         display: false,
  //         color: theme.colors.chartLine,
  //       },
  //     },
  //     y: {
  //       grid: {
  //         display: false,
  //         drawTicks: false,
  //       },
  //       ticks: {
  //         display: false,
  //         color: theme.colors.chartLine,
  //       },
  //     },
  //   },
  // }

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
                <Route path="/" element={<Dashboard theme={theme}/>} />
                <Route path="/students" element={<Students />} />
                <Route path="/engagement" element={<Engagement />} />
                <Route path="/review" element={<Review theme={theme} />} />
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
