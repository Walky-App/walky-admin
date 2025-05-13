import { useEffect, useRef } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import { useTheme } from '../hooks/useTheme';
import { Chart } from 'chart.js';

const MainChart = () => {
  const chartRef = useRef<Chart | null>(null);
  const { theme } = useTheme()

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
      }}
    />
  )
}

export default MainChart

