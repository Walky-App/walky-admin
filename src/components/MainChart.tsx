import { useEffect, useRef } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { useTheme } from '../hooks/useTheme'
import { Chart, TooltipModel } from 'chart.js'

// Define interfaces
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
}

interface WalksData {
  value: number; 
  percentChange: number;
  chartData: number[];
  monthLabels?: string[];
}

// Update props to accept both active users and walks data
interface MainChartProps {
  activeUsers?: MonthlyActiveUsersData | null;
  walks?: WalksData | null;
}

const MainChart = ({ activeUsers, walks }: MainChartProps) => {
  const chartRef = useRef<Chart | null>(null);
  const { theme } = useTheme()

  // Determine labels, prioritizing active users labels
  const chartLabels = activeUsers?.chartLabels || 
                      walks?.monthLabels || 
                      ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  // Define datasets array
  const datasets = [
    {
      label: 'Active Users',
      data: activeUsers?.chartData || [70, 105, 120, 110, 165, 95, 85],
      borderColor: 'rgba(0, 123, 255, 1)',
      backgroundColor: 'rgba(0, 123, 255, 0.1)', 
      fill: true, 
      tension: 0.4,
      pointRadius: 0,
      hitRadius: 20,
      hoverRadius: 4,
    },
    {
      label: 'Walks',
      data: walks?.chartData || [140, 160, 180, 120, 170, 130, 100],
      borderColor: 'rgba(40, 167, 69, 1)', 
      backgroundColor: 'transparent', 
      fill: false, 
      tension: 0.4,
      pointRadius: 0,
      hitRadius: 20,
      hoverRadius: 4,
    }
  ];

  // Combined tooltip plugin that shows both values
  const tooltipPlugin = {
    id: 'customTooltip',
    afterDraw: (chart: Chart) => {
      const tooltipModel = chart.tooltip as TooltipModel<'line'>;
      let tooltipEl = document.getElementById('chartjs-tooltip');

      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.padding = '8px 12px';
        tooltipEl.style.borderRadius = '6px';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.transition = 'all 0.1s ease';
        tooltipEl.style.fontFamily = 'Inter, sans-serif';
        tooltipEl.style.fontSize = '12px';
        document.body.appendChild(tooltipEl);
      }

      tooltipEl.style.background = theme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(4, 4, 4, 0.75)';
      tooltipEl.style.color = theme.isDark ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';

      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = '0';
        return;
      }

      if (tooltipModel.dataPoints && tooltipModel.dataPoints.length > 0) {
        const dataPoint = tooltipModel.dataPoints[0];
        const hoveredMonth = dataPoint.label;
        const dataIndex = dataPoint.dataIndex; // Get the index of the data point
        
        // Get the values for both datasets at this month
        const activeUsersValue = chart.data.datasets[0].data[dataIndex] || 0;
        const walksValue = chart.data.datasets[1].data[dataIndex] || 0;
        
        // Create combined tooltip showing both values
        tooltipEl.innerHTML = `
          <strong>${hoveredMonth}</strong><br>
          Active Users: ${activeUsersValue}<br>
          Walks: ${walksValue}
        `;
      }

      const position = chart.canvas.getBoundingClientRect();
      tooltipEl.style.opacity = '1';
      tooltipEl.style.left = `${position.left + window.pageXOffset + tooltipModel.caretX}px`;
      tooltipEl.style.top = `${position.top + window.pageYOffset + tooltipModel.caretY}px`;
    },
  };

  useEffect(() => {
    const updateChartColors = () => {
      if (!chartRef.current) return;
      const chart = chartRef.current;

      if (chart.options.scales?.x?.grid) {
        chart.options.scales.x.grid.color = `${theme.colors.borderColor}33`;
        chart.options.scales.x.grid.borderColor = `${theme.colors.borderColor}33`;
      }
      if (chart.options.scales?.x?.ticks) {
        chart.options.scales.x.ticks.color = theme.colors.bodyColor;
      }

      if (chart.options.scales?.y?.grid) {
        chart.options.scales.y.grid.color = `${theme.colors.borderColor}33`;
        chart.options.scales.y.grid.borderColor = `${theme.colors.borderColor}33`;
      }
      if (chart.options.scales?.y?.ticks) {
        chart.options.scales.y.ticks.color = theme.colors.bodyColor;
      }

      if (chart.data.datasets[0]) {
        chart.data.datasets[0].borderColor = 'rgba(0, 123, 255, 1)';
        chart.data.datasets[0].backgroundColor = 'rgba(0, 123, 255, 0.08)';
      }

      if (chart.data.datasets[1]) {
        chart.data.datasets[1].borderColor = 'rgba(40, 167, 69, 1)';
        chart.data.datasets[1].backgroundColor = 'transparent';
      }

      chart.update();
    };

    document.documentElement.addEventListener('ColorSchemeChange', () => {
      setTimeout(updateChartColors, 50);
    });

    updateChartColors();
  }, [theme]);

  return (
    <CChartLine
      ref={chartRef}
      style={{ height: '300px', marginTop: '40px' }}
      data={{
        labels: chartLabels,
        datasets: datasets
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: theme.colors.bodyColor,
            }
          },
          tooltip: {
            enabled: false,
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
          axis: 'x',
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
            bottom: 0
          }
        },
      }}
      plugins={[tooltipPlugin]}
    />
  )
}

export default MainChart