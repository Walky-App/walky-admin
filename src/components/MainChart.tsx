import { useEffect, useRef } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import { useTheme } from '../hooks/useTheme'
import { Chart, TooltipModel } from 'chart.js'


const MainChart = () => {
  const chartRef = useRef<Chart | null>(null);
  const { theme } = useTheme()

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

      if (tooltipModel.dataPoints) {
        const dataPoint = tooltipModel.dataPoints[0];
        const hoveredMonth = dataPoint.label;
        const value = dataPoint.raw;
        tooltipEl.innerHTML = `<strong>${hoveredMonth}</strong><br>Walks this week: ${value}`;
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
  chart.data.datasets[0].borderColor = theme.colors.graphLine;
  chart.data.datasets[0].backgroundColor = theme.colors.chartPoint;
}

if (chart.data.datasets[1]) {
  chart.data.datasets[1].borderColor = theme.colors.success;
  chart.data.datasets[1].backgroundColor = theme.colors.success;
}

chart.update();
};

document.documentElement.addEventListener('ColorSchemeChange', () => {
setTimeout(updateChartColors, 50);
});

    updateChartColors()
  }, [theme])

  return (
    <CChartLine
      ref={chartRef}
      style={{ height: '300px', marginTop: '40px' }}
      data={{
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
              label: 'Traffic',
              data: [70, 105, 120, 110, 165, 95, 85],
              borderColor: theme.colors.borderColor,
              backgroundColor: theme.colors.chartLineBackground,
              fill: 'start',
              tension: 0.4,
              pointBackgroundColor: theme.colors.chartPoint,
            },
            {
                label: 'Conversion',
                data: [140, 160, 180, 120, 170, 130, 100],
                borderColor: theme.colors.borderColor,
                tension: 0.4,
                pointBackgroundColor: getStyle('--cui-success'),
              }
              
          ]          
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
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
  )
}

export default MainChart

