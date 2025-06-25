import { useState, useEffect, ReactElement } from 'react'
import CIcon from '@coreui/icons-react'
import { cilArrowTop, cilCloudDownload, cilArrowBottom, cilArrowRight } from '@coreui/icons'
import {
  CButton,
  CButtonGroup,
  CCard, 
  CCardBody, 
  CCardHeader,
  CRow,
  CCol, 
  CWidgetStatsA 
} from '@coreui/react' 
import { CChartBar, CChartLine } from '@coreui/react-chartjs'

import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { useTheme } from './hooks/useTheme'
import Students from './pages/Students'
import Engagement from './pages/Engagement'
import Review from './pages/Review'
import Geofences from './pages/Geofences'
import Campuses from './pages/Campuses'
import CreateAccount from './pages/CreateAccount'
import ForgotPassword from './pages/ForgotPassword'  
import { AppTheme } from './theme'
import VerifyCode from './pages/VerifyCode'
import ExampleAdminLayout from './components/ExampleAdminLayout'

import './App.css'
import MainChart from './components/MainChart'

import { Chart as ChartJS, TooltipModel } from 'chart.js'
import API from './API/index'
import Login from './pages/Login'

type DashboardProps = {
  theme: AppTheme;
};

type BaseWidgetData = {
  percentChange: number;
  chartData: number[];
};

interface MonthlyActiveUsersData {
  monthlyData: Array<{
    month?: string;
    label?: string;
    year?: number;
    count: number;
  }>;
  chartData: number[];
  chartLabels: string[];
  totalActiveUsers: number;
  last24HoursActiveUsers: number;
  period: string;        // Add these two properties
  since: string;         // that exist in your actual data
}
type WalksData = {
  value: number; 
  percentChange: number;
  chartData: number[];
  monthLabels?: string[];
};

type EventsData = {
  value: number;  // Total sum of events
  percentChange: number;
  chartData: number[];
  monthLabels?: string[];
  timeFrame?: string;
};

type IdeasData = {
  value: number;
  percentChange: number;
  chartData: number[];
  monthLabels?: string[];
};

type SurpriseData = BaseWidgetData & {
  value: number | string;
};

// API Response Interfaces
interface IdeaMonthData {
  month: string;
  year: string;
  count: number;
}

interface EventMonthData {
  month: string;
  totalCount: number;
}

// API Response structure for walks endpoint
interface WalksApiResponse {
  chartData?: number[];
  chartLabels?: string[];
  totalWalksCreated?: number;
}

