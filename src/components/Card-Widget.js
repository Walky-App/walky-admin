import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilOptions } from '@coreui/icons';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import { CCol, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CRow, CWidgetStatsA, } from '@coreui/react';
export const WidgetStatsAExample = () => {
    return (_jsxs(CRow, { children: [_jsx(CCol, { sm: 6, children: _jsx(CWidgetStatsA, { className: "mb-4", color: "primary", value: _jsxs(_Fragment, { children: ["46", ' ', _jsxs("span", { className: "fs-6 fw-normal", children: ["(0% ", _jsx(CIcon, { icon: cilArrowTop }), ")"] })] }), title: "Surprise", action: _jsxs(CDropdown, { alignment: "end", children: [_jsx(CDropdownToggle, { color: "transparent", caret: false, className: "p-0", children: _jsx(CIcon, { icon: cilOptions, className: "text-white" }) }), _jsxs(CDropdownMenu, { children: [_jsx(CDropdownItem, { children: "Action" }), _jsx(CDropdownItem, { children: "Another action" }), _jsx(CDropdownItem, { children: "Something else here..." }), _jsx(CDropdownItem, { disabled: true, children: "Disabled action" })] })] }), chart: _jsx(CChartLine, { className: "mt-3 mx-3", style: { height: '70px' }, data: {
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
                        }, options: {
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    grid: {
                                        display: false,
                                    },
                                    ticks: {
                                        display: false,
                                    },
                                },
                                y: {
                                    min: 30,
                                    max: 89,
                                    display: false,
                                    grid: {
                                        display: false,
                                    },
                                    ticks: {
                                        display: false,
                                    },
                                },
                            },
                            elements: {
                                line: {
                                    borderWidth: 1,
                                    tension: 0.4,
                                },
                                point: {
                                    radius: 4,
                                    hitRadius: 10,
                                    hoverRadius: 4,
                                },
                            },
                        } }) }) }), _jsx(CCol, { sm: 6, children: _jsx(CWidgetStatsA, { className: "mb-4", color: "info", value: _jsxs(_Fragment, { children: ["281", ' ', _jsxs("span", { className: "fs-6 fw-normal", children: ["(0% ", _jsx(CIcon, { icon: cilArrowTop }), ")"] })] }), title: "Walks", action: _jsxs(CDropdown, { alignment: "end", children: [_jsx(CDropdownToggle, { color: "transparent", caret: false, className: "p-0", children: _jsx(CIcon, { icon: cilOptions, className: "text-white" }) }), _jsxs(CDropdownMenu, { children: [_jsx(CDropdownItem, { children: "Action" }), _jsx(CDropdownItem, { children: "Another action" }), _jsx(CDropdownItem, { children: "Something else here..." }), _jsx(CDropdownItem, { disabled: true, children: "Disabled action" })] })] }), chart: _jsx(CChartLine, { className: "mt-3 mx-3", style: { height: '70px' }, data: {
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
                        }, options: {
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    grid: {
                                        display: false,
                                    },
                                    ticks: {
                                        display: false,
                                    },
                                },
                                y: {
                                    min: -9,
                                    max: 39,
                                    display: false,
                                    grid: {
                                        display: false,
                                    },
                                    ticks: {
                                        display: false,
                                    },
                                },
                            },
                            elements: {
                                line: {
                                    borderWidth: 1,
                                },
                                point: {
                                    radius: 4,
                                    hitRadius: 10,
                                    hoverRadius: 4,
                                },
                            },
                        } }) }) }), _jsx(CCol, { sm: 6, children: _jsx(CWidgetStatsA, { className: "mb-4", color: "warning", value: _jsxs(_Fragment, { children: ["187", ' ', _jsxs("span", { className: "fs-6 fw-normal", children: ["(0% ", _jsx(CIcon, { icon: cilArrowTop }), ")"] })] }), title: "Events", action: _jsxs(CDropdown, { alignment: "end", children: [_jsx(CDropdownToggle, { color: "transparent", caret: false, className: "p-0", children: _jsx(CIcon, { icon: cilOptions, className: "text-white" }) }), _jsxs(CDropdownMenu, { children: [_jsx(CDropdownItem, { children: "Action" }), _jsx(CDropdownItem, { children: "Another action" }), _jsx(CDropdownItem, { children: "Something else here..." }), _jsx(CDropdownItem, { disabled: true, children: "Disabled action" })] })] }), chart: _jsx(CChartLine, { className: "mt-3", style: { height: '70px' }, data: {
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
                        }, options: {
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    display: false,
                                },
                                y: {
                                    display: false,
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
                        } }) }) }), _jsx(CCol, { sm: 6, children: _jsx(CWidgetStatsA, { className: "mb-4", color: "danger", value: _jsxs(_Fragment, { children: ["192", ' ', _jsxs("span", { className: "fs-6 fw-normal", children: ["(0% ", _jsx(CIcon, { icon: cilArrowTop }), ")"] })] }), title: "Ideas", action: _jsxs(CDropdown, { alignment: "end", children: [_jsx(CDropdownToggle, { color: "transparent", caret: false, className: "p-0", children: _jsx(CIcon, { icon: cilOptions, className: "text-white" }) }), _jsxs(CDropdownMenu, { children: [_jsx(CDropdownItem, { children: "Action" }), _jsx(CDropdownItem, { children: "Another action" }), _jsx(CDropdownItem, { children: "Something else here..." }), _jsx(CDropdownItem, { disabled: true, children: "Disabled action" })] })] }), chart: _jsx(CChartBar, { className: "mt-3 mx-3", style: { height: '70px' }, data: {
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
                                    backgroundColor: 'rgba(255,255,255,.2)',
                                    borderColor: 'rgba(255,255,255,.55)',
                                    data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                                    barPercentage: 0.6,
                                },
                            ],
                        }, options: {
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
                        } }) }) })] }));
};
