import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { CChartLine } from '@coreui/react-chartjs';
import { useTheme } from '../hooks/useTheme';
const MainChart = () => {
    const chartRef = useRef(null);
    const { theme } = useTheme();
    useEffect(() => {
        const updateChartColors = () => {
            if (!chartRef.current)
                return;
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
                chart.data.datasets[0].backgroundColor = 'rgba(0, 123, 255, 0.08)'; // Light blue fill
            }
            if (chart.data.datasets[1]) {
                chart.data.datasets[1].borderColor = 'rgba(40, 167, 69, 1)';
                chart.data.datasets[1].backgroundColor = 'transparent'; // No fill
            }
            chart.update();
        };
        document.documentElement.addEventListener('ColorSchemeChange', () => {
            setTimeout(updateChartColors, 50);
        });
        updateChartColors();
    }, [theme]);
    return (_jsx(CChartLine, { ref: chartRef, style: { height: '300px', marginTop: '40px' }, data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Traffic',
                    data: [70, 105, 120, 110, 165, 95, 85],
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                },
                {
                    label: 'Conversion',
                    data: [140, 160, 180, 120, 170, 130, 100],
                    borderColor: 'rgba(40, 167, 69, 1)',
                    backgroundColor: 'transparent',
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                }
            ]
        }, options: {
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
                line: {
                    borderWidth: 2,
                },
                point: {
                    radius: 0,
                },
            },
        } }));
};
export default MainChart;
