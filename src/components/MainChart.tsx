import { useEffect, useRef } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = () => {
  const chartRef = useRef<any | null>(null)

  useEffect(() => {
    const updateChartColors = () => {
      if (!chartRef.current) return;
      const chart = chartRef.current

      chart.options.scales.x.grid.borderColor = getStyle('--cui-border-color-translucent')
      chart.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
      chart.options.scales.x.ticks.color = getStyle('--cui-body-color')

      chart.options.scales.y.grid.borderColor = getStyle('--cui-border-color-translucent')
      chart.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
      chart.options.scales.y.ticks.color = getStyle('--cui-body-color')

      chart.update()
    }

    document.documentElement.addEventListener('ColorSchemeChange', () => {
      setTimeout(updateChartColors, 50)
    })
  }, [])

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
              borderColor: getStyle('--cui-info'),
              backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, 0.2)`,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: getStyle('--cui-info'),
            },
            {
                label: 'Conversion',
                data: [140, 160, 180, 120, 170, 130, 100],
                borderColor: getStyle('--cui-success'),
                backgroundColor: 'transparent',
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
              color: getStyle('--cui-border-color-translucent'),
            },
            ticks: {
              color: getStyle('--cui-body-color'),
            },
          },
          y: {
            grid: {
              color: getStyle('--cui-border-color-translucent'),
            },
            ticks: {
              color: getStyle('--cui-body-color'),
            },
          },
        },
      }}
    />
  )
}

export default MainChart
