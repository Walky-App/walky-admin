import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilOptions } from '@coreui/icons';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import { CButton, CButtonGroup } from "@coreui/react";
import { cilCloudDownload } from "@coreui/icons";
import { CCard, CCardBody, CRow, CCol, CCardHeader, CDropdownItem, CDropdown, CDropdownMenu, CDropdownToggle, CWidgetStatsA } from '@coreui/react';
import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTheme } from './hooks/useTheme.js';
import Students from './pages/Students.js';
import Engagement from './pages/Engagement.js';
import Review from './pages/Review.js';
import Mywalky from './pages/Mywalky.js';
import Compliance from './pages/Compliance.js';
import Settings from './pages/Settings.js';
import Login from './pages/Login.js';
import CreateAccount from './pages/CreateAccount.js';
import ExampleAdminLayout from './components/ExampleAdminLayout.js';
import MainChart from "./components/MainChart.tsx.js";
import API from './API/index.ts.js';
const Dashboard = ({ theme, chartOptions, barChartOptions }) => {
    const [walks, setWalks] = useState(null);
    const [events, setEvents] = useState(null);
    const [ideas, setIdeas] = useState(null);
    const [surprise, setSurprise] = useState(null);
    useEffect(() => {
        const fetchWidgets = async () => {
            try {
                const [walksRes, eventsRes, ideasRes, surpriseRes] = await Promise.all([
                    API.get('/api/v1/walks'),
                    API.get('/api/v1/events'),
                    API.get('/api/v1/ideas'),
                    API.get('/api/v1/surprise'),
                ]);
                setWalks(walksRes.data);
                setEvents(eventsRes.data);
                setIdeas(ideasRes.data);
                setSurprise(surpriseRes.data);
            }
            catch (err) {
                console.error('Failed to fetch one or more widgets:', err);
            }
        };
        fetchWidgets();
    }, []);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-4 d-sm-flex justify-content-between align-items-center", children: [_jsx("div", {}), _jsx("div", { className: "mt-3 mt-sm-0" })] }), _jsxs(CRow, { children: [_jsx(CCol, { sm: 6, lg: 3, children: _jsx(CWidgetStatsA, { className: "mb-4 px-0 py-0", color: "primary", value: walks ? (_jsxs(_Fragment, { children: [walks.value, ' ', _jsxs("span", { className: "fs-6 fw-normal", children: ["(", walks.percentChange, "% ", _jsx(CIcon, { icon: cilArrowTop }), ")"] })] })) : ('Loading...'), title: _jsx("div", { className: "text-start ps-0", children: _jsx("span", { className: "text-white", children: "Walks" }) }), action: _jsxs(CDropdown, { alignment: "end", children: [_jsx(CDropdownToggle, { color: "transparent", caret: false, className: "p-0", children: _jsx(CIcon, { icon: cilOptions, className: "text-white" }) }), _jsxs(CDropdownMenu, { children: [_jsx(CDropdownItem, { children: "Action" }), _jsx(CDropdownItem, { children: "Another action" }), _jsx(CDropdownItem, { children: "Something else here..." }), _jsx(CDropdownItem, { disabled: true, children: "Disabled action" })] })] }), chart: _jsx(CChartLine, { className: "mt-3 mx-3", style: { height: '70px' }, data: {
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                    datasets: [
                                        {
                                            label: 'Walks',
                                            backgroundColor: 'transparent',
                                            borderColor: theme.colors.chartLine,
                                            pointBackgroundColor: theme.colors.primary,
                                            data: walks?.chartData || [],
                                        },
                                    ],
                                }, options: chartOptions }) }) }), _jsx(CCol, { sm: 6, lg: 3, children: _jsx(CWidgetStatsA, { className: "mb-4 px-0 py-0", color: "info", value: events ? (_jsxs(_Fragment, { children: [events.value, ' ', _jsxs("span", { className: "fs-6 fw-normal", children: ["(", events.percentChange, "% ", _jsx(CIcon, { icon: cilArrowTop }), ")"] })] })) : ('Loading...'), title: _jsx("div", { className: "text-start ps-0", children: _jsx("span", { className: "text-white", children: "Events" }) }), action: _jsxs(CDropdown, { alignment: "end", children: [_jsx(CDropdownToggle, { color: "transparent", caret: false, className: "p-0", children: _jsx(CIcon, { icon: cilOptions, className: "text-white" }) }), _jsxs(CDropdownMenu, { children: [_jsx(CDropdownItem, { children: "Action" }), _jsx(CDropdownItem, { children: "Another action" }), _jsx(CDropdownItem, { children: "Something else here..." }), _jsx(CDropdownItem, { disabled: true, children: "Disabled action" })] })] }), chart: _jsx(CChartLine, { className: "mt-3 mx-3", style: { height: '70px' }, data: {
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                    datasets: [
                                        {
                                            label: 'Events',
                                            backgroundColor: 'transparent',
                                            borderColor: theme.colors.chartLine,
                                            pointBackgroundColor: theme.colors.info,
                                            data: events?.chartData || [],
                                        },
                                    ],
                                }, options: chartOptions }) }) }), _jsx(CCol, { sm: 6, lg: 3, children: _jsx(CWidgetStatsA, { className: "mb-4 px-0 py-0", color: "warning", value: ideas ? (_jsxs(_Fragment, { children: [ideas.value, ' ', _jsxs("span", { className: "fs-6 fw-normal", children: ["(", ideas.percentChange, "% ", _jsx(CIcon, { icon: cilArrowTop }), ")"] })] })) : ('Loading...'), title: _jsx("div", { className: "text-start ps-0", children: _jsx("span", { className: "text-white", children: "Ideas" }) }), action: _jsxs(CDropdown, { alignment: "end", children: [_jsx(CDropdownToggle, { color: "transparent", caret: false, className: "p-0", children: _jsx(CIcon, { icon: cilOptions, className: "text-white" }) }), _jsxs(CDropdownMenu, { children: [_jsx(CDropdownItem, { children: "Action" }), _jsx(CDropdownItem, { children: "Another action" }), _jsx(CDropdownItem, { children: "Something else here..." }), _jsx(CDropdownItem, { disabled: true, children: "Disabled action" })] })] }), chart: _jsx(CChartLine, { className: "mt-3", style: { height: '70px' }, data: {
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                    datasets: [
                                        {
                                            label: 'Ideas',
                                            backgroundColor: `${theme.colors.warning}33`,
                                            borderColor: theme.colors.chartLine,
                                            data: ideas?.chartData || [],
                                            fill: true,
                                        },
                                    ],
                                }, options: chartOptions }) }) }), _jsx(CCol, { sm: 6, lg: 3, children: _jsx(CWidgetStatsA, { className: "mb-4 px-0 py-0", color: "danger", value: surprise ? (_jsxs(_Fragment, { children: [surprise.value, ' ', _jsxs("span", { className: "fs-6 fw-normal", children: ["(", surprise.percentChange, "% ", _jsx(CIcon, { icon: cilArrowTop }), ")"] })] })) : ('Loading...'), title: _jsx("div", { className: "text-start ps-0", children: _jsx("span", { className: "text-white", children: "Surprise" }) }), action: _jsxs(CDropdown, { alignment: "end", children: [_jsx(CDropdownToggle, { color: "transparent", caret: false, className: "p-0", children: _jsx(CIcon, { icon: cilOptions, className: "text-white" }) }), _jsxs(CDropdownMenu, { children: [_jsx(CDropdownItem, { children: "Action" }), _jsx(CDropdownItem, { children: "Another action" }), _jsx(CDropdownItem, { children: "Something else here..." }), _jsx(CDropdownItem, { disabled: true, children: "Disabled action" })] })] }), chart: _jsx(CChartBar, { className: "mt-3 mx-3", style: { height: '70px' }, data: {
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
                                            label: 'Surprise',
                                            backgroundColor: theme.colors.danger,
                                            borderColor: theme.colors.chartLine,
                                            data: surprise?.chartData || [],
                                            barPercentage: 0.6,
                                        },
                                    ],
                                }, options: barChartOptions }) }) })] }), _jsxs(CCard, { className: "mb-4", style: {
                    backgroundColor: theme.colors.cardBg,
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }, children: [_jsxs(CCardHeader, { className: "d-flex justify-content-between align-items-center border-0 py-0 px-3", children: [_jsxs("div", { children: [_jsx("h5", { className: "mb-1", style: {
                                            fontFamily: "Inter, sans-serif",
                                            fontWeight: 500,
                                            fontSize: '24px',
                                        }, children: "Active Users" }), _jsx("div", { style: {
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: '12px',
                                            marginLeft: '-30px',
                                            color: theme.colors.secondary,
                                        }, children: "January - July 2025" })] }), _jsxs("div", { className: "d-flex align-items-center", children: [_jsxs(CButtonGroup, { role: "group", children: [_jsx(CButton, { color: "outline-secondary", size: "sm", children: "Day" }), _jsx(CButton, { color: "dark", size: "sm", children: "Week" }), _jsx(CButton, { color: "outline-secondary", size: "sm", children: "Month" })] }), _jsx(CButton, { color: "primary", size: "sm", className: "ms-2", children: _jsx(CIcon, { icon: cilCloudDownload }) })] })] }), _jsx(CCardBody, { className: "p-0", children: _jsx(MainChart, {}) })] })] }));
};
function App() {
    const { theme } = useTheme();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    console.log("💡 Logged in:", isLoggedIn); // ✅ DEBUG: See login state in browser console
    const chartOptions = {
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
                    color: theme.colors.chartLine,
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
                    color: theme.colors.chartLine,
                },
            },
        },
        elements: {
            line: {
                borderWidth: 1,
                tension: 0.4,
                borderColor: theme.colors.chartLine,
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
                backgroundColor: theme.colors.chartPoint,
            },
        },
    };
    const barChartOptions = {
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            x: {
                grid: {
                    display: false,
                    drawTicks: false,
                },
                ticks: {
                    display: false,
                    color: theme.colors.chartLine,
                },
            },
            y: {
                grid: {
                    display: false,
                    drawTicks: false,
                },
                ticks: {
                    display: false,
                    color: theme.colors.chartLine,
                },
            },
        },
    };
    const PrivateRoute = ({ children }) => {
        const location = useLocation();
        return isLoggedIn
            ? children
            : _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    };
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, { onLogin: () => setIsLoggedIn(true) }) }), _jsx(Route, { path: "*", element: _jsx(PrivateRoute, { children: _jsx(ExampleAdminLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, { theme: theme, chartOptions: chartOptions, barChartOptions: barChartOptions }) }), _jsx(Route, { path: "/students", element: _jsx(Students, {}) }), _jsx(Route, { path: "/engagement", element: _jsx(Engagement, {}) }), _jsx(Route, { path: "/review", element: _jsx(Review, {}) }), _jsx(Route, { path: "/mywalky", element: _jsx(Mywalky, {}) }), _jsx(Route, { path: "/compliance", element: _jsx(Compliance, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "/create-account", element: _jsx(CreateAccount, {}) })] }) }) }) })] }));
}
export default App;
