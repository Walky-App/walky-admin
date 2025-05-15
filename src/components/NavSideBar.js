import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CSidebar, CSidebarHeader, CSidebarNav, CNavGroup, CNavItem, CNavTitle, CCloseButton, } from '@coreui/react';
import { NavLink } from 'react-router-dom';
export const Sidebar = ({ visible, onVisibleChange, isMobile = false }) => {
    // Handle close button click
    const handleClose = () => {
        onVisibleChange(false);
    };
    return (_jsxs(CSidebar, { className: "border-end text-white flex-shrink-0", style: {
            backgroundColor: '#1e1e2f',
            transition: 'transform 0.3s ease',
            transform: visible ? 'translateX(0)' : 'translateX(-100%)',
            position: 'fixed', // ✅ always fixed
            top: 0, // ✅ start from top
            left: 0,
            height: '100vh', // ✅ full height
            width: '250px', // or whatever matches your design
            zIndex: 1030,
        }, visible: visible, children: [_jsxs(CSidebarHeader, { className: "d-flex justify-content-between align-items-center px-3 py-2", children: [_jsx("div", { className: "text-white fw-bold", children: "Walky Admin" }), isMobile && (_jsx(CCloseButton, { onClick: handleClose }))] }), _jsxs(CSidebarNav, { children: [_jsx(CNavItem, { className: "px-3 py-2", children: _jsx(NavLink, { to: "/", className: ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`, children: "Dashboard" }) }), _jsx(CNavTitle, { className: "text-white-50 px-3", style: { textAlign: 'left' }, children: "PAGES" }), _jsx(CNavItem, { className: "px-3 py-2", children: _jsx(NavLink, { to: "/students", className: ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`, children: "Students" }) }), _jsx(CNavItem, { className: "px-3 py-2", children: _jsx(NavLink, { to: "/engagement", className: ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`, children: "Engagement" }) }), _jsx(CNavItem, { className: "px-3 py-2", children: _jsx(NavLink, { to: "/review", className: ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`, children: "Review" }) }), _jsxs(CNavGroup, { toggler: "My Walky", className: "px-3 py-2", children: [_jsx(CNavItem, { className: "ms-4 px-3 py-1", children: _jsx(NavLink, { to: "/walky/item1", className: ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`, children: "My Walky Item 1" }) }), _jsx(CNavItem, { className: "ms-4 px-3 py-1", children: _jsx(NavLink, { to: "/walky/item2", className: ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`, children: "My Walky Item 2" }) })] }), _jsx(CNavItem, { className: "px-3 py-2", children: _jsx(NavLink, { to: "/compliance", className: ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`, children: "Compliance" }) }), _jsx(CNavItem, { className: "px-3 py-2", children: _jsx(NavLink, { to: "/settings", className: ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`, children: "Settings" }) })] })] }));
};
