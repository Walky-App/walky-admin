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

// Import example components
import ExampleAdminLayout from './components/ExampleAdminLayout'
import { BreadcrumbDividersExample } from './components/examples/BreadCrumbs'
import MainChart from "./components/MainChart.tsx";
import { useEffect } from 'react'
import { Chart as ChartJS, TooltipModel } from 'chart.js';

type DashboardProps = {
  theme: AppTheme;
  // chartOptions: object;
  // barChartOptions: object;
};

const Dashboard = ({theme} : DashboardProps) => {
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
    <BreadcrumbDividersExample />
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
            <>
              283{' '}
              <span className="fs-6 fw-normal">
                (40.9% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title="Walks"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-white" />
              </CDropdownToggle>
              <CDropdownMenu>
              <CDropdownItem>Daily Walks</CDropdownItem>
                  <CDropdownItem>Weekly Walks</CDropdownItem>
                  <CDropdownItem>Monthly Walks</CDropdownItem>
                  <CDropdownItem disabled>Download CSV</CDropdownItem>
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
            <>
              187{' '}
              <span className="fs-6 fw-normal">
                (40.9% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title="Events"
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
            <>
              192{' '}
              <span className="fs-6 fw-normal">
                (40%<CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title="Ideas"
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
    <ExampleAdminLayout>
      {}
      <Routes>
        <Route
          path="/"
          element={<Dashboard theme={theme} />}
        />
        <Route path="/students" element={<Students />} />
        <Route path="/engagement" element={<Engagement />} />
        <Route path="/review" element={<Review theme={theme}/>} />
        <Route path="/mywalky" element={<Mywalky />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </ExampleAdminLayout>
  );
}

export default App
