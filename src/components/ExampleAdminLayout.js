import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Sidebar } from './NavSideBar';
import { Topbar } from './Topbar';
import { useTheme } from '../hooks/useTheme';
import { BreadcrumbDividersExample } from './examples/BreadCrumbs';
function ExampleAdminLayout({ children }) {
    const { theme } = useTheme();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    // Toggle sidebar manually (for button clicks)
    const toggleSidebar = () => {
        setSidebarVisible(prev => !prev);
    };
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarVisible(false);
            }
            else {
                setSidebarVisible(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Run once on mount
        return () => window.removeEventListener('resize', handleResize);
    }, []); // ✅ Important: no dependencies
    return (_jsxs("div", { className: "d-flex flex-column vh-100", style: { backgroundColor: theme.colors.bodyBg }, children: [_jsx(Topbar, { onToggleSidebar: toggleSidebar }), _jsxs("div", { className: "d-flex flex-grow-1", children: [_jsx(Sidebar, { visible: sidebarVisible, onVisibleChange: setSidebarVisible, isMobile: isMobile }), isMobile && sidebarVisible && (_jsx("div", { className: "sidebar-overlay active", onClick: () => setSidebarVisible(false) })), _jsx("div", { className: " d-sm-flex justify-content-between align-items-center mt-0" }), _jsxs("main", { className: "d-flex flex-column flex-grow-1 bg-light px-4 pt-0 pb-2", style: {
                            overflowY: 'auto',
                            marginLeft: isMobile ? 0 : '250px', // 👈 Push content to the right of the sidebar
                            transition: 'margin-left 0.3s ease', // optional smoothness
                        }, children: [_jsx("div", { className: "bg-white px-3 py-2 mb-3 border ", style: {
                                    margin: '0 -1.5rem',
                                    paddingLeft: '1.5rem',
                                    paddingRight: '1.5rem',
                                    paddingBottom: '0',
                                }, children: _jsx(BreadcrumbDividersExample, {}) }), _jsxs("div", { className: " d-sm-flex justify-content-between align-items-center mt-0", children: [_jsx("div", { className: "d-sm-flex justify-content-between align-items-center", children: _jsx("h2", { className: "mb-0", children: "Dashboard" }) }), _jsx("div", { className: "mt-3 mt-sm-0" })] }), children] })] }), _jsx("footer", { className: "footer py-3 border-top text-center", children: _jsx("span", { className: "small", children: "Walky Admin \u00A9 2023 | Built with CoreUI" }) })] }));
}
export default ExampleAdminLayout;
