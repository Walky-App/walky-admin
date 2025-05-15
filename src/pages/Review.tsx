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



type DashboardProps = {
  theme: AppTheme;
};

const Review = ({ theme }: DashboardProps) => {
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
                      enabled: false, // Completely disable native tooltips
                    },
                  },
                  interaction: {
                    mode: "index",
                    intersect: false,
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { display: false }, ticks: { display: false } },
                    y: { display: false, grid: { display: false }, ticks: { display: false } },
                  },
                  elements: {
                    line: { borderWidth: 1, tension: 0.4 },
                    point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
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
