import { useEffect, useRef } from "react";
import { CChartLine } from "@coreui/react-chartjs";
// import { getStyle } from '@coreui/utils'
import { useTheme } from "../hooks/useTheme";


const MainChart = () => {
   
  const chartRef = useRef<any>(null);
  const { theme } = useTheme();

  // Removed unused variables chartLabels and datasets

  // Combined tooltip plugin that shows both values
  const tooltipPlugin = {
    id: "customTooltip",
     
    afterDraw: (chart: any) => {
      const tooltipModel = chart.tooltip;
      let tooltipEl = document.getElementById("chartjs-tooltip");

      if (!tooltipEl) {
        tooltipEl = document.createElement("div");
        tooltipEl.id = "chartjs-tooltip";
        tooltipEl.style.position = "absolute";
        tooltipEl.style.padding = "16px 20px";
        tooltipEl.style.borderRadius = "12px";
        tooltipEl.style.pointerEvents = "none";
        tooltipEl.style.transition = "all 0.2s ease";
        tooltipEl.style.fontFamily = "Inter, sans-serif";
        tooltipEl.style.fontSize = "13px";
        tooltipEl.style.boxShadow = theme.isDark 
          ? "0 8px 32px rgba(0,0,0,0.6)" 
          : "0 8px 32px rgba(0,0,0,0.15)";
        tooltipEl.style.border = `1px solid ${theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`;
        tooltipEl.style.backdropFilter = "blur(10px)";
        document.body.appendChild(tooltipEl);
      }

      tooltipEl.style.background = theme.isDark
        ? "rgba(33, 38, 49, 0.95)"
        : "rgba(255, 255, 255, 0.95)";
      tooltipEl.style.color = theme.isDark
        ? "rgb(225, 229, 235)"
        : "rgb(51, 51, 51)";

      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = "0";
        return;
      }
      if (tooltipModel.dataPoints && tooltipModel.dataPoints.length > 0) {
        const dataPoint = tooltipModel.dataPoints[0];
        const hoveredMonth = dataPoint.label;
        const dataIndex = dataPoint.dataIndex; // Get the index of the data point

        // Get the values for both datasets at this month
        const activeUsersValue = chart.data.datasets[0].data[dataIndex] || 0;
        const walksValue = chart.data.datasets[1].data[dataIndex] || 0;

        // Create combined tooltip showing both values with modern styling
        tooltipEl.innerHTML = `
          <div style="font-weight: 600; margin-bottom: 8px; color: ${theme.isDark ? '#fff' : '#000'};">
            📅 ${hoveredMonth}
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <div style="width: 12px; height: 12px; background: ${theme.colors.primary}; border-radius: 50%; margin-right: 8px;"></div>
            <span style="color: ${theme.isDark ? '#f1f5f9' : '#1e293b'};">Active Students: <strong>${activeUsersValue?.toLocaleString()}</strong></span>
          </div>
          <div style="display: flex; align-items: center;">
            <div style="width: 12px; height: 12px; background: ${theme.colors.success}; border-radius: 50%; margin-right: 8px;"></div>
            <span style="color: ${theme.isDark ? '#f1f5f9' : '#1e293b'};">Total Sessions: <strong>${walksValue?.toLocaleString()}</strong></span>
          </div>
        `;
      }

      const position = chart.canvas.getBoundingClientRect();
      tooltipEl.style.opacity = "1";
      tooltipEl.style.left = `${
        position.left + window.pageXOffset + tooltipModel.caretX
      }px`;
      tooltipEl.style.top = `${
        position.top + window.pageYOffset + tooltipModel.caretY
      }px`;
    },
  };

  useEffect(() => {
    const updateChartColors = () => {
      if (!chartRef.current) return;
      const chart = chartRef.current;
      if (chart.options.scales?.x?.grid) {
        chart.options.scales.x.grid.color = `${theme.colors.borderColor}33`;
      }
      if (chart.options.scales?.x?.ticks) {
        chart.options.scales.x.ticks.color = theme.colors.bodyColor;
      }

      if (chart.options.scales?.x?.grid) {
        chart.options.scales.x.grid.color = `${theme.colors.borderColor}33`;
      }
      if (chart.options.scales?.x?.ticks) {
        chart.options.scales.x.ticks.color = theme.colors.bodyColor;
      }

      if (chart.options.scales?.y?.grid) {
        chart.options.scales.y.grid.color = `${theme.colors.borderColor}33`;
      }
      if (chart.options.scales?.y?.ticks) {
        chart.options.scales.y.ticks.color = theme.colors.bodyColor;
      }

      if (chart.data.datasets[0]) {
        chart.data.datasets[0].borderColor = theme.colors.primary;
        chart.data.datasets[0].backgroundColor = `${theme.colors.primary}15`;
      }

      if (chart.data.datasets[1]) {
        chart.data.datasets[1].borderColor = theme.colors.success;
        chart.data.datasets[1].backgroundColor = "transparent";
      }

      chart.update();
    };

    document.documentElement.addEventListener("ColorSchemeChange", () => {
      setTimeout(updateChartColors, 50);
    });

    updateChartColors();
  }, [theme]);

  return (
    <CChartLine
      ref={chartRef}
      style={{ height: "300px", marginTop: "40px" }}
      data={{
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Active Students",
            data: [2840, 3250, 3680, 3420, 4150, 3890, 4320, 4680, 4950, 5240, 5680, 6120],
            borderColor: theme.colors.primary,
            backgroundColor: `${theme.colors.primary}15`,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 3,
          },
          {
            label: "Total Sessions",
            data: [1420, 1680, 1920, 1750, 2180, 1980, 2340, 2580, 2790, 2940, 3180, 3420],
            borderColor: theme.colors.success,
            backgroundColor: "transparent",
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 3,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: theme.colors.bodyColor,
            },
          },
          tooltip: {
            enabled: false,
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
          axis: "x",
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: theme.colors.borderColor,
            },
            ticks: {
              color: theme.colors.bodyColor,
            },
          },
          y: {
            grid: {
              color: theme.colors.borderColor,
            },
            ticks: {
              color: theme.colors.bodyColor,
            },
          },
        },
        elements: {
          line: { borderWidth: 2 },
          point: {
            radius: 0,
            hitRadius: 20,
            hoverRadius: 4,
          },
        },
        animation: false,
        layout: {
          padding: {
            bottom: 0, //ensure graph is touching bottom of widget
          },
        },
      }}
      plugins={[tooltipPlugin]}
    />
  );
};

export default MainChart;