const Dashboard = ({theme} : DashboardProps) => {
    const [walks, setWalks] = useState<WalksData | null>(null);
    const [events, setEvents] = useState<EventsData | null>(null);
    const [ideas, setIdeas] = useState<IdeasData | null>(null);
    const [surprise, setSurprise] = useState<SurpriseData | null>(null);
    const [activeUsers, setActiveUsers] = useState<MonthlyActiveUsersData | null>(null);
    const [activePeriod, setActivePeriod] = useState<'day' | 'week' | 'month'>('month');

    // Helper function to handle period changes
    const handlePeriodChange = (period: 'day' | 'week' | 'month') => {
      setActivePeriod(period);
      getActiveUsersData(period);
      getWalksData(period);
    };
    
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
    
    // Function to get active users data
    const getActiveUsersData = async (period: 'day' | 'week' | 'month' = 'month') => {
      try {
        console.log(`🔍 Fetching ${period} active users data...`);
        const response = await API.get(`/users/monthly-active?period=${period}`);
        console.log('✅ Monthly active users response:', response.data);
        
        if (response && response.data) {
          setActiveUsers(response.data as MonthlyActiveUsersData);
        }
      } catch (err) {
        console.error('❌ Failed to fetch monthly active users data:', err);
        setActiveUsers(null);
      }
    };

    // Function to get walks data - modified to use the direct API response
    const getWalksData = async (period: 'day' | 'week' | 'month' = 'month') => {
      try {
        // Make API call to get the data for the selected period
        const response = await API.get(`/walks/count?groupBy=${period}`);
        
        if (response?.data) {
          const apiData = response.data as WalksApiResponse;
          
          // Add safety checks for API response properties
          const chartData = Array.isArray(apiData.chartData) ? [...apiData.chartData] : [];
          const chartLabels = Array.isArray(apiData.chartLabels) ? apiData.chartLabels : [];
          
          const last6MonthsData = chartData.slice(-6); // Get last 6 months
          const totalWalks = apiData.totalWalksCreated ?? last6MonthsData.reduce((sum, count) => sum + count, 0);
          
          // Get growth percentage - calculate ourselves if not provided
          let percentChange = 0;
          if (chartData.length >= 2) {
            const lastMonth = chartData[chartData.length - 1] ?? 0;
            const previousMonth = chartData[chartData.length - 2] ?? 0;
            
            if (previousMonth > 0) {
              percentChange = Number((((lastMonth - previousMonth) / previousMonth) * 100).toFixed(2));
            } else if (lastMonth > 0) {
              percentChange = 100; // If previous month was 0 and current month has data
            }
          }
          
          // Build the walks data object
          const walksData = {
            value: totalWalks,
            percentChange,
            chartData: last6MonthsData,
            monthLabels: chartLabels.slice(-6) // Get last 6 month labels
          };
          
          console.log('Walks data:', walksData);
          setWalks(walksData);
        }
      } catch (err) {
        console.error('❌ Failed to fetch walks data:', err);
        // Set default data on error
        setWalks({
          value: 0,
          percentChange: 0,
          chartData: [],
          monthLabels: []
        });
      }
    };
    
    // Function to get ideas data
    const getIdeasData = async () => {
      try {
        const response = await API.get('/ideas/count?groupBy=month');
        
        if (response?.data?.monthlyData) {
          const monthlyData = response.data.monthlyData as IdeaMonthData[];
          
          // Extract the counts for the chart with proper type annotation
          const chartData = monthlyData.map((month: IdeaMonthData) => month.count);
          
          // Calculate the total sum of ideas
          const totalIdeas = chartData.reduce((sum, count) => sum + count, 0);
          
          // Calculate percentage change between the last two months
          let percentChange = 0;
          if (monthlyData.length >= 2) {
            const lastMonth = monthlyData[monthlyData.length - 1].count;
            const previousMonth = monthlyData[monthlyData.length - 2].count;
            
            if (previousMonth > 0) {
              percentChange = Number((((lastMonth - previousMonth) / previousMonth) * 100).toFixed(2));
            } else if (lastMonth > 0) {
              percentChange = 100; // If previous month was 0 and current month has data
            }
          }
          
          const ideasData = {
            value: totalIdeas,
            percentChange,
            chartData,
            monthLabels: monthlyData.map((month: IdeaMonthData) => `${month.month.substring(0, 3)} ${month.year}`)
          };
          
          setIdeas(ideasData);
        }
      } catch (err) {
        console.error('❌ Failed to fetch ideas data:', err);
      }
    };

    // Function to get events data
    const getEventsData = async () => {
      try {
        const response = await API.get('/events/eventEngagement-count?timeFrame=last6months');
        
        if (response?.data?.data) {
          // The data array contains monthly data
          const monthlyData = response.data.data as EventMonthData[];
          
          // Extract the counts for the chart with proper type annotation
          const chartData = monthlyData.map((item: EventMonthData) => item.totalCount);
          
          // Calculate the total sum of events
          const totalEvents = chartData.reduce((sum, count) => sum + count, 0);
          
          // Calculate percentage change between the last two months
          let percentChange = 0;
          if (monthlyData.length >= 2) {
            const lastMonth = monthlyData[monthlyData.length - 1].totalCount;
            const previousMonth = monthlyData[monthlyData.length - 2].totalCount;
            
            if (previousMonth > 0) {
              percentChange = Number((((lastMonth - previousMonth) / previousMonth) * 100).toFixed(2));
            } else if (lastMonth > 0) {
              percentChange = 100; // If previous month was 0 and current month has data
            }
          }
          
          // Format month labels
          const monthLabels = monthlyData.map((item: EventMonthData) => {
            const parts = item.month.split(' ');
            return parts[0].substring(0, 3) + ' ' + parts[1];  // Format as "Nov 2024"
          });
          
          const eventsData = {
            value: totalEvents,
            percentChange,
            chartData,
            monthLabels,
            timeFrame: response.data.timeFrame
          };
          
          setEvents(eventsData);
        }
      } catch (err) {
        console.error('❌ Failed to fetch events data:', err);
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

    // Initialize API calls
    useEffect(() => {
      console.log('Dashboard component mounted or period changed:', activePeriod);
      getWalksData(activePeriod);
      getEventsData();
      getIdeasData();
      getSurpriseData();
      getActiveUsersData(activePeriod);
    }, [activePeriod]); // Added activePeriod to dependency array

    // Fix the tooltipPlugin to properly handle potential null references
    const tooltipPlugin = {
      id: "customTooltip",
      afterDraw: (chart: ChartJS) => {
        if (!chart.tooltip) return;
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

        if (tooltipModel.dataPoints && tooltipModel.dataPoints.length > 0) {
          const dataPoint = tooltipModel.dataPoints[0];
          const hoveredMonth = dataPoint.label || '';
          const value = dataPoint.raw;
          
          // Determine which dataset this is from based on chart ID or label
          const datasetLabel = dataPoint.dataset.label || '';
          
          if (datasetLabel === 'Events') {
            tooltipEl.innerHTML = `<strong>${hoveredMonth}</strong><br>Events this month: ${value}`;
          } else if (datasetLabel === 'Walks') {
            tooltipEl.innerHTML = `<strong>${hoveredMonth}</strong><br>Walks this month: ${value}`;
          } else if (datasetLabel === 'Ideas') {
            tooltipEl.innerHTML = `<strong>${hoveredMonth}</strong><br>Ideas this month: ${value}`;
          } else if (datasetLabel === 'Surprise') {
            tooltipEl.innerHTML = `<strong>${hoveredMonth}</strong><br>Value: ${value}`;
          } else {
            tooltipEl.innerHTML = `<strong>${hoveredMonth}</strong><br>Value: ${value}`;
          }
        }
  
        const position = chart.canvas.getBoundingClientRect();
        tooltipEl.style.opacity = "1";
        tooltipEl.style.left = `${position.left + window.pageXOffset + tooltipModel.caretX}px`;
        tooltipEl.style.top = `${position.top + window.pageYOffset + tooltipModel.caretY}px`;
      },
    };

    const getTrendIcon = (percent: number | undefined) => {
      if (percent === undefined || percent === null || percent === 0) return cilArrowRight
      if (percent > 0) return cilArrowTop
      if (percent < 0) return cilArrowBottom
      return cilArrowRight
    }
    

  return (
    <>
      <div className="mb-4 d-sm-flex justify-content-between align-items-center">
        <div></div>
        <div className="mt-3 mt-sm-0"></div>
      </div>

      <CRow>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={
              walks ? (
                <>
                  {walks.value}{' '}
                  <span className="fs-6 fw-normal">
                    ({walks.percentChange}% <CIcon icon={getTrendIcon(walks.percentChange)}/>)
                  </span>
                </>
              ) : (
                'Loading...'
              )
            }
            title="Walks (Last 6 Months)"
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: walks?.monthLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
                  animation: false,
                  layout: {
                    padding: {
                      bottom: 10
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
                  {events.value}{' '}
                  <span className="fs-6 fw-normal">
                    ({events.percentChange}% <CIcon icon={getTrendIcon(events.percentChange)} />)
                  </span>
                </>
              ) : (
                'Loading...'
              )
            }
            title="Events"
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: events?.monthLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
                  animation: false,
                  layout: {
                    padding: {
                      bottom: 10
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
            color="warning"
            value={
              ideas ? (
                <>
                  {ideas.value}{' '}
                  <span className="fs-6 fw-normal">
                    ({ideas.percentChange}% <CIcon icon={getTrendIcon(ideas.percentChange)} />)
                  </span>
                </>
              ) : (
                'Loading...'
              )
            }
            title="Ideas"
            chart={
              <CChartLine
                className="mt-3"
                style={{ height: '70px' }}
                data={{
                  labels: ideas?.monthLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
                    ({surprise.percentChange}% <CIcon icon={getTrendIcon(surprise.percentChange)} />)
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
                Active Users & Walks
              </h5>
              <div
                style={{ 
                  fontFamily: "Inter, sans-serif",
                  fontSize: '12px',
                  marginLeft: '0px',
                  color: theme.colors.secondary,
                }}
              >
                {activeUsers 
                  ? `Active Users: ${activeUsers.totalActiveUsers} (Last 24h: ${activeUsers.last24HoursActiveUsers}) | Walks: ${walks?.value || 0}`
                  : 'January - July 2025'}
              </div>
            </div>
            <div className="d-flex align-items-center">
              <CButtonGroup role="group">
                <CButton 
                  color={activePeriod === 'day' ? 'dark' : 'outline-secondary'} 
                  size="sm"
                  onClick={() => handlePeriodChange('day')}
                >
                  Day
                </CButton>
                <CButton 
                  color={activePeriod === 'week' ? 'dark' : 'outline-secondary'} 
                  size="sm"
                  onClick={() => handlePeriodChange('week')}
                >
                  Week
                </CButton>
                <CButton 
                  color={activePeriod === 'month' ? 'dark' : 'outline-secondary'} 
                  size="sm"
                  onClick={() => handlePeriodChange('month')}
                >
                  Month
                </CButton>
              </CButtonGroup>
              <CButton color="primary" size="sm" className="ms-2" onClick={() => {
                getActiveUsersData(activePeriod);
                getWalksData(activePeriod);
              }}>
                <CIcon icon={cilCloudDownload} />
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody className="p-0">
            {/* Chart */}
  <div style={{ padding: '0 24px' }}>
  <MainChart activeUsers={activeUsers}  walks={walks} />
  </div>

  {/* Footer: full width, no side padding */}
  <div
    style={{
      backgroundColor: theme.isDark ? '#2a2d32' : '#f3f4f6',
      borderTop: '1px solid #d8dbe0',
      display: 'flex',
      justifyContent: 'center',
      gap: '60px',
      padding: '24px ',
      width: '100%',
      borderBottomLeftRadius: '12px',
      borderBottomRightRadius: '12px',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <div className="fw-semibold" style={{ fontSize: '16px', color: theme.isDark ? '#fff' : '#343a40' }}>
        Visits
      </div>
      <div style={{ fontSize: '14px', color: theme.isDark ? '#adb5bd' : '#4f5d73' }}>232 Users </div>
      <div style={{ height: '4px', background: '#2eb85c', width: '60px', margin: '6px auto 0', borderRadius: '2px' }} />
    </div>

    <div style={{ textAlign: 'center' }}>
      <div className="fw-semibold" style={{ fontSize: '16px', color: theme.isDark ? '#fff' : '#343a40' }}>
        Unique
      </div>
      <div style={{ fontSize: '14px', color: theme.isDark ? '#adb5bd' : '#4f5d73' }}>102 Users </div>
      <div style={{ height: '4px', background: '#3399ff', width: '60px', margin: '6px auto 0', borderRadius: '2px' }} />
    </div>
  </div>
          </CCardBody>
        </CCard>
      </>
    )
  }

function App() {
  const { theme } = useTheme()
  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme.isDark);
  }, [theme.isDark]);
  
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  const PrivateRoute = ({ children }: { children: ReactElement }) => { 
    return isLoggedIn ? children : <Navigate to="/login" />;
  };
  return (
    <Routes>
      {/* Login route (still public) */}
      <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />

      {/* Protected routes inside admin layout */}
      <Route
        path="*"
        element={
          <PrivateRoute>
            <ExampleAdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard theme={theme}/>} />
                <Route path="/students" element={<Students />} />
                <Route path="/engagement" element={<Engagement />} />
                <Route path="/review" element={<Review />} />
                <Route path="/geofences" element={<Geofences />} />
                <Route path="/campuses" element={<Campuses />} />
              </Routes>
            </ExampleAdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  )  
}
  
export default App
