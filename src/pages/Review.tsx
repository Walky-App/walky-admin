import { cilArrowTop, cilOptions } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CWidgetStatsA,
} from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import { AppTheme } from "../theme";
import { Chart as ChartJS, TooltipModel } from 'chart.js';
import { useEffect } from 'react';

type DashboardProps = {
  theme: AppTheme;
};

const Review = ({ theme }: DashboardProps) => {
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
      <CRow>
        <CCol sm={6}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={
              <>
                300{" "}
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
                style={{ height: "70px" }}
                data={{
                  labels: ["January", "February", "March", "April", "May", "June", "July"],
                  datasets: [
                    {
                      label: "",
                      backgroundColor: "transparent",
                      borderColor: theme.colors.chartLine || "rgba(255,255,255,0.55)",
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
      </CRow>
    </>
  );
};

export default Review;

